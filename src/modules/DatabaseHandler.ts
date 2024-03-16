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
}

export default DatabaseHandler;
