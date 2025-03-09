import { Box } from "@mui/material";
import { ReactNode } from "react";
import backgroundImage from "../assets/background-img.png";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation();
    const isSettingsPage = location.pathname.includes('/settings');

    return (
        <Box 
            sx={{ 
                height: "100dvh",
                width: "100vw",
                overflow: "hidden",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#1a1a1a",
                backgroundImage: `
                    linear-gradient(rgba(26, 26, 26, 0.85), rgba(26, 26, 26, 0.85)),
                    url(${backgroundImage})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                flexDirection: "column"
            }}
        >
            {isSettingsPage ? (
                children
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    {children}
                </motion.div>
            )}
        </Box>
    );
} 