import { Routes as Switch, Route } from "react-router-dom";
import Main from "../pages/Main";
import { PageWrapper } from "../components/PageWrapper";

export default function BaseRoutes() {
	return (
		<PageWrapper>
			<Switch>
				<Route path="/" element={<Main />} />
				{/* <Route path="/login" element={<App />} />
			<Route path="/hadith" element={<App />} />
			<Route path="/upload-timetable" element={<App />} /> */}
			</Switch>
		</PageWrapper>
	);
}
