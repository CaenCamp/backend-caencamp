const csv = require('csvtojson');
const signale = require('signale');
const slugify = require('slugify');
const knex = require('knex');

const knexConfig = require('../../knexfile');

const pg = knex(knexConfig);

const slugConf = {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    trim: true,
};

const splitLines = (string, options = {}) => {
    const { preserveNewlines = false } = options;

    if (typeof string !== 'string') {
        throw new TypeError(`Expected input to be of type \`string\`, got \`${typeof string}\``);
    }

    if (!preserveNewlines) {
        return string.split(/\r?\n/);
    }

    const parts = string.split(/(\r?\n)/);
    const lines = [];

    for (let index = 0; index < parts.length; index += 2) {
        lines.push(parts[index] + (parts[index + 1] || ''));
    }

    return lines;
};

const formatTitle = (data) => {
    return splitLines(data)
        .map((str) => str.trim())
        .filter((x) => x)
        .join(' ');
};

const formatResume = (data) => {
    return (
        splitLines(data)
            .map((str) => str.replace(/\t/g, ''))
            .map((str) => str.trim())
            .filter((str) => !str.includes('►'))
            //.map(str => str.replace(/\s/g, ''));
            .filter((x) => x)
            .join(' ')
    );
};

const findCityFromCp = (postalCode, city, codesPostaux) => {
    // { CP: '14600', INSEE: '14001', 'Nom min': 'Ablon', 'Nom Maj': 'ABLON' }
    const dataCity = city.join(' ').trim();
    const cities = codesPostaux.filter((cp) => cp.CP == postalCode);
    if (!cities.length) {
        return dataCity;
    }
    if (cities.length === 1) {
        return cities[0]['Nom min'];
    }
    const cityFromCp = cities.find((c) => slugify(c['Nom Maj'], slugConf) == slugify(dataCity, slugConf));
    return cityFromCp ? cityFromCp['Nom min'] : dataCity;
};

const formatAdress = (data, codesPostaux) => {
    //return eol.split(data).filter(line => line).join(eol.auto);
    const addressInArray = splitLines(data)
        .map((str) => str.replace(/\t/g, ''))
        .map((str) => str.trim())
        .filter((x) => x);
    const [postalCode, ...city] = addressInArray.slice(-1)[0].split(' ');
    return {
        street: addressInArray[0],
        postalCode,
        city: findCityFromCp(postalCode, city, codesPostaux),
    };
};

const formatActivity = (data, codesNaf) => {
    const defaultNaf = {
        label: 'Conseil en systèmes et logiciels informatiques',
        code: '6202A',
    };
    const codeLabel = splitLines(data)
        .map((str) => str.trim())
        .filter((x) => x);
    const [label, code] = codeLabel[0].split('(');
    if (!code) {
        return defaultNaf;
    }
    const codeData = code.replace(')', '').trim();
    let codeNaf = codesNaf.find((cn) => cn.code == codeData);
    if (!codeNaf) {
        let correctCode = null;
        if (codeLabel[0].includes('4666Z')) {
            correctCode = '4666Z';
        }
        if (codeLabel[0].includes('4669B')) {
            correctCode = '4669B';
        }
        if (codeLabel[0].includes('1812Z')) {
            correctCode = '1812Z';
        }
        if (codeLabel[0].includes('4651Z')) {
            correctCode = '4651Z';
        }
        if (codeLabel[0].includes('4690Z')) {
            correctCode = '4690Z';
        }
        codeNaf = correctCode ? codesNaf.find((cn) => cn.code == correctCode) : null;
    }

    return codeNaf
        ? {
              label: codeNaf.label,
              code: codeNaf.code,
          }
        : defaultNaf;
};

const formatLegalStatus = (data) => {
    const cleanStatus = data.replace('(sans autre indication)', '').trim();
    return !cleanStatus || cleanStatus === 'null' ? 'Non renseigné' : cleanStatus;
};

const convertToOrganization = (data, codesNaf, codesPostaux) => ({
    name: formatTitle(data.title),
    resume: formatResume(data.resume),
    adress: formatAdress(data.adresse, codesPostaux),
    link: data.web || null,
    creationDate: data.creation ? new Date(data.creation) : null,
    activity: formatActivity(data['activite-naf08'], codesNaf),
    staffing: !data.effectif || data.effectif === 'null' ? 'Non renseigné' : data.effectif,
    legalStatus: formatLegalStatus(data.type),
});

