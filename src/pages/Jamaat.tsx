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
		<Box
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				height: "100dvh",
				width: "100vw",
				overflow: "hidden",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<Grid
				container
				sx={{ 
					maxHeight: "100dvh",
					width: "100%",
					alignItems: "center", 
					justifyContent: "center",
					overflow: "hidden"
				}}
			>
				<Grid item xs={12}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 2,
							padding: "1rem",
							height: "100%",
							overflow: "hidden"
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
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								gap: 3,
								width: "100%",
								maxWidth: "90%",
								overflow: "hidden"
							}}
						>
							<Box sx={{ 
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								maxHeight: "30vh"
							}}>
								<img 
									src={noSmartPhone} 
									alt="switch off phone" 
									style={{
										maxWidth: "100%",
										maxHeight: "100%",
										width: "auto",
										height: "auto",
										objectFit: "contain",
										userSelect: "none",
										WebkitUserSelect: "none",
										pointerEvents: "none"
									}}
								/>
							</Box>
							<Typography variant="h3" sx={{ textAlign: "center" }}>
								PLEASE BE QUIET AND SWITCH OFF YOUR MOBILE PHONES! JHAZAKUMULLAHU
								KHAIRAN.
							</Typography>
						</Box>
					</Box>
					<CountdownTimer hide />
				</Grid>
			</Grid>
		</Box>
	);
}
