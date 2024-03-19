import { Box } from "@mui/material";
import Marquee from "react-fast-marquee";
import { useAppState } from "../providers/state";
import { useEffect, useState } from "react";

export default function Banner() {
	const { state, setState } = useAppState();
	const [banner, setBanner] = useState(state.bannerMessage);

	useEffect(() => {
		if (!state.banner) return;
		setBanner(state.banner);
		console.log(state.banner);
	}, [state.banner]);

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
