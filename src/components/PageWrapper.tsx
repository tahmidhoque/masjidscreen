import { Box } from "@mui/material";
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useAppState } from "../providers/state";
import { motion } from "framer-motion";

export const PageWrapper = ({ children }: { children: ReactNode }) => {
	const { state } = useAppState();

	const showNavbar =
		state.isUserLoggedIn &&
		(window.location.pathname.includes("/settings") ||
			window.location.pathname !== "/login");

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
				<motion.div
					initial="initial"
					animate="in"
					exit="out"
					variants={{
						initial: { opacity: 0 },
						in: { opacity: 1 },
						out: { opacity: 0 },
					}}
					transition={{
						type: "tween",
						ease: "anticipate",
						duration: 3,
					}}
					style={{ height: "100%" }}
				>
					<Box sx={{ overflow: "auto", height: "100%" }}>{children}</Box>
				</motion.div>
			</Box>
		</Box>
	);
};
