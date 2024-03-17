import React, {
	createContext,
	useState,
	useContext,
	Dispatch,
	SetStateAction,
} from "react";
import IData from "../interfaces/IData";

interface AppStateContextType {
	state: any; // replace 'any' with the type of your state
	setState: Dispatch<SetStateAction<any>>; // replace 'any' with the type of your state
}

const AppStateContext = createContext<AppStateContextType | undefined>(
	undefined
);

interface AppState {
	isUserLoggedIn: boolean;
	timetableData: IData[] | null;
	todayTimetable: IData | null;
	tomoTimetable: IData | null;
	nextPrayer: { prayerName: string; start: string; jamaat: string } | null;
	hadithOfTheDay: string | null;
	bannerMessage: string | null;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AppState>({
		isUserLoggedIn:
			localStorage.getItem("authenticated") === "true" ? true : false,
		todayTimetable: null,
		tomoTimetable: null,
		nextPrayer: null,
		hadithOfTheDay: null,
		bannerMessage: null,
		timetableData: null,
	});

	return (
		<AppStateContext.Provider value={{ state, setState }}>
			{children}
		</AppStateContext.Provider>
	);
}

export function useAppState() {
	const context = useContext(AppStateContext);
	if (!context) {
		throw new Error("useAppState must be used within the AppStateProvider");
	}
	return context;
}
