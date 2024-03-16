import { Box } from "@mui/material";
import { ReactNode } from "react";

export const PageWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<Box sx={{ display: "flex", width: "100%", paddingTop: 10 }}>
			<Box
				component="main"
				sx={{ flexGrow: 1, height: "calc(100vh - 80px)", position: "relative" }}
			>
				<Box sx={{ height: "inherit", overflow: "auto" }}>{children}</Box>
			</Box>
		</Box>
	);
};
