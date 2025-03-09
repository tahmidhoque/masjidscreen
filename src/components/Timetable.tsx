import { Grid, Typography, Box } from "@mui/material";

import { useAppState } from "../providers/state";
import { useEffect, useMemo } from "react";
import useResponsiveSize from "../hooks/useResponsiveSize";
import useScreenOrientation from "../hooks/useScreenOrientation";
import IData from "../interfaces/IData";

type PrayerInfo = {
	name: string;
	key: keyof Pick<IData, "Fajr" | "Zuhr" | "Asr" | "Maghrib" | "Isha">;
};

const convertTo24Hour = (time12h: string | undefined): string => {
	if (!time12h) return '';
	const [timeStr, modifier] = time12h.split(' ');
	if (!timeStr || !modifier) return time12h;
	
	let [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
	if (isNaN(hours) || isNaN(minutes)) return time12h;
	
	if (hours === 12) {
		hours = modifier === 'PM' ? 12 : 0;
	} else {
		hours = modifier === 'PM' ? hours + 12 : hours;
	}
	
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export function Timetable() {
	const { state } = useAppState();
	const responsiveSizes = useResponsiveSize();
	const { orientation } = useScreenOrientation();
	const isLandscape = orientation === "landscape-primary";

	// Only log when timetable data actually changes
	useEffect(() => {
		console.log('Timetable data changed:', {
			todayTimetable: state.todayTimetable?.Date,
			tomoTimetable: state.tomoTimetable?.Date,
			numEntries: state.timetableData?.length,
			isLoading: state.isLoading
		});
	}, [state.todayTimetable?.Date, state.tomoTimetable?.Date, state.timetableData?.length, state.isLoading]);

	const rowSX = useMemo(() => ({
		padding: responsiveSizes.spacing.xs,
		borderRadius: "20px",
		minHeight: isLandscape ? "8vh" : "6vh",
		display: "flex",
		alignItems: "center",
	}), [responsiveSizes.spacing.xs, isLandscape]);

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

	const cellStyles = useMemo(() => ({
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: responsiveSizes.spacing.xs,
	}), [responsiveSizes.spacing.xs]);

	const prayers: PrayerInfo[] = useMemo(() => [
		{ name: "Fajr", key: "Fajr" },
		{ name: "Zuhr", key: "Zuhr" },
		{ name: "Asr", key: "Asr" },
		{ name: "Maghrib", key: "Maghrib" },
		{ name: "Isha", key: "Isha" },
	], []);

	if (state.isLoading) {
		return (
			<Box sx={{ width: "100%", textAlign: "center", p: 2 }}>
				<Typography variant="h6">Loading prayer times...</Typography>
			</Box>
		);
	}

	if (!state.todayTimetable || !state.tomoTimetable) {
		return (
			<Box sx={{ width: "100%", textAlign: "center", p: 2 }}>
				<Typography variant="h6">No prayer times available</Typography>
			</Box>
		);
	}

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
							<Typography variant="h6">
								{convertTo24Hour(state.todayTimetable?.[prayer.key])}
							</Typography>
						</Grid>
						<Grid item xs={3} sx={cellStyles}>
							<Typography variant="h6">
								{convertTo24Hour(state.todayTimetable?.[`${prayer.key} J` as keyof IData])}
							</Typography>
						</Grid>
						<Grid item xs={3} sx={cellStyles}>
							<Typography variant="h6">
								{convertTo24Hour(state.tomoTimetable?.[`${prayer.key} J` as keyof IData])}
							</Typography>
						</Grid>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
