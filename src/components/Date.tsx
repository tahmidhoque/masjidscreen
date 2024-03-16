import { Box, Typography } from "@mui/material";
import moment from "moment-hijri";

const islamicMonths = [
	"Mu\u1e25arram",
	"\u1e62afar",
	"Rab\u012b' al-Awwal",
	"Rab\u012b' al-\u0100\u1e25ir",
	"Jum\u0101d\u0101 al-\u016al\u0101",
	"Jum\u0101d\u0101 al-\u0100\u1e25ira",
	"Rajab",
	"Sha'b\u0101n",
	"Rama\u1e0d\u0101n",
	"Shaww\u0101l",
	"Dhu al-Qa'da",
	"Dhu al-\u1e24ijja",
];

export default function Date() {
	const date = moment();
	const hijriDate = `${date.format("iD")} ${
		islamicMonths[date.iMonth()]
	} ${date.format("iYYYY")}`;
	const gregorianDate = date.format("dddd, MMMM Do YYYY");

	return (
		<Box sx={{ textAlign: "center" }}>
			<Typography variant="h6">{hijriDate}</Typography>
			<Typography variant="h6">{gregorianDate}</Typography>
		</Box>
	);
}
