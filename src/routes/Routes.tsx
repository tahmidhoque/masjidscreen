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
	const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

	return (
		<PageWrapper>
			<Switch>
				<Route path="/" element={<Main />} />
				<Route
					path="/login"
					element={
						isLoggedIn ? <Navigate replace to={"/settings"} /> : <Login />
					}
				/>
				<Route
					path="/settings"
					element={<Navigate to="/settings/upload-timetable" replace />}
				/>
				<Route
					path="/settings/*"
					element={
						<ProtectedRoute>
							<SettingsRoutes />
						</ProtectedRoute>
					}
				/>
			</Switch>
		</PageWrapper>
	);
}
