export const convertGoogleDriveLink = (link) => {
	const match = link.match(/\/d\/(.*?)\//);
	if (match && match[1]) {
		return `https://drive.google.com/uc?export=download&id=${match[1]}`;
	}
	return link;
};
