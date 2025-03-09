import { PrayerTimes, Coordinates, CalculationMethod, Madhab } from 'adhan';
import moment from 'moment';
import { calculateJamaatTimes, type PrayerTimes as JamaatPrayerTimes } from '../jamaat-calculator';

interface PrayerTimesData {
	Date: string;
	Day: string;
	Fajr: string;
	Sunrise: string;
	Zuhr: string;
	Asr: string;
	Maghrib: string;
	Isha: string;
	"Fajr J": string;
	"Zuhr J": string;
	"Asr J": string;
	"Maghrib J": string;
	"Isha J": string;
	Khutbah: string;
	"Khutbah J": string;
}

class DatabaseHandler {
	private externalId: string;
	private coordinates: Coordinates | null = null;
	private calculationMethod = CalculationMethod.MoonsightingCommittee();

	constructor() {
		// this.externalId = window.location.pathname.split("/")[2];
		this.externalId = "localhost";
		this.initializeChippingNorton();
		this.configureHanafiSettings();
	}

	private configureHanafiSettings() {
		// Configure for Hanafi calculations
		this.calculationMethod.madhab = Madhab.Hanafi;
		
		// Customize the calculation method parameters
		this.calculationMethod.adjustments = {
			fajr: 0,
			sunrise: 0,
			dhuhr: 0,
			asr: 0,    // Hanafi Asr time is handled by madhab parameter
			maghrib: 0,
			isha: 0
		};

		// Moonsighting Committee with Hanafi Asr uses:
		// Fajr Angle: 18°
		// Isha Angle: 18°
		// Maghrib offset: 0 minutes after sunset
		// Method for Asr: Hanafi (shadow length factor = 2)
	}

	private initializeChippingNorton() {
		// Chipping Norton, Oxford coordinates
		const latitude = 51.9405;
		const longitude = -1.5451;
		this.setLocation(latitude, longitude);
	}

	public setLocation(latitude: number, longitude: number) {
		this.coordinates = new Coordinates(latitude, longitude);
	}

