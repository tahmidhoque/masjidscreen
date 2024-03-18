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
import Banner from "../components/Banner";

const sxPortrait = {};

const sxLandscape = {};

export default function Main() {
	const { state } = useAppState();
	const isLoading = state.isLoading;
	const { orientation } = useScreenOrientation();
	const isLandscape = orientation === "landscape-primary";
	const columnWidth = isLandscape ? 6 : 12;

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
						<Banner />
					</Grid>
				</Grid>
			)}
		</>
	);
}
