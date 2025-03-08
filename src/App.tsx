import { ThemeProvider, createTheme } from "@mui/material";
import Routes from "./routes/Routes";
import { Theme, Components } from "@mui/material/styles";
import { AppStateProvider } from "./providers/state";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { initializeServices, sync } from "./services";
import { OfflineIndicator } from "./components/OfflineIndicator";
import useResponsiveSize from "./hooks/useResponsiveSize";

import "./styles/App.css";
import { BrowserRouter } from "react-router-dom";

declare module '@mui/material/styles' {
	interface Components {
		MuiBox?: {
			styleOverrides?: {
				root?: {
					'&.fullHeight'?: {
						height: string;
						overflow: string;
					};
				};
			};
		};
	}
}

export default function App() {
	const responsiveSizes = useResponsiveSize();

	const theme = createTheme({
		palette: {
			primary: {
				main: "#FFF5F0",
			},
			secondary: {
				main: "#A30000",
			},
		},
		typography: {
			h1: {
				fontSize: responsiveSizes.fontSize.h1,
				fontWeight: 'bold',
			},
			h2: {
				fontSize: responsiveSizes.fontSize.h2,
				fontWeight: 'bold',
			},
			h3: {
				fontSize: responsiveSizes.fontSize.h3,
				fontWeight: 'bold',
			},
			h6: {
				fontSize: responsiveSizes.fontSize.h6,
				fontWeight: 'bold',
				color: 'white',
			},
			body1: {
				fontSize: responsiveSizes.fontSize.body1,
				color: 'white',
			},
			body2: {
				fontSize: responsiveSizes.fontSize.body2,
				color: 'white',
			},
		},
		components: {
			MuiTableCell: {
				styleOverrides: {
					root: {
						border: "none",
						textAlign: "center",
						fontSize: responsiveSizes.fontSize.h6,
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
			MuiGrid: {
				styleOverrides: {
					root: {
						'&.MuiGrid-container': {
							margin: 0,
							width: '100%',
							maxWidth: '100%',
						},
					},
				},
			},
			MuiBox: {
				styleOverrides: {
					root: {
						'&.fullHeight': {
							height: '100vh',
							overflow: 'hidden',
						},
					},
				},
			},
		},
		spacing: (factor: number) => `${responsiveSizes.spacing.sm * factor}px`,
	});

	useEffect(() => {
		initializeServices().catch(console.error);
	}, []);

	const baseName = () => {
		const split = window.location.pathname.split("/");
		if (split.length < 3) return "/";
		return `/${split[1]}/${split[2]}`;
	};

	return (
		<BrowserRouter basename={baseName()}>
			<AppStateProvider>
				<AnimatePresence mode="wait">
					<ThemeProvider theme={theme}>
						<OfflineIndicator syncService={sync} />
						<Routes />
					</ThemeProvider>
				</AnimatePresence>
			</AppStateProvider>
		</BrowserRouter>
	);
}
