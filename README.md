# Maison Orange — Console de gestion de zone

Application web autonome (un seul fichier `public/index.html`) de gestion
d'une Maison Orange : responsable de zone, superviseurs, gérants, agents,
points de vente, traçabilité SIM, CA/TDR/TDA/LP, objectifs, rapports,
export Excel/PDF/JPEG.

Aucun serveur ni base de données externe n'est requis : les données sont
stockées directement dans le navigateur (`localStorage`), par appareil.

## Connexion de démonstration

| Rôle | Code | Mot de passe |
|---|---|---|
| Responsable de zone | `RZ-0001` | `orange2024` |

Créez ensuite superviseurs, gérants et agents depuis l'application.

> ⚠️ Chaque navigateur / appareil a son propre stockage local. Pour une
> utilisation en équipe (plusieurs personnes, plusieurs appareils), il faudra
> à terme relier l'application à une vraie base de données partagée (Firestore,
> par exemple) — voir la section « Aller plus loin ».

---

## 1. Déployer sur GitHub

```bash
git init
git add .
git commit -m "Première publication — Maison Orange"
git branch -M main
git remote add origin https://github.com/VOTRE-UTILISATEUR/VOTRE-DEPOT.git
git push -u origin main
```

(Facultatif) Pour héberger directement via **GitHub Pages** :
1. Sur GitHub → Settings → Pages
2. Source : branche `main`, dossier `/public`... ⚠️ GitHub Pages ne permet pas
   de choisir un sous-dossier autre que `/` ou `/docs`. Si vous voulez utiliser
   GitHub Pages plutôt que Firebase, renommez le dossier `public/` en `docs/`
   ou copiez `public/index.html` à la racine du dépôt.

---

## 2. Déployer sur Firebase Hosting

### Prérequis (une seule fois)
```bash
npm install -g firebase-tools
firebase login
```

### Configuration
1. Créez un projet sur https://console.firebase.google.com
2. Ouvrez `.firebaserc` dans ce dossier et remplacez
   `VOTRE-ID-PROJET-FIREBASE` par l'identifiant réel de votre projet Firebase
   (visible dans les paramètres du projet).

### Déploiement
```bash
firebase deploy
```

Firebase publiera le contenu du dossier `public/` (déjà configuré dans
`firebase.json`). Votre application sera disponible à une adresse du type :
`https://votre-projet.web.app`

### Redéployer après une modification
```bash
firebase deploy
```

---

## Structure du projet

```
.
├── public/
│   └── index.html      ← l'application complète (HTML + CSS + JS)
├── firebase.json        ← configuration Firebase Hosting
├── .firebaserc          ← identifiant du projet Firebase
├── .gitignore
└── README.md
```

---

## Aller plus loin : base de données partagée (optionnel)

Actuellement, les données (comptes, SIM, CA, PDV…) sont stockées dans le
`localStorage` du navigateur — donc **propres à chaque appareil**. Pour que
tous les utilisateurs (responsable de zone, superviseurs, gérants, agents)
partagent réellement les mêmes données en temps réel depuis différents
appareils, l'étape suivante consiste à remplacer le stockage local par
**Cloud Firestore** (déjà dans l'écosystème Firebase) :

1. Activez Firestore dans la console Firebase.
2. Ajoutez le SDK Firebase (`firebase-app`, `firebase-firestore`) au fichier
   `index.html`.
3. Remplacez les appels `window.storage.get/set` par des lectures/écritures
   Firestore (`getDoc`, `setDoc`, ou mieux, des écouteurs `onSnapshot` pour
   une synchronisation en temps réel entre utilisateurs).
4. Ajoutez des règles de sécurité Firestore adaptées aux rôles
   (responsable de zone / superviseur / gérant / agent).

Cette évolution n'est pas incluse dans cette version afin de garder
l'application déployable en un clic, sans configuration supplémentaire.
