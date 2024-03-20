import { Box, Divider, Typography } from "@mui/material";

export default function SettingsWrapper({
	children,
	header,
	subText,
}: {
	children: React.ReactNode;
	header: string;
	subText: string;
}) {
	return (
		<Box
			id={"settings-wrapper"}
			sx={{
				display: "flex",
				backgroundImage:
					"linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0));",
				backdropFilter: "blur(10px)",
				boxShadow: "10px 10px 10px rgba(30,30,30,0.5);",
				paddingX: "20px",
				paddingBottom: "0px",
				borderRadius: "10px",
				height: "inherit",
				flexDirection: "column",
			}}
		>
			<Box
				sx={{
					width: "100%",
					paddingTop: 5,
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Typography variant="h2">{header}</Typography>
				<Typography variant="body1">{subText}</Typography>
				<Divider
					sx={{ margin: "10px 0", borderColor: "white", paddingTop: 1 }}
				/>
				<Box sx={{ flexGrow: 1, paddingY: 2, height: "100%" }}>
					<Box sx={{ color: "black", margin: "auto", height: "inherit" }}>
						{children}
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
