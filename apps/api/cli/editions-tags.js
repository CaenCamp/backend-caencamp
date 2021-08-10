const knex = require('knex');
const signale = require('signale');

const knexConfig = require('../knexfile');

const pg = knex(knexConfig);

const importEditionsTags = async () => {
    signale.info('Importation des tags pour les éditions');

    const editions = await pg
        .select(
            'edition.id',
            pg.raw(`(SELECT ARRAY(
            SELECT t.id
            FROM talk t
            WHERE  t.edition_id = edition.id
            ) as talks)`),
        )
        .from('edition');

    for (let i = 0; i < editions.length; i++) {
        const tagsFromDb = await pg('talk_tag')
            .select('tag.slug')
            .join('tag', {
                'tag.id': 'talk_tag.tag_id',
            })
            .whereIn('talk_id', editions[i].talks);
        if (tagsFromDb.length) {
            const tags = [...new Set(tagsFromDb.map(tfdb => tfdb.slug))];
            const tagsData = tags.map(tag => ({
                editionId: editions[i].id,
                tag,
            }));
            await pg('edition_tag')
                .where({ editionId: editions[i].id })
                .del();
            await pg('edition_tag')
                .insert(tagsData);
        }
    }
    
    return true;
};

importEditionsTags()
    .then(() => {
        signale.info(
            `Fin de l'importation des tags d'éditions`
        );
        process.exit(0);
    })
    .catch((error) => {
        signale.error("Erreur lors de l'importation des tags d'éditions : ", error);
        process.exit(1);
    });
