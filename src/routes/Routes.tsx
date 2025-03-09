import { Navigate, Route, Routes as Switch, useLocation } from "react-router-dom";
import { PageWrapper } from "../components/PageWrapper";
import Login from "../pages/Login";
import Main from "../pages/Main";
import { useAppState } from "../providers/state";
import SettingsRoutes from "./SettingsRoutes";
import CountdownPage from "../pages/CountdownPage";
import Jamaat from "../pages/Jamaat";
import Adhaan from "../pages/Adhaan";
import { AnimatePresence } from "framer-motion";

function ProtectedRoute({ children }: { children: JSX.Element }) {
	const { state } = useAppState();

	if (!state.isUserLoggedIn) {
		return <Navigate to="/login" />;
	}
	return children;
}

export default function Routes() {
	const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
	const location = useLocation();

	return (
		<PageWrapper>
			<AnimatePresence mode="wait">
				<Switch location={location} key={location.pathname}>
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
					<Route
						path="/adhaan-countdown"
						element={<CountdownPage title={"Adhaan"} />}
					/>
					<Route path="/adhaan" element={<Adhaan />} />
					<Route path="/jamaat" element={<Jamaat />} />
					<Route
						path="jamaat-countdown"
						element={<CountdownPage title="Jamaa'at" />}
					/>
				</Switch>
			</AnimatePresence>
		</PageWrapper>
	);
}
