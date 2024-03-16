import { useEffect, useState } from "react";
import DatabaseHandler from "../modules/DatabaseHandler";
import { useAppState } from "../providers/state";
import { Box, Typography } from "@mui/material";

export default function Hadith() {
	const { state, setState } = useAppState();
	const [hadith, setHadith] = useState("");

	useEffect(() => {
		const fetchHadith = async () => {
			const database = new DatabaseHandler();
			const hadith = await database.getHadith();

			return hadith;
		};

		fetchHadith().then((hadith) => {
			if (!hadith) return;
			setState({
				...state,
				hadith,
			});
		});
	}, []);

	useEffect(() => {
		console.log(state.hadith);
		setHadith(state.hadith);
	}, [state.hadith]);

	return (
		<Box sx={{ textAlign: "center" }}>
			<Typography variant="h2" sx={{ margin: "20px" }}>
				Hadith of the Day
			</Typography>
			<Typography variant="h6">{hadith && "No Hadith Set"}</Typography>
		</Box>
	);
}
