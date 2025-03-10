import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useCallback,
	useMemo,
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
	countingJamaat: boolean;
}

interface AppStateContextType {
	state: AppState;
	refreshData: () => Promise<void>;
	updateTimetable: (timetable: IData[]) => Promise<void>;
	setLogin: (isLoggedIn: boolean) => void;
	updateCountingJamaat: (counting: boolean) => void;
	updateNextPrayer: (prayer: PrayerTime) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

export function AppStateProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AppState>({
		isUserLoggedIn: localStorage.getItem("authenticated") === "true",
		todayTimetable: null,
		tomoTimetable: null,
		nextPrayer: null,
		hadithOfTheDay: null,
		bannerMessage: null,
		timetableData: null,
		isLoading: true,
		removePastDates: false,
		countingJamaat: false,
	});

	// Memoize database instance
	const database = useMemo(() => new DatabaseHandler(), []);

	// Function to process timetable data and update related state
	const processTimetableData = useCallback((timetableData: IData[] | null) => {
		if (!timetableData?.length) return null;

		const today = moment().format("MM/DD/YYYY");
		const tomorrow = moment().add(1, "days").format("MM/DD/YYYY");

		const todaysPrayer = timetableData.find(item => item.Date === today) || null;
		const tomorrowsPrayer = timetableData.find(item => item.Date === tomorrow) || null;
		const nextPrayer = getPrayerTime(todaysPrayer, tomorrowsPrayer);

		return {
			timetableData,
			todaysPrayer,
			tomorrowsPrayer,
			nextPrayer,
		};
	}, []);

	// Main data fetching function
	const fetchData = useCallback(async () => {
		try {
			setState(prev => ({ ...prev, isLoading: true }));

			// Get validated timetable data
			const timetableData = await database.getTimetable();
			const processedData = processTimetableData(timetableData);

			if (!processedData) {
				throw new Error('Failed to process timetable data');
			}

			// Get other data
			const data = await database.getAllData();
			const decoder = new TextDecoder();
			
			const hadith = JSON.parse(data.hadith || '{}');
			const banner = JSON.parse(data.banner || '{}');
			const bannerArray = Object.keys(banner).map(key => banner[key]);
			const hadithArray = Object.keys(hadith).map(key => hadith[key]);
			const bannerBinArray = new Uint8Array(bannerArray);
			const hadithArray8Bit = new Uint8Array(hadithArray);

			setState(prev => ({
				...prev,
				timetableData: processedData.timetableData,
				todayTimetable: processedData.todaysPrayer,
				tomoTimetable: processedData.tomorrowsPrayer,
				nextPrayer: processedData.nextPrayer,
				hadithOfTheDay: decoder.decode(hadithArray8Bit),
				bannerMessage: decoder.decode(bannerBinArray),
				isLoading: false,
			}));
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Error fetching data:', error);
			}
			setState(prev => ({ ...prev, isLoading: false }));
		}
	}, [database, processTimetableData]);

	// Action to update timetable
	const updateTimetable = useCallback(async (timetable: IData[]) => {
		try {
			await database.setTimetable(timetable);
			const processedData = processTimetableData(timetable);
			if (processedData) {
				setState(prev => ({
					...prev,
					timetableData: processedData.timetableData,
					todayTimetable: processedData.todaysPrayer,
					tomoTimetable: processedData.tomorrowsPrayer,
					nextPrayer: processedData.nextPrayer,
				}));
			}
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Error updating timetable:', error);
			}
		}
	}, [database, processTimetableData]);

	// Action to update login state
	const setLogin = useCallback((isLoggedIn: boolean) => {
		localStorage.setItem("authenticated", isLoggedIn.toString());
		setState(prev => ({ ...prev, isUserLoggedIn: isLoggedIn }));
	}, []);

	// Action to update counting jamaat state
	const updateCountingJamaat = useCallback((counting: boolean) => {
		setState(prev => ({ ...prev, countingJamaat: counting }));
	}, []);

	// Action to update next prayer
	const updateNextPrayer = useCallback((prayer: PrayerTime) => {
		setState(prev => ({
			...prev,
			nextPrayer: prayer
		}));
	}, []);

	// Initial data load and periodic refresh
	useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, REFRESH_INTERVAL);
		return () => clearInterval(interval);
	}, [fetchData]);

	const contextValue = useMemo(() => ({
		state,
		refreshData: fetchData,
		updateTimetable,
		setLogin,
		updateCountingJamaat,
		updateNextPrayer,
	}), [state, fetchData, updateTimetable, setLogin, updateCountingJamaat, updateNextPrayer]);

	return (
		<AppStateContext.Provider value={contextValue}>
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
