# 🚀 Guide de Déploiement Backend sur Render

## Prérequis
- Compte Render : https://render.com
- Code poussé sur GitHub
- Frontend déployé sur Vercel

---

## 📋 Étapes de Déploiement

### 1. Créer une Base de Données PostgreSQL

1. Connectez-vous à [Render Dashboard](https://dashboard.render.com/)
2. Cliquez sur **"New +"** → **"PostgreSQL"**
3. Configurez :
   - **Name** : `abricot-db` (ou votre choix)
   - **Database** : `abricot` (nom de la base)
   - **User** : (généré automatiquement)
   - **Region** : Choisissez la région la plus proche (Europe/Frankfurt)
   - **Instance Type** : **Free** pour commencer
4. Cliquez sur **"Create Database"**
5. ⚠️ **IMPORTANT** : Copiez l'**Internal Database URL** (commence par `postgresql://...`)

---

### 2. Créer le Web Service Backend

1. Sur le Dashboard Render, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt GitHub
3. Sélectionnez le dépôt **Abricot**
4. Configurez :

#### 🔧 Configuration Générale
- **Name** : `abricot-backend`
- **Region** : Même région que la DB (Europe/Frankfurt)
- **Branch** : `main`
- **Root Directory** : `BackEnd` ⚠️ **TRÈS IMPORTANT**
- **Runtime** : `Node`
- **Build Command** : `npm install && npm run build`
- **Start Command** : `npm start`
- **Instance Type** : `Free`

#### 🔐 Variables d'Environnement

Ajoutez ces variables dans **Environment Variables** :

| Key | Value | Note |
|-----|-------|------|
| `DATABASE_URL` | `<Internal DB URL copiée>` | URL de votre base PostgreSQL |
| `JWT_SECRET` | `votre-secret-super-securise-min-32-chars` | Générez une chaîne aléatoire forte |
| `PORT` | `10000` | Port par défaut de Render |
| `NODE_ENV` | `production` | Environnement de production |
| `FRONTEND_URL` | `https://abricot-nine.vercel.app` | URL de votre frontend Vercel |

**💡 Pour générer un JWT_SECRET sécurisé** :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 3. Configurer CORS pour le Frontend

Vérifiez que votre backend accepte les requêtes depuis Vercel.

Le fichier `src/index.ts` doit avoir une configuration CORS comme :

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
```

---

### 4. Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va :
   - Installer les dépendances (`npm install`)
   - Générer Prisma Client (`prisma generate`)
   - Exécuter les migrations (`prisma migrate deploy`)
   - Compiler TypeScript (`tsc`)
   - Démarrer le serveur (`npm start`)

⏱️ Le premier déploiement prend 3-5 minutes.

---

## ✅ Vérification

### 1. Backend Live
Une fois déployé, vous aurez une URL type :
```
https://abricot-backend.onrender.com
```

### 2. Tester l'API
Accédez à la documentation Swagger :
```
https://abricot-backend.onrender.com/api-docs
```

### 3. Tester la santé
```bash
curl https://abricot-backend.onrender.com/health
```

---

## 🔗 Connecter Frontend et Backend

### Sur Vercel (Frontend)

Ajoutez la variable d'environnement :

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez :
   - **Key** : `NEXT_PUBLIC_API_URL`
   - **Value** : `https://abricot-backend.onrender.com`
   - **Environment** : Toutes (Production, Preview, Development)
3. **Redéployez** le frontend pour appliquer les changements

---

## 🌱 Seed de la Base de Données (Optionnel)

Pour peupler la base avec des données de test :

1. Dans le dashboard Render, allez dans votre service backend
2. Ouvrez l'onglet **"Shell"**
3. Exécutez :
```bash
npm run seed
```

---

## 📊 Monitoring & Logs

### Voir les logs
- Dashboard Render → Votre service → Onglet **"Logs"**

### Métriques
- Dashboard Render → Votre service → Onglet **"Metrics"**

### Redéployer manuellement
- Dashboard Render → Votre service → **"Manual Deploy"** → **"Clear build cache & deploy"**

---

## ⚠️ Limitations du Plan Gratuit

- **Instance se met en veille** après 15 minutes d'inactivité
- Premier démarrage après veille : ~30-60 secondes
- Base de données PostgreSQL gratuite : **1 Go de stockage** max
- **500 heures/mois** d'exécution

💡 **Pour éviter la mise en veille**, utilisez un service de ping (UptimeRobot, Cron-Job.org) toutes les 10-14 minutes.

---

## 🐛 Troubleshooting

### Erreur "Module not found"
- Vérifiez que **Root Directory** = `BackEnd`
- Vérifiez les dépendances dans `package.json`

### Erreur Prisma
- Vérifiez `DATABASE_URL` dans les variables d'environnement
- Assurez-vous que `schema.prisma` utilise `provider = "postgresql"`

### Erreur CORS
- Vérifiez `FRONTEND_URL` dans les variables d'environnement
- Vérifiez la configuration CORS dans `src/index.ts`

### Build échoue
- Regardez les logs détaillés dans l'onglet "Logs"
- Vérifiez que tous les fichiers TypeScript compilent localement

---

## 🔒 Sécurité Recommandée

✅ Utilisez des variables d'environnement pour TOUS les secrets  
✅ Activez HTTPS (automatique sur Render)  
✅ Utilisez un JWT_SECRET fort (minimum 32 caractères)  
✅ Limitez les origines CORS au frontend uniquement  
✅ Activez Helmet pour les headers de sécurité (déjà fait)  

---

## 📞 Support

- Documentation Render : https://render.com/docs
- Community Forum : https://community.render.com
- Status Page : https://status.render.com

---

**🎉 Votre backend est maintenant en production !**