const importation = async () => {
    signale.info('Importation de boite depuis les csv');
    // References NAF
    // {
    //     code: '0111Z',
    //     label: "Culture de céréales (à l'exception du riz)",
    //     id_1: 'A',
    //     label_1: 'Agriculture, sylviculture et pêche',
    //     id_2: '01',
    //     label_2: 'Culture et production animale, chasse et services annexes',
    //     id_3: '01.1',
    //     label_3: 'Cultures non permanentes',
    //     id_4: '01.11',
    //     label_4: "Culture de céréales (à l'exception du riz)",
    //     id_5: '01.11Z',
    //     label_5: "Culture de céréales (à l'exception du riz)"
    // }
    const nafRaw = await csv({
        noheader: false,
        trim: true,
        alwaysSplitAtEOL: true,
        delimiter: ',',
    }).fromFile('naf2008.csv');
    const codesNaf = nafRaw.map((c) => ({
        code: c.id_5.replace('.', ''),
        label: c.label_5,
        ...c,
    }));
    // Reference code postaux
    // { CP: '14600', INSEE: '14001', 'Nom min': 'Ablon', 'Nom Maj': 'ABLON' }
    const codesPostaux = await csv({
        noheader: false,
        trim: true,
        alwaysSplitAtEOL: true,
        delimiter: ',',
    }).fromFile('codes_postaux_14_utf8.csv');

    const organizations = [];
    for (let nb = 1; nb < 14; nb++) {
        const csvFilePath = `kompass-p${nb}.csv`;
        // signale.info(`Import du fichier ${csvFilePath}`);
        const jsonArray = await csv({
            noheader: false,
            trim: true,
            alwaysSplitAtEOL: true,
        }).fromFile(csvFilePath);

        for (let i = 0; i < jsonArray.length; i++) {
            try {
                const organization = convertToOrganization(jsonArray[i], codesNaf, codesPostaux);
                // console.log(organization);
                organizations.push(organization);
            } catch (error) {
                signale.debug(jsonArray[i]);
                signale.error(error);
                throw error;
            }
        }
    }

    signale.info(' ');
    signale.info(`== On a importé ${organizations.length} boites ==`);
    signale.info(' ');

    const activitiesObjects = organizations.reduce((acc, org) => {
        if (!acc[org.activity.code]) {
            acc[org.activity.code] = {
                ...org.activity,
                count: 1,
            };
        } else {
            acc[org.activity.code].count = acc[org.activity.code].count + 1;
        }
        return acc;
    }, {});
    const activities = Object.keys(activitiesObjects)
        .map((aok) => activitiesObjects[aok])
        .sort((a, b) => {
            return b.count - a.count;
        });
    signale.info(' ');
    signale.info(`== Bilan des ${activities.length} activités importées ==`);
    signale.info(' ');
    displayActivities(activities, codesNaf);

    const staffingObjects = organizations.reduce((acc, org) => {
        const slug = slugify(org.staffing, slugConf);
        if (!acc[slug]) {
            acc[slug] = {
                label: org.staffing,
                count: 1,
            };
        } else {
            acc[slug].count = acc[slug].count + 1;
        }
        return acc;
    }, {});
    const staffing = Object.keys(staffingObjects)
        .map((sk) => staffingObjects[sk])
        .sort((a, b) => {
            return b.count - a.count;
        });
    signale.info(' ');
    signale.info(`== Bilan des ${staffing.length} types d'effectifs importées ==`);
    signale.info(' ');
    displayStaffing(staffing);

    const statusObjects = organizations.reduce((acc, org) => {
        const slug = slugify(org.legalStatus, slugConf);
        if (!acc[slug]) {
            acc[slug] = {
                label: org.legalStatus,
                count: 1,
            };
        } else {
            acc[slug].count = acc[slug].count + 1;
        }
        return acc;
    }, {});
    const status = Object.keys(statusObjects)
        .map((sk) => statusObjects[sk])
        .sort((a, b) => {
            return b.count - a.count;
        });
    signale.info(' ');
    signale.info(`== Bilan des ${status.length} types d'entreprises importées ==`);
    signale.info(' ');
    displayStatus(status);

    // console.log(organizations[0]);

    await pg('code_naf').del();
    await pg('staffing').del();
    await pg('legal_structure').del();
    await pg('imported_organization').del();

    await pg('code_naf').insert(
        codesNaf.map((naf) => ({
            ...naf,
            is_used: activities.findIndex((act) => act.code === naf.code) > -1,
        })),
    );
    await pg('staffing').insert(staffing.map((s) => ({ label: s.label })));
    await pg('legal_structure').insert(status.map((s) => ({ label: s.label })));

    const staffings = await pg('staffing').select('*');
    const legalStructures = await pg('legal_structure').select('*');
    const cNafs = await pg('code_naf').select('*').where({ is_used: true });

    for (let orgcount = 0; orgcount < organizations.length; orgcount++) {
        const orga = organizations[orgcount];
        const dbStaffing = staffings.find((s) => s.label === orga.staffing);
        const dbLegal = legalStructures.find((s) => s.label === orga.legalStatus);
        const dbNaf = cNafs.find((n) => n.code === orga.activity.code);
        const data = {
            name: orga.name,
            slug: slugify(orga.name, slugConf),
            description: orga.resume,
            url: orga.link || null,
            address_country: 'FR',
            address_locality: orga.adress.city,
            postal_code: orga.adress.postalCode,
            street_address: orga.adress.street,
            creation_date: orga.creationDate,
            imported_from: 'https://fr.kompass.com/a/informatique-et-internet/57/d/calvados/fr_25_14',
            code_naf_id: dbNaf ? dbNaf.id : null,
            staffing_id: dbStaffing ? dbStaffing.id : null,
            legal_structure_id: dbLegal ? dbLegal.id : null,
        };
        await pg('imported_organization').insert(data);
    }

    return organizations.length;
};

