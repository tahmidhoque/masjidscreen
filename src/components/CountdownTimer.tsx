import { useEffect, useState, useCallback } from "react";
import { useAppState } from "../providers/state";
import moment from "moment";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import IData from "../interfaces/IData";
import useResponsiveSize from "../hooks/useResponsiveSize";

interface PrayerTime {
	name: string;
	time: string;
	jamaat: string;
	jamaatTimeLeft: string;
	timeLeft: string;
	tomorrow: boolean;
	countingJamaat: boolean;
}

type PrayerKey = "Fajr" | "Zuhr" | "Asr" | "Maghrib" | "Isha" | "Khutbah";
type JamaatKey = "Fajr J" | "Zuhr J" | "Asr J" | "Maghrib J" | "Isha J" | "Khutbah J";

export const getPrayerTime = (today: IData | null, tomorrow: IData | null): PrayerTime => {
	if (!today || !tomorrow) {
		return {
			name: "Fajr",
			time: "",
			jamaat: "",
			jamaatTimeLeft: "",
			timeLeft: "",
			tomorrow: false,
			countingJamaat: false,
		};
	}

	const nextJ = Object.keys(today).find((key) => {
		const isFriday = moment().day() === 5;

		if (
			key.charAt(key.length - 1) === "J" &&
			moment().isBefore(moment(today[key as keyof IData] as string, "hh:mm"))
		) {
			if (key.includes("Khutbah") && isFriday) {
				return true;
			} else if (!key.includes("Khutbah")) {
				return true;
			}
		}
		return false;
	}) as JamaatKey | undefined;

	const next = Object.keys(today).find((key) => {
		return key === nextJ?.slice(0, -2);
	}) as PrayerKey | undefined;

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

export default function CountdownTimer({
	hideLabel,
	fontSize,
	hide,
}: {
	hide?: boolean;
	hideLabel?: boolean;
	fontSize?: string;
}) {
	const { state, updateCountingJamaat, updateNextPrayer } = useAppState();
	const [timeLeft, setTimeLeft] = useState("");
	const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
	const navigate = useNavigate();
	const responsiveSizes = useResponsiveSize();

	const handleNavigation = useCallback((path: string) => {
		navigate(path);
	}, [navigate]);

	useEffect(() => {
		if (!state) return;
		setNextPrayer(state.nextPrayer);
	}, [state]);

	useEffect(() => {
		if (!nextPrayer || !state) return;

		const interval = setInterval(() => {
			//change page at certain times
			if (nextPrayer.timeLeft === "00:00:00") {
				if (
					moment().isSameOrBefore(
						moment(nextPrayer.time, "hh:mm").add(3, "minutes")
					)
				) {
					handleNavigation("/adhaan");
				}

				if (nextPrayer.jamaatTimeLeft === "00:00:00") {
					handleNavigation("/jamaat");
				} else if (
					moment(nextPrayer.jamaatTimeLeft, "hh:mm:ss").isSameOrBefore(
						moment("00:05:00", "hh:mm:ss")
					) &&
					nextPrayer.name !== "Maghrib"
				) {
					handleNavigation("/jamaat-countdown");
				}
			}

			if (
				nextPrayer.timeLeft !== "00:00:00" &&
				moment(nextPrayer.timeLeft, "hh:mm:ss").isSameOrBefore(
					moment("00:05:00", "hh:mm:ss")
				)
			) {
				handleNavigation("/adhaan-countdown");
			}

			if (
				nextPrayer.jamaatTimeLeft === "00:00:00" &&
				nextPrayer.timeLeft === "00:00:00"
			) {
				handleNavigation("/jamaat");
			}

			if (nextPrayer.jamaatTimeLeft === "00:00:00") {
				// if time is 00:00:00, find next prayer
				const foundPrayer = getPrayerTime(
					state.todayTimetable,
					state.tomoTimetable
				);
				setNextPrayer(foundPrayer);
				updateNextPrayer(foundPrayer);
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

			const countingJamaat =
				timeLeftMinutes <= 0 && timeLeftHours <= 0 && timeLeftSeconds <= 0;

			const updatedPrayer = {
				...nextPrayer,
				timeLeft,
				jamaatTimeLeft,
				countingJamaat,
			};

			updateNextPrayer(updatedPrayer);
			updateCountingJamaat(countingJamaat);
			setNextPrayer(updatedPrayer);

			if (countingJamaat) {
				setTimeLeft(jamaatTimeLeft);
			} else {
				setTimeLeft(timeLeft);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [nextPrayer, state, handleNavigation, updateCountingJamaat, updateNextPrayer]);

	return (
		<>
			{!hide && (
				<Grid container spacing={0} sx={{ color: "white", width: "100%" }}>
					{!hideLabel && (
						<Grid item xs={12} sx={{ textAlign: "center" }}>
							<Box
								sx={{
									fontSize: fontSize || responsiveSizes.fontSize.h2,
									fontWeight: "bold",
								}}
							>
								Time Till {nextPrayer?.name}{" "}
								{nextPrayer?.countingJamaat ? "Jamaa'at" : ""}{" "}
							</Box>
						</Grid>
					)}
					<Grid item xs={12} sx={{ textAlign: "center" }}>
						<Box
							sx={{
								fontSize: fontSize || responsiveSizes.fontSize.h1,
								fontWeight: "bold",
							}}
						>
							{timeLeft}
						</Box>
					</Grid>
				</Grid>
			)}
		</>
	);
}
