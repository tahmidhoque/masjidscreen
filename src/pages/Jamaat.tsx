import { Box, Grid, Typography } from "@mui/material";
import noSmartPhone from "../assets/no-smartphones.png";
import { useEffect } from "react";
import CountdownTimer from "../components/CountdownTimer";
import { useNavigate } from "react-router-dom";

export default function Jamaat() {
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			navigate("/");
		}, 120000);
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
					<Typography variant="h1" fontWeight={"bold"}>
						سووا صفوفكم
					</Typography>
					<Typography variant="h2" fontWeight={"bold"}>
						Straighten Your Rows
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
