import MenuBookIcon from "@mui/icons-material/MenuBook";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { SetStateAction, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const drawerItems = [
	{
		name: "Upload Timetable",
		icon: <UploadFileIcon />,
		path: "/settings/upload-timetable",
	},
	{
		name: "Hadith of the Day",
		icon: <MenuBookIcon />,
		path: "/settings/hadith",
	},
	{
		name: "Banner",
		icon: <ViewCarouselIcon />,
		path: "/settings/banner",
	},
];

export default function Navbar(): JSX.Element {
	const [value, setValue] = useState(useLocation().pathname);

	const handleChange = (event: any, newValue: SetStateAction<string>) => {
		setValue(newValue);
	};

	return (
		<BottomNavigation value={value} onChange={handleChange} showLabels>
			{drawerItems.map((item, index) => (
				<BottomNavigationAction
					component={Link}
					to={item.path}
					value={item.path}
					key={index}
					label={item.name}
					icon={item.icon}
					sx={{
						padding: 2,
					}}
				></BottomNavigationAction>
			))}
		</BottomNavigation>
	);
}
