import { ThemeProvider, createTheme } from "@mui/material";
import Routes from "./routes/Routes";
import { Theme, responsiveFontSizes } from "@mui/material/styles";
import { AppStateProvider } from "./providers/state";
import { AnimatePresence } from "framer-motion";

import "./styles/App.css";
import { BrowserRouter } from "react-router-dom";

export default function App() {
	let theme: Theme = createTheme({
		palette: {
			primary: {
				main: "#FFF5F0",
			},
			secondary: {
				main: "#A30000",
			},
		},

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
			MuiFormControlLabel: {
				styleOverrides: {
					label: {
						color: "black",
					},
				},
			},
			MuiListItemText: {
				styleOverrides: {
					primary: {
						color: "black",
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

	theme = responsiveFontSizes(theme);

	const baseName = () => {
		const split = window.location.pathname.split("/");
		return `/${split[1]}/${split[2]}`;
	};

	return (
		<BrowserRouter basename={baseName()}>
			<AppStateProvider>
				<AnimatePresence mode="wait">
					<ThemeProvider theme={theme}>
						<Routes />
					</ThemeProvider>
				</AnimatePresence>
			</AppStateProvider>
		</BrowserRouter>
	);
}
