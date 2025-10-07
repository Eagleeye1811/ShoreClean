// TrashMarkerList.jsx
import React, { useState } from "react";

const statusColor = {
  pending: "#e3f2fd", // blue
  ongoing: "#fffde7", // yellow
  completed: "#e8f5e9", // green
};

function TrashMarkerList({
  markers,
  loading,
  updateStatus,
  completeTask,
  updateRemark,
}) {
  const [uploadingId, setUploadingId] = useState(null);
  const [focusedDescriptionId, setFocusedDescriptionId] = useState(null);

  function handleCompleteClick(id) {
    setUploadingId(id);
  }

  function handleDescriptionChange(id, description) {
    // You'll need to add this function to update description
    // updateDescription(id, description);
  }

  function handleDescriptionKeyPress(e, id) {
    if (e.key === "Enter") {
      e.preventDefault();
      setFocusedDescriptionId(null);
      e.target.blur(); // Remove focus from the input
    }
  }

  function handleDescriptionFocus(id) {
    setFocusedDescriptionId(id);
  }

  function handleDescriptionBlur() {
    setFocusedDescriptionId(null);
  }

  function handleAnalyse(id) {
    // Add your analysis logic here
    console.log("Analysing marker:", id);
  }

  async function handleImageUpload(e, id) {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file to complete the task.");
      return;
    }
    await completeTask(id, file); // Only mark as completed after file upload
    setUploadingId(null); // Force re-render to update color
  }

  async function handleBeforeImageUpload(e, id) {
    const file = e.target.files[0];
    if (!file) return;
    
    // You'll need to implement this function to upload before image
    // await uploadBeforeImage(id, file);
    console.log("Uploading before image for marker:", id);
  }

  async function handleAfterImageUpload(e, id) {
    const file = e.target.files[0];
    if (!file) return;
    
    // You'll need to implement this function to upload after image
    // await uploadAfterImage(id, file);
    console.log("Uploading after image for marker:", id);
  }

  return (
    <div style={{ marginTop: 20 }}>
      {loading ? (
        <div>Loading markers...</div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
          }}
        >
          <thead
            style={{
              background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
            }}
          >
            <tr>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Before Image</th>
              <th style={thStyle}>After Image</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Analysis</th>
            </tr>
          </thead>
          <tbody>
            {markers.map((marker, index) => (
              <tr
                key={marker._id}
                style={{
                  background:
                    marker.status === "completed"
                      ? statusColor["completed"]
                      : marker.status === "ongoing"
                      ? statusColor["ongoing"]
                      : statusColor["pending"],
                  transition: "background 0.3s",
                  borderBottom:
                    index === markers.length - 1 ? "none" : "1px solid #e2e8f0",
                }}
              >
                <td style={tdStyle}>{marker.address}</td>
                <td style={tdStyle}>
                  <textarea
                    placeholder="Add description..."
                    value={marker.description || ""}
                    onChange={(e) => handleDescriptionChange(marker._id, e.target.value)}
                    onKeyPress={(e) => handleDescriptionKeyPress(e, marker._id)}
                    onFocus={() => handleDescriptionFocus(marker._id)}
                    onBlur={handleDescriptionBlur}
                    style={{
                      width: "100%",
                      minHeight: "40px",
                      maxHeight: "120px",
                      boxSizing: "border-box",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "2px solid #e2e8f0",
                      fontFamily: "inherit",
                      fontSize: "14px",
                      resize: "vertical",
                      lineHeight: "1.4",
                      transition: "border-color 0.2s ease",
                      borderColor:
                        focusedDescriptionId === marker._id ? "#4299e1" : "#e2e8f0",
                    }}
                    rows={2}
                  />
                </td>
                <td style={tdStyle}>{marker.name || "-"}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {marker.before_img ? (
                      <img
                        src={marker.before_img}
                        alt="Before"
                        style={{ width: 50, borderRadius: "4px" }}
                      />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#666' }}>No image</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBeforeImageUpload(e, marker._id)}
                      style={imageUploadStyle}
                    />
                  </div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {marker.after_img ? (
                      <img
                        src={marker.after_img}
                        alt="After"
                        style={{ width: 50, borderRadius: "4px" }}
                      />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#666' }}>No image</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAfterImageUpload(e, marker._id)}
                      style={imageUploadStyle}
                    />
                  </div>
                </td>
                <td
                  style={{
                    ...tdStyle,
                    fontWeight: "bold",
                    color:
                      marker.status === "completed"
                        ? "#388e3c"
                        : marker.status === "pending"
                        ? "#1976d2"
                        : "#fbc02d",
                  }}
                >
                  {marker.status.charAt(0).toUpperCase() + marker.status.slice(1)}
                </td>
                <td style={tdStyle}>
                  {marker.status === "pending" && (
                    <button style={buttonStyleBlue} onClick={() => updateStatus(marker._id, "ongoing")}>
                      Accept
                    </button>
                  )}
                  {marker.status === "ongoing" && (
                    <>
                      <button style={buttonStyleYellow} onClick={() => handleCompleteClick(marker._id)}>
                        Complete
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, marker._id)}
                        style={fileInputStyle}
                      />
                    </>
                  )}
                  {marker.status === "completed" && marker.after_img && (
                    <img
                      src={marker.after_img}
                      alt="Proof"
                      style={{ width: 50, borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                  )}
                </td>
                <td style={tdStyle}>
                  <button 
                    style={buttonStyleGreen} 
                    onClick={() => handleAnalyse(marker._id)}
                  >
                    Analyse
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Reusable styles
const thStyle = {
  padding: "14px 12px",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "14px",
  textAlign: "left",
  borderBottom: "2px solid #2b77cb",
};

const tdStyle = {
  padding: "12px",
  borderRight: "1px solid #e2e8f0",
  fontSize: "14px",
  color: "#2d3748",
};

const buttonStyleBlue = {
  padding: "6px 12px",
  borderRadius: "4px",
  background: "#2196f3",
  color: "#fff",
  border: "none",
};

const buttonStyleYellow = {
  padding: "6px 12px",
  borderRadius: "4px",
  background: "#fbc02d",
  color: "#fff",
  border: "none",
  marginRight: "8px",
};

const buttonStyleGreen = {
  padding: "6px 12px",
  borderRadius: "4px",
  background: "#4caf50",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const fileInputStyle = {
  marginRight: "8px",
  padding: "8px",
  border: "2px solid #4299e1",
  borderRadius: "8px",
  fontSize: "12px",
  backgroundColor: "#fff",
  cursor: "pointer",
  transition: "border-color 0.2s ease",
};

const imageUploadStyle = {
  padding: "4px 8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "10px",
  backgroundColor: "#f9f9f9",
  cursor: "pointer",
  width: "80px",
  textAlign: "center",
};

export default TrashMarkerList;
