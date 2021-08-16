const knex = require('knex');
const signale = require('signale');

const knexConfig = require('../knexfile');

const pg = knex(knexConfig);

const importEditionsTags = async () => {
    signale.info('Importation des tags pour les éditions');

    const editions = await pg
        .select(
            'edition.id',
            'edition.slug',
            pg.raw(`(SELECT array_to_json(array_agg(jsonb_build_object(
                'slug', talk.slug,
                'title', talk.title,
                'video', talk.video
            ) ORDER BY talk.title))
            FROM talk
            WHERE talk.edition_id = edition.id) as talks`)
        )
        .from('edition');

    for (let i = 0; i < editions.length; i++) {
        if (editions[i].talks) {
            const hasVideo = editions[i].talks.reduce((acc, talk) => {
                if (acc) return true;
                return !!talk.video;
            }, false);
            
            await pg('edition')
                .where({ id: editions[i].id })
                .update({ hasVideo });
        }
    }
    
    return true;
};

importEditionsTags()
    .then(() => {
        signale.info(
            `Fin de l'importation du marqueur de video sur les editions`
        );
        process.exit(0);
    })
    .catch((error) => {
        signale.error("Erreur lors de l'importation du marqueur de video sur les editions : ", error);
        process.exit(1);
    });
