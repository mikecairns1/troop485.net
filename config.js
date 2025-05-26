// External Service Configuration
const config = {
    // Google Calendar
    calendar: {
        embedUrl: 'https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID',
        // This will be replaced with the actual calendar ID when available
        calendarId: 'YOUR_CALENDAR_ID'
    },
    
    // Google Photos
    photos: {
        // This will be replaced with the actual album ID when available
        albumId: 'YOUR_ALBUM_ID',
        // Base URL for Google Photos sharing
        baseUrl: 'https://photos.google.com/share/'
    },
    
    // BSA Official Links
    bsaLinks: {
        national: 'https://www.scouting.org/',
        scoutbook: 'https://www.scoutbook.com/',
        scoutshop: 'https://www.scoutshop.org/',
        meritBadges: 'https://www.scouting.org/merit-badges/',
        youthTraining: 'https://www.scouting.org/training/youth/',
        adultTraining: 'https://www.scouting.org/training/adult/',
        youthProtection: 'https://www.scouting.org/training/youth-protection/',
        medicalForms: 'https://www.scouting.org/health-and-safety/ahmr/',
        scoutHandbook: 'https://www.scoutshop.org/scouts-bsa-handbook-33161.html'
    },
    
    // Troop Information
    troop: {
        name: 'BSA Troop 485',
        location: 'San Antonio, TX',
        meetingPlace: 'VFW Post 7108',
        address: '8795 FM 1560 N, Helotes, TX 78254',
        phone: '(210) 688-9312',
        email: 'info@troop485.net',
        scoutmaster: 'Natalie Rhodes',
        committeeChair: '[Committee Chair Name]'
    }
};

// Make config available globally
window.troopConfig = config; 