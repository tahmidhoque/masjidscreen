import { Box } from "@mui/material";
import Clock from "../../components/Clock";
import Date from "../../components/Date";
import { Timetable } from "../../components/Timetable";
import Hadith from "../../components/Hadith";
import CountdownTimer from "../../components/CountdownTimer";
import Banner from "../../components/Banner";

interface PortraitLayoutProps {
    isLoading?: boolean;
}

export default function PortraitLayout({ isLoading }: PortraitLayoutProps) {
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* Main content area with padding */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    padding: "1rem",
                }}
            >
                {/* Clock and Date Section - Fixed height for mobile */}
                <Box 
                    sx={{ 
                        height: "15%",
                        py: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                    }}
                >
                    <Clock />
                    <Date />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        overflow: "hidden",
                        px: 2,
                    }}
                >
                    {/* Timetable section */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                        }}
                    >
                        <Box 
                            sx={{ 
                                overflow: "hidden",
                            }}
                        >
                            <Timetable />
                        </Box>
                    </Box>

                    {/* Hadith section */}
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                        }}
                    >
                        <Box 
                            sx={{ 
                                flex: 1,
                                overflow: "hidden",
                            }}
                        >
                            <Hadith />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Footer area */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    overflow: "hidden",
                    padding: "0 1rem",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 0.5,
                        overflow: "hidden",
                    }}
                >
                    <CountdownTimer />
                </Box>
                <Box
                    sx={{
                        height: "0.75rem",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                    }}
                >
                    <Banner />
                </Box>
            </Box>
        </Box>
    );
} 