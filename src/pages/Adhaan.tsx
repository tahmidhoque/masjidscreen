import { Box, Grid, Typography, Paper } from "@mui/material";
import noSmartPhone from "../assets/no-smartphones.png";
import { useAppState } from "../providers/state";
import CountdownTimer from "../components/CountdownTimer";
import moment from "moment";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

export default function Adhaan() {
	const { state } = useAppState();
	const navigate = useNavigate();

	useEffect(() => {
		if (state.nextPrayer) {
			const hasBeen3Minutes = moment().isSameOrAfter(
				moment(state.nextPrayer.time, "hh:mm").add(3, "minutes")
			);

			if (hasBeen3Minutes) {
				navigate("/");
			}
		}
	}, [navigate, state.nextPrayer]);

	const getNextTimeInfo = () => {
		if (!state.nextPrayer) return null;

		// During Adhaan, next will be Jamaa'at
		return {
			title: `Next: ${state.nextPrayer.name} Jamaa'at`,
			time: moment(state.nextPrayer.jamaat, "HH:mm").format("h:mm A")
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
						Adhaan In Progress
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
