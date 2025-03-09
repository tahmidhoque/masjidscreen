import { useEffect, useState, useCallback } from "react";
import { useAppState } from "../providers/state";
import moment from "moment";
import { Box, Grid, Skeleton } from "@mui/material";
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

	const prayers = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"] as const;
	const now = moment();

	console.log("Current time:", now.format("HH:mm"));
	console.log("Today's prayer times:", today);

	// First check today's prayers
	for (const prayer of prayers) {
		// Convert from 12-hour to 24-hour format
		const prayerDateTime = moment(today[prayer], ["h:mm A", "HH:mm"]).set({
			year: now.year(),
			month: now.month(),
			date: now.date()
		});
		
		const jamaatDateTime = moment(today[`${prayer} J`], ["h:mm A", "HH:mm"]).set({
			year: now.year(),
			month: now.month(),
			date: now.date()
		});
		
		console.log(`\nChecking ${prayer}:`, {
			now: now.format("HH:mm"),
			prayerTime: prayerDateTime.format("HH:mm"),
			jamaatTime: jamaatDateTime.format("HH:mm"),
			rawPrayerTime: today[prayer],
			rawJamaatTime: today[`${prayer} J`],
			isPrayerAfterNow: now.isBefore(prayerDateTime),
			isJamaatAfterNow: now.isBefore(jamaatDateTime)
		});

		if (now.isBefore(prayerDateTime) || now.isBefore(jamaatDateTime)) {
			console.log(`Found next prayer: ${prayer}`);
			return {
				name: prayer,
				time: today[prayer],
				jamaat: today[`${prayer} J`],
				jamaatTimeLeft: "",
				timeLeft: "",
				tomorrow: false,
				countingJamaat: false,
			};
		}
	}

	console.log("No more prayers today, returning tomorrow's Fajr");
	// If no more prayers today, return tomorrow's Fajr
	return {
		name: "Fajr",
		time: tomorrow["Fajr"],
		jamaat: tomorrow["Fajr J"],
		jamaatTimeLeft: "",
		timeLeft: "",
		tomorrow: true,
		countingJamaat: false,
	};
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
	const [timeLeft, setTimeLeft] = useState("--:--:--");
	const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>({
		name: "",
		time: "",
		jamaat: "",
		jamaatTimeLeft: "",
		timeLeft: "",
		tomorrow: false,
		countingJamaat: false,
	});
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const responsiveSizes = useResponsiveSize();

	const handleNavigation = useCallback((path: string) => {
		navigate(path);
	}, [navigate]);

	// Initialize the prayer time as soon as state is available
	useEffect(() => {
		if (!state?.todayTimetable || !state?.tomoTimetable) return;
		
		const initialPrayer = getPrayerTime(state.todayTimetable, state.tomoTimetable);
		setNextPrayer(initialPrayer);
		
		// Calculate initial time left immediately
		const prayerTime = moment(initialPrayer.time, ["h:mm A", "HH:mm"]).set({
			year: moment().year(),
			month: moment().month(),
			date: initialPrayer.tomorrow ? moment().date() + 1 : moment().date()
		});

		const now = moment();
		const timeLeftMinutes = prayerTime.diff(now, "minutes") % 60;
		const timeLeftHours = prayerTime.diff(now, "hours");
		const timeLeftSeconds = prayerTime.diff(now, "seconds") % 60;
		const initialTimeLeft = `${formatTime(timeLeftHours)}:${formatTime(
			timeLeftMinutes
		)}:${formatTime(timeLeftSeconds)}`;

		setTimeLeft(initialTimeLeft);
		setIsLoading(false);
	}, [state?.todayTimetable, state?.tomoTimetable]);

	useEffect(() => {
		if (!nextPrayer || !state) return;

		const interval = setInterval(() => {
			//change page at certain times
			if (nextPrayer.timeLeft === "00:00:00") {
				if (
					moment().isSameOrBefore(
						moment(nextPrayer.time, ["h:mm A", "HH:mm"]).add(3, "minutes")
					)
				) {
					handleNavigation("/adhaan");
				}

				if (nextPrayer.jamaatTimeLeft === "00:00:00") {
					handleNavigation("/jamaat");
				} else if (
					moment(nextPrayer.jamaatTimeLeft, "HH:mm:ss").isSameOrBefore(
						moment("00:05:00", "HH:mm:ss")
					) &&
					nextPrayer.name !== "Maghrib"
				) {
					handleNavigation("/jamaat-countdown");
				}
			}

			if (
				nextPrayer.timeLeft !== "00:00:00" &&
				moment(nextPrayer.timeLeft, "HH:mm:ss").isSameOrBefore(
					moment("00:05:00", "HH:mm:ss")
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

			const now = moment();

			// update jamaat time left
			const jamaatTime = moment(nextPrayer.jamaat, ["h:mm A", "HH:mm"]).set({
				year: moment().year(),
				month: moment().month(),
				date: nextPrayer.tomorrow ? moment().date() + 1 : moment().date()
			});
			
			const jamaatTimeLeftMinutes = jamaatTime.diff(now, "minutes") % 60;
			const jamaatTimeLeftHours = jamaatTime.diff(now, "hours");
			const jamaatTimeLeftSeconds = jamaatTime.diff(now, "seconds") % 60;
			const jamaatTimeLeft = `${formatTime(jamaatTimeLeftHours)}:${formatTime(
				jamaatTimeLeftMinutes
			)}:${formatTime(jamaatTimeLeftSeconds)}`;

			//update adhaan time left
			const prayerTime = moment(nextPrayer.time, ["h:mm A", "HH:mm"]).set({
				year: moment().year(),
				month: moment().month(),
				date: nextPrayer.tomorrow ? moment().date() + 1 : moment().date()
			});

			const timeLeftMinutes = prayerTime.diff(now, "minutes") % 60;
			const timeLeftHours = prayerTime.diff(now, "hours");
			const timeLeftSeconds = prayerTime.diff(now, "seconds") % 60;
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

	if (hide) return null;

	return (
		<Grid container spacing={0} sx={{ color: "white", width: "100%" }}>
			{!hideLabel && (
				<Grid item xs={12} sx={{ textAlign: "center" }}>
					<Box
						sx={{
							fontSize: fontSize || responsiveSizes.fontSize.h2,
							fontWeight: "bold",
							opacity: isLoading ? 0.5 : 1,
							transition: "opacity 0.3s ease-in-out"
						}}
					>
						Time Till {nextPrayer?.name || "..."}{" "}
						{nextPrayer?.countingJamaat ? "Jamaa'at" : ""}{" "}
					</Box>
				</Grid>
			)}
			<Grid item xs={12} sx={{ textAlign: "center" }}>
				<Box
					sx={{
						fontSize: fontSize || responsiveSizes.fontSize.h1,
						fontWeight: "bold",
						opacity: isLoading ? 0.5 : 1,
						transition: "opacity 0.3s ease-in-out"
					}}
				>
					{timeLeft}
				</Box>
			</Grid>
		</Grid>
	);
}
