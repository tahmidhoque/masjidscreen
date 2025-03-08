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
							"& p": {
								margin: 0,
								fontSize: responsiveSizes.fontSize.body1,
								color: "white",
							},
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
