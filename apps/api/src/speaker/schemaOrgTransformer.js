const addHours = require('date-fns/addHours');
const formatISO = require('date-fns/formatISO');

const API_URL = 'http://localhost:3001/api';

const formatSpeaker = (speaker) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': speaker.slug,
        identifier: speaker.slug,
        url: `${API_URL}/speakers/${speaker.slug}`,
        name: speaker.name,
        disambiguatingDescription: speaker.shortBiography,
        description: speaker.biography,
        descriptionHtml: speaker.biographyHtml,
        image: 'https://caen.camp/static/logoFondBlanc-278da657a83902f7d21083ade8e9ce7a.png',
        websites: speaker.websites,
        talks:speaker.talks.map(talk => ({
            '@type': 'CreativeWork',
            '@id': talk.slug,
            identifier: talk.slug,
            url: `${API_URL}/events/${talk.edition}`,
            name: talk.title,
            format: {
                label: talk.type,
                durationInMinutes: talk.durationInMinutes,
            },
            abstract: talk.shortDescription,
            video: talk.video,
            image: 'https://caen.camp/static/logoFondBlanc-278da657a83902f7d21083ade8e9ce7a.png',
        })),
    };
  };
  
  module.exports = {
    formatSpeaker,
  };
