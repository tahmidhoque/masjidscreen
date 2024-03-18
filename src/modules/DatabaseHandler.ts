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

	public async setHadith(hadith: string): Promise<string> {
		const response = await fetch(
			`https://masjidsolutions.com/ms/api/setHadith/${this.externalId}`,
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
}

export default DatabaseHandler;
