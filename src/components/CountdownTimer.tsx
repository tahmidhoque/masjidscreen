import { useEffect, useState } from "react";
import { useAppState } from "../providers/state";
import moment from "moment";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const getPrayerTime = (today: any, tomorrow: any) => {
	const nextJ = Object.keys(today).find((key) => {
		const isFriday = moment().day() === 5;

		if (
			key.charAt(key.length - 1) === "J" &&
			moment().isBefore(moment(today[key], "hh:mm"))
		) {
			if (key.includes("Khutbah") && isFriday) {
				return true;
			} else if (!key.includes("Khutbah")) {
				return true;
			}
		}
	});

	const next = Object.keys(today).find((key) => {
		return key === nextJ?.slice(0, -2);
	});

	if (next && nextJ) {
		return {
			name: next,
			time: today[next],
			jamaat: today[nextJ],
			jamaatTimeLeft: "",
			timeLeft: "",
			tomorrow: false,
			countingJamaat: false,
		};
	} else {
		return {
			name: "Fajr",
			time: tomorrow["Fajr J"],
			jamaat: tomorrow["Fajr"],
			jamaatTimeLeft: "",
			timeLeft: "",
			tomorrow: true,
			countingJamaat: false,
		};
	}
};

export const formatTime = (time: number) => {
	return `${time < 0 ? "00" : time < 10 ? `0${time}` : time}`;
};

export default function CountdownTimer() {
	const { state, setState } = useAppState();
	const [timeLeft, setTimeLeft] = useState("");
	const [nextPrayer, setNextPrayer] = useState<
		| {
				jamaat: any;
				name: string;
				time: any;
				jamaatTimeLeft: string;
				timeLeft: string;
				tomorrow: boolean;
				countingJamaat: boolean;
		  }
		| undefined
	>(state.nextPrayer);
	const navigate = useNavigate();

	useEffect(() => {
		if (nextPrayer) {
			const interval = setInterval(() => {
				//change page at certain times
				if (nextPrayer.timeLeft === "00:00:00") {
					if (
						moment().isSameOrBefore(
							moment(nextPrayer.time, "hh:mm").add(3, "minutes")
						)
					) {
						navigate("/adhaan");
					}

					if (nextPrayer.jamaatTimeLeft === "00:00:00") {
						navigate("/jamaat");
					} else if (
						moment(nextPrayer.jamaatTimeLeft, "hh:mm:ss").isSameOrBefore(
							moment("00:05:00", "hh:mm:ss")
						) &&
						nextPrayer.name !== "Maghrib"
					) {
						navigate("/jamaat-countdown");
					}
				}

				if (
					nextPrayer.timeLeft !== "00:00:00" &&
					moment(nextPrayer.timeLeft, "hh:mm:ss").isSameOrBefore(
						moment("00:05:00", "hh:mm:ss")
					)
				) {
					navigate("/adhaan-countdown");
				}

				console.log(nextPrayer);

				if (
					nextPrayer.jamaatTimeLeft === "00:00:00" &&
					nextPrayer.timeLeft === "00:00:00"
				) {
					navigate("/jamaat");
				}

				if (nextPrayer.jamaatTimeLeft === "00:00:00") {
					// if time is 00:00:00, find next prayer
					const foundPrayer = getPrayerTime(
						state.todayTimetable,
						state.tomoTimetable
					);
					setNextPrayer(foundPrayer);
					setState({ ...state, nextPrayer: foundPrayer });
					return;
				}

				// update jamaat time left

				const jamaatTime = moment(nextPrayer.jamaat, "hh:mm");
				const now = moment();
				const jamaatTimeLeftMinutes = jamaatTime.diff(now, "minutes") % 60;
				const jamaatTimeLeftHours = jamaatTime.diff(now, "hours");
				const jamaatTimeLeftSeconds = jamaatTime.diff(now, "seconds") % 60;
				const jamaatTimeLeft = `${formatTime(jamaatTimeLeftHours)}:${formatTime(
					jamaatTimeLeftMinutes
				)}:${formatTime(jamaatTimeLeftSeconds)}`;
				setState({ ...state, nextPrayer: { ...nextPrayer, jamaatTimeLeft } });
				setNextPrayer({ ...nextPrayer, jamaatTimeLeft });

				//update adhaan time left
				const time = moment(nextPrayer.time, "hh:mm");
				if (nextPrayer.tomorrow) {
					time.add(1, "day");
				}

				const timeLeftMinutes = time.diff(now, "minutes") % 60;
				const timeLeftHours = time.diff(now, "hours");
				const timeLeftSeconds = time.diff(now, "seconds") % 60;
				const timeLeft = `${formatTime(timeLeftHours)}:${formatTime(
					timeLeftMinutes
				)}:${formatTime(timeLeftSeconds)}`;
				setState({
					...state,
					nextPrayer: { ...nextPrayer, timeLeft, jamaatTimeLeft },
					countingJamaat:
						timeLeftMinutes <= 0 && timeLeftHours <= 0 && timeLeftSeconds <= 0,
				});
				setNextPrayer({
					...nextPrayer,
					timeLeft,
					jamaatTimeLeft,
					countingJamaat:
						timeLeftMinutes <= 0 && timeLeftHours <= 0 && timeLeftSeconds <= 0,
				});
				if (
					timeLeftMinutes <= 0 &&
					timeLeftHours <= 0 &&
					timeLeftSeconds <= 0
				) {
					setTimeLeft(jamaatTimeLeft);
				} else {
					setTimeLeft(timeLeft);
				}
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [nextPrayer]);

	return (
		<Grid container spacing={2} sx={{ color: "white", width: "100%" }}>
			<Grid item xs={12} sx={{ textAlign: "center" }}>
				<Box sx={{ fontSize: "2rem" }}>
					Time Till {nextPrayer?.name}{" "}
					{nextPrayer?.countingJamaat ? "Jamaa'at" : ""}{" "}
				</Box>
			</Grid>
			<Grid item xs={12} sx={{ textAlign: "center" }}>
				<Box sx={{ fontSize: "2rem" }}>{timeLeft}</Box>
			</Grid>
		</Grid>
	);
}
