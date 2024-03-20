import { Grid, Typography } from "@mui/material";
import CSVReader from "../../components/CSVReader";
import EditingGrid from "../../components/EditingGrid";
import SettingsWrapper from "../../components/SettingsWrapper";

export default function EditTimetable(): JSX.Element {
	return (
		<SettingsWrapper
			header="Edit Timetable"
			subText="You can upload a CSV file of the timetable or change values below"
		>
			<Grid
				container
				spacing={2}
				sx={{ display: "flex", flexDirection: "column", width: "100%" }}
			>
				<Grid item xs={12}>
					<Typography variant="h5" paddingBottom={2}>
						Upload CSV
					</Typography>
					<CSVReader />
				</Grid>

				<Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
					<Typography variant="h5" paddingBottom={2}>
						Edit Values
					</Typography>
					<EditingGrid />
				</Grid>
			</Grid>
		</SettingsWrapper>
	);
}
