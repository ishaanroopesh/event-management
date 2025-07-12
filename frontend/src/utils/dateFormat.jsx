// export const formatDateForInput = (dateString) => {
// 	const date = new Date(dateString);
// 	// return date.toISOString().slice(0, 10) + "  " + date.toISOString().slice(12, 16); // "YYYY-MM-DDTHH:mm"
// 	return (
// 		date.toISOString().slice(12, 16) +
// 		" " +
// 		date.toISOString().slice(8, 10) +
// 		"/" +
// 		date.toISOString().slice(5, 7) +
// 		"/" +
// 		date.toISOString().slice(0, 4)
// 	); // "DD MM YYYY"
// };

// // time
// // date.toISOString().slice(12, 16)

// // // year
// // date.toISOString().slice(0, 4)

// // // month
// // date.toISOString().slice(6, 8)

// // // day
// // date.toISOString().slice(8, 10)

export const formatDateForInput = (dateString) => {
	const date = new Date(dateString);

	// Convert to IST (UTC+5:30)
	const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
	const istDate = new Date(date.getTime() + istOffset);

	// Extract components
	const hours = String(istDate.getUTCHours()).padStart(2, "0");
	const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");
	const day = String(istDate.getUTCDate()).padStart(2, "0");
	const month = String(istDate.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
	const year = istDate.getUTCFullYear();

	// Return in "HH:mm DD/MM/YYYY" format
	return `${hours}:${minutes} ${day}/${month}/${year}`;
};

// Example usage:
// formatDateForInput("2025-05-30T06:00:00.000+00:00")
// Returns "11:30 30/05/2025" (IST conversion)
