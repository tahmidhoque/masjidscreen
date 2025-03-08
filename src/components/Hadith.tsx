import { useEffect, useState } from "react";
import { useAppState } from "../providers/state";
import { Box, Typography } from "@mui/material";
import useResponsiveSize from "../hooks/useResponsiveSize";
import useScreenOrientation from "../hooks/useScreenOrientation";
import { useTextFit } from "../hooks/useTextFit";

export default function Hadith() {
	const { state } = useAppState();
	const [hadith, setHadith] = useState("");
	const responsiveSizes = useResponsiveSize();
	const { orientation } = useScreenOrientation();
	const isLandscape = orientation === "landscape-primary";
	const { containerRef, contentRef, fontSize } = useTextFit(hadith);

	useEffect(() => {
		if (state.hadithOfTheDay) {
			setHadith(state.hadithOfTheDay);
		}
	}, [state.hadithOfTheDay]);

	return (
		<Box
			ref={containerRef}
			sx={{
				textAlign: "center",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			<Typography
				variant="h2"
				sx={{
					marginBottom: 1,
					fontSize: isLandscape
						? responsiveSizes.fontSize.h2
						: responsiveSizes.fontSize.h3,
				}}
			>
				Hadith of the Day
			</Typography>
			<Box
				ref={contentRef}
				sx={{
					flex: 1,
					overflow: "hidden",
					fontSize: `${fontSize}px`,
					"& p": {
						margin: 0,
						color: "white",
					},
				}}
				component={"div"}
				dangerouslySetInnerHTML={{
					__html: hadith,
				}}
			/>
		</Box>
	);
}
