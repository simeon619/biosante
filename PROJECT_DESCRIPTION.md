# Description du Projet - BIO SANTÉ Store

Ce projet est une application web e-commerce moderne dédiée à la vente de compléments alimentaires naturels, spécifiquement les gammes **BioActif** et **VitaMax**. Elle est conçue pour offrir une expérience utilisateur fluide, rassurante et engageante.

## 🎯 Objectif
Permettre aux utilisateurs de découvrir, s'informer et commander facilement des produits de santé naturelle, tout en offrant un support client interactif via un assistant IA et des canaux directs (WhatsApp).

## ✨ Fonctionnalités Principales

### 🛍️ Catalogue Produits
- **Présentation immersive** : Pages produits riches avec images, descriptions détaillées, bienfaits et prix.
- **Gestion du panier** : Ajout, modification et suppression de produits. Le panier est sauvegardé localement (LocalStorage).
- **Gammes Spécialisées** :
    - *BioActif* : Pour l'hypertension et le diabète.
    - *VitaMax* : Pour la santé masculine et la prostate.

### 🎧 Témoignages Audio
- Lecteur audio intégré pour écouter les retours d'expérience authentiques des clients.
- Interface visuelle avec ondes sonores animées lors de la lecture.

### 🤖 Assistant IA (AIChat)
- Chatbot intelligent intégré (basé sur Google Gemini).
- Répond aux questions des utilisateurs sur les produits et la santé.
- Accessible via une interface de chat flottante.

### 📞 Contact & Support
- Boutons d'action rapide pour contacter le support via **WhatsApp** ou appel téléphonique.
- Formulaire de contact intégré.

### 💳 Processus de Commande
- Tunnel de commande simplifié (Checkout Modal) pour finaliser les achats rapidement.

## 🛠️ Architecture Technique

Le projet est construit avec une stack moderne axée sur la performance et l'expérience développeur.

- **Framework Frontend** : [React 19](https://react.dev/)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Build Tool** : [Vite](https://vitejs.dev/)
- **Styles** : [Tailwind CSS](https://tailwindcss.com/) (Inferred)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Intelligence Artificielle** : SDK Google AI (`@google/genai`)

## 📂 Structure du Projet

- **`App.tsx`** : Composant racine gérant le routing (vues Home, Products, About, Contact) et l'état global (panier).
- **`components/`** : Composants réutilisables (Header, Footer, ProductCard, CartDrawer, AIChat, CheckoutModal, etc.).
- **`data/`** : Données statiques de l'application (liste des produits `products.ts`).
- **`services/`** : Logique métier et appels API.
- **`types.ts`** : Définitions des types TypeScript (Interfaces Product, CartItem, etc.).

## 🚀 Installation et Démarrage

1. **Installation des dépendances** :
   ```bash
   npm install
   ```

2. **Configuration** :
   Assurez-vous d'avoir une clé API Gemini dans le fichier `.env.local` :
   ```env
   GEMINI_API_KEY=votre_cle_api
   ```

3. **Lancement en développement** :
   ```bash
   npm run dev
   ```

4. **Construction pour la production** :
   ```bash
   npm run build
   ```
