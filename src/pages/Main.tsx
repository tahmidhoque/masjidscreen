import { Box, CircularProgress, Grid } from "@mui/material";
import useScreenOrientation from "../hooks/useScreenOrientation";
import { Timetable } from "../components/Timetable";
import Clock from "../components/Clock";
import { useAppState } from "../providers/state";
import useResponsiveSize from "../hooks/useResponsiveSize";
import Date from "../components/Date";
import CountdownTimer from "../components/CountdownTimer";
import Hadith from "../components/Hadith";
import Banner from "../components/Banner";
import backgroundImage from "../assets/background-img.png";

export default function Main() {
	const { state } = useAppState();
	const isLoading = state.isLoading;
	const { orientation } = useScreenOrientation();
	const responsiveSizes = useResponsiveSize();
	const isLandscape = orientation === "landscape-primary";

	return (
		<Box 
			sx={{ 
				height: "100dvh", // Use dynamic viewport height
				overflow: "hidden",
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "#1a1a1a", // Dark background
				backgroundImage: `
					linear-gradient(rgba(26, 26, 26, 0.85), rgba(26, 26, 26, 0.85)),
					url(${backgroundImage})
				`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			{isLoading ? (
				<Box
					sx={{
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<CircularProgress size={responsiveSizes.spacing.lg} />
				</Box>
			) : (
				<Box
					sx={{
						height: "100%",
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
					}}
				>
					{/* Main content area */}
					<Box
						sx={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							overflow: "hidden",
						}}
					>
						{/* Clock and Date Section - Fixed height for mobile */}
						{!isLandscape && (
							<Box 
								sx={{ 
									height: "15%",
									py: 1,
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									overflow: "hidden",
								}}
							>
								<Clock />
								<Date />
							</Box>
						)}

						<Box
							sx={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								gap: "12px", // Fixed 12px gap
								overflow: "hidden",
								px: 2, // Consistent padding
							}}
						>
							{/* Timetable section */}
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									overflow: "hidden",
								}}
							>
								{/* Clock and Date only shown in landscape */}
								{isLandscape && (
									<Box 
										sx={{ 
											p: 1,
											display: "flex",
											flexDirection: "column",
											justifyContent: "center",
											alignItems: "center",
											overflow: "hidden",
										}}
									>
										<Clock />
										<Date />
									</Box>
								)}
								<Box 
									sx={{ 
										overflow: "hidden",
									}}
								>
									<Timetable />
								</Box>
							</Box>

							{/* Hadith section */}
							<Box
								sx={{
									flex: 1,
									minHeight: 0,
									display: "flex",
									flexDirection: "column",
									overflow: "hidden",
								}}
							>
								<Box 
									sx={{ 
										flex: 1,
										overflow: "hidden",
									}}
								>
									<Hadith />
								</Box>
							</Box>
						</Box>
					</Box>

					{/* Footer area */}
					<Box
						sx={{
							height: "15%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "flex-end",
							overflow: "hidden",
						}}
					>
						<Box
							sx={{
								flex: 1,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								py: 0.5,
								overflow: "hidden",
							}}
						>
							<CountdownTimer />
						</Box>
						<Box
							sx={{
								height: responsiveSizes.spacing.sm,
								backgroundColor: "rgba(0,0,0,0.1)",
								overflow: "hidden",
							}}
						>
							<Banner />
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
}
