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
        location: 'Helotes, TX',
        meetingPlace: 'VFW Post 7108',
        address: '8795 FM 1560 N, Helotes, TX 78254',
        phone: '(210) 688-9312',
        email: 'info@troop485.net',
        scoutmaster: 'Natalie Rhodes',
        committeeChair: 'Rene Beltran',
        emailCommitteeChair: 'committeechair@troop485.net'
    },

    aws: {
        region: 'us-east-1',
        apiEndpoint: 'YOUR_API_GATEWAY_ENDPOINT',
        ses: {
            fromEmail: 'noreply@troop485.net',
            toEmail: 'info@troop485.net'
        },
        sns: {
            enabled: true
        }
    }
};

// Don't expose sensitive configuration in production
if (process.env.NODE_ENV === 'production') {
    config.aws.apiEndpoint = process.env.AWS_API_ENDPOINT;
    config.aws.ses.fromEmail = process.env.AWS_SES_FROM_EMAIL;
    config.aws.ses.toEmail = process.env.AWS_SES_TO_EMAIL;
}

// Make config available globally
window.troopConfig = config;

export default config; 