class DatabaseHandler {
	private externalId: string;

	constructor() {
		// this.externalId = window.location.pathname.split("/")[2];
		this.externalId = "localhost";
	}

	public async getTimetable(): Promise<any> {
		const response = await fetch(
			`https://masjidsolutions.com/ms/api/getTimetable/${this.externalId}`
		);

		return response.json();
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
