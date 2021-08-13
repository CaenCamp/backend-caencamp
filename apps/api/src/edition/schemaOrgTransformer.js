const addHours = require('date-fns/addHours');

const API_URL = 'http://localhost:3001/api';

const formatEvent = (event) => {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      '@id': event.slug,
      identifier: event.slug,
      url: `${API_URL}/events/${event.slug}`,
      name: event.title,
      category: event.category,
      number: event.number,
      startDate: event.startDateTime,
      endDate: event.endDateTime || addHours(new Date(event.startDateTime), 2),
      eventAttendanceMode: getSchemaOrgAttendanceMode(event.mode),
      eventStatus: "https://schema.org/EventScheduled",
      isAccessibleForFree: true,
      description: event.description,
      descriptionHtml: event.descriptionHtml,
      disambiguatingDescription: event.shortDescription,
      inLanguage: {
          '@type': 'Language',
          'name': 'French'
      },
      image: 'https://caen.camp/static/logoFondBlanc-278da657a83902f7d21083ade8e9ce7a.png',
      tags: event.tags,
      meetupId: event.meetupId,
      location: event.mode === 'online' ? {
          '@type': 'VirtualLocation',
          url: 'https://somewhere.com/'
      } : {
        '@type': 'Place',
        '@id': event.placeSlug,
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
          url: `${API_URL}/organizations/${event.organizer.identifier}`,
          name: event.category,
      },
      sponsor: event.sponsor ? {
          '@type': 'Organization',
          '@id': event.sponsor.identifier,
          url: `${API_URL}/organizations/${event.sponsor.identifier}`,
          name: event.sponsor.name,
      } : null,
      workPerformed: event.talks.map(talk => ({
          '@type': 'CreativeWork',
          '@id': talk.slug,
          url: `${API_URL}/creative-works/${talk.slug}`,
          name: talk.title,
          description: talk.description,
          descriptionHtml: talk.descriptionHtml,
          abstract: talk.shortDescription,
          maintainers: talk.speakers.map(speaker => ({
              '@type': 'Person',
              url: `${API_URL}/persons/${speaker.slug}`,
              '@id': speaker.slug,
              name: speaker.name,
              knowsAbout: speaker.shortBiography,
          }))
      })),
      performers: event.talks.reduce((acc,talk) => ([
          ...acc,
          ...talk.speakers,
      ]), []).map(speaker => ({
          '@type': 'Person',
          '@id': speaker.slug,
          url: `${API_URL}/persons/${speaker.slug}`,
          name: speaker.name,
          knowsAbout: speaker.shortBiography,
      }))
    };
  };
  
  const getSchemaOrgAttendanceMode = mode => {
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
