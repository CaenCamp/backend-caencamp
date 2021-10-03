const addHours = require('date-fns/addHours');
const formatISO = require('date-fns/formatISO');

const API_URL = 'http://localhost:3001/api';

const formatEvent = (event) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        '@id': event.slug,
        identifier: event.slug,
        url: `${API_URL}/events/${event.slug}`,
        name: event.title,
        category: event.category,
        number: event.number,
        startDate: formatISO(new Date(event.startDateTime)),
        endDate: formatISO(new Date(event.endDateTime)) || formatISO(addHours(new Date(event.startDateTime), 2)),
        eventAttendanceMode: getSchemaOrgAttendanceMode(event.mode),
        eventStatus: 'https://schema.org/EventScheduled',
        isAccessibleForFree: true,
        description: event.description,
        descriptionHtml: event.descriptionHtml,
        disambiguatingDescription: event.shortDescription,
        inLanguage: {
            '@type': 'Language',
            name: 'French',
        },
        image: 'https://caen.camp/static/logoFondBlanc-278da657a83902f7d21083ade8e9ce7a.png',
        tags: event.tags,
        hasVideo: event.hasVideo,
        meetupId: event.meetupId,
        location:
            event.mode === 'online'
                ? {
                      '@type': 'VirtualLocation',
                      '@id': 'youtube',
                      identifier: 'youtube',
                      url: 'https://somewhere.com/',
                      name: 'YouTube',
                  }
                : {
                      '@type': 'Place',
                      '@id': event.placeSlug,
                      identifier: event.placeSlug,
                      url: `${API_URL}/places/${event.placeSlug}`,
                      name: event.place,
                      address: {
                          '@type': 'PostalAddress',
                          streetAddress: [event.address1, event.address2].join(', '),
                          addressLocality: event.city,
                          postalCode: event.postalCode,
                          addressCountry: event.country,
                      },
                  },
        organizer: {
            '@type': 'Organization',
            '@id': event.organizer.identifier,
            identifier: event.organizer.identifier,
            url: `${API_URL}/organizations/${event.organizer.identifier}`,
            name: event.category,
        },
        sponsor: event.sponsor
            ? {
                  '@type': 'Organization',
                  '@id': event.sponsor.identifier,
                  identifier: event.sponsor.identifier,
                  url: `${API_URL}/organizations/${event.sponsor.identifier}`,
                  name: event.sponsor.name,
              }
            : null,
        workPerformed: event.talks.map((talk) => ({
            '@type': 'CreativeWork',
            '@id': talk.slug,
            identifier: talk.slug,
            url: `${API_URL}/creative-works/${talk.slug}`,
            name: talk.title,
            format: {
                label: talk.type,
                durationInMinutes: talk.durationInMinutes,
            },
            description: talk.description,
            descriptionHtml: talk.descriptionHtml,
            abstract: talk.shortDescription,
            maintainers: talk.speakers.map((speaker) => ({
                '@type': 'Person',
                '@id': speaker.slug,
                identifier: speaker.slug,
                url: `${API_URL}/speakers/${speaker.slug}`,
                name: speaker.name,
                disambiguatingDescription: speaker.shortBiography,
            })),
            video: talk.video,
        })),
        performers: event.talks
            .reduce((acc, talk) => [...acc, ...talk.speakers], [])
            .map((speaker) => ({
                '@type': 'Person',
                '@id': speaker.slug,
                identifier: speaker.slug,
                url: `${API_URL}/speakers/${speaker.slug}`,
                name: speaker.name,
                disambiguatingDescription: speaker.shortBiography,
            })),
    };
};

const getSchemaOrgAttendanceMode = (mode) => {
    switch (mode) {
        case 'online':
            return 'https://schema.org/OnlineEventAttendanceMode';
        case 'mixed':
            return 'https://schema.org/MixedEventAttendanceMode';
        default:
            return 'https://schema.org/OfflineEventAttendanceMode';
    }
};

module.exports = {
    formatEvent,
};
