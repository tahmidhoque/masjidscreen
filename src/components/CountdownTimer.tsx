import { useEffect, useState } from "react";
import { useAppState } from "../providers/state";
import moment from "moment";
import { Box, Grid } from "@mui/material";

export default function CountdownTimer() {
	const { state, setState } = useAppState();
	const [timeLeft, setTimeLeft] = useState("");
	const [nextPrayer, setNextPrayer] = useState<
		| {
				name: string;
				time: any;
				timeLeft: number;
		  }
		| undefined
	>();

	useEffect(() => {
		if (!state.todayTimetable || !state.tomoTimetable) return;
		if (!state.nextPrayer) {
			console.log("finding next prayer");
			// find next prayer
			const today = state.todayTimetable;
			const prayers = [
				{ name: "Fajr", time: today.Fajr, timeLeft: -1 },
				{ name: "Zuhr", time: today.Zuhr, timeLeft: -1 },
				{ name: "Asr", time: today.Asr, timeLeft: -1 },
				{ name: "Maghrib", time: today.Maghrib, timeLeft: -1 },
				{ name: "Isha", time: today.Isha, timeLeft: -1 },
			];

			const nextPrayer = prayers.find((prayer) => {
				return moment(prayer.time, "hh:mm").isAfter(moment());
			});
			setNextPrayer(nextPrayer);
			setState({ ...state, nextPrayer });
		}
	}, [state.nextPrayer, state.todayTimetable, state.tomorrowTimetable]);

	useEffect(() => {
		if (nextPrayer) {
			console.log("setting interval");
			const interval = setInterval(() => {
				const time = moment(nextPrayer.time, "hh:mm");
				const now = moment();

				const timeLeftMinutes = time.diff(now, "minutes") % 60;
				const timeLeftHours = time.diff(now, "hours");
				const timeLeftSeconds = time.diff(now, "seconds") % 60;
				const timeLeft = `${timeLeftHours < 10 ? 0 : ""}${timeLeftHours}:${
					timeLeftMinutes < 10 ? 0 : ""
				}${timeLeftMinutes}:${timeLeftSeconds < 10 ? 0 : ""}${timeLeftSeconds}`;
				setState({ ...state, nextPrayer: { ...nextPrayer, timeLeft } });
				setTimeLeft(timeLeft);
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [nextPrayer]);

	return (
		<Grid container spacing={2} sx={{ color: "white", width: "100%" }}>
			<Grid item xs={12} sx={{ textAlign: "center" }}>
				<Box sx={{ fontSize: "2rem" }}>Next Prayer</Box>
			</Grid>
			<Grid item xs={12} sx={{ textAlign: "center" }}>
				<Box sx={{ fontSize: "2rem" }}>
					{nextPrayer?.name} in {timeLeft}
				</Box>
			</Grid>
		</Grid>
	);
}
