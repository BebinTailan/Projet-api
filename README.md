Markdown

# API Board Game (Projet NestJS)

Ceci est une API RESTful conçue pour gérer une collection de jeux de société. Elle est construite avec **NestJS**, **TypeORM**, et utilise **SQLite** comme base de données. L'API implémente les opérations CRUD (Create, Read, Update, Delete), gère la pagination, et est sécurisée par une authentification **JSON Web Token (JWT)**.

Au premier lancement, l'API remplit automatiquement la base de données SQLite à partir du fichier `bgg_dataset.json` fourni.

## Technologies utilisées

* **NestJS** : Framework Node.js pour la construction d'applications côté serveur.
* **TypeORM** : ORM (Object-Relational Mapper) pour TypeScript.
* **SQLite** : Système de gestion de base de données SQL léger et "serverless".
* **JWT (JSON Web Token)** : Standard ouvert (RFC 7519) pour la création de tokens d'accès afin de sécuriser les routes de l'API.
* **`@nestjs/config`** : Module officiel de NestJS pour la gestion des variables d'environnement (`.env`).

---

## Installation et Lancement

Suivez ces étapes pour configurer et lancer le projet en environnement de développement.

### 1. Prérequis

Avant de commencer, vous aurez besoin des outils suivants :

* **[Node.js](https://nodejs.org/)** : Assurez-vous d'avoir une version LTS (v18+).
* **[Postman](https://www.postman.com/downloads/)** : Un client API essentiel pour tester les endpoints. Téléchargez et installez la version correspondant à votre système d'exploitation (Windows, macOS, ou Linux).

### 2. Cloner le dépôt

Utilisez git pour cloner le code source sur votre machine locale.

```bash
git clone https://github.com/BebinTailan/Projet-api
cd projet-api
3. Installer les dépendances
Naviguez dans le dossier du projet et utilisez npm (ou un autre gestionnaire de paquets) pour installer toutes les bibliothèques requises listées dans package.json.

Bash

npm install
4. Configurer l'environnement
Ce projet utilise un fichier .env pour gérer les informations sensibles (identifiants, clés secrètes).

À la racine du projet (au même niveau que package.json), créez un nouveau fichier nommé exactement .env.

Ouvrez ce fichier et copiez-y le contenu suivant :

Extrait de code

# Identifiants pour l'authentification
AUTH_USER=marcel
AUTH_PASSWORD=azerty

# Clé secrète utilisée pour signer les tokens JWT
JWT_SECRET=votreSuperSecretPhraseQuiNeDoitEtreNullePartAilleurs
5. Lancer l'application (Mode Développement)
Cette commande démarre le serveur en mode "watch", ce qui signifie qu'il redémarrera automatiquement à chaque modification de fichier .ts.

Bash

npm run start:dev
Le serveur est maintenant en cours d'exécution et écoute à l'adresse http://localhost:3000.

Note sur le premier lancement : Au tout premier démarrage, le serveur détectera que la base de données est vide.

Il créera le fichier ma_base_de_donnees.sqlite à la racine du projet.

Il lira le fichier bgg_dataset.json et exécutera un script de "seeding" (remplissage).

Le terminal affichera [GamesService] Remplissage terminé ! lorsque la base sera prête.

Utilisation de l'API (avec Postman)
Toutes les routes (sauf /auth/login) sont protégées par authentification JWT. Vous devez impérativement obtenir un token avant de pouvoir interroger les autres endpoints.

1. Authentification (Flux de Login)
C'est la première étape pour obtenir votre token d'accès.

POST /auth/login
Échange vos identifiants (stockés dans le .env) contre un access_token valide pour 1 heure.

Méthode : POST

URL : http://localhost:3000/auth/login

Body :

Sélectionnez l'onglet Body.

Activez l'option raw.

Dans la liste déroulante à droite, sélectionnez JSON.

Collez le JSON suivant dans la zone de texte :

JSON

{
  "username": "marcel",
  "password": "azerty"
}
Réponse (Succès 200 OK) : Le serveur répondra avec votre token.

JSON

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmNlbCIsInN1YiI6MSwiaWF0IjoxNz... (etc)"
}
Action : Copiez la valeur complète du access_token.

2. Accéder aux routes protégées
Pour toutes les requêtes suivantes, vous devez prouver votre identité en utilisant ce token.

Dans Postman, pour chaque nouvelle requête :

Ouvrez l'onglet Authorization.

Dans le menu déroulant Type, sélectionnez Bearer Token.

Dans le champ Token à droite, collez le access_token que vous venez de copier.

Endpoints des Jeux de Société (Routes Protégées)
Toutes ces routes nécessitent le Bearer Token configuré comme ci-dessus.

GET /games
Récupère la liste paginée de tous les jeux, triés par nom (ordre alphabétique).

Méthode : GET

URL : http://localhost:3000/games

Query Parameters (Optionnels) :

limit : Nombre d'éléments à renvoyer. (Défaut : 20).

offset : Nombre d'éléments à sauter. (Défaut : 0).

Exemple : http://localhost:3000/games?limit=5&offset=10

Réponses :

200 OK : Renvoie un tableau d'objets Game.

401 Unauthorized : Token manquant ou invalide.

GET /games/:id
Récupère un jeu de société spécifique par son id numérique.

Méthode : GET

URL : http://localhost:3000/games/1 (Remplacez 1 par l'ID désiré).

Réponses :

200 OK : Renvoie l'objet Game correspondant.

404 Not Found : Si l'ID n'existe pas dans la base de données.

401 Unauthorized : Token manquant ou invalide.

POST /games
Ajoute un nouveau jeu de société à la base de données.

Méthode : POST

URL : http://localhost:3000/games

Body (raw, JSON) : (Tous les champs sont requis)

JSON

{
  "name": "Mon Nouveau Jeu",
  "published_at": 2024,
  "min_players": 2,
  "max_players": 4,
  "duration": 60,
  "age_min": 12
}
Réponses :

201 Created : Renvoie l'objet Game nouvellement créé (avec son id).

400 Bad Request : Si les données du body sont invalides (ex: age_min négatif, name manquant).

401 Unauthorized : Token manquant ou invalide.

PUT /games/:id
Met à jour les informations d'un jeu existant via son id. Vous pouvez envoyer un objet partiel (un seul champ ou plusieurs).

Méthode : PUT

URL : http://localhost:3000/games/1 (Remplacez 1 par l'ID à modifier).

Body (raw, JSON) : (Envoyez seulement les champs à mettre à jour)

JSON

{
  "name": "Nouveau Nom du Jeu",
  "duration": 75
}
Réponses :

200 OK : Renvoie l'objet Game complet mis à jour.

404 Not Found : Si l'ID n'existe pas.

400 Bad Request : Si les données du body sont invalides (ex: age_min: 0).

401 Unauthorized : Token manquant ou invalide.

DELETE /games/:id
Supprime un jeu de société de la base de données via son id.

Méthode : DELETE

URL : http://localhost:3000/games/1 (Remplacez 1 par l'ID à supprimer).

Réponses :

204 No Content : Indique que la suppression a réussi. Le corps de la réponse sera vide.

404 Not Found : Si l'ID n'existe pas.

401 Unauthorized : Token manquant ou invalide.