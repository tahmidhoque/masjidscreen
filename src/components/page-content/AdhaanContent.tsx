import { Box, Typography } from "@mui/material";
import CountdownTimer from "../CountdownTimer";
import noSmartPhone from "../../assets/no-smartphones.png";
import { useAppState } from "../../providers/state";

export default function AdhaanContent() {
    const { state } = useAppState();
    const nextPrayer = state.nextPrayer;

    return (
        <Box 
            sx={{ 
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4
            }}
        >
            {/* Title and countdown section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <Typography variant="h2" sx={{ textAlign: "center" }}>
                    {nextPrayer?.name} {state.nextPrayer?.countingJamaat ? "Jamaa'at" : "Adhaan"}
                </Typography>
                <Typography variant="h3" sx={{ textAlign: "center" }}>
                    Will Begin in:
                </Typography>
                <CountdownTimer hideLabel fontSize="4rem" />
            </Box>

            {/* Phone image and message */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3
                }}
            >
                <Box sx={{ 
                    width: "150px",
                    height: "150px"
                }}>
                    <img 
                        src={noSmartPhone} 
                        alt="switch off phone" 
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain"
                        }}
                    />
                </Box>

                <Typography 
                    variant="h6" 
                    sx={{ 
                        textAlign: "center",
                        maxWidth: "80%"
                    }}
                >
                    PLEASE BE QUIET AND SWITCH OFF YOUR MOBILE PHONES! JHAZAKUMULLAHU KHAIRAN.
                </Typography>
            </Box>
        </Box>
    );
} 