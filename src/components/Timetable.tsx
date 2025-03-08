import { Grid, Typography, Box } from "@mui/material";

import { useAppState } from "../providers/state";
import { useEffect, useState } from "react";
import useResponsiveSize from "../hooks/useResponsiveSize";
import useScreenOrientation from "../hooks/useScreenOrientation";
import IData from "../interfaces/IData";

type PrayerInfo = {
	name: string;
	key: keyof Pick<IData, "Fajr" | "Zuhr" | "Asr" | "Maghrib" | "Isha">;
};

export function Timetable() {
	const { state } = useAppState();
	const [todayTimetable, setTodayTimetable] = useState(state.todayTimetable);
	const [tomoTimetable, setTomoTimetable] = useState(state.tomoTimetable);
	const responsiveSizes = useResponsiveSize();
	const { orientation } = useScreenOrientation();
	const isLandscape = orientation === "landscape-primary";

	useEffect(() => {
		if (state.todayTimetable) {
			setTodayTimetable(state.todayTimetable);
		}
		if (state.tomoTimetable) {
			setTomoTimetable(state.tomoTimetable);
		}
	}, [state]);

	const rowSX = {
		padding: responsiveSizes.spacing.xs,
		borderRadius: "20px",
		minHeight: isLandscape ? "8vh" : "6vh",
		display: "flex",
		alignItems: "center",
	};

	const isNextPrayer = (prayer: string) => {
		if (!state.nextPrayer) return false;
		return state.nextPrayer.name === prayer;
	};

	const rowStyles = (prayer: string) => {
		const style = isNextPrayer(prayer)
			? { ...rowSX, backgroundColor: "#a30000" }
			: { ...rowSX };

		if ("Jumu'ah" === prayer) {
			return { ...rowSX, backgroundColor: "white", color: "black" };
		}

		return style;
	};

	const cellStyles = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: responsiveSizes.spacing.xs,
	};

	const prayers: PrayerInfo[] = [
		{ name: "Fajr", key: "Fajr" },
		{ name: "Zuhr", key: "Zuhr" },
		{ name: "Asr", key: "Asr" },
		{ name: "Maghrib", key: "Maghrib" },
		{ name: "Isha", key: "Isha" },
	];

	return (
		<Box sx={{ width: "100%" }}>
			<Grid container spacing={1}>
				<Grid item container xs={12} sx={rowSX}>
					<Grid item xs={3} sx={cellStyles}>
						<Typography variant="h6">Prayer</Typography>
					</Grid>
					<Grid item xs={3} sx={cellStyles}>
						<Typography variant="h6">Start</Typography>
					</Grid>
					<Grid item xs={3} sx={cellStyles}>
						<Typography variant="h6">Jamaa'at</Typography>
					</Grid>
					<Grid item xs={3} sx={cellStyles}>
						<Typography variant="h6">Tomorrow</Typography>
					</Grid>
				</Grid>

				{prayers.map((prayer) => (
					<Grid key={prayer.key} item container xs={12} sx={rowStyles(prayer.key)}>
						<Grid item xs={3} sx={cellStyles}>
							<Typography variant="h6">{prayer.name}</Typography>
						</Grid>
						<Grid item xs={3} sx={cellStyles}>
							<Typography variant="h6">{todayTimetable?.[prayer.key]}</Typography>
						</Grid>
						<Grid item xs={3} sx={cellStyles}>
							<Typography variant="h6">
								{todayTimetable?.[`${prayer.key} J` as keyof IData]}
							</Typography>
						</Grid>
						<Grid item xs={3} sx={cellStyles}>
							<Typography variant="h6">
								{tomoTimetable?.[`${prayer.key} J` as keyof IData]}
							</Typography>
						</Grid>
					</Grid>
				))}
			</Grid>
		</Box>
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
