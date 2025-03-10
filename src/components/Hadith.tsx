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
	const { containerRef, contentRef, fontSize } = useTextFit(hadith, {
		maxFontSize: isLandscape ? 18 : 16,
	});

	useEffect(() => {
		if (state.hadithOfTheDay) {
			setHadith(state.hadithOfTheDay);
		}
	}, [state.hadithOfTheDay]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				height: "100%",
				position: "relative",
				textAlign: "center",
			}}
		>
			<Box
				ref={containerRef}
				sx={{
					position: "absolute",
					top: "50%",
					transform: "translateY(-50%)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					maxHeight: "calc(100% - 32px)",
					textAlign: "center",
					width: { xs: "calc(100% - 96px)", sm: "calc(100% - 128px)", md: "calc(100% - 160px)" },
					mx: "auto",
				}}
			>
				<Typography
					variant="h2"
					sx={{
						mb: 2,
						fontSize: isLandscape
							? responsiveSizes.fontSize.h3
							: responsiveSizes.fontSize.h6,
						fontWeight: 500,
						textAlign: "center",
						width: "100%",
					}}
				>
					Hadith of the Day
				</Typography>

				<Box
					ref={contentRef}
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						"& > div": {
							width: "100%",
							maxWidth: "85%",
							fontSize: `${fontSize}px`,
							textAlign: "center !important",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							mx: "auto",
							"& *": {
								textAlign: "center !important",
								margin: "0 auto !important",
								width: "100% !important",
								maxWidth: "100% !important",
								display: "block !important",
							},
							"& p, & div, & h1, & h2, & h3, & h4, & h5, & h6, & span": {
								marginBottom: 1.5,
								lineHeight: 1.4,
							},
							"& p:last-child": {
								marginBottom: 0,
							},
						}
					}}
					component={"div"}
					dangerouslySetInnerHTML={{
						__html: hadith,
					}}
				/>
			</Box>
		</Box>
	);
}
