import { useEffect } from "react";
import DatabaseHandler from "../modules/DatabaseHandler";

export default function Hadith() {
	useEffect(() => {
		const db = new DatabaseHandler();
	});

	return (
		<div>
			<h1>Hadith of the day</h1>
		</div>
	);
}
