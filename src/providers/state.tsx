import React, {
	createContext,
	useState,
	useContext,
	Dispatch,
	SetStateAction,
	useEffect,
	useCallback,
} from "react";
import IData from "../interfaces/IData";
import DatabaseHandler from "../modules/DatabaseHandler";
import moment from "moment";
import { getPrayerTime } from "../components/CountdownTimer";

interface PrayerTime {
	name: string;
	time: string;
	jamaat: string;
	jamaatTimeLeft: string;
	timeLeft: string;
	tomorrow: boolean;
	countingJamaat: boolean;
}

interface AppStateContextType {
	state: AppState;
	setState: Dispatch<SetStateAction<AppState>>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(
	undefined
);

interface AppState {
	isUserLoggedIn: boolean;
	timetableData: IData[] | null;
	todayTimetable: IData | null;
	tomoTimetable: IData | null;
	nextPrayer: PrayerTime | null;
	hadithOfTheDay: string | null;
	bannerMessage: string | null;
	isLoading: boolean;
	removePastDates: boolean;
	countingJamaat?: boolean;
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
		isLoading: true,
		removePastDates: false,
	});

	const updateTimetableData = useCallback((timetableData: IData[] | null) => {
		if (!timetableData) return;

		const today = moment().format("MM/DD/YYYY");
		const tomorrow = moment().add(1, "days").format("MM/DD/YYYY");
		const todaysPrayer = timetableData.find(
			(item: IData) => item.Date === today
		) || null;
		const tomorrowsPrayer = timetableData.find(
			(item: IData) => item.Date === tomorrow
		) || null;

		const nextPrayer = getPrayerTime(todaysPrayer, tomorrowsPrayer);

		setState(prevState => ({
			...prevState,
			timetableData,
			todayTimetable: todaysPrayer,
			tomoTimetable: tomorrowsPrayer,
			nextPrayer,
			isLoading: false,
		}));
	}, []);

	const getDatafromDatabase = useCallback(async () => {
		try {
			const database = new DatabaseHandler();
			const data = await database.getAllData();
			const timetableData = JSON.parse(data.timetable) as IData[];
			
			const decoder = new TextDecoder();
			const hadith = JSON.parse(data.hadith);
			const banner = JSON.parse(data.banner);
			const bannerArray = Object.keys(banner).map(key => banner[key]);
			const hadithArray = Object.keys(hadith).map(key => hadith[key]);
			const bannerBinArray = new Uint8Array(bannerArray);
			const hadithArray8Bit = new Uint8Array(hadithArray);

			setState(prevState => ({
				...prevState,
				timetableData,
				hadithOfTheDay: decoder.decode(hadithArray8Bit),
				bannerMessage: decoder.decode(bannerBinArray),
			}));
		} catch (error) {
			console.error('Failed to fetch data from database:', error);
			setState(prevState => ({
				...prevState,
				isLoading: false,
			}));
		}
	}, []);

	// Effect for initial data load and periodic refresh
	useEffect(() => {
		getDatafromDatabase();
		const interval = setInterval(getDatafromDatabase, 1000 * 60 * 20); // 20 minutes

		return () => clearInterval(interval);
	}, [getDatafromDatabase]);

	// Effect for updating timetable-related state when timetableData changes
	useEffect(() => {
		if (state.timetableData !== undefined) {
			updateTimetableData(state.timetableData);
		}
	}, [state.timetableData, updateTimetableData]);

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
