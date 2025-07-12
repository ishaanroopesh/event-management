// components/tables/EventTable.jsx
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { getEvents } from "../../hooks/useEvents";
import { formatDateForInput } from "../../utils/dateFormat";

const EventTable = () => {
	const navigate = useNavigate();
	const { events } = getEvents();

	const handleDoubleClick = (eventId) => {
		navigate(`/admin/event/${eventId}`);
	};

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Event Name</TableCell>
						<TableCell>Date</TableCell>
						<TableCell>Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{events.map((event) => (
						<TableRow key={event._id} onDoubleClick={() => handleDoubleClick(event._id)}>
							<TableCell>{event.name}</TableCell>
							<TableCell>{formatDateForInput(event.date)}</TableCell>
							{/* <TableCell>{event.date}</TableCell> */}
							<TableCell>{event.status}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default EventTable;
