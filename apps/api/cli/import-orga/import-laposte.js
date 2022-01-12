const csv = require('csvtojson');
const signale = require('signale');

const importation = async () => {
    signale.info('Importation de code postaux');
    const csvFilePath = `codes_postaux_14_utf8.csv`;
    signale.info(`Import du fichier ${csvFilePath}`);
    const jsonArray = await csv({
        noheader: false,
        trim: true,
        alwaysSplitAtEOL: true,
        delimiter: ',',
    }).fromFile(csvFilePath);

    console.log(jsonArray[0]);

    return jsonArray.length;
};

importation()
    .then((total) => {
        signale.info(`On a importé ${total} codes`);
        process.exit(0);
    })
    .catch((error) => {
        signale.error("Erreur lors de l'importation du csv' : ", error.message);
        process.exit(1);
    });
