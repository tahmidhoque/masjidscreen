import { Box, Typography } from "@mui/material";
import { useAppState } from "../../providers/state";

export default function UploadTimetable(): JSX.Element {
	const { state } = useAppState();
	console.log(state);
	return (
		<Box>
			<Typography variant="h2">Upload Timetable</Typography>
		</Box>
	);
}
