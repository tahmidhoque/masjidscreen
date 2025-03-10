import { Box } from "@mui/material";
import Marquee from "react-fast-marquee";
import { useAppState } from "../providers/state";
import { useEffect, useState } from "react";
import useScreenOrientation from "../hooks/useScreenOrientation";

export default function Banner() {
	const { state } = useAppState();
	const [banner, setBanner] = useState(state.bannerMessage);
	const { orientation } = useScreenOrientation();
	const isLandscape = orientation === "landscape-primary";

	useEffect(() => {}, [state]);

	useEffect(() => {
		if (!state.bannerMessage) return;
		setBanner(state.bannerMessage);
	}, [state.bannerMessage]);

	return (
		<>
			{banner && (
				<Marquee speed={50} gradient={false} style={{ height: "100%" }}>
					<Box
						component={"div"}
						sx={{
							"& p, & h1, & h2, & h3, & h4, & h5, & h6": {
								margin: "0 !important",
								fontSize: isLandscape ? "1.8rem !important" : "1.2rem !important",
								color: "white !important",
								lineHeight: "1.5 !important",
								fontWeight: "normal !important",
							},
							height: "100%",
							display: "flex",
							alignItems: "center",
							px: 2,
						}}
						dangerouslySetInnerHTML={{
							__html: banner,
						}}
					/>
				</Marquee>
			)}
		</>
	);
}