	private formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', { 
			hour: '2-digit', 
			minute: '2-digit', 
			hour12: true 
		}).replace(/^0+/, '');
	}

	private format24HourTime(date: Date): string {
		return date.toLocaleTimeString('en-GB', { 
			hour: '2-digit', 
			minute: '2-digit', 
			hour12: false 
		});
	}

	private getDayName(date: Date): string {
		return date.toLocaleDateString('en-US', { weekday: 'short' });
	}

	private formatDate(date: Date): string {
		// Use moment.js for consistent date formatting
		return moment(date).format('MM/DD/YYYY');
	}

	private normalizeDate(dateStr: string): string {
		// Use moment.js to parse and format the date consistently
		return moment(dateStr).format('MM/DD/YYYY');
	}

	private calculatePrayerTimes(date: Date): PrayerTimesData {
		if (!this.coordinates) {
			throw new Error('Location coordinates not set');
		}

		const prayerTimes = new PrayerTimes(this.coordinates, date, this.calculationMethod);
		
		// Format prayer times for display (12-hour format)
		const displayTimes = {
			Fajr: this.formatTime(prayerTimes.fajr),
			Zuhr: this.formatTime(prayerTimes.dhuhr),
			Asr: this.formatTime(prayerTimes.asr),
			Maghrib: this.formatTime(prayerTimes.maghrib),
			Isha: this.formatTime(prayerTimes.isha),
		};

		// Format prayer times for Jamaat calculation (24-hour format)
		const formattedTimes: JamaatPrayerTimes = {
			Fajr: this.format24HourTime(prayerTimes.fajr),
			Zuhr: this.format24HourTime(prayerTimes.dhuhr),
			Asr: this.format24HourTime(prayerTimes.asr),
			Maghrib: this.format24HourTime(prayerTimes.maghrib),
			Isha: this.format24HourTime(prayerTimes.isha),
		};

		// Calculate Jamaat times using our new calculator
		const jamaatTimes = calculateJamaatTimes(formattedTimes);

		return {
			Date: this.formatDate(date),
			Day: this.getDayName(date),
			...displayTimes,
			Sunrise: this.formatTime(prayerTimes.sunrise),
			"Fajr J": this.convertTo12Hour(jamaatTimes.Fajr),
			"Zuhr J": this.convertTo12Hour(jamaatTimes.Zuhr),
			"Asr J": this.convertTo12Hour(jamaatTimes.Asr),
			"Maghrib J": this.convertTo12Hour(jamaatTimes.Maghrib),
			"Isha J": this.convertTo12Hour(jamaatTimes.Isha),
			Khutbah: "1:00 PM",
			"Khutbah J": "1:00 PM"
		};
	}

	private convertTo12Hour(time24: string): string {
		const [hours, minutes] = time24.split(':').map(Number);
		const period = hours >= 12 ? 'PM' : 'AM';
		const hours12 = hours % 12 || 12;
		return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
	}

	private generateFutureTimetable(days: number = 30): PrayerTimesData[] {
		const timetable: PrayerTimesData[] = [];
		const today = new Date();
		
		console.log('Generating future timetable starting from:', this.formatDate(today));
		
		for (let i = 0; i < days; i++) {
			const date = new Date();
			date.setDate(today.getDate() + i);
			const times = this.calculatePrayerTimes(date);
			timetable.push(times);
		}
		
		return timetable;
	}

	public async getTimetable(): Promise<any> {
		console.log('Getting timetable...');
		try {
			let timetable = [];
			try {
				console.log('Attempting to fetch from API with externalId:', this.externalId);
				const response = await fetch(
					`https://masjidsolutions.com/ms/api/getTimetable/${this.externalId}`
				);
				if (!response.ok) {
					console.log('API response not ok:', response.status);
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const responseData = await response.json();
				console.log('Raw API response:', responseData);

				// Parse the timetable data from the response
				if (responseData && typeof responseData === 'object') {
					if (responseData.timetable) {
						timetable = responseData.timetable;
					} else if (Array.isArray(responseData)) {
						timetable = responseData;
					} else {
						timetable = Object.values(responseData);
					}
				}

				console.log('Parsed timetable data:', timetable);

				// Validate timetable format and check for current dates
				if (!Array.isArray(timetable)) {
					console.log('Parsed data is not an array, generating new timetable...');
					throw new Error('Invalid timetable format');
				}

				// Check if we have current dates in the timetable
				const today = moment().startOf('day');
				const hasCurrentDates = timetable.some(entry => {
					const entryDate = moment(entry.Date, 'MM/DD/YYYY');
					return entryDate.isSameOrAfter(today);
				});

				if (!hasCurrentDates) {
					console.log('No current or future dates found in timetable, generating new data...');
					throw new Error('No current dates in timetable');
				}

				// Filter to keep only current and future dates
				timetable = timetable.filter(entry => {
					const entryDate = moment(entry.Date, 'MM/DD/YYYY');
					return entryDate.isSameOrAfter(today);
				});

				// If we have less than 7 days of future dates, generate new timetable
				if (timetable.length < 7) {
					console.log('Less than 7 days of future dates available, generating new timetable...');
					throw new Error('Insufficient future dates');
				}

			} catch (apiError) {
				console.log('API data not usable:', apiError);
				console.log('Generating new 30-day timetable...');
				const newTimetable = this.generateFutureTimetable();
				await this.setTimetable(newTimetable);
				return newTimetable;
			}

			// At this point we have a valid timetable with current dates
			const todayStr = this.formatDate(new Date());
			console.log('Looking for today\'s date:', todayStr);
			
			const todayData = timetable.find((entry: PrayerTimesData) => 
				this.normalizeDate(entry.Date) === this.normalizeDate(todayStr)
			);

			if (!todayData) {
				console.log('Today\'s data not found in filtered timetable, generating new data...');
				const newTimetable = this.generateFutureTimetable();
				await this.setTimetable(newTimetable);
				return newTimetable;
			}

			// Sort the timetable by date
			return timetable.sort((a, b) => {
				const dateA = moment(a.Date, 'MM/DD/YYYY');
				const dateB = moment(b.Date, 'MM/DD/YYYY');
				return dateA.valueOf() - dateB.valueOf();
			});

		} catch (error) {
			console.error('Error in getTimetable:', error);
			const newTimetable = this.generateFutureTimetable();
			await this.setTimetable(newTimetable);
			return newTimetable;
		}
	}

	public async getHadith(): Promise<string> {
		const response = await fetch(
			`https://masjidsolutions.com/ms/api/getHadith/${this.externalId}`
		);

		return response.json();
	}

	public async getBanner(): Promise<string> {
		const response = await fetch(
			`https://masjidsolutions.com/ms/api/getBanner/${this.externalId}`
		);

		return response.json();
	}

	public async getAllData(): Promise<any> {
		const response = await fetch(
			`https://masjidsolutions.com/ms/api/getAllData/${this.externalId}`
		);

		return response.json();
	}

	public async setHadith(hadith: Uint8Array): Promise<string> {
		const response = await fetch(
			`https://masjidsolutions.com/ms/api/saveHadith/${this.externalId}`,
			{
				method: "POST", // or 'PUT'
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ hadith }), // body data type must match "Content-Type" header
			}
		);

		return response.json();
	}

	public async setBanner(banner: Uint8Array): Promise<void> {
		const response = await fetch(
			`https://masjidsolutions.com/ms/api/saveBanner/${this.externalId}`,
			{
				method: "POST", // or 'PUT'
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ banner }), // body data type must match "Content-Type" header
			}
		);

		return response.json();
	}

	public async setTimetable(timetable: any[]): Promise<void> {
		const response = await fetch(
			`https://masjidsolutions.com/ms/api/saveTimetable/${this.externalId}`,
			{
				method: "POST", // or 'PUT'
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ timetable }), // body data type must match "Content-Type" header
			}
		);

		return response.json();
	}
}

export default DatabaseHandler;
