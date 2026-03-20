# UniGrade - Portail de Gestion des Requêtes Académiques

## 🎯 Vue d'ensemble

**UniGrade** est une application web professionnelle permettant de gérer les requêtes académiques des étudiants. Cette version représente une refonte complète suivant les meilleures pratiques enterprise avec 15 ans d'expérience fullstack.

## ✨ Améliorations principales

### 1. **Architecture en couches professionnelle**
```
src/
├── core/                    # Cœur de l'application
│   ├── models/             # Modèles et DTOs
│   ├── services/           # Services métier
│   ├── guards/             # Guards de route
│   ├── interceptors/       # HTTP interceptors
│   └── config/             # Configuration centralisée
├── features/               # Fonctionnalités métier
│   ├── auth/              # Authentification
│   ├── dashboard/         # Tableau de bord
│   └── requests/          # Gestion des requêtes
├── shared/                # Composants partagés
└── app.component.ts       # Composant racine
```

### 2. **Sécurité renforcée**
- ✅ **Guards de route**: Protection des pages par authentification
- ✅ **Role-based access control (RBAC)**: Gestion des permissions
- ✅ **HTTP Interceptors**: Ajout automatique des tokens d'auth
- ✅ **Error handling centralisé**: Gestion intelligente des erreurs 401/403

### 3. **Gestion de l'état moderne**
- ✅ **Angular Signals**: État réactif sans RxJS
- ✅ **Computed signals**: Dérivations automatiques
- ✅ **Read-only signals**: Encapsulation et immutabilité

### 4. **Lazy loading des routes**
- ✅ Code splitting automatique
- ✅ Chargement à la demande des modules
- ✅ Bundling optimisé

