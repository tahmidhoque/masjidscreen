import { Box, Grid, Typography } from "@mui/material";
import noSmartPhone from "../assets/no-smartphones.png";
import { useAppState } from "../providers/state";
import CountdownTimer from "../components/CountdownTimer";
import moment from "moment";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Adhaan() {
	const { state } = useAppState();
	const navigate = useNavigate();

	useEffect(() => {
		if (state.nextPrayer) {
			const hasBeen3Minutes = moment().isSameOrAfter(
				moment(state.nextPrayer.time, "hh:mm").add(3, "minutes")
			);

			console.log("hasBeen3Minutes", hasBeen3Minutes);

			if (hasBeen3Minutes) {
				navigate("/");
			}
		}
	});

	return (
		<Grid
			container
			sx={{ height: "inherit", alignItems: "center", justifyContent: "center" }}
		>
			<Grid item xs={12} sx={{ alignItems: "center" }}>
				<Box
					sx={{
						justifyContent: "center",
						alignContent: "center",
						textAlign: "center",
					}}
				>
					<Typography variant="h2" fontWeight={"bold"}>
						Adhaan In Progress
					</Typography>
					<Box
						sx={{
							paddingTop: "5%",
							justifyContent: "center",
							textAlign: "center",
							alignItems: "center",
							margin: "0 10%",
						}}
					>
						<Typography variant="h1" fontSize={"50wh"} paddingBottom={10}>
							<img src={noSmartPhone} alt="switch off phone" />
						</Typography>
						<Typography variant="h3">
							PLEASE BE QUIET AND SWITCH OFF YOUR MOBILE PHONES! JHAZAKUMULLAHU
							KHAIRAN.
						</Typography>
					</Box>
				</Box>
				<CountdownTimer hide />
			</Grid>
		</Grid>
	);
}
