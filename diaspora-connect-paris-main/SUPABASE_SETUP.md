# 🚀 Configuration Supabase - Diaspora Connect Paris

Ce guide vous explique comment configurer Supabase pour gérer les inscriptions de votre événement.

## 📋 Prérequis

- Un compte Supabase (gratuit) : https://supabase.com
- Node.js installé sur votre machine

---

## Étape 1 : Créer un projet Supabase

1. **Allez sur** https://supabase.com et connectez-vous (ou créez un compte gratuit)
2. **Cliquez sur** "New Project"
3. **Remplissez les informations** :
   - **Name** : `diaspora-connect-paris` (ou un nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (notez-le bien !)
   - **Region** : Choisissez la région la plus proche (Europe West pour la France)
   - **Pricing Plan** : Sélectionnez "Free" (gratuit, suffisant pour démarrer)
4. **Cliquez sur** "Create new project"
5. **Attendez 2-3 minutes** que le projet soit créé

---

## Étape 2 : Créer la table dans la base de données

1. Dans votre projet Supabase, **cliquez sur** l'icône **SQL Editor** dans la barre latérale gauche (icône `</>`)
2. **Cliquez sur** "+ New query"
3. **Ouvrez le fichier** `supabase-setup.sql` qui se trouve à la racine de ce projet
4. **Copiez tout le contenu** du fichier `supabase-setup.sql`
5. **Collez-le** dans l'éditeur SQL de Supabase
6. **Cliquez sur** le bouton "Run" (en bas à droite)
7. Vous devriez voir le message : **"Success. No rows returned"**

✅ Votre base de données est maintenant configurée !

---

## Étape 3 : Récupérer vos clés API

1. Dans votre projet Supabase, **cliquez sur** l'icône **Settings** (⚙️) dans la barre latérale
2. **Cliquez sur** "API" dans le sous-menu
3. Vous verrez deux informations importantes :

   **Project URL** :
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key** (une longue chaîne de caractères) :
   ```
   votre-cle-anonyme-supabase-ici   ```

4. **Gardez cet onglet ouvert**, vous allez en avoir besoin !votre-cle-anonyme-supabase-ici
---

## Étape 4 : Configurer votre application locale

1. **Dans le dossier de votre projet**, créez un fichier nommé `.env` (à la racine, au même niveau que `.env.example`)

2. **Ouvrez** `.env.example` pour voir le format

3. **Créez le fichier `.env`** et ajoutez-y vos clés :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme-supabase-ici```

⚠️ **Remplacez** les valeurs par celles de votre projet (étape 3)
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme-supabase-ici4. **Enregistrez** le fichier `.env`

---

## Étape 5 : Tester en local

1. **Ouvrez un terminal** dans le dossier du projet

2. **Installez les dépendances** (si ce n'est pas déjà fait) :
   ```bash
   npm install
   ```

3. **Lancez le serveur de développement** :
   ```bash
   npm run dev
   ```

4. **Ouvrez votre navigateur** à l'adresse indiquée (généralement http://localhost:5173)

5. **Testez le formulaire d'inscription** :
   - Remplissez tous les champs obligatoires
   - Cliquez sur "S'inscrire"
   - Vous devriez voir un message de succès

6. **Vérifiez dans Supabase** que l'inscription a bien été enregistrée :
   - Allez dans votre projet Supabase
   - Cliquez sur "Table Editor" dans la barre latérale
   - Cliquez sur la table "inscriptions"
   - Vous devriez voir votre inscription !

---

## 🎉 C'est terminé !

Votre application est maintenant connectée à Supabase et peut enregistrer les inscriptions.

---

## 📊 Consulter vos inscriptions

### Option 1 : Interface Supabase

1. Allez sur https://app.supabase.com
2. Ouvrez votre projet
3. Cliquez sur **"Table Editor"** dans la barre latérale
4. Cliquez sur la table **"inscriptions"**
5. Vous verrez toutes les inscriptions avec tous les détails

### Option 2 : Exporter en CSV

1. Dans le "Table Editor", cliquez sur le bouton **"Download"** (en haut à droite)
2. Sélectionnez **"CSV"**
3. Vous pouvez maintenant ouvrir ce fichier dans Excel, Google Sheets, etc.

---

## 🔒 Sécurité

### Row Level Security (RLS)

La base de données est configurée avec les règles de sécurité suivantes :

- ✅ **Tout le monde peut CRÉER** une inscription (public)
- ❌ **Seuls les utilisateurs authentifiés peuvent VOIR** les inscriptions
- ❌ **Seuls les utilisateurs authentifiés peuvent MODIFIER** les inscriptions

Cela signifie que les visiteurs peuvent s'inscrire, mais ne peuvent pas voir les inscriptions des autres.

### Variables d'environnement

⚠️ **IMPORTANT** : Le fichier `.env` contient vos clés secrètes et **NE DOIT JAMAIS** être partagé ou commité sur Git.

Le fichier `.gitignore` est déjà configuré pour ignorer le fichier `.env`.

---

## 🚀 Déploiement en production

### Sur Vercel, Netlify ou similaire

1. **Allez sur votre plateforme de déploiement** (Vercel, Netlify, etc.)
2. **Connectez votre dépôt GitHub**
3. **Ajoutez les variables d'environnement** dans les paramètres du projet :
   - `VITE_SUPABASE_URL` = votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = votre clé anonyme Supabase
4. **Déployez** !

---

## 🐛 Dépannage

### Erreur : "Missing Supabase environment variables"

➡️ Vérifiez que le fichier `.env` existe et contient les bonnes valeurs.

### Erreur : "Invalid API key"

➡️ Vérifiez que vous avez bien copié la clé **"anon/public"** et non la clé "service_role".

### L'inscription ne s'enregistre pas

1. **Ouvrez la console** du navigateur (F12)
2. **Vérifiez les erreurs** dans l'onglet "Console"
3. **Vérifiez** que les variables d'environnement sont bien chargées

### Impossible de voir les inscriptions dans Supabase

➡️ Vérifiez que vous avez bien exécuté le script SQL (Étape 2).

---

## 📞 Support

Si vous avez besoin d'aide :
- Documentation Supabase : https://supabase.com/docs
- Support Supabase : https://supabase.com/support

---

## 📝 Structure de la base de données

La table `inscriptions` contient les champs suivants :

### Champs obligatoires
- `full_name` : Nom complet
- `email` : Adresse email (unique)
- `phone_code` : Code téléphonique international
- `phone` : Numéro de téléphone
- `country` : Pays
- `city` : Ville

### Champs optionnels
- `needs_accommodation` : Besoin d'hébergement (oui/non)
- `start_date` : Date d'arrivée
- `end_date` : Date de départ
- `has_children` : Vient avec des enfants (oui/non)
- `number_of_children` : Nombre d'enfants
- `children_ages` : Âges des enfants
- `has_reduced_mobility` : Mobilité réduite (oui/non)
- `has_special_needs` : Besoins spéciaux (oui/non)
- `allergies` : Allergies et restrictions alimentaires
- `comments` : Commentaires additionnels

### Métadonnées automatiques
- `id` : Identifiant unique (UUID)
- `created_at` : Date de création
- `updated_at` : Date de dernière modification
- `status` : Statut (pending, confirmed, cancelled)

---

**Bon courage ! 🎉**
