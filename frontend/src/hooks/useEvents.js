// hooks/useEvents.js
import { useEffect } from "react";
import { useEventStore } from "../store/event.js";

export const getEvents = () => {
	const { fetchEvents, events } = useEventStore();

	useEffect(() => {
		fetchEvents(); // Fetch events when the hook is used
	}, [fetchEvents]);

	return { events }; // Return the events for use in components
};

export const getEventById = (eventId) => {
	const { fetchEventById, selectedEvent } = useEventStore();

	useEffect(() => {
		if (eventId) fetchEventById(eventId);
	}, [eventId, fetchEventById]);

	return { event: selectedEvent };
};
