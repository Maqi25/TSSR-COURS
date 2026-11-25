# Comptes du site avec Supabase

Le site est statique (GitHub Pages) : les comptes et la sauvegarde en ligne passent par **Supabase**, un service gratuit qui fournit l'authentification (e-mail + mot de passe) et une base de données.

Ce qui est sauvegardé sur le compte : le **suivi des TP**, les **profils du QCM examen** (historique, compétences, erreurs, meilleurs scores), le **planning de révision**, les pages consultées et la couleur du site.

## Mise en place (une seule fois, ~10 minutes)

1. **Créer le projet**
   - Aller sur <https://supabase.com> → *Start your project* → se connecter avec GitHub.
   - *New project* : un nom (ex. `tssr-cours`), un mot de passe de base de données (à garder, il ne servira pas au site), la région **Europe (Paris ou Frankfurt)**, offre **Free**.

2. **Créer la table**
   - Menu *SQL Editor* → *New query* → coller tout le contenu de [`schema.sql`](schema.sql) → *Run*.
   - Le message *Success. No rows returned* confirme.

3. **Régler l'authentification** (menu *Authentication*)
   - *URL Configuration* :
     - **Site URL** : `https://maqi25.github.io/TSSR-COURS/`
     - **Redirect URLs** : ajouter `https://maqi25.github.io/TSSR-COURS/**` et `http://127.0.0.1:8000/**`
   - *Sign In / Providers* → *Email* : laisser activé. **Confirm email** :
     - activé (conseillé) : un lien de confirmation est envoyé à la création du compte ;
     - désactivé : le compte est utilisable tout de suite.

4. **Brancher le site**
   - *Project Settings* → *API* (ou *Data API* / *API Keys*) : copier la **Project URL** et la clé **anon / public** (ou *publishable*).
   - Les coller dans [`docs/javascripts/compte-config.js`](../docs/javascripts/compte-config.js), puis `git add`, `git commit`, `git push`.
   - ⚠️ Ne jamais copier la clé **service_role** / **secret** : elle donne tous les droits.

5. **Créer son compte** sur le site (bouton 👤 en haut), puis, si le site est seulement pour soi :
   *Authentication* → *Sign In / Providers* → décocher **Allow new users to sign up**. Personne d'autre ne pourra créer de compte.

## Sécurité, en bref

- La clé *anon* est **publique par conception** : elle est visible dans le code du site, et c'est normal.
- Ce qui protège les données, ce sont les **règles RLS** de `schema.sql` : un utilisateur connecté ne peut lire et écrire **que ses propres lignes** ; un visiteur non connecté n'a accès à rien.
- Les mots de passe sont gérés par Supabase (jamais stockés dans la table ni sur le site).
- Sur un ordinateur partagé : se déconnecter en cochant « Effacer mes données de ce navigateur ».

## Désactiver les comptes

Vider les deux valeurs de `compte-config.js` : le bouton 👤 disparaît et le site garde les données dans le navigateur, comme avant.
