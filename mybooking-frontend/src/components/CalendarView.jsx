import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BookingForm from "./BookingForm";
import { useBookings } from "../hooks/useBookings";

export default function CalendarView() {
    const { bookings, addBooking, updateBooking, removeBooking } = useBookings();
    const [formVisible, setFormVisible] = useState(false);
    const [draftBooking, setDraftBooking] = useState(null);

    const handleTimeSelect = (info) => {
        setDraftBooking({
            id: null,
            user: "",
            startTime: formatForLocalInput(info.startStr),
            endTime: formatForLocalInput(info.endStr),
        });

        setFormVisible(true);
    };

    function formatForLocalInput(isoString) {
        const date = new Date(isoString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    }

    const handleEventClick = (clickInfo) => {
        const b = bookings.find((bk) => bk.id === clickInfo.event.id);
        if (b) {
            setDraftBooking(b);
            setFormVisible(true);
        }
    };

    const handleFormSubmit = async (data) => {
        if (data.id) {
            await updateBooking(data);
        } else {
            await addBooking(data);
        }
        setFormVisible(false);
    };

    return (
        <>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                selectable={true}
                events={bookings.map((b) => ({
                    id: b.id,
                    title: b.user,
                    start: b.startTime,
                    end: b.endTime,
                }))}
                select={handleTimeSelect}
                eventClick={handleEventClick}
            />

            {formVisible && (
                <BookingForm
                    booking={draftBooking}
                    onCancel={() => setFormVisible(false)}
                    onSave={handleFormSubmit}
                    onDelete={removeBooking}
                />
            )}
        </>
    );
}
