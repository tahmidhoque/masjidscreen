import { Box, Grid, Typography, Paper } from "@mui/material";
import useScreenOrientation from "../hooks/useScreenOrientation";
import CountdownTimer from "../components/CountdownTimer";
import noSmartPhone from "../assets/no-smartphones.png";
import MainLayout from "../components/MainLayout";
import { useAppState } from "../providers/state";
import moment from "moment";
import IData from "../interfaces/IData";

export default function CountdownPage({
	title,
}: {
	title: string;
}): JSX.Element {
	const { state } = useAppState();
	const nextPrayer = state.nextPrayer;
	
	const getNextTimeInfo = () => {
		if (!nextPrayer || !state.todayTimetable || !state.tomoTimetable) return null;

		const prayers = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"] as const;
		const currentPrayerIndex = prayers.indexOf(nextPrayer.name as typeof prayers[number]);
		
		// If we're counting down to Adhaan
		if (title === "Adhaan") {
			// Next will be the Jamaa'at for this prayer
			return {
				title: `Next: ${nextPrayer.name} Jamaa'at`,
				time: moment(nextPrayer.jamaat, "HH:mm").format("h:mm A")
			};
		} else {
			// If we're counting down to Jamaa'at, next will be the next prayer's Adhaan
			let nextPrayerName: typeof prayers[number];
			let nextPrayerTime: string;

			// If this is the last prayer of the day
			if (currentPrayerIndex === prayers.length - 1) {
				// Next prayer is tomorrow's Fajr
				nextPrayerName = "Fajr";
				nextPrayerTime = state.tomoTimetable[nextPrayerName];
			} else {
				// Next prayer is today's next prayer
				nextPrayerName = prayers[currentPrayerIndex + 1];
				nextPrayerTime = state.todayTimetable[nextPrayerName];
			}

			return {
				title: `Next: ${nextPrayerName} Adhaan`,
				time: moment(nextPrayerTime, "HH:mm").format("h:mm A")
			};
		}
	};

	const nextTimeInfo = getNextTimeInfo();

	return (
		<MainLayout>
			<Box 
				sx={{ 
					height: "100%",
					width: "100%",
					display: "grid",
					gridTemplateRows: "1fr auto 1fr",
					alignItems: "center",
					gap: 4
				}}
			>
				{/* Top section with countdown */}
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 2,
						alignSelf: "end"
					}}
				>
					<Typography variant="h1">{nextPrayer?.name + " " + title}</Typography>
					<Typography variant="h2">
						Will Begin in:
					</Typography>
					<CountdownTimer hideLabel fontSize="4rem" />
				</Box>

				{/* Middle section with phone image */}
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 4
					}}
				>
					<Box sx={{ 
						width: "200px",
						height: "200px"
					}}>
						<img 
							src={noSmartPhone} 
							alt="switch off phone" 
							style={{
								width: "100%",
								height: "100%",
								objectFit: "contain"
							}}
						/>
					</Box>

					<Typography 
						variant="h6" 
						sx={{ 
							textAlign: "center",
							maxWidth: "80%"
						}}
					>
						PLEASE BE QUIET AND SWITCH OFF YOUR MOBILE PHONES! JHAZAKUMULLAHU KHAIRAN.
					</Typography>
				</Box>

				{/* Bottom section with next prayer info */}
				{nextTimeInfo && (
					<Box
						sx={{
							alignSelf: "start",
							display: "flex",
							justifyContent: "center",
							width: "100%",
							pt: 2
						}}
					>
						<Paper 
							elevation={3}
							sx={{
								p: 2,
								backgroundColor: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(10px)',
								borderRadius: 2,
								border: '1px solid rgba(255, 255, 255, 0.3)',
								width: 'auto',
								minWidth: '300px'
							}}
						>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 1
								}}
							>
								<Typography 
									variant="h6" 
									sx={{ 
										color: 'white',
										opacity: 0.9,
										fontWeight: 'medium'
									}}
								>
									{nextTimeInfo.title}
								</Typography>
								<Typography 
									variant="h3" 
									sx={{ 
										color: 'white',
										fontWeight: 'bold'
									}}
								>
									{nextTimeInfo.time}
								</Typography>
							</Box>
						</Paper>
					</Box>
				)}
			</Box>
		</MainLayout>
	);
}
