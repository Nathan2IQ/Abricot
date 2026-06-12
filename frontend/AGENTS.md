<!-- BEGIN:nextjs-agent-rules -->

# Agent Rules - Abricot Project Management

## Priorité : Accessibilité Web (WCAG 2.1 niveau AA)

### Principes fondamentaux

Lors du développement de fonctionnalités ou de la révision de code, **l'accessibilité doit être une priorité absolue**. Chaque composant doit être utilisable par tous les utilisateurs, y compris ceux qui utilisent des technologies d'assistance.

### Directives d'accessibilité obligatoires

#### 1. Sémantique HTML

- Utiliser les balises HTML sémantiques appropriées (`<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`)
- Éviter les `<div>` et `<span>` pour les éléments interactifs
- Utiliser `<button>` pour les actions, `<a>` pour la navigation
- Structure de titres hiérarchique (`<h1>` → `<h2>` → `<h3>`) sans sauter de niveaux

#### 2. Navigation au clavier

- Tous les éléments interactifs doivent être accessibles au clavier (Tab, Shift+Tab, Enter, Space, Échap)
- Ordre de tabulation logique et visible
- Indicateurs de focus visibles et distincts (`:focus-visible`)
- Pas de piège au clavier (`focus trap` uniquement dans les modales)
- Implémenter les raccourcis clavier pour les actions fréquentes

#### 3. Labels et textes alternatifs

- Tous les `<input>`, `<textarea>`, `<select>` doivent avoir un `<label>` associé ou `aria-label`
- Images décoratives : `alt=""` ou `role="presentation"`
- Images informatives : `alt` descriptif et concis
- Icônes sans texte : `aria-label` obligatoire
- Boutons avec icônes uniquement : `aria-label` descriptif

#### 4. ARIA (Accessible Rich Internet Applications)

- **Règle d'or** : HTML natif avant ARIA
- Utiliser ARIA roles uniquement quand nécessaire (`role="dialog"`, `role="alert"`, `role="navigation"`)
- États dynamiques : `aria-expanded`, `aria-selected`, `aria-checked`, `aria-pressed`
- Relations : `aria-labelledby`, `aria-describedby`, `aria-controls`
- Contenu dynamique : `aria-live="polite"` ou `aria-live="assertive"`
- Cacher les éléments décoratifs : `aria-hidden="true"`

#### 5. Contraste des couleurs

- Texte normal : ratio minimum de 4.5:1
- Texte large (18pt+ ou gras 14pt+) : ratio minimum de 3:1
- Éléments d'interface (boutons, icônes) : ratio minimum de 3:1
- États de focus/hover avec contraste suffisant

#### 6. Contenu dynamique et formulaires

- Messages d'erreur annoncés par les lecteurs d'écran (`aria-live`, `role="alert"`)
- Validation en temps réel avec feedback accessible
- Champs requis identifiés visuellement et programmatiquement (`required`, `aria-required="true"`)
- Instructions de formulaire associées (`aria-describedby`)

#### 7. Modales et dialogues

- `role="dialog"` ou `role="alertdialog"`
- Focus trap : focus bloqué dans la modale
- Focus initial sur le premier élément interactif ou titre
- Fermeture par Échap
- `aria-labelledby` pointant vers le titre
- `aria-modal="true"`

#### 8. Responsive et zoom

- Supporter le zoom jusqu'à 200% sans perte de contenu
- Unités relatives (`rem`, `em`) plutôt qu'absolues (`px`) pour les textes
- Responsive design adapté aux différentes tailles d'écran

#### 9. Performance et chargement

- Indicateurs de chargement annoncés (`aria-live="polite"`, `aria-busy="true"`)
- Respecter `prefers-reduced-motion`

#### 10. Tableaux et listes

- Tableaux de données : `<thead>`, `<tbody>`, `<th scope="col|row">`
- Légende de tableau : `<caption>` ou `aria-labelledby`
- Listes : utiliser `<ul>`, `<ol>`, `<dl>` pour les contenus listés

### Tests d'accessibilité obligatoires

1. **Navigation clavier** : Tester toute l'interface uniquement au clavier
2. **Lecteur d'écran** : Tester avec NVDA (Windows) ou VoiceOver (Mac)
3. **Outils automatisés** : axe DevTools, Lighthouse (score minimum 90)
4. **Contraste** : Vérifier tous les textes et éléments interactifs
5. **Zoom** : Tester à 200% de zoom

### Checklist de révision

- [ ] Sémantique HTML correcte
- [ ] Navigation au clavier fonctionnelle
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Labels et textes alternatifs présents
- [ ] ARIA utilisé correctement
- [ ] Contraste des couleurs respecté
- [ ] Messages d'erreur accessibles
- [ ] Testé avec un lecteur d'écran
- [ ] Score Lighthouse accessibility ≥ 90

### Ressources

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Accessibility](https://react.dev/learn/accessibility)

---

**Note** : L'accessibilité est un droit fondamental, pas une fonctionnalité optionnelle.

# Agent Rules - Abricot Project Management

## Priorité : Accessibilité Web (WCAG 2.1 niveau AA)

### Principes fondamentaux

Lors du développement de fonctionnalités ou de la révision de code, **l'accessibilité doit être une priorité absolue**. Chaque composant doit être utilisable par tous les utilisateurs, y compris ceux qui utilisent des technologies d'assistance.

### Directives d'accessibilité obligatoires

#### 1. Sémantique HTML

- Utiliser les balises HTML sémantiques appropriées (`<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`)
- Éviter les `<div>` et `<span>` pour les éléments interactifs
- Utiliser `<button>` pour les actions, `<a>` pour la navigation
- Structure de titres hiérarchique (`<h1>` → `<h2>` → `<h3>`) sans sauter de niveaux

#### 2. Navigation au clavier

- Tous les éléments interactifs doivent être accessibles au clavier (Tab, Shift+Tab, Enter, Space, Échap)
- Ordre de tabulation logique et visible
- Indicateurs de focus visibles et distincts (`:focus-visible`)
- Pas de piège au clavier (`focus trap` uniquement dans les modales)
- Implémenter les raccourcis clavier pour les actions fréquentes

**Exemple de focus visible :**

```css
button:focus-visible,
a:focus-visible {
  outline: 3px solid var(--focus-color);
  outline-offset: 2px;
}
```
