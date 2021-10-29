const formatISO = require('date-fns/formatISO');

const API_URL = 'https://api.caen.camp/api';

const formatOrganization = (organization) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': organization.slug,
        identifier: organization.slug,
        url: `${API_URL}/organizations/${organization.slug}`,
        name: organization.name,
        description: organization.description,
        descriptionHtml: organization.descriptionHtml,
        logo: organization.logo,
        email: organization.email,
        locations: {
            '@type': 'PostalAddress',
            streetAddress: organization.streetAddress,
            addressLocality: organization.addressLocality,
            postalCode: organization.postalCode,
            addressCountry: organization.addressCountry,
        },
        contactPoints: organization.contactPoints
            ? organization.contactPoints.map((contact) => ({
                  '@type': 'ContactPoint',
                  contactType: contact.contactType,
                  name: contact.name,
                  email: contact.email,
                  telephone: contact.telephone,
              }))
            : null,
        events: organization.events
            ? organization.events.map((event) => ({
                  '@type': 'Event',
                  '@id': event.slug,
                  identifier: event.slug,
                  url: `${API_URL}/events/${event.slug}`,
                  name: event.name,
                  category: event.category,
                  number: event.number,
                  startDate: formatISO(new Date(event.startDate)),
                  disambiguatingDescription: event.disambiguatingDescription,
              }))
            : null,
    };
};

module.exports = {
    formatOrganization,
};