### 5. **Gestion d'erreurs globale**
- ✅ HTTP error interceptor
- ✅ Logging centralisé
- ✅ Messages d'erreur utilisateur
- ✅ Retry logic (prêt pour l'implémentation)

### 6. **Logging & Monitoring**
- ✅ Service de logging centralisé
- ✅ Niveaux de log (DEBUG, INFO, WARN, ERROR)
- ✅ Prêt pour l'intégration avec Sentry/DataDog

### 7. **Configuration centralisée**
- ✅ Injection de configuration
- ✅ Gestion d'environnements multiples
- ✅ Pas de configs dispersées dans le code

### 8. **Types TypeScript stricts**
- ✅ Modèles et DTOs séparés
- ✅ Interfaces pour la sérialisation API
- ✅ Énums pour les constantes

## 🚀 Getting Started

### Installation des dépendances
```bash
npm install
```

### Démarrage du serveur de développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (Vite par défaut)

## 📋 Données de test

### Comptes de test disponibles

| Matricule | Rôle      | Accès                    |
|-----------|-----------|--------------------------|
| SUPER     | Superadmin| Accès complet + admin    |
| PROF*     | Admin     | Gestion des requêtes     |
| *         | Étudiant  | Soumission requêtes      |

**Mot de passe**: Quelconque (mock implementation)

## 🏗️ Architecture détaillée

### Core Services

#### **AuthService**
- Gestion de l'authentification
- Stockage du token/utilisateur
- Vérification des rôles
- Signals read-only pour réactivité

```typescript
// Utilisation
const authService = inject(AuthService);
authService.login(credentials); // Signal mis à jour automatiquement
authService.isAuthenticated$;   // Signal observable
```

#### **RequestService**
- CRUD sur les requêtes
- Statistiques calculées
- Filtrage et recherche

```typescript
// Utilisation
const requestService = inject(RequestService);
requestService.createRequest(data);
requestService.getStats$(); // Computed signal
```

#### **ErrorHandlingService**
- Affichage des erreurs utilisateur
- Logging des erreurs
- Gestion des codes d'erreur spécifiques

#### **LoggerService**
- Logging centralisé
- Niveaux de sévérité
- Prêt pour services externes

### Guards de route

```typescript
// Protection basique
path: 'dashboard',
canActivate: [authGuard]

// Protection par rôle
path: 'admin',
canActivate: [roleGuardFactory(['admin', 'superadmin'])]

// Page publique uniquement si pas authentifié
path: 'auth/login',
canActivate: [publicGuard]
```

### HTTP Interceptors

1. **LoggingInterceptor**: Log de toutes les requêtes
2. **AuthInterceptor**: Injection du token Bearer
3. **ErrorInterceptor**: Gestion centralisée des erreurs HTTP

## 🔄 Flux d'authentification

```
1. Utilisateur se connecte (Login)
   ↓
2. AuthService valide les credentials
   ↓
3. Token stocké en localStorage
   ↓
4. Signal currentUser mis à jour
   ↓
5. AppComponent affiche le dashboard
   ↓
6. AuthInterceptor ajoute Bearer token aux requêtes
   ↓
7. Si 401 → ErrorInterceptor logout automatique
```

## 📊 Modèles de données

### User Model
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  role: 'student' | 'admin' | 'superadmin';
  createdAt: Date;
  lastLogin?: Date;
}
```

### Request Model
```typescript
interface Request {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  type: 'Erreur de saisie' | 'Absence de note' | 'Incohérence' | 'Autre';
  description: string;
  status: 'En attente' | 'Validée' | 'Rejetée' | 'Transmise';
  priority: 'low' | 'medium' | 'high';
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}
```

## 🛣️ Routage

### Routes principales
- `/auth/login` - Page de connexion (publique)
- `/auth/register` - Inscription (publique)
- `/dashboard` - Tableau de bord (protégé)
- `/requests` - Liste des requêtes (protégé)
- `/requests/new` - Créer requête (protégé, étudiants)
- `/requests/:id` - Détail requête (protégé)
- `/unauthorized` - Erreur 403

### Lazy Loading
Toutes les routes de features utilisent lazy loading pour une meilleure performance.

## 📝 Composants

### Layout & Shell
- **AppComponent** (layout principal avec sidebar)

### Features
- **LoginComponent** - Formulaire de connexion
- **RegisterComponent** - Formulaire d'inscription
- **DashboardComponent** - Tableau de bord avec stats
- **RequestFormComponent** - Création de requête
- **RequestListComponent** - Liste des requêtes
- **RequestDetailComponent** - Détail d'une requête
- **UnauthorizedComponent** - Page 403

## 🔧 Configuration

### Fichier de configuration
`src/core/config/app.config.ts`

```typescript
const config = {
  apiUrl: 'http://localhost:3000/api',
  environment: 'development',
  maxRetries: 3,
  timeout: 30000,
  enableLogging: true
};
```

## 📦 Dépendances principales

- **@angular/core@^21.1.0** - Framework
- **@angular/router@^21.1.1** - Routage
- **@angular/forms@^21.1.1** - Gestion des formulaires
- **@angular/common@^21.1.0** - HTTP et modules courants
- **rxjs@^7.8.2** - Réactivité
- **tailwindcss@latest** - Styling
- **typescript@~5.8.2** - Type checking

## 🎨 Styling

- **Tailwind CSS** pour le design system
- **Responsive design** (mobile-first)
- **Gradients et animations** professionnels
- **Dark mode compatible** (prêt pour implémentation)

## ✅ Best Practices implémentées

1. ✅ **SOLID Principles**
   - Single Responsibility
   - Dependency Injection
   - Interface Segregation

2. ✅ **DRY** (Don't Repeat Yourself)
   - Composants réutilisables
   - Services partagés
   - Config centralisée

3. ✅ **Type Safety**
   - TypeScript strict
   - Interfaces explicites
   - Enums pour les constantes

4. ✅ **Performance**
   - Lazy loading
   - Signals au lieu de Observables
   - Change Detection OnPush prêt

5. ✅ **Maintenabilité**
   - Arborescence logique
   - Naming conventions claires
   - Documentation en place

6. ✅ **Scalabilité**
   - Architecture extensible
   - Facile d'ajouter des features
   - Facile d'intégrer une vraie API

## 🚀 Prochaines étapes (roadmap)

### Court terme
- [ ] Intégration API réelle (remplacer les mocks)
- [ ] Authentification JWT
- [ ] Gestion des fichiers (attachments)
- [ ] Pagination
- [ ] Recherche et filtrage avancés

### Moyen terme
- [ ] Notifications en temps réel (WebSocket)
- [ ] Export PDF/Excel
- [ ] Graphiques d'analytics
- [ ] Tests unitaires et E2E
- [ ] CI/CD pipeline

### Long terme
- [ ] Historique des modifications
- [ ] Workflow customizable
- [ ] Intégration SSO
- [ ] Multi-tenancy
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

## 🐛 Debugging

### Activer le logging complet
```typescript
// src/core/config/app.config.ts
export const DEFAULT_APP_CONFIG: AppConfig = {
  // ...
  enableLogging: true
};
```

### Inspecter l'état des signals
```typescript
// Dans la console Chrome
ng.probe(document.querySelector('app-root')).componentInstance.authService.currentUser()
```

## 📚 Ressources supplémentaires

- [Angular 21 Documentation](https://angular.io)
- [Angular Signals](https://angular.io/guide/signals)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 👨‍💼 Support & Contribution

Ce projet a été refactorisé en suivant les standards enterprise avec 15 ans d'expérience de développement fullstack. Chaque décision d'architecture a été justifiée par la maintenabilité, scalabilité et performance.

---

**Version**: 2.0 (Refonte Enterprise)  
**Dernière mise à jour**: Mars 2026
