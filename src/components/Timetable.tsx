import { Grid, Typography } from "@mui/material";

import { useAppState } from "../providers/state";
import { useEffect } from "react";

export function Timetable() {
	const { state } = useAppState();
	const { todayTimetable, tomoTimetable } = state;

	const rowSX = {
		padding: "10px 0px",
	};

	const isNextPrayer = (prayer: string) => {
		if (!state.nextPrayer) return false;
		return state.nextPrayer.name === prayer;
	};

	const rowStyles = (prayer: string) => {
		const style = isNextPrayer(prayer)
			? { ...rowSX, backgroundColor: "#a30000", borderRadius: "20px" }
			: { ...rowSX };

		return style;
	};

	return (
		<Grid container>
			<Grid item container xs={12}>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">Prayer</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">Start</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">Jamaa'at</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">Tomorrow's Jamaa'at</Typography>
				</Grid>
			</Grid>
			<Grid item container xs={12} sx={rowStyles("Fajr")}>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">Fajr</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{todayTimetable?.Fajr}</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{todayTimetable?.["Fajr J"]}</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{tomoTimetable?.["Fajr J"]}</Typography>
				</Grid>
			</Grid>
			<Grid item container xs={12} sx={rowStyles("Zuhr")}>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">Zuhr</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{todayTimetable?.Zuhr}</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{todayTimetable?.["Zuhr J"]}</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{tomoTimetable?.["Zuhr J"]}</Typography>
				</Grid>
			</Grid>
			<Grid item container xs={12} sx={rowStyles("Asr")}>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">Asr</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{todayTimetable?.Asr}</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{todayTimetable?.["Asr J"]}</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{tomoTimetable?.["Asr J"]}</Typography>
				</Grid>
			</Grid>
			<Grid item container xs={12} sx={rowStyles("Maghrib")}>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">Maghrib</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{todayTimetable?.Maghrib}</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{todayTimetable?.["Maghrib J"]}</Typography>
				</Grid>
				<Grid item xs={3} alignSelf={"center"}>
					<Typography variant="h6">{tomoTimetable?.["Maghrib J"]}</Typography>
				</Grid>
			</Grid>
			<Grid item container xs={12} sx={rowStyles("Isha")}>
				<Grid item xs={3}>
					<Typography variant="h6">Isha</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography variant="h6">{todayTimetable?.Isha}</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography variant="h6">{todayTimetable?.["Isha J"]}</Typography>
				</Grid>
				<Grid item xs={3}>
					<Typography variant="h6">{tomoTimetable?.["Isha J"]}</Typography>
				</Grid>
			</Grid>
		</Grid>
	);

	// return (
	// 	<TableContainer>
	// 		<Table>
	// 			<TableHead>
	// 				<TableRow>
	// 					<TableCell>Prayer</TableCell>
	// 					<TableCell>Start</TableCell>
	// 					<TableCell>Jamaa'at</TableCell>
	// 					<TableCell>Tomorrow's Jamaa'at</TableCell>
	// 				</TableRow>
	// 			</TableHead>
	// 			<TableBody>
	// 				<TableRow>
	// 					<TableCell>Fajr</TableCell>
	// 					<TableCell>{todayTimetable?.Fajr}</TableCell>
	// 					<TableCell>{todayTimetable?.["Fajr J"]}</TableCell>
	// 					<TableCell>{tomoTimetable?.["Fajr J"]}</TableCell>
	// 				</TableRow>
	// 				<TableRow>
	// 					<TableCell>Zuhr</TableCell>
	// 					<TableCell>{todayTimetable?.Zuhr}</TableCell>
	// 					<TableCell>{todayTimetable?.["Zuhr J"]}</TableCell>
	// 					<TableCell>{tomoTimetable?.["Zuhr J"]}</TableCell>
	// 				</TableRow>
	// 				<TableRow>
	// 					<TableCell>Asr</TableCell>
	// 					<TableCell>{todayTimetable?.Asr}</TableCell>
	// 					<TableCell>{todayTimetable?.["Asr J"]}</TableCell>
	// 					<TableCell>{tomoTimetable?.["Asr J"]}</TableCell>
	// 				</TableRow>
	// 				<TableRow>
	// 					<TableCell>Maghrib</TableCell>
	// 					<TableCell>{todayTimetable?.Maghrib}</TableCell>
	// 					<TableCell>{todayTimetable?.["Maghrib J"]}</TableCell>
	// 					<TableCell>{tomoTimetable?.["Maghrib J"]}</TableCell>
	// 				</TableRow>
	// 				<TableRow>
	// 					<TableCell>Isha</TableCell>
	// 					<TableCell>{todayTimetable?.Isha}</TableCell>
	// 					<TableCell>{todayTimetable?.["Isha J"]}</TableCell>
	// 					<TableCell>{tomoTimetable?.["Isha J"]}</TableCell>
	// 				</TableRow>
	// 			</TableBody>
	// 		</Table>
	// 	</TableContainer>
	// );
}
