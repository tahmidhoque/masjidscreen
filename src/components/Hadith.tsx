import { useEffect, useState } from "react";
import { useAppState } from "../providers/state";
import { Box, Typography } from "@mui/material";

export default function Hadith() {
	const { state } = useAppState();
	const [hadith, setHadith] = useState("");

	useEffect(() => {
		if (state.hadithOfTheDay) {
			setHadith(state.hadithOfTheDay);
		}
	}, []);

	return (
		<Box sx={{ textAlign: "center", paddingX: 10 }}>
			<Typography variant="h2" sx={{ margin: "20px" }}>
				Hadith of the Day
			</Typography>
			<Box
				component={"div"}
				dangerouslySetInnerHTML={{
					__html: hadith,
				}}
			></Box>
		</Box>
	);
}
