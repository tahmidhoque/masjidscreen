import { Box } from "@mui/material";
import Marquee from "react-fast-marquee";
import { useAppState } from "../providers/state";
import { useEffect, useState } from "react";
import useResponsiveSize from "../hooks/useResponsiveSize";

export default function Banner() {
	const { state } = useAppState();
	const [banner, setBanner] = useState(state.bannerMessage);
	const responsiveSizes = useResponsiveSize();

	useEffect(() => {}, [state]);

	useEffect(() => {
		if (!state.bannerMessage) return;
		setBanner(state.bannerMessage);
	}, [state.bannerMessage]);

	return (
		<>
			{banner && (
				<Marquee speed={50} gradient={false}>
					<Box
						component={"div"}
						sx={{
							"& p, & h1, & h2, & h3, & h4, & h5, & h6": {
								margin: "0 !important",
								fontSize: "0.4rem !important",
								color: "white !important",
								lineHeight: "1 !important",
								fontWeight: "normal !important",
							},
							height: "100%",
							display: "flex",
							alignItems: "center",
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
