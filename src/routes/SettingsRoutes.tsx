import { Route, Routes as Switch } from "react-router-dom";
import EditBanner from "../pages/settings/EditBanner";
import EditHadith from "../pages/settings/EditHadith";
import UploadTimetable from "../pages/settings/UploadTimetable";

export default function SettingsRoutes() {
	return (
		<Switch>
			<Route path="/banner" element={<EditBanner />} />
			<Route path="/hadith" element={<EditHadith />} />
			<Route path="/upload-timetable" element={<UploadTimetable />} />
		</Switch>
	);
}
