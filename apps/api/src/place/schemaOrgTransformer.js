const formatISO = require('date-fns/formatISO');

const API_URL = 'https://api.caen.camp/api';

const formatPlace = (place) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Place',
        '@id': place.slug,
        identifier: place.slug,
        url: `${API_URL}/places/${place.slug}`,
        name: place.name,
        description: place.description,
        descriptionHtml: place.descriptionHtml,
        image: place.logo,
        address: {
            '@type': 'PostalAddress',
            streetAddress: [place.address1, place.address2].join(', '),
            addressLocality: place.city,
            postalCode: place.postalCode,
            addressCountry: place.country,
        },
        events: place.events.map((event) => ({
            '@type': 'Event',
            '@id': event.slug,
            identifier: event.slug,
            url: `${API_URL}/events/${event.slug}`,
            name: event.name,
            category: event.category,
            number: event.number,
            startDate: formatISO(new Date(event.startDate)),
            disambiguatingDescription: event.disambiguatingDescription,
        })),
    };
};

module.exports = {
    formatPlace,
};
