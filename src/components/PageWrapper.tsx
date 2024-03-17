import { Box } from "@mui/material";
import { ReactNode } from "react";

export const PageWrapper = ({
	children,
	navbar = false,
}: {
	children: ReactNode;
	navbar?: boolean;
}) => {
	return (
		<Box sx={{ display: "flex", width: "100%", paddingTop: 10 }}>
			{navbar && (
				<Box
					component="nav"
					sx={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
						position: "fixed",
						top: 0,
						backgroundColor: "white",
						zIndex: 1000,
					}}
				>
					{/* <Navbar /> */}
				</Box>
			)}
			<Box
				component="main"
				sx={{ flexGrow: 1, height: "calc(100vh - 80px)", position: "relative" }}
			>
				<Box sx={{ height: "inherit", overflow: "auto" }}>{children}</Box>
			</Box>
		</Box>
	);
};
