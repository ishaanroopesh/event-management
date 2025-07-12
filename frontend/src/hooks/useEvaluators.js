// hooks/useEvaluators.js
import { useEffect } from "react";
import { useEvaluatorStore } from "../store/evaluator.js";

export const getEvaluators = () => {
	const { fetchEvaluators, evaluators } = useEvaluatorStore();

	useEffect(() => {
		fetchEvaluators();
	}, [fetchEvaluators]);

	return { evaluators };
};

export const getEvaluatorsForEvent = (eventId) => {
	const { fetchEvaluatorsByEvent, eventEvaluators } = useEvaluatorStore();

	useEffect(() => {
		if (eventId) fetchEvaluatorsByEvent();
	}, [eventId, fetchEvaluatorsByEvent]);

	return { evaluators: eventEvaluators };
};
