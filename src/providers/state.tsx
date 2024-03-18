import React, {
	createContext,
	useState,
	useContext,
	Dispatch,
	SetStateAction,
	useEffect,
} from "react";
import IData from "../interfaces/IData";
import DatabaseHandler from "../modules/DatabaseHandler";
import moment from "moment";

interface AppStateContextType {
	state: any; // replace 'any' with the type of your state
	setState: Dispatch<SetStateAction<any>>; // replace 'any' with the type of your state
}

const AppStateContext = createContext<AppStateContextType | undefined>(
	undefined
);

interface AppState {
	isUserLoggedIn: boolean;
	timetableData: IData[] | null | Promise<unknown> | undefined;
	todayTimetable: IData | null | undefined;
	tomoTimetable: IData | null | undefined;
	nextPrayer: { prayerName: string; start: string; jamaat: string } | null;
	hadithOfTheDay: string | null;
	bannerMessage: string | null;
	isLoading: boolean;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AppState>({
		isUserLoggedIn:
			localStorage.getItem("authenticated") === "true" ? true : false,
		todayTimetable: null || undefined,
		tomoTimetable: null || undefined,
		nextPrayer: null,
		hadithOfTheDay: null,
		bannerMessage: null,
		timetableData: null,
		isLoading: true,
	});

	const getDatafromDatabase = async () => {
		console.log("getting data");
		const database = new DatabaseHandler();
		const data = await database.getAllData();
		const timetableData = JSON.parse(data.timetable) as IData[];
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
			timetableData: timetableData,
			hadithOfTheDay: data.hadith,
			bannerMessage: data.banner,
			todayTimetable: todaysPrayer,
			tomoTimetable: tomorrowsPrayer,
			isLoading: false,
		});
	};

	useEffect(() => {
		getDatafromDatabase();
	}, []);

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
