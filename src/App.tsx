import { ThemeProvider, createTheme } from "@mui/material";
import BaseRoutes from "./routes/BaseRoutes";
import { ThemeOptions } from "@mui/material/styles";
import { AppStateProvider } from "./providers/state";

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
					},
				},
			},
		},
	});

	return (
		<AppStateProvider>
			<ThemeProvider theme={theme}>
				<BaseRoutes />
			</ThemeProvider>
		</AppStateProvider>
	);
}
