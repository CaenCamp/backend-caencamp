const formatISO = require('date-fns/formatISO');

/**
 * Transforms a db queried organization into an organization object for API.
 *
 * @param {object} dbOrganization - organization data from database
 * @returns {object} an organization object as describe in OpenAPI contract
 */
 const formatJobPosting = (dbJobPosting) => {
  return dbJobPosting
      ? {
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            '@id': dbJobPosting.id,
            identifier: dbJobPosting.id,
            url: dbJobPosting.url,
            title: dbJobPosting.title,
            employmentType: dbJobPosting.employmentType,
            employerOverview: dbJobPosting.employerOverview,
            experienceRequirements: dbJobPosting.experienceRequirements,
            skills: dbJobPosting.skills,
            hiringOrganization: {
                '@type': 'Organization',
                '@id': dbJobPosting.hiringOrganizationId,
                identifier: dbJobPosting.hiringOrganizationId,
                name: dbJobPosting.hiringOrganizationName,
                url: dbJobPosting.hiringOrganizationUrl,
                address: {
                    '@type': 'PostalAddress',
                    addressCountry:
                        dbJobPosting.hiringOrganizationAddressCountry,
                    addressLocality:
                        dbJobPosting.hiringOrganizationAddressLocality,
                    postalCode: dbJobPosting.hiringOrganizationPostalCode,
                },
            },
            datePosted: dbJobPosting.datePosted
                ? formatISO(new Date (dbJobPosting.datePosted))
                : null,
            jobStartDate: dbJobPosting.jobStartDate
                ? formatISO(new Date (dbJobPosting.jobStartDate))
                : null,
            validThrough: dbJobPosting.validThrough
                ? formatISO(new Date (dbJobPosting.validThrough))
                : null,
        }
      : {};
};

module.exports = {
  formatJobPosting,
};
