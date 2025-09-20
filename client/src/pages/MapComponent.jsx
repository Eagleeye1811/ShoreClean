import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Fix default marker icon issue in React
import "leaflet/dist/leaflet.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Custom red icon for current location
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = () => {
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [currentLocationName, setCurrentLocationName] = React.useState("");

  // Get user's current location on mount
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentLocation([lat, lng]);
        let label = "Your Current Location";
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const geoData = await geoRes.json();
          label = geoData.display_name || label;
          setCurrentLocationName(label);
        } catch {
          setCurrentLocationName(label);
        }
        // Save to DB if not already present
        try {
          const res = await fetch("http://localhost:5000/api/points", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lng, label }),
          });
          if (res.ok) {
            const newPoint = await res.json();
            setPoints((prev) => [
              ...prev,
              { position: [newPoint.lat, newPoint.lng], label: newPoint.label },
            ]);
          }
        } catch (err) {
          // Optionally handle error
        }
      });
    }
  }, []);
  const initialPosition = [19.076, 72.8777]; // Mumbai
  const [points, setPoints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch points from backend on mount
  React.useEffect(() => {
    fetch("http://localhost:8000/api/points")
      .then((res) => res.json())
      .then((data) => {
        setPoints(
          data.map((pt) => ({ position: [pt.lat, pt.lng], label: pt.label }))
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Custom component to handle map clicks
  function MapClickHandler() {
    useMapEvents({
      dblclick: async (e) => {
        const { lat, lng } = e.latlng;
        let label = `Custom Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        try {
          // Reverse geocode to get place name
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const geoData = await geoRes.json();
          if (geoData && geoData.display_name) {
            label = geoData.display_name;
          }
        } catch {}
        try {
          const res = await fetch("http://localhost:5000/api/points", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lng, label }),
          });
          if (res.ok) {
            const newPoint = await res.json();
            setPoints([
              ...points,
              { position: [newPoint.lat, newPoint.lng], label: newPoint.label },
            ]);
          }
        } catch (err) {
          // Optionally handle error
        }
      },
    });
    return null;
  }

  return (
    <>
      {loading ? (
        <div>Loading map points...</div>
      ) : (
        <MapContainer
          center={initialPosition}
          zoom={12}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler />
          {points.map((pt, idx) => (
            <Marker key={idx} position={pt.position}>
              <Popup>
                <div>
                  <strong>Place:</strong> {pt.label}
                  <br />
                  <strong>Latitude:</strong> {pt.position[0]}
                  <br />
                  <strong>Longitude:</strong> {pt.position[1]}
                </div>
              </Popup>
            </Marker>
          ))}
          {currentLocation && (
            <Marker position={currentLocation} icon={redIcon}>
              <Popup>
                <div>
                  <strong>Place:</strong> {currentLocationName}
                  <br />
                  <strong>Latitude:</strong>{" "}
                  {currentLocation ? currentLocation[0] : ""}
                  <br />
                  <strong>Longitude:</strong>{" "}
                  {currentLocation ? currentLocation[1] : ""}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}
    </>
  );
};

export default MapComponent;
