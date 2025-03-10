import { Box } from "@mui/material";
import Clock from "../Clock";
import DateComponent from "../Date";
import { Timetable } from "../Timetable";
import Hadith from "../Hadith";
import CountdownTimer from "../CountdownTimer";
import Banner from "../Banner";
import useResponsiveSize from "../../hooks/useResponsiveSize";
import { useAppState } from "../../providers/state";
import AdhaanContent from "../page-content/AdhaanContent";
import JamaatContent from "../page-content/JamaatContent";
import { useCallback, useState, useEffect, useRef } from "react";
import moment from "moment";

const TEST_MODE = false; // Set to false in production
const DEBOUNCE_DELAY = 1000; // 1 second debounce

interface LandscapeLayoutProps {
    isLoading?: boolean;
}

export default function LandscapeLayout({ isLoading }: LandscapeLayoutProps) {
    const responsiveSizes = useResponsiveSize();
    const { state } = useAppState();
    const { nextPrayer } = state;
    const [currentContent, setCurrentContent] = useState<string>("");
    const lastUpdateTime = useRef<number>(0);

    // Helper function to determine content
    const determineContent = useCallback((prayer: typeof nextPrayer) => {
        if (!prayer) return "";

        const now = moment();
        const timeLeftParts = prayer.timeLeft.split(':').map(Number);
        const timeLeftMinutes = timeLeftParts[0] * 60 + timeLeftParts[1];

        // If we're within 5 minutes of prayer time
        if (timeLeftMinutes <= 5) {
            return "/adhaan-countdown";
        }

        // After prayer time
        if (prayer.timeLeft === "00:00:00") {
            const prayerTime = moment(prayer.time, ["h:mm A", "HH:mm"]).set({
                year: now.year(),
                month: now.month(),
                date: prayer.tomorrow ? now.date() + 1 : now.date()
            });
            
            const prayerTimePlus3 = prayerTime.clone().add(3, "minutes");
            
            if (now.isSameOrBefore(prayerTimePlus3)) {
                return "/adhaan";
            }
            
            if (prayer.jamaatTimeLeft === "00:00:00") {
                return "/jamaat";
            }
            
            const jamaatLeftParts = prayer.jamaatTimeLeft.split(':').map(Number);
            const jamaatLeftMinutes = jamaatLeftParts[0] * 60 + jamaatLeftParts[1];
            
            if (jamaatLeftMinutes <= 5 && prayer.name !== "Maghrib") {
                return "/jamaat-countdown";
            }
        }

        return "";
    }, []);

    // Effect to handle page state changes with debouncing
    useEffect(() => {
        if (!nextPrayer) return;

        const currentTime = window.Date.now();
        if (currentTime - lastUpdateTime.current < DEBOUNCE_DELAY) {
            return;
        }

        const newContent = determineContent(nextPrayer);
        if (newContent !== currentContent) {
            lastUpdateTime.current = currentTime;
            setCurrentContent(newContent);
        }
    }, [nextPrayer, determineContent, currentContent]);

    const renderRightContent = useCallback(() => {
        switch (currentContent) {
            case "/adhaan":
            case "/adhaan-countdown":
                return <AdhaanContent />;
            case "/jamaat":
            case "/jamaat-countdown":
                return <JamaatContent />;
            default:
                return <Hadith />;
        }
    }, [currentContent]);

    return (
        <Box
            sx={{
                height: "100%",
                display: "grid",
                gridTemplateColumns: "50% 50%",
                gridTemplateRows: "1fr auto",
                overflow: "hidden",
                py: 4,
                px: 3,
                gap: 3,
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
                    justifyContent: "center",
                }}
            >
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
                    <DateComponent />
                </Box>

                <Box 
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
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

            {/* Right side - Dynamic content section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    height: "100%",
                    justifyContent: "center",
                }}
            >
                {renderRightContent()}
            </Box>

            {/* Footer area - spans both columns */}
            <Box
                sx={{
                    gridColumn: "1 / -1",
                    height: "3rem",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "auto",
                    marginBottom: "5vh", // 5% of viewport height
                    width: "95%",
                    mx: "auto", // Center horizontally with margin
                    borderRadius: "8px", // Rounded corners
                    padding: "0.5rem" // Add some padding
                }}
            >
                <Banner />
            </Box>

            {TEST_MODE && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        p: 1,
                        fontSize: '0.8rem',
                    }}
                >
                    Current Content: {currentContent || 'Hadith'}<br />
                    Time Left: {nextPrayer?.timeLeft || '--:--:--'}<br />
                    Jamaat Left: {nextPrayer?.jamaatTimeLeft || '--:--:--'}
                </Box>
            )}
        </Box>
    );
} 