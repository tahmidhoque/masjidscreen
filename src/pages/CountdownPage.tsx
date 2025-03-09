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
		const now = moment();
		
		// If we're counting down to Adhaan
		if (title === "Adhaan") {
			// Next will be the Jamaa'at for this prayer
			return {
				title: `Next: ${nextPrayer.name} Jamaa'at`,
				time: moment(nextPrayer.jamaat, ["h:mm A", "HH:mm"]).format("h:mm A")
			};
		} else {
			// If we're counting down to Jamaa'at, next will be the next prayer's Adhaan
			// First check if there are any more prayers today
			for (let i = currentPrayerIndex + 1; i < prayers.length; i++) {
				const nextPrayerName = prayers[i];
				const nextPrayerTime = moment(state.todayTimetable[nextPrayerName], ["h:mm A", "HH:mm"]);
				
				if (now.isBefore(nextPrayerTime)) {
					return {
						title: `Next: ${nextPrayerName} Adhaan`,
						time: nextPrayerTime.format("h:mm A")
					};
				}
			}

			// If no more prayers today, return tomorrow's Fajr
			return {
				title: `Next: Fajr Adhaan`,
				time: moment(state.tomoTimetable["Fajr"], ["h:mm A", "HH:mm"]).format("h:mm A")
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
