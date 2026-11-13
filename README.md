# OBSIDEX — reconstruction en ligne

## Architecture retenue
- Site public, sans compte visiteur.
- Un compte administrateur Supabase (authentification e-mail/mot de passe).
- Données des dossiers et images dans le dépôt / site statique.
- Données évolutives du Power Ranking dans une seule ligne JSON de la table `ranking_state`.
- Aucun serveur applicatif personnalisé nécessaire : Render héberge le frontend, Supabase conserve les données partagées et sécurise les écritures.

## Contenu migré
- 93 dossiers : 80 élèves et 13 professeurs.
- 122 images extraites et classées dans `public/images/`.
- 80 valeurs de prestige issues de `calc(1).xlsx`.
- 6 combats déjà inscrits dans le classeur, importés dans leur ordre d'origine.
- Interface de consultation, recherche, filtres, fiches et galeries.
- Console admin minimale : saisie/suppression de combats et édition du prestige initial / ajustement manuel.

## Calcul du Power Ranking
Les résultats sont recalculés chronologiquement à chaque ajout, suppression ou modification des points de base.
- Pour les 8 premiers combats : bonus outsider `20 + écart × 0,4`, perte du perdant `30 %` du gain.
- Pour les combats 9 à 11 : même bonus outsider, perte du perdant `40 %` du gain.
- À partir du combat 12 : bonus outsider `30 + écart × 0,4`, perte du perdant `40 %` du gain.
- Si le favori gagne : gain `max(3, arrondi(15 - écart × 0,02))`, perte adverse `max(4, arrondi(1 % de ses points))`.
- Arrondis à l'entier le plus proche, comme Excel ROUND pour les valeurs positives utilisées.

Les valeurs sont directement reproduites depuis les formules de la feuille `Combats`. Les six combats présents dans le classeur reproduisent exactement leurs gains/pertes calculés.

## Écart de nom constaté
Le classeur écrit `Tav21 Wraith`, tandis que la fiche OBSIDEX est `Tav21 Vraith`. Une correspondance technique relie les deux sans changer le nom de la fiche affichée. Le nom source reste documenté dans `src/data/ranking-seed.json`.

## Lancer localement
1. Installer Node.js LTS.
2. `npm install`
3. Copier `.env.example` vers `.env` et renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
4. `npm run dev`

Sans Supabase configuré, l’application permet de prévisualiser le site public avec les données intégrées. La connexion administrateur et la synchronisation du Power Ranking nécessitent Supabase ; le mode local ne fournit volontairement pas de faux système de connexion.

## Configurer Supabase
1. Créer un projet Supabase.
2. Exécuter `supabase/schema.sql` dans SQL Editor.
3. Créer le compte administrateur dans Authentication > Users.
4. Ajouter son UUID dans `public.admin_users` :

```sql
insert into public.admin_users (user_id) values ('UUID_DU_COMPTE_ADMIN');
```

5. Dans un terminal local, définir `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` (clé secrète, jamais dans le frontend), puis lancer `npm run seed`.
6. Dans Supabase Authentication, désactiver les inscriptions publiques.

Le script importe les fiches et initialise `ranking_state` avec les 80 prestiges et les 6 combats du classeur.

## Déploiement Render
- Type : Static Site.
- Build command : `npm install && npm run build`.
- Publish directory : `dist`.
- Variables : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

Le site publié est public ; les écritures du classement sont protégées par la session Supabase et les politiques RLS.

## Contrôles restant avant mise en production
- Vérifier visuellement toutes les fiches et illustrations sur la version web.
- Exécuter le SQL puis le script `npm run seed` dans le projet Supabase réel.
- Tester un visiteur anonyme et le compte admin.
- Faire un test de combat après le 8e, le 11e et le 12e combat pour confirmer les paliers de formules.
