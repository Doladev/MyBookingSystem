import React, { useState, useEffect } from "react";
import "../css/booking-form.css";

export default function BookingForm({ booking, onSave, onCancel, onDelete }) {
    const [formData, setFormData] = useState(booking);

    useEffect(() => {
        setFormData(booking);
    }, [booking]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div
            className="overlay"
            onClick={(e) => {
                if (e.target.classList.contains("overlay")) {
                    onCancel();
                }
            }}
        >
            <div className="form" onClick={(e) => e.stopPropagation()}>
                <div style={styles.overlay}>
                    <div style={styles.form}>
                        <h3>{booking.id ? "Edit Booking" : "Create Booking"}</h3>
                        <label>User Name:</label>
                        <input
                            name="user"
                            value={formData.user}
                            onChange={handleChange}
                            placeholder="Enter name"
                        />
                        <label>Start Time:</label>
                        <input
                            name="startTime"
                            type="datetime-local"
                            value={formData.startTime || ""}
                            onChange={handleChange}
                        />
                        <label>End Time:</label>
                        <input
                            name="endTime"
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={handleChange}
                        />
                        <div style={styles.actions}>
                            <button onClick={() => onSave(formData)}>Save</button>
                            {booking.id && <button onClick={() => onDelete(booking.id)}>Delete</button>}
                            <button onClick={onCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        background: "rgba(0,0,0,0.4)",
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    form: {
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "300px",
    },
    actions: {
        marginTop: "10px",
        display: "flex",
        justifyContent: "space-between",
    },
};
