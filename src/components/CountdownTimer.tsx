import { useEffect, useState } from "react";
import { useAppState } from "../providers/state";
import moment from "moment";
import { Box, Grid } from "@mui/material";

const getPrayerTime = (today: any, tomorrow: any) => {
	const next = Object.keys(today).find((key) => {
		return (
			key.charAt(key.length - 1) === "J" &&
			moment().isBefore(moment(today[key], "hh:mm"))
		);
	});

	if (next) {
		return {
			name: next.slice(0, -2),
			time: today[next],
			timeLeft: -1,
			tomorrow: false,
		};
	} else {
		return {
			name: "Fajr",
			time: tomorrow["Fajr J"],
			timeLeft: -1,
			tomorrow: true,
		};
	}
};

export default function CountdownTimer() {
	const { state, setState } = useAppState();
	const [timeLeft, setTimeLeft] = useState("");
	const [nextPrayer, setNextPrayer] = useState<
		| {
				name: string;
				time: any;
				timeLeft: number;
				tomorrow: boolean;
		  }
		| undefined
	>();

	useEffect(() => {
		if (!state.todayTimetable || !state.tomoTimetable) return;
		if (!state.nextPrayer) {
			console.log("finding next prayer");
			// find next prayer

			const nextPrayer = getPrayerTime(
				state.todayTimetable,
				state.tomoTimetable
			);
			setNextPrayer(nextPrayer);
			setState({ ...state, nextPrayer });
		}
	}, []);

	useEffect(() => {
		if (nextPrayer) {
			const interval = setInterval(() => {
				if (nextPrayer.timeLeft === 0) {
					clearInterval(interval);
				}
				const time = moment(nextPrayer.time, "hh:mm");
				if (nextPrayer.tomorrow) {
					time.add(1, "day");
				}

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
