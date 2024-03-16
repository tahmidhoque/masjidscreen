import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function Clock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<Typography
			variant="h2"
			component="h2"
			sx={{ textAlign: "center", fontWeight: "bold" }}
		>
			{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
		</Typography>
	);
}
