# Audit et état de migration OBSIDEX

## Source HTML
- Fichier : `OBSIDEX-version-complete.html`
- Taille source : environ 255 Mo
- Données extraites : 93 dossiers (80 élèves, 13 professeurs)
- Illustrations extraites : 122 fichiers image, environ 98 Mo

## Source Power Ranking
- Classeur : `calc(1).xlsx`
- Feuilles : `base`, `Combats`, `Classement`
- Prestige de base : 80 élèves
- Combats existants : 6
- Les six gains/pertes recalculés par la logique TypeScript correspondent aux valeurs mises en cache par Excel.

## Règles de calcul relevées dans les formules de `Combats`
- Combats 1 à 8 : outsider +20 + 40 % de l'écart ; perte perdant = 30 % du gain.
- Combats 9 à 11 : même bonus outsider ; perte perdant = 40 % du gain.
- Combat 12 et suivants : outsider +30 + 40 % de l'écart ; perte perdant = 40 % du gain.
- Favori vainqueur : gain minimum 3 selon `15 - 2 % de l'écart` ; perdant minimum -4 selon 1 % de son prestige.

## Écart de nom
- Classeur : `Tav21 Wraith`
- Fiche OBSIDEX : `Tav21 Vraith`
- Alias technique ajouté pour rattacher le combat et les points à la fiche existante. Le nom affiché reste celui de la fiche OBSIDEX.

## État de cette livraison
- Interface React/Vite de consultation et fiches.
- Console admin minimale pour combats et prestige.
- Persistance Supabase prévue dans `ranking_state` avec politiques RLS.
- Repli localStorage pour les tests sans configuration Supabase.
- Les dépendances npm n'ont pas pu être installées dans l'environnement de génération ; la compilation Vite complète reste à valider après `npm install`. Les sources TS/TSX passent le contrôle de syntaxe TypeScript.