const truncate = (str, n = 70) => {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

const displayActivities = (activities, codesNaf) => {
    for (ac of activities) {
        const codeNaf = codesNaf.find((cn) => cn.code == ac.code);
        signale.info(`${ac.count} : ${ac.code} - ${truncate(ac.label)} (${truncate(codeNaf.label_1, 40)})`);
    }
};
const displayStaffing = (staffing) => {
    for (st of staffing) {
        signale.info(`${st.count} : ${st.label}`);
    }
};

const displayStatus = (status) => {
    for (st of status) {
        signale.info(`${st.count} : ${st.label}`);
    }
};
/*
{
  'web-scraper-order': '1641925120-563',
  'web-scraper-start-url': 'https://fr.kompass.com/a/informatique-et-internet/57/d/calvados/fr_25_14/',
  'lien-fiche': 'M.R.C.F (EASY CONSEIL)',
  'lien-fiche-href': 'https://fr.kompass.com/c/m-r-c-f/fr8288560/',
  title: 'M.R.C.F\n                                    EASY CONSEIL',
  rue: '210 RUE DE L AVENIR',
  adresse: '210 RUE DE L AVENIR \n\n\t                \n\t        14790 VERSON',
  web: 'http://www.easy-conseil.eu',
  creation: '2006',
  type: 'Société à responsabilité limitée (sans autre indication)',
  effectif: 'De 0 à 9 employés',
  resume: "Implanté à VERSON, l'établissement M R C F est spécialisé dans le domaine de la gestion d'encaissement, système de vidéo-surveillance et solution ressources humaines dans les boulangeries et restaurants. Avec une équipe bien formée aux nouvelles technologies pour conseiller et apporté des solutions adaptées.",
  'activite-naf08': 'Traitement de données, hébergement et activités connexes (6311Z)\n' +
    '\t\t\t\tVoir la classification Kompass'
}
*/
importation()
    .then((total) => {
        signale.info(' ');
        signale.info(`Import terminé`);
        signale.info(' ');
        process.exit(0);
    })
    .catch((error) => {
        signale.error("Erreur lors de l'importation du csv' : ", error.message);
        process.exit(1);
    });
