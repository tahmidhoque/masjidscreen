import { Typography } from "@mui/material";
import Marquee from "react-fast-marquee";
import { useAppState } from "../providers/state";
import { useEffect, useState } from "react";
import DatabaseHandler from "../modules/DatabaseHandler";

export default function Banner() {
	const { state, setState } = useAppState();
	const [banner, setBanner] = useState("");

	useEffect(() => {
		const fetchBanner = async () => {
			const database = new DatabaseHandler();
			const banner = await database.getBanner();
			return banner;
		};

		fetchBanner().then((banner) => {
			if (!banner) return;
			setBanner(banner);
			setState({
				...state,
				banner,
			});
		});
	}, []);

	useEffect(() => {
		if (!state.banner) return;
		setBanner(state.banner);
		console.log(state.banner);
	}, [state.banner]);

	return (
		<>
			{banner && (
				<Marquee>
					<Typography variant="h6">{banner}</Typography>
				</Marquee>
			)}
		</>
	);
}
