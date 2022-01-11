const csv = require('csvtojson');
const eol = require('eol');
const signale = require('signale');

const splitLines = (string, options = {}) => {
	const {preserveNewlines = false} = options;

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
}

const formatTitle = data => {
    return splitLines(data).map(str => str.trim()).filter(x => x).join(' ');
}

const formatResume = data => {
    return splitLines(data)
        .map(str => str.replace(/\t/g, ''))
        .map(str => str.trim())
        .filter(str => !str.includes('►'))
        //.map(str => str.replace(/\s/g, ''));
        .filter(x => x)
        .join(' ');
}

const formatAdress = data => {
    //return eol.split(data).filter(line => line).join(eol.auto);
    const addressInArray = splitLines(data)
        .map(str => str.replace(/\t/g, ''))
        .map(str => str.trim())
        .filter(x => x);
    const [postalCode, ...city] = addressInArray.slice(-1)[0].split(' ');
    return {
        street: addressInArray[0],
        postalCode,
        city: city.join(' '),
    };
}

const formatActivity = data => {
    const codeLabel = splitLines(data).map(str => str.trim()).filter(x => x);
    const [label, code] = codeLabel[0].split('(');
    return {
        label: label.trim(),
        code: code ? code.replace(')', '').trim() : label.trim(),
    };
}

const formatLegalStatus = data => {
    return data.replace('(sans autre indication)', '').trim();
}

const convertToOrganization = data => ({
    name: formatTitle(data.title),
    resume: formatResume(data.resume),
    adress: formatAdress(data.adresse),
    link: data.web || null,
    creationDate: data.creation ? new Date(data.creation) : null,
    activity: formatActivity(data['activite-naf08']),
    staffing: data.effectif || null,
    legalStatus: data.type ? formatLegalStatus(data.type) : null,
});

const importation = async () => {
    signale.info("Importation de boite depuis les csv");
    const organizations = [];
    for (let nb = 1; nb < 14; nb++) {
        const csvFilePath=`kompass-p${nb}.csv`;
        signale.info(`Import du fichier ${csvFilePath}`);
        const jsonArray=await csv({
            noheader:false,
            trim: true,
            alwaysSplitAtEOL: true,
        }).fromFile(csvFilePath);

        for (let i = 0; i < jsonArray.length; i++) {
            try {
                const organization = convertToOrganization(jsonArray[i]);
                console.log(organization);
                organizations.push(organization);
            } catch (error) {
                signale.debug(jsonArray[i]);
                signale.error(error);
                throw error;
            }
        }
    }
    
    return organizations.length;
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
        signale.info(`On a importé ${total} boites`);
        process.exit(0);
    })
    .catch((error) => {
        signale.error("Erreur lors de l'importation du csv' : ", error.message);
        process.exit(1);
    });
