import { Box } from "@mui/material";
import Marquee from "react-fast-marquee";
import { useAppState } from "../providers/state";
import { useEffect, useState } from "react";

export default function Banner() {
	const { state } = useAppState();
	const [banner, setBanner] = useState(state.bannerMessage);

	useEffect(() => {}, [state]);

	useEffect(() => {
		if (!state.bannerMessage) return;
		setBanner(state.bannerMessage);
		console.log(state.bannerMessage);
	}, [state.bannerMessage]);

	return (
		<>
			{banner && (
				<Marquee>
					<Box
						component={"div"}
						dangerouslySetInnerHTML={{
							__html: banner,
						}}
					></Box>
				</Marquee>
			)}
		</>
	);
}
