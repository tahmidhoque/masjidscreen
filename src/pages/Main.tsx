import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import useScreenOrientation from "../hooks/useScreenOrientation";
import { useAppState } from "../providers/state";
import useResponsiveSize from "../hooks/useResponsiveSize";
import backgroundImage from "../assets/background-img.png";
import LandscapeLayout from "../components/layouts/LandscapeLayout";
import PortraitLayout from "../components/layouts/PortraitLayout";

export default function Main() {
	const { state } = useAppState();
	const isLoading = state.isLoading;
	const { orientation } = useScreenOrientation();
	const responsiveSizes = useResponsiveSize();
	const theme = useTheme();
	const isTabletOrAbove = useMediaQuery(theme.breakpoints.up('sm'));
	const isLandscape = orientation === "landscape-primary";

	// Use landscape layout for tablet and above in landscape mode
	const shouldUseLandscapeLayout = isLandscape && isTabletOrAbove;

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
				shouldUseLandscapeLayout ? (
					<LandscapeLayout isLoading={isLoading} />
				) : (
					<PortraitLayout isLoading={isLoading} />
				)
			)}
		</Box>
	);
}
