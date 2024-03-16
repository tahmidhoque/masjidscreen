import { useState, useEffect } from "react";

const useScreenOrientation = () => {
	const [screenOrientation, setScreenOrientation] = useState({
		orientation: window.screen.orientation.type,
	});

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > window.innerHeight) {
				setScreenOrientation({
					orientation: "landscape-primary",
				});
			} else {
				setScreenOrientation({
					orientation: "portrait-primary",
				});
			}
		};

		window.addEventListener("resize", handleResize);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return screenOrientation;
};

export default useScreenOrientation;
