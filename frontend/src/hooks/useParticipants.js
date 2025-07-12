// hooks/useParticipants.js
import { useEffect } from "react";
import { useParticipantStore } from "../store/participant.js";

export const getParticipants = () => {
	const { fetchParticipants, participants } = useParticipantStore();

	useEffect(() => {
		fetchParticipants();
	}, [fetchParticipants]);

	return { participants };
};

export const getParticipantsByEvent = (eventId) => {
	const { fetchParticipantsByEvent, selectedParticipants } = useParticipantStore();

	useEffect(() => {
		if (eventId) fetchParticipantsByEvent(eventId);
	}, [eventId, fetchParticipantsByEvent]);

	return { participants: selectedParticipants };
};
