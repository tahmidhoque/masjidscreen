import MenuBookIcon from "@mui/icons-material/MenuBook";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";

import { CSSObject, Theme, styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const drawerItems = [
	[
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
	],
];

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

export default function SideNav() {
	const navigate = useNavigate();
	const location = useLocation();

	const open = true;

	return (
		<Drawer
			variant="permanent"
			open={open}
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					backgroundColor: "primary.main",
					borderRadius: 0,
				},
				"& .MuiTypography-root": {
					color: "inherit",
				},
			}}
		>
			<List
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
			>
				<Box sx={{ flexGrow: 1 }}>
					{drawerItems.map((subItems, index) => (
						<Box key={index}>
							{subItems.map((item, subIndex) => (
								<Box key={subIndex}>
									<ListItem
										key={item.name}
										disablePadding
										sx={{
											display: "block",
											color: "black",
										}}
										onClick={() => navigate(item.path)}
									>
										<ListItemButton
											sx={{
												color:
													location.pathname === item.path
														? "primary.main"
														: "black",
												minHeight: 48,
												justifyContent: open ? "initial" : "center",
												px: 2.5,
												m: 1,
												backgroundColor:
													location.pathname === item.path
														? "secondary.main"
														: "none",
												borderRadius: "8px",
												"&:hover": {
													backgroundColor:
														location.pathname === item.path
															? "secondary.main"
															: "none",
												},
											}}
										>
											<ListItemIcon
												sx={{
													minWidth: 0,
													mr: open ? 2 : "auto",
													justifyContent: "center",
													color: "inherit ",
												}}
											>
												{item.icon}
											</ListItemIcon>
											<ListItemText
												primary={
													<Typography variant="body2">{item.name}</Typography>
												}
												sx={{
													opacity: open ? 1 : 0,
													color: "inherit",
												}}
											/>
											<ListItemIcon
												sx={{
													minWidth: 0,
													ml: open ? 1 : "auto",
													justifyContent: "center",
													color: "inherit",
												}}
											>
												<ChevronRightIcon />
											</ListItemIcon>
										</ListItemButton>
									</ListItem>
								</Box>
							))}
						</Box>
					))}
				</Box>
			</List>
		</Drawer>
	);
}
