# Validation de l'Implémentation Livraison

Ce document résume les actions effectuées et comment tester la nouvelle infrastructure.

## ✅ Ce qui a été fait

1.  **Installation de l'Infrastructure**
    -   Installation de Docker et Docker Compose.
    -   Démarrage de la stack `geo-services` (Nominatim, Valhalla, PostGIS, OSRM).
    -   Configuration du réseau local pour l'API.

2.  **Création du Backend AdonisJS**
    -   Initialisation du projet dans le dossier `api/`.
    -   Migration de base de données `deliveries` avec support spatial **PostGIS**.
    -   Création du `GeoService` pour dialoguer avec Nominatim/Valhalla.
    -   Implémentation du `DeliveriesController` avec calcul de frais dynamique.

## 🧪 Comment Tester

### 1. Vérifier que les conteneurs tournent
```bash
docker ps
```
Vous devriez voir `geo-services_nominatim_1`, `valhalla_1`, `postgres_1`, etc.

### 2. Démarrer le serveur API
Dans un nouveau terminal :
```bash
cd api
npm run dev
```

### 3. Tester l'Estimation de Frais
Ouvrez un autre terminal et lancez cette commande CURL pour simuler une demande client (Cocody, Abidjan) :

```bash
curl -X POST http://localhost:3333/api/deliveries/estimate \
-H "Content-Type: application/json" \
-d '{"address": "Cocody, Abidjan", "cartTotal": 10000}'
```

**Réponse attendue :**
```json
{
  "fee": 1500,
  "currency": "FCFA",
  "distanceKm": 4.2,
  "timeMinutes": 12,
  "destination": {
    "lat": 5.3xxxx,
    "lon": -4.0xxxx,
    "address": "Cocody, Abidjan, Côte d'Ivoire"
  }
}
```

### 4. Créer une Livraison (Simulation Checkout)
```bash
curl -X POST http://localhost:3333/api/deliveries/create \
-H "Content-Type: application/json" \
-d '{
  "orderId": "CMD-12345",
  "address": "Cocody, Abidjan",
  "lat": 5.35, "lon": -4.01,
  "fee": 1500,
  "customerName": "Jean Duval",
  "customerPhone": "+225 07070707"
}'
```

### 5. Tester le Frontend (React)
Assurez-vous que le serveur API tourne dans un terminal (`npm run dev` dans `api/`).
Dans un autre terminal :
```bash
npm run dev
```
1.  Ouvrez `http://localhost:5173`.
2.  Ajoutez un produit au panier.
3.  Dans le panier, saisissez un quartier (ex: "Plateau") et cliquez sur "Estimer".
4.  Vérifiez que les frais et la distance s'affichent.
5.  Cliquez sur "Passer la commande".
6.  Dans la modale de paiement, vérifiez que la carte est centrée sur le lieu estimé.
7.  Remplissez le formulaire et validez.

## ⚠️ Notes Importantes
-   **Premier Démarrage** : Nominatim peut prendre quelques minutes pour être prêt (import des données Côte d'Ivoire). Si vous avez des erreurs `socket hang up`, attendez un peu.
-   **Base de Données** : Les données sont persistées dans le volume Docker `geo-services_postgres_data`.
