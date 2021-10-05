# Le backend (API, admin, ...) du caen.camp

![GitHub top language](https://img.shields.io/github/languages/top/CaenCamp/backend-caencamp.svg) ![github contributors](https://img.shields.io/github/contributors/CaenCamp/backend-caencamp.svg) ![web-myna.svg](https://img.shields.io/github/license/CaenCamp/backend-caencamp.svg) ![prs welcome](https://img.shields.io/badge/prs-welcome-brightgreen.svg)

L'idée d'aller plus loin que la mise à disposition de l'historique des talks du CaenCamp n'est pas nouvelle. D'ailleurs, ce dépôt synthétise le travail allant dans ce sens déjà réalisé lors du Coding CaenCamp (voir les dépôts [api-caencamp](https://github.com/CaenCamp/api-caencamp), [jobs-caen-camp](https://github.com/CaenCamp/jobs-caen-camp), [decentralised-network-for-developers](https://github.com/CaenCamp/decentralised-network-for-developers)).

Pour le moment ce backend est constitué de :

- une base de données postgreSQL,
- une API propulsée par Koa et validée par un contrat OpenApi,
- une interface d'administration en react-admin.

Vous pouvez d'ores et déjà voir le détail des objets servis par cette API sur la documentation, mais on trouve :

- les rencontres du CaenCamp,
- les talks présentés,
- les speakers,
- les lieux physiques des rencontres,
- les sponsors,
- des offres d'emploi,
- un annuaire d'organisations du Calvados liées à l'informatique.

## Démarrage rapide

### Pré-requis

Vous devrez avoir Node en version 14 minimum installé sur votre machine. Le projet dépendant d'une base de données, vous devrez également avoir un serveur postgreSQL en version 12.5 en local, ou avoir Docker pour pouvoir lancer la base de données dans un conteneur.

Le [guide du contributeur](./.github/CONTRIBUTING.md#installer-le-projet) détaille les pré-requis et les différents mode d’installation du projet. 

### Installation des dépendances

```bash
make install
```

### Démarrer l'environnement de développement

Vous pouvez lancer l'environnement de développement (attention cela va aussi lancer un containeur Docker pour la base de données) :

```bash
make start
```

Ensuite, si c'est la première fois que vous démarrez le projet, vous pourrez ajouter du contenu à la base de données avec la commande :

```bash
make db-init
```

L'api est accessible sur http://localhost:3001/documentation
L'interface d'administration est accessible sur http://localhost:3000/admin

## Vous souhaitez participer

Merci à vous :+1:

Et c’est très simple :

-   Si vous ne savez pas trop par où commencer, vous pouvez jeter un coup d’œil aux [issues](https://github.com/CaenCamp/jobs-caen-camp/issues): elles décrivent les taches à réaliser classées par type (code, design, integration, etc.),
-   Une fois que vous savez quoi faire, vous pouvez consulter le [**guide du contributeur**](.github/CONTRIBUTING.md) pour vous lancer.

Et si vous ne trouvez toujours pas quoi faire dans les issues existantes et/ou que vous avez d’autres idées, n’hésitez pas à créer une nouvelle issue.

## License

backend-caencamp est sous license [GNU GPLv3](LICENSE)
