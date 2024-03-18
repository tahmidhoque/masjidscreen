import { Box } from "@mui/material";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useAppState } from "../providers/state";

export const PageWrapper = ({ children }: { children: ReactNode }) => {
	const { state } = useAppState();

	const showNavbar =
		state.isUserLoggedIn &&
		(window.location.pathname.includes("/settings") ||
			window.location.pathname === "/login");

	const padding = showNavbar ? 3 : 0;
	return (
		<Box
			sx={{
				display: "flex",
				width: "100%",
				height: "100vh",
				flexDirection: "column",
			}}
		>
			{showNavbar && (
				<Box
					component="nav"
					sx={{
						width: "100%",
						justifyContent: "center",

						top: 0,
						backgroundColor: "white",
						zIndex: 1000,
						padding: 3,
					}}
				>
					<Navbar />
				</Box>
			)}
			<Box component="main" sx={{ padding: padding, flexGrow: 1 }}>
				<Box sx={{ overflow: "auto", height: "100%" }}>{children}</Box>
			</Box>
		</Box>
	);
};
