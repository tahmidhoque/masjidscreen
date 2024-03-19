import { Box, Grid, Typography } from "@mui/material";
import useScreenOrientation from "../hooks/useScreenOrientation";
import CountdownTimer from "../components/CountdownTimer";
import noSmartPhone from "../assets/no-smartphones.png";

export default function CountdownPage({
	title,
}: {
	title: string;
}): JSX.Element {
	const { orientation } = useScreenOrientation();
	const isLandscape = orientation === "landscape-primary";
	const columnWidth = isLandscape ? 6 : 12;

	return (
		<Grid container sx={{ height: "inherit" }}>
			<Grid
				item
				xs={columnWidth}
				sx={{
					alignItems: "center",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					textAlign: "center",
				}}
			>
				<Box
					sx={{
						textAlign: "center",
						margin: " 0 10%",
					}}
				>
					<Typography variant="h1">{title}</Typography>
					<Typography variant="h2">Will Begin in:</Typography>
					<CountdownTimer hideLabel fontSize="4rem" />
				</Box>
			</Grid>
			<Grid
				item
				xs={columnWidth}
				sx={{
					alignItems: "center",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					textAlign: "center",
				}}
			>
				<Box
					sx={{
						justifyContent: "center",
						textAlign: "center",
						alignItems: "center",
						margin: "0 10%",
					}}
				>
					<Typography variant="h1" fontSize={"50wh"} paddingBottom={10}>
						<img src={noSmartPhone} alt="switch off phone" />
					</Typography>
					<Typography variant="h4">
						PLEASE BE QUIET AND SWITCH OFF YOUR MOBILE PHONES! JHAZAKUMULLAHU
						KHAIRAN.
					</Typography>
				</Box>
			</Grid>
		</Grid>
	);
}
