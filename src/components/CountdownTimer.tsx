import { useEffect, useState, useRef } from "react";
import { useAppState } from "../providers/state";
import moment from "moment";
import { Box, Grid } from "@mui/material";
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

	// First check today's prayers
	for (const prayer of prayers) {
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

		if (now.isBefore(prayerDateTime) || now.isBefore(jamaatDateTime)) {
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
	const [isLoading, setIsLoading] = useState(true);
	const responsiveSizes = useResponsiveSize();
	const lastUpdateTime = useRef<number>(0);

	// Initialize the prayer time as soon as state is available
	useEffect(() => {
		if (!state?.todayTimetable || !state?.tomoTimetable) return;
		
		const initialPrayer = getPrayerTime(state.todayTimetable, state.tomoTimetable);
		updateNextPrayer(initialPrayer);
		
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
	}, [state?.todayTimetable, state?.tomoTimetable, updateNextPrayer]);

	useEffect(() => {
		if (!state.nextPrayer) return;

		const interval = setInterval(() => {
			const { nextPrayer } = state;
			if (!nextPrayer) return;

			const now = moment();

			// update jamaat time left
			const jamaatTime = moment(nextPrayer.jamaat, ["h:mm A", "HH:mm"]).set({
				year: now.year(),
				month: now.month(),
				date: nextPrayer.tomorrow ? now.date() + 1 : now.date()
			});
			
			const jamaatTimeLeftMinutes = jamaatTime.diff(now, "minutes") % 60;
			const jamaatTimeLeftHours = jamaatTime.diff(now, "hours");
			const jamaatTimeLeftSeconds = jamaatTime.diff(now, "seconds") % 60;
			const jamaatTimeLeft = `${formatTime(jamaatTimeLeftHours)}:${formatTime(
				jamaatTimeLeftMinutes
			)}:${formatTime(jamaatTimeLeftSeconds)}`;

			//update adhaan time left
			const prayerTime = moment(nextPrayer.time, ["h:mm A", "HH:mm"]).set({
				year: now.year(),
				month: now.month(),
				date: nextPrayer.tomorrow ? now.date() + 1 : now.date()
			});

			const timeLeftMinutes = prayerTime.diff(now, "minutes") % 60;
			const timeLeftHours = prayerTime.diff(now, "hours");
			const timeLeftSeconds = prayerTime.diff(now, "seconds") % 60;
			const timeLeft = `${formatTime(timeLeftHours)}:${formatTime(
				timeLeftMinutes
			)}:${formatTime(timeLeftSeconds)}`;

			const countingJamaat =
				timeLeftMinutes <= 0 && timeLeftHours <= 0 && timeLeftSeconds <= 0;

			// Only update state every second
			const currentTime = Date.now();
			if (currentTime - lastUpdateTime.current >= 1000) {
				lastUpdateTime.current = currentTime;

				// Only update if there are actual changes
				const hasChanges = 
					timeLeft !== nextPrayer.timeLeft ||
					jamaatTimeLeft !== nextPrayer.jamaatTimeLeft ||
					countingJamaat !== nextPrayer.countingJamaat;

				if (hasChanges) {
					const updatedPrayer = {
						...nextPrayer,
						timeLeft,
						jamaatTimeLeft,
						countingJamaat,
					};

					updateNextPrayer(updatedPrayer);
					updateCountingJamaat(countingJamaat);
				}
			}

			// Always update the displayed time
			if (countingJamaat) {
				setTimeLeft(jamaatTimeLeft);
			} else {
				setTimeLeft(timeLeft);
			}
		}, 100); // Run more frequently but update state less often

		return () => {
			clearInterval(interval);
		};
	}, [state, updateCountingJamaat, updateNextPrayer]);

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
						Time Till {state.nextPrayer?.name || "..."}{" "}
						{state.nextPrayer?.countingJamaat ? "Jamaa'at" : ""}{" "}
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
