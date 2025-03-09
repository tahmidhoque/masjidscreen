export interface PrayerTimes {
    Fajr: string;
    Zuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

export interface JamaatTimes {
    Fajr: string;
    Zuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

/**
 * Rounds time up to nearest multiple of minutes
 * @param {string} time - Time in HH:mm format
 * @param {number} minutes - Multiple to round up to
 * @returns {string} Rounded time in HH:mm format
 */
function roundUpToNearest(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const totalMins = hours * 60 + mins;
    const roundedMins = Math.ceil(totalMins / minutes) * minutes;
    const newHours = Math.floor(roundedMins / 60);
    const newMins = roundedMins % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

/**
 * Add minutes to time
 * @param {string} time - Time in HH:mm format
 * @param {number} minutes - Minutes to add
 * @returns {string} New time in HH:mm format
 */
function addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number);
    const totalMins = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMins / 60);
    const newMins = totalMins % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

/**
 * Calculate Jamaat times based on prayer times
 * All times except Maghrib are rounded to 5-minute intervals
 * @param {PrayerTimes} prayerTimes - Object containing prayer times
 * @returns {JamaatTimes} Calculated Jamaat times
 */
export function calculateJamaatTimes(prayerTimes: PrayerTimes): JamaatTimes {
    // Helper function to round to 5 minutes after adding delay
    const roundToFiveAfterDelay = (time: string, delayMinutes: number): string => {
        const withDelay = addMinutes(time, delayMinutes);
        return roundUpToNearest(withDelay, 5);
    };

    const jamaatTimes: JamaatTimes = {
        // Round Fajr to nearest 5 minutes after adding 15-30 minutes
        Fajr: roundToFiveAfterDelay(prayerTimes.Fajr, 15),
        
        // Fixed at 13:00
        Zuhr: '13:00',
        
        // Round Asr to nearest 5 minutes after adding 30-45 minutes
        Asr: roundToFiveAfterDelay(prayerTimes.Asr, 30),
        
        // Maghrib is exactly 3 minutes after prayer time (no rounding)
        Maghrib: addMinutes(prayerTimes.Maghrib, 3),
        
        // Round Isha to nearest 5 minutes after adding 60-90 minutes
        Isha: roundToFiveAfterDelay(prayerTimes.Isha, 60)
    };

    return jamaatTimes;
}

export {
    roundUpToNearest,
    addMinutes
}; 