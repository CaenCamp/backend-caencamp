const csv = require('csvtojson');
const signale = require('signale');

const importation = async () => {
    signale.info("Importation de code naf/ape");
    const csvFilePath =`naf2008.csv`;
    signale.info(`Import du fichier ${csvFilePath}`);
    const jsonArrayRaw = await csv({
        noheader:false,
        trim: true,
        alwaysSplitAtEOL: true,
        delimiter: ','
    }).fromFile(csvFilePath);

    const jsonArray = jsonArrayRaw.map(c => ({
        code: c.id_5.replace('.', ''),
        label: c.label_5,
        ...c,
    }))

    console.log(jsonArray[0])
    // 6202A
    // Conseil en systèmes et logiciels informatiques
    // const testcode = jsonArray.find(d => d.id_5.replace('.', '') == '6202A');
    // console.log(testcode);
    // const codesNaf = jsonArray.reduce((acc, code) => {
    //     if (!acc[code.id_1]) {
    //         acc[code.id_1] = { label: code.label_1 };
    //     }
    //     if (!acc[code.id_1][code.id_2]) {
    //         acc[code.id_1][code.id_2] = { label: code.label_2 };
    //     }
    //     // if (!acc[code.id_1][code.id_2][code.id_3]) {
    //     //     acc[code.id_1][code.id_2][code.id_3] = { label: code.label_3 };
    //     // }
    //     // if (!acc[code.id_1][code.id_2][code.id_3][code.id_4]) {
    //     //     acc[code.id_1][code.id_2][code.id_3][code.id_4] = { label: code.label_4 };
    //     // }
    //     // if (!acc[code.id_1][code.id_2][code.id_3][code.id_4][code.id_5]) {
    //     //     acc[code.id_1][code.id_2][code.id_3][code.id_4][code.id_5] = { label: code.label_4, code: code.id_5.replace('.', '') };
    //     // }
    //     return acc;
    // }, {});
    // // console.log(codesNaf.J['62']['62.0']);
    // console.log(codesNaf);
    
    return jsonArray.length;
};

importation()
    .then((total) => {
        signale.info(`On a importé ${total} codes naf`);
        process.exit(0);
    })
    .catch((error) => {
        signale.error("Erreur lors de l'importation du csv' : ", error.message);
        process.exit(1);
    });
