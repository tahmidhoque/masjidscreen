import { Box } from "@mui/material";
import Clock from "../../components/Clock";
import Date from "../../components/Date";
import { Timetable } from "../../components/Timetable";
import Hadith from "../../components/Hadith";
import CountdownTimer from "../../components/CountdownTimer";
import Banner from "../../components/Banner";
import useResponsiveSize from "../../hooks/useResponsiveSize";

interface LandscapeLayoutProps {
    isLoading?: boolean;
}

export default function LandscapeLayout({ isLoading }: LandscapeLayoutProps) {
    const responsiveSizes = useResponsiveSize();

    return (
        <Box
            sx={{
                height: "100%",
                display: "grid",
                gridTemplateColumns: "50% 50%",
                gridTemplateRows: "1fr auto",
                overflow: "hidden",
                py: 4, // Consistent top/bottom padding
                px: 3, // Slightly less side padding
                gap: 3, // Add horizontal gap between columns
            }}
        >
            {/* Left side - Clock, Timetable, and Countdown */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    gap: 1.5,
                    height: "100%",
                    justifyContent: "center", // Center all content vertically
                }}
            >
                {/* Clock and Date */}
                <Box 
                    sx={{ 
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

                {/* Timetable container with flex */}
                <Box 
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {/* Timetable wrapper for horizontal centering */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Timetable />
                    </Box>
                </Box>

                {/* Countdown Timer */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    <CountdownTimer fontSize={responsiveSizes.fontSize.h3} />
                </Box>
            </Box>

            {/* Right side - Hadith section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    height: "100%",
                    justifyContent: "center", // Center hadith vertically
                }}
            >
                <Hadith />
            </Box>

            {/* Footer area - spans both columns */}
            <Box
                sx={{
                    gridColumn: "1 / -1",
                    height: "1rem",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Banner />
            </Box>
        </Box>
    );
} 