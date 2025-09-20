// TrashMarkerMap.jsx
import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icons for marker status
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const yellowIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const statusIcon = {
  pending: blueIcon,
  ongoing: yellowIcon,
  completed: greenIcon,
};

function TrashMarkerMap({
  markers,
  loading,
  addMarker,
  updateStatus,
  deleteMarkerFrontend,
  completeTask,
}) {
  const initialPosition = [19.076, 72.8777]; // Mumbai

  function MapClickHandler() {
    useMapEvents({
      dblclick: async (e) => {
        const { lat, lng } = e.latlng;
        await addMarker(lat, lng);
      },
    });
    return null;
  }

  return (
    <>
      {loading ? (
        <div>Loading markers...</div>
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
          {markers.map((marker) => (
            <Marker
              key={marker._id}
              position={[marker.latitude, marker.longitude]}
              icon={statusIcon[marker.status]}
            >
              <Popup>
                <div>
                  <strong>Address:</strong> {marker.address || "Fetching..."}
                  <br />
                  <strong>Latitude:</strong> {marker.latitude}
                  <br />
                  <strong>Longitude:</strong> {marker.longitude}
                  <br />
                  <strong>Status:</strong> {marker.status}
                  <br />
                  {marker.status === "pending" && (
                    <button
                      style={{
                        padding: "6px 12px",
                        borderRadius: "4px",
                        background: "#2196f3",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                      onClick={() => updateStatus(marker._id, "ongoing")}
                    >
                      Accept
                    </button>
                  )}
                  {marker.status === "ongoing" && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        style={{
                          marginBottom: "8px",
                          padding: "4px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            completeTask(marker._id, file);
                          }
                        }}
                      />
                      <button
                        style={{
                          padding: "6px 12px",
                          borderRadius: "4px",
                          background: "#4caf50",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "500",
                          display: "block",
                          width: "100%",
                        }}
                        onClick={() => {
                          const fileInput =
                            document.querySelector(`input[type="file"]`);
                          if (fileInput.files[0]) {
                            completeTask(marker._id, fileInput.files[0]);
                          } else {
                            alert("Please select a file to complete the task.");
                          }
                        }}
                      >
                        Complete
                      </button>
                    </div>
                  )}
                  {/* Remove direct complete from map, require file upload via table */}
                  <button
                    style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      background: "#f44336",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      width: "100%",
                    }}
                    onClick={() => deleteMarkerFrontend(marker._id)}
                  >
                    Delete (frontend only)
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
}

export default TrashMarkerMap;
