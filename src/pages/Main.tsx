import { Box, CircularProgress, Grid } from "@mui/material";
import useScreenOrientation from "../hooks/useScreenOrientation";
import { Timetable } from "../components/Timetable";
import Clock from "../components/Clock";
import { useAppState } from "../providers/state";
import { useEffect, useState } from "react";
import moment from "moment";
import Date from "../components/Date";
import CountdownTimer from "../components/CountdownTimer";
import DatabaseHandler from "../modules/DatabaseHandler";
import IData from "../interfaces/IData";
import Hadith from "../components/Hadith";

const sxPortrait = {};

const sxLandscape = {};

export default function Main() {
	const { state, setState } = useAppState();
	const [isLoading, setIsLoading] = useState(false);
	const { orientation } = useScreenOrientation();
	const isLandscape = orientation === "landscape-primary";
	const columnWidth = isLandscape ? 6 : 12;
	const database = new DatabaseHandler();

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const data = await database.getTimetable();
			return data;
		};

		fetchData().then((data) => {
			const timetableData = data as IData[];
			//find today's timetable
			const today = moment().format("MM/DD/YYYY");
			const tomorrow = moment().add(1, "days").format("MM/DD/YYYY");
			const todaysPrayer = timetableData.find(
				(item: IData) => item.Date === today
			);
			const tomorrowsPrayer = timetableData.find(
				(item: IData) => item.Date === tomorrow
			);
			setState({
				...state,
				timetableData,
				todayTimetable: todaysPrayer,
				tomoTimetable: tomorrowsPrayer,
			});
			setIsLoading(false);
		});
	}, []);

	return (
		<>
			{isLoading ? (
				<Box
					sx={{ height: "100vh", display: "flex", justifyContent: "center" }}
				>
					<CircularProgress size={"10vh"} />
				</Box>
			) : (
				<Grid container sx={{ height: "inherit" }}>
					<Grid item container xs={12}>
						<Grid item xs={columnWidth} sx={{ padding: "0px 5vw" }}>
							<Clock />
							<Date />
							<Timetable />
						</Grid>
						<Grid
							item
							xs={columnWidth}
							sx={isLandscape ? sxLandscape : sxPortrait}
						>
							<Hadith />
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<CountdownTimer />
					</Grid>
					<Grid item xs={12} sx={{ height: "10vh", alignSelf: "flex-end" }}>
						<h1> Banner</h1>
					</Grid>
				</Grid>
			)}
		</>
	);
}
