import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ReactMarkdown from "react-markdown";

const ChatBox = () => {
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState([]);
	const chatWindowRef = useRef(null);

	// Scroll to the bottom when new messages arrive
	useEffect(() => {
		if (chatWindowRef.current) {
			chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim() || loading) return; // Prevent sending if input is empty or already processing
		setInput(""); // Clear input field

		setMessages((prev) => [...prev, { role: "user", content: input }]);
		setLoading(true); // Disable the button

		try {
			const response = await fetch("/api/chat/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: input }),
			});
			const data = await response.json();
			console.log(data);

			setMessages((prev) => [...prev, { role: "bot", content: data.data }]);
		} catch (error) {
			console.error("Error fetching chatbot response:", error);
			setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I couldn't process your request." }]);
		} finally {
			setLoading(false); // Enable the button again
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "80vh",
				maxWidth: "1100px",
				margin: "auto",
				backgroundColor: "background.paper",
				borderRadius: 2,
				boxShadow: 3,
				p: 2,
				mt: 2,
			}}
		>
			<Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
				Study Chatbot
			</Typography>

			<Paper
				ref={chatWindowRef}
				elevation={3}
				sx={{
					flex: 1,
					overflowY: "auto",
					p: 2,
					backgroundColor: "#f5f5f5",
					borderRadius: 2,
				}}
			>
				{messages.map((msg, index) => (
					<Box
						key={index}
						sx={{
							mb: 2,
							display: "flex",
							flexDirection: "column",
							alignItems: msg.role === "user" ? "flex-end" : "flex-start",
						}}
					>
						<Paper
							sx={{
								p: 1.5,
								bgcolor: msg.role === "user" ? "primary.main" : "grey.300",
								color: msg.role === "user" ? "white" : "black",
								borderRadius: 2,
								maxWidth: "75%",
							}}
						>
							<Typography
								variant="body2"
								sx={{
									fontWeight: "bold",
									mb: 0.5,
									textAlign: msg.role === "user" ? "right" : "left",
								}}
							>
								{msg.role === "user" ? "You" : "Bot"}
							</Typography>
							<Typography variant="body1" sx={{ wordWrap: "break-word", textAlign: "left" }}>
								{msg.role === "bot" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
							</Typography>
						</Paper>
					</Box>
				))}
			</Paper>

			<Box sx={{ display: "flex", gap: 1, mt: 2 }}>
				<TextField
					fullWidth
					variant="outlined"
					size="small"
					placeholder="Ask a study-related question..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => e.key === "Enter" && handleSend()}
				/>
				<Button variant="contained" color="primary" onClick={handleSend} disabled={loading}>
					{loading ? <CircularProgress size="30px" /> : "Send"}
				</Button>
			</Box>
		</Box>
	);
};

export default ChatBox;
