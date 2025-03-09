import { Box, Grid, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAppState } from "../providers/state";
import { useNavigate } from "react-router-dom";

const fieldStyle = {
	margin: "10px",
	color: "white",
	backgroundColor: "rgba(0,0,0,0.5)",
};

export default function Login() {
	const [password, setPassword] = useState("");
	const { setLogin } = useAppState();
	const navigate = useNavigate();

	const handleLogin = () => {
		if (password === process.env.REACT_APP_PASSWORD) {
			setLogin(true);
			navigate("/settings");
		}
	};

	return (
		<Grid container spacing={2} sx={{ justifyContent: "center" }}>
			<Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
				<Typography variant="h2">Login</Typography>
			</Grid>

			<Grid
				item
				container
				xs={12}
				sx={{ display: "flex", justifyContent: "center" }}
			>
				<Box
					sx={{
						width: "50%",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						backgroundImage:
							"linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0));",
						backdropFilter: "blur(10px)",
						boxShadow: "10px 10px 10px rgba(30,30,30,0.5);",
						padding: "20px",
						borderRadius: "10px",
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							flexDirection: "column",
						}}
					>
						<TextField
							id="outlined-basic"
							label="Password"
							InputLabelProps={{ style: { color: "white" } }}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							variant="filled"
							sx={fieldStyle}
						/>
					</Box>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							flexDirection: "column",
							width: "30%",
							margin: "auto",
						}}
					>
						<Button
							variant="contained"
							sx={{ margin: "10px" }}
							onClick={handleLogin}
						>
							Login
						</Button>
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
}
