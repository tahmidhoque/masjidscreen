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
                    paddingBottom: 0, // Remove bottom padding from main content
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
                        pb: 2, // Add bottom padding here
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

            {/* Footer area with countdown and banner */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    marginTop: 2,
                    position: "relative", // For absolute positioning of watermark
                }}
            >
                {/* Countdown section */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 3,
                        overflow: "hidden",
                        mb: 4, // Add margin between countdown and banner
                    }}
                >
                    <CountdownTimer />
                </Box>

                {/* Banner section */}
                <Box
                    sx={{
                        height: "2.5rem", // Increased height for larger text
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                        px: 2,
                    }}
                >
                    <Banner />
                </Box>

                {/* Watermark */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "0.5rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "rgba(255, 255, 255, 0.3)",
                        fontSize: "0.7rem",
                        textAlign: "center",
                        width: "100%",
                        pointerEvents: "none",
                    }}
                >
                    Provided by Masjid Solutions
                </Box>
            </Box>
        </Box>
    );
} 