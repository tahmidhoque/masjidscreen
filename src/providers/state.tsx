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
import { getPrayerTime } from "../components/CountdownTimer";

interface AppStateContextType {
	state: any; // replace 'any' with the type of your state
	setState: Dispatch<SetStateAction<any>>; // replace 'any' with the type of your state
}

const AppStateContext = createContext<AppStateContextType | undefined>(
	undefined
);

interface AppState {
	isUserLoggedIn: boolean;
	timetableData: IData[] | null | undefined;
	todayTimetable: IData | null | undefined;
	tomoTimetable: IData | null | undefined;
	nextPrayer: {
		name: string;
		time: string;
		timeLeft: string;
		tomorrow: boolean;
		jamaat: string;
		jamaatTimeLeft: string;
	} | null;
	hadithOfTheDay: string | null;
	bannerMessage: string | null;
	isLoading: boolean;
	removePastDates: boolean;
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
		removePastDates: false,
	});

	useEffect(() => {
		if (!state.timetableData) return;
		//state.timetable has been updated so we need to find today's timetable
		//and tomorrow's timetable incase they've changed
		const today = moment().format("MM/DD/YYYY");
		const tomorrow = moment().add(1, "days").format("MM/DD/YYYY");
		const todaysPrayer = state.timetableData.find(
			(item: IData) => item.Date === today
		);
		const tomorrowsPrayer = state.timetableData.find(
			(item: IData) => item.Date === tomorrow
		);

		const nextPrayer = getPrayerTime(todaysPrayer, tomorrowsPrayer);

		setState({
			isUserLoggedIn: state.isUserLoggedIn,
			timetableData: state.timetableData,
			hadithOfTheDay: state.hadithOfTheDay,
			bannerMessage: state.bannerMessage,
			todayTimetable: todaysPrayer,
			tomoTimetable: tomorrowsPrayer,
			nextPrayer: nextPrayer,
			isLoading: false,
			removePastDates: state.removePastDates,
		});
	}, [state.timetableData]);

	const getDatafromDatabase = async () => {
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

		const nextPrayer = getPrayerTime(todaysPrayer, tomorrowsPrayer);
		const decoder = new TextDecoder();
		const hadith = JSON.parse(data.hadith);
		const banner = JSON.parse(data.banner);
		const bannerArray = Object.keys(banner).map(function (_) {
			return banner[_];
		});
		const array = Object.keys(hadith).map(function (_) {
			return hadith[_];
		});
		const bannerBinArray = new Uint8Array(bannerArray);
		const hadithArray = new Uint8Array(array);

		setState({
			isUserLoggedIn: state.isUserLoggedIn,
			timetableData: timetableData,
			hadithOfTheDay: decoder.decode(hadithArray),
			bannerMessage: decoder.decode(bannerBinArray),
			todayTimetable: todaysPrayer,
			tomoTimetable: tomorrowsPrayer,
			nextPrayer: nextPrayer,
			isLoading: false,
			removePastDates: state.removePastDates,
		});
	};

	useEffect(() => {
		getDatafromDatabase();
		const interval = setInterval(() => getDatafromDatabase(), 1000 * 60 * 20);

		return () => clearInterval(interval);
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
