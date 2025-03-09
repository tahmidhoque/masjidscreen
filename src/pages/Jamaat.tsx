import { Box, Grid, Typography, Paper } from "@mui/material";
import noSmartPhone from "../assets/no-smartphones.png";
import { useEffect } from "react";
import CountdownTimer from "../components/CountdownTimer";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { useAppState } from "../providers/state";
import moment from "moment";

export default function Jamaat() {
	const navigate = useNavigate();
	const { state } = useAppState();

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/");
		}, 120000); // 2 minutes

		return () => clearTimeout(timer);
	}, [navigate]);

	const getNextTimeInfo = () => {
		if (!state.nextPrayer || !state.todayTimetable || !state.tomoTimetable) return null;

		const prayers = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"] as const;
		const currentPrayerIndex = prayers.indexOf(state.nextPrayer.name as typeof prayers[number]);
		
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
					gap: 6,
					px: 3,
					py: 4
				}}
			>
				{/* Top section with title */}
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 3,
						alignSelf: "end"
					}}
				>
					<Typography variant="h1" fontWeight={"bold"}>
						سووا صفوفكم
					</Typography>
					<Typography variant="h2" fontWeight={"bold"}>
						Straighten Your Rows
					</Typography>
				</Box>

				{/* Middle section with phone image */}
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 6
					}}
				>
					<Box sx={{ 
						width: "200px",
						height: "200px",
						my: 2
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
							pt: 3,
							pb: 2
						}}
					>
						<Paper 
							elevation={3}
							sx={{
								p: 3,
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

				<CountdownTimer hide />
			</Box>
		</MainLayout>
	);
}
