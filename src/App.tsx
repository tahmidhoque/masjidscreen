import { ThemeProvider, createTheme } from "@mui/material";
import Routes from "./routes/Routes";
import { ThemeOptions } from "@mui/material/styles";
import { AppStateProvider } from "./providers/state";
import { AnimatePresence } from "framer-motion";

export default function App() {
	const theme: ThemeOptions = createTheme({
		components: {
			MuiTableCell: {
				styleOverrides: {
					root: {
						border: "none",
						textAlign: "center",
						fontSize: "33px",
						fontWeight: "bold",
						color: "white",
					},
				},
			},
			MuiTypography: {
				styleOverrides: {
					h6: {
						color: "white",
						fontSize: "33px",
						textAlign: "center",
						fontWeight: "bold",
					},
					root: {
						color: "white",
						cursor: "default",
						"&:focus": {
							outline: "none",
						},
					},
				},
			},
		},
	});

	return (
		<AppStateProvider>
			<AnimatePresence mode="wait">
				<ThemeProvider theme={theme}>
					<Routes />
				</ThemeProvider>
			</AnimatePresence>
		</AppStateProvider>
	);
}
