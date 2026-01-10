#!/bin/sh
set -e

# Attendre que la base de données soit disponible s'il s'agit du premier démarrage
if [ -n "$DB_HOST" ]; then
  echo "Attente de la disponibilité de la base de données $DB_HOST..."
  until nc -z "$DB_HOST" "${DB_PORT:-26257}"; do
    echo "Base de données non disponible, pause de 1s..."
    sleep 1
  done
  echo "Base de données connectée !"
fi

# Exécuter les migrations en production
echo "Exécution des migrations..."
node ace migration:run --force

# Démarrer l'application
echo "Démarrage de l'application BioSante..."
exec "$@"
