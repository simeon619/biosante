# 🚀 Guide de Déploiement : Tout Docker (Santé Vitalité Store)

Ce guide a été mis à jour pour une approche **"100% Docker"** afin de simplifier le déploiement. Plus besoin d'installer Node.js ou PM2 sur le serveur : tout est conteneurisé.

## 🏗️ Architecture "Full Docker"

Tout tourne dans des conteneurs isolés et orchestrés par `docker-compose.prod.yml` :
- `frontend` (Next.js)
- `api` (AdonisJS)
- `crdb` (CockroachDB)
- `redis` (Redis)
- `garage` (S3)
- `httpsms-*` (Services SMS)

---

## 📋 1. Prérequis Serveur

1.  **VPS** : Ubuntu 22.04+ (4GB+ RAM recommandé).
2.  **Outils** : Docker et Docker Compose uniquement.

### Installation Rapide
Connectez-vous au VPS et lancez :
```bash
# Mise à jour
sudo apt update && sudo apt upgrade -y

# Installer Docker
sudo apt install -y docker.io docker-compose git

# Activer Docker au démarrage
sudo systemctl enable --now docker
```

---

## 🚀 2. Déploiement

### 2.1 Cloner le projet
```bash
git clone https://github.com/votre-user/sante-vitalite-store.git /var/www/sante-vitalite
cd /var/www/sante-vitalite
```

### 2.2 Configuration (.env)
Vous devez créer les fichiers d'environnement pour que les conteneurs puissent communiquer.

**Backend (`api/.env`)**
```env
NODE_ENV=production
APP_KEY=votre_cle_secrete_generee
PORT=3333
HOST=0.0.0.0
# Base de données (Nom du service docker)
DB_HOST=sv-crdb
DB_USER=root
# ... autres configs
```

### 2.3 Lancement
Utilisez le fichier de production spécifique créé (`docker-compose.prod.yml`).

```bash
# Construire et lancer en arrière-plan
sudo docker-compose -f docker-compose.prod.yml up -d --build
```

Cela va :
1.  Compiler le Frontend Next.js (optimisé avec `standalone`).
2.  Compiler le Backend AdonisJS.
3.  Lancer tous les services interconnectés.

---

## 🌐 3. Configuration du Domaine (Reverse Proxy)

Bien que Docker gère les apps, vous avez besoin de Nginx sur l'hôte pour gérer le SSL et rediriger le trafic vers les ports Docker.

### Installer Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Configuration `/etc/nginx/sites-available/sante-vitalite`
```nginx
# Frontend (Port 3000)
server {
    server_name sante-vitalite.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Backend API (Port 3333)
server {
    server_name api.sante-vitalite.com;
    location / {
        proxy_pass http://localhost:3333;
        proxy_set_header Host $host;
    }
}
```

### Activer SSL
```bash
sudo ln -s /etc/nginx/sites-available/sante-vitalite /etc/nginx/sites-enabled/
sudo systemctl restart nginx
sudo certbot --nginx -d sante-vitalite.com -d api.sante-vitalite.com
```

---

## � 4. Mettre à jour le site

Quand vous faites des modifications, il suffit de :
1.  `git pull`
2.  `sudo docker-compose -f docker-compose.prod.yml up -d --build`

Docker va reconstruire uniquement ce qui a changé.

---

> [!TIP]
> **Logs** : Pour voir ce qui se passe, utilisez `docker-compose -f docker-compose.prod.yml logs -f`.
