# 🚀 Quick Start & Troubleshooting

## Démarrage rapide

### 1. Installation
```bash
cd "c:\Users\KAMI SAMA\Documents\GitHub\Gestion-des-Requ-tes"
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```

### 3. Accéder à l'app
```
http://localhost:5173
```

## 🧪 Tester le système

### Comptes disponibles

#### Super Admin
- **Matricule**: SUPER
- **Mot de passe**: N'importe lequel
- **Accès**: Tous les menus + gestion

#### Admin
- **Matricule**: PROF (ou PROF001, PROF002, etc.)
- **Mot de passe**: N'importe lequel
- **Accès**: Tableau de bord + gestion requêtes

#### Étudiant
- **Matricule**: Tout autre (ex: STU001)
- **Mot de passe**: N'importe lequel
- **Accès**: Dashboard + soumettre requêtes

### Flux de test proposé

1. **Test Étudiant**
   - Login avec STU001
   - Voir le dashboard
   - Créer une nouvelle requête
   - Voir les statistiques

2. **Test Admin**
   - Login avec PROF001
   - Voir toutes les requêtes
   - Consulter les détails
   - Voir options de gestion

3. **Test Authentification**
   - Logout
   - Vérifier redirection vers login

## 🐛 Troubleshooting

### Erreur: "Cannot find module '@angular/core'"
```bash
# Solution
npm install
```

### Erreur: "Port 5173 already in use"
```bash
# Solution: Utiliser un port différent
npm run dev -- --port 3000
```

### L'app compile mais ne s'affiche pas
```bash
# Solution: Ouvrir la console (F12) et vérifier les erreurs
# Redémarrer le serveur
npm run dev
```

### Perte de session après actualisation
**Comportement normal en mode démo** - Les données sont rechargées à chaque F5.  
En production avec JWT, les sessions persisteraient.

## 📁 Structure importante à connaître

### Fichiers clés

| Fichier | Rôle |
|---------|------|
| `src/core/services/auth.service.ts` | Authentification |
| `src/core/guards/auth.guard.ts` | Protection routes |
| `src/app.routes.ts` | Configuration routage |
| `index.tsx` | Bootstrap application |
| `src/app.component.ts` | Layout principal |

### Ajouter une nouvelle page

1. Créer composant dans `src/features/[feature]/components/`
2. Ajouter route dans `src/app.routes.ts`
3. Lier depuis un menu (app.component.ts)

### Ajouter un nouveau service

1. Créer dans `src/core/services/[mon].service.ts`
2. Ajouter `{ providedIn: 'root' }` au @Injectable
3. Utiliser avec `const service = inject(MonService)`

## 🔧 Modification du mock API

### Changer les données par défaut

```typescript
// src/core/services/auth.service.ts
private handleMockLogin(credentials: LoginDTO): void {
  // Modifier les utilisateurs ici
}

// src/core/services/request.service.ts
private requestsSignal = signal<Request[]>([
  // Modifier les requêtes ici
]);
```

## 📋 Commandes disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur

# Production
npm run build           # Compiler pour production
npm run preview         # Prévisualiser build prod

# Maintenance
npm list                # Voir les dépendances
npm audit              # Vérifier les vulnérabilités
npm update             # Mettre à jour dépendances
```

## 🎨 Personnalisation visuelle

### Changer les couleurs

**Fichier**: `index.html`
```html
<!-- Tailwind utilise des classes, pas de CSS custom nécessaire -->
<!-- Changer les couleurs: blue-600 → purple-600 -->
```

### Layout
Modifier dans `src/app.component.ts` template CSS

### Thème
Tailwind theme dans `tailwind.config.js` (si créé)

## 🔍 Debug mode

### Voir les logs dans la console

```typescript
// Les logs s'affichent automatiquement si enableLogging: true
// Voir dans: src/core/config/app.config.ts

// Ou en console:
const app = ng.probe(document.querySelector('app-root')).componentInstance
app.currentUser()  // Voir l'utilisateur courant
```

## ⚠️ Points d'attention

1. **Données** - Mock data reset après refresh (normal)
2. **Fichiers** - L'upload n'est pas implémenté (structure prête)
3. **API** - Remplacer les mocks http.post par des vrais appels
4. **JWT** - Ajouter le vrai token management
5. **Dates** - Vérifier les formats selon votre serveur

## 🚀 Déploiement

### Pour production
```bash
npm run build
# Fichiers dans dist/
# Deployer vers Vercel, Netlify, AWS, etc.
```

### Adapter la config
```typescript
// src/core/config/app.config.ts
apiUrl: 'https://api.production.com'  // Changer pour production
environment: 'production'
```

## 📞 Support & Questions

### Fichiers de référence

- **Architecture**: `ARCHITECTURE.md`
- **Refonte**: `REFONTE_GUIDE.md`
- **Résumé**: `REFONTE_RESUME.md`
- **Ce fichier**: `QUICK_START.md`

### Erreurs communes & solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| 401 Unauthorized | Token invalide | Reconnecter |
| 403 Forbidden | Rôle insuffisant | Utiliser compte correct |
| CORS error | API différente | Configurer API correctement |
| localStorage error | Mode privé | Utiliser sessionStorage |

---

**Bon développement!** 🚀  
Vous êtes prêt à utiliser et modifier ce projet enterprise-grade.
