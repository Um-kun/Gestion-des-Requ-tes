# UniGrade 📚 - Portail de Gestion des Requêtes Académiques

Une application web professionnelle permettant aux étudiants de gérer leurs requêtes académiques, avec support complet de l'authentification, des rôles et des workflows d'approbation.

## ✨ Caractéristiques principales

- 🔐 **Authentification sécurisée** avec role-based access control (RBAC)
- 📊 **Tableau de bord** avec statistiques en temps réel
- 📝 **Gestion des requêtes** (création, suivi, modification du statut)
- 👥 **Rôles multiples** (Étudiant, Admin, Super Admin)
- 🎨 **Interface moderne** avec Tailwind CSS
- 📱 **Responsive design** (mobile, tablet, desktop)
- ⚡ **Architecture scalable** et maintenable
- 🚀 **Lazy loading** des routes pour performance optimale
- 🛡️ **Gestion d'erreurs centralisée** et logging
- 💾 **Signals Angular** pour réactivité optimale

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Démarrage
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📋 Comptes de test

| Matricule | Rôle      | Note           |
|-----------|-----------|---|
| SUPER     | Superadmin| Accès complet |
| PROF001   | Admin     | Gestion requêtes |
| Autre     | Étudiant  | Soumission requêtes |

**Mot de passe**: N'importe lequel (mode démo)

## 🏗️ Architecture

La refonte v2.0 suit une **architecture en couches professionnelle**:

```
src/
├── core/                          # Cœur applicatif
│   ├── models/                   # Modèles TypeScript
│   ├── services/                 # Services métier
│   ├── guards/                   # Route guards
│   ├── interceptors/             # HTTP interceptors
│   └── config/                   # Configuration
├── features/                      # Modules métier
│   ├── auth/                     # Authentification
│   ├── dashboard/                # Tableau de bord
│   └── requests/                 # Gestion requêtes
├── shared/                        # Composants partagés
└── app.component.ts              # Layout principal
```

## 🔑 Améliorations principales (v2.0)

### Sécurité
- ✅ Guards de route (auth, public, role-based)
- ✅ HTTP Interceptors (tokens, erreurs)
- ✅ Validation des rôles au niveau de la route
- ✅ CSRF protection (prête)

### Scalabilité
- ✅ Lazy loading des routes
- ✅ Signals au lieu de Subjects
- ✅ Change detection OnPush optimisé
- ✅ Code splitting automatique

### Maintenabilité
- ✅ Architecture en couches
- ✅ Services séparés par responsabilité
- ✅ DTOs pour sérialisation API
- ✅ Configuration centralisée
- ✅ Logging centralisé

### Developer Experience
- ✅ TypeScript strict
- ✅ Interfaces explicites
- ✅ Enums pour constantes
- ✅ Documentation complète

## 📖 Documentation complète

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour:
- Architecture détaillée en couches
- Guide des services
- Patterns d'authentification
- Modèles de données
- Gestion d'erreurs
- Configuration
- Roadmap complète

## 🛠️ Technologie

- **Framework**: Angular 21.1
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS
- **Build**: Vite
- **State**: Angular Signals
- **HTTP**: @angular/common/http

## 📦 Dépendances principales

```json
{
  "@angular/core": "^21.1.0",
  "@angular/router": "^21.1.1",
  "@angular/forms": "^21.1.1",
  "@angular/common": "^21.1.0",
  "rxjs": "^7.8.2",
  "tailwindcss": "latest"
}
```

## 🎯 Utilisation

### Authentification
```typescript
const authService = inject(AuthService);
authService.login(credentials);
authService.isAuthenticated$; // Signal
authService.getCurrentUser();  // User
```

### Gestion des requêtes
```typescript
const requestService = inject(RequestService);
requestService.createRequest(data);
requestService.getStats$(); // Stats calculées
requestService.updateRequest(id, changes);
```

### Protection des routes
```typescript
// Route protégée par authentification
{ path: 'dashboard', canActivate: [authGuard] }

// Route protégée par rôle
{ path: 'admin', canActivate: [roleGuardFactory(['admin'])] }
```

## 🔄 Flux de travail

1. Utilisateur se connecte
2. Token stocké localement
3. AuthInterceptor ajoute token aux requêtes
4. Si 401 → Logout automatique
5. Erreurs gérées centralement
6. UI mise à jour via Signals

## 🧪 Testing

Tests unitaires et E2E en cours de mise en place. Infrastructure prête pour:
- Jest pour les tests unitaires
- Cypress pour E2E
- Coverage reports

## 💡 Prochaines étapes

- [ ] API backend réelle
- [ ] Authentification JWT
- [ ] Pagination/Filtrage avancé
- [ ] Notifications temps réel
- [ ] Tests complets
- [ ] CI/CD automatique

## 👨‍💼 Expérience

Cette refonte représente **15 ans d'expérience en développement fullstack**, appliquant:
- SOLID Principles
- Design Patterns
- Best Practices Enterprise
- Code Quality Standards
- Performance Optimization

## 📝 License

Propriétaire - Tous droits réservés

---

**Version**: 2.0  
**Dernière mise à jour**: Mars 2026  
**Auteur**: Lionel Yengue Um
