import { Navigate, Route, Routes as Switch } from "react-router-dom";
import { PageWrapper } from "../components/PageWrapper";
import Login from "../pages/Login";
import Main from "../pages/Main";
import { useAppState } from "../providers/state";
import SettingsRoutes from "./SettingsRoutes";

function ProtectedRoute({ children }: { children: JSX.Element }) {
	const { state } = useAppState();

	if (!state.isUserLoggedIn) {
		return <Navigate to="/login" />;
	}
	return children;
}

export default function Routes() {
	const { state } = useAppState();
	return (
		<PageWrapper
			navbar={!state.isUserLoggedIn && window.location.pathname !== "/screen"}
		>
			<Switch>
				<Route path="/" element={<Main />} />
				<Route path="/login" element={<Login />} />
				<Route
					path="/settings/*"
					element={
						<ProtectedRoute>
							<SettingsRoutes />
						</ProtectedRoute>
					}
				/>
				{/* <Route path="/login" element={<App />} />
			<Route path="/hadith" element={<App />} />
			<Route path="/upload-timetable" element={<App />} /> */}
			</Switch>
		</PageWrapper>
	);
}
