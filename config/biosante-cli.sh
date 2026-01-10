#!/bin/bash

set -euo pipefail

APP_NAME="biosante_cli"
APP_VERSION="0.1.0"

BIOSANTE_BASE_PATH="/srv/biosante"
BIOSANTE_GIT_BASE_PATH="${BIOSANTE_BASE_PATH}/git"
BIOSANTE_SRC_BASE_PATH="${BIOSANTE_BASE_PATH}/src"
BIOSANTE_ENV_BASE_PATH="${BIOSANTE_BASE_PATH}/env"
BIOSANTE_VOLUMES_BASE_PATH="${BIOSANTE_BASE_PATH}/volumes"

SUBLYMUS_GLOBAL_ENV="/srv/sublymus/.env"
SUBLYMUS_NETWORK="sublymus_net"

# Services
SERVICE_API="biosante_api"
SERVICE_FRONTEND="biosante_frontend"
SERVICE_CRDB="biosante_crdb"
SERVICE_GARAGE="biosante_garage"
SERVICE_HTTPSMS_API="biosante_httpsms_api"
SERVICE_HTTPSMS_WEB="biosante_httpsms_web"

# Images
IMAGE_API="biosante/api"
IMAGE_FRONTEND="biosante/frontend"
IMAGE_HTTPSMS_API="biosante/httpsms-api"
IMAGE_HTTPSMS_WEB="biosante/httpsms-web"

DEPLOY_USER="root"

COLOR_INFO='\033[0;32m'
COLOR_WARN='\033[0;33m'
COLOR_ERROR='\033[0;31m'
COLOR_RESET='\033[0m'

log_info()  { printf "${COLOR_INFO}[INFO]${COLOR_RESET} %s\n" "$*"; }
log_warn()  { printf "${COLOR_WARN}[WARN]${COLOR_RESET} %s\n" "$*"; }
log_error() { printf "${COLOR_ERROR}[ERROR]${COLOR_RESET} %s\n" "$*"; }

run_command() {
  local cmd="$1"
  local msg="${2:-Commande échouée}"
  log_info "→ $cmd"
  bash -c "$cmd"
  local status=$?
  if [[ $status -ne 0 ]]; then
    log_error "${msg} (code ${status})"
    exit $status
  fi
}

determine_docker_cmd() {
  if groups "${USER}" 2>/dev/null | grep -q '\bdocker\b'; then
    DOCKER_CMD="docker"
  else
    DOCKER_CMD="sudo docker"
  fi
}

ensure_directories() {
  local dirs=(
    "$BIOSANTE_BASE_PATH"
    "$BIOSANTE_GIT_BASE_PATH"
    "$BIOSANTE_SRC_BASE_PATH"
    "$BIOSANTE_ENV_BASE_PATH"
    "$BIOSANTE_VOLUMES_BASE_PATH"
    "${BIOSANTE_VOLUMES_BASE_PATH}/crdb_data"
    "${BIOSANTE_VOLUMES_BASE_PATH}/garage_data"
    "${BIOSANTE_VOLUMES_BASE_PATH}/garage_meta"
  )
  for dir in "${dirs[@]}"; do
    if [[ ! -d "$dir" ]]; then
      run_command "sudo mkdir -p \"$dir\""
    fi
  done
  run_command "sudo chown -R ${DEPLOY_USER} ${BIOSANTE_BASE_PATH}"
}

setup_git_repo() {
  local service_name="$1"
  local repo_path="$2"
  local checkout_dir="$3"
  local image_name="$4"
  local lock_file="/var/lock/${service_name}_hook.lock"

  if [[ ! -d "$repo_path" ]]; then
    run_command "sudo mkdir -p \"$repo_path\""
    run_command "sudo git init --bare \"$repo_path\""
  fi

  local hook_path="${repo_path}/hooks/post-receive"
  cat <<EOF | sudo tee "$hook_path" >/dev/null
#!/bin/bash
set -euo pipefail
SERVICE_NAME="${service_name}"
PROJECT_DIR="${checkout_dir}"
IMAGE_NAME="${image_name}"
LOCK_FILE="${lock_file}"

DOCKER_CMD="docker"

mkdir -p "\${PROJECT_DIR}"

while read -r oldrev newrev refname; do
  if [[ "\$refname" == "refs/heads/main" ]]; then
    (
      flock -n 200 || exit 0
      echo ">> Déploiement \${SERVICE_NAME} (commit \${newrev:0:7})"
      git --work-tree="\${PROJECT_DIR}" --git-dir="\${PWD}" checkout -f "\$newrev"
      cd "\${PROJECT_DIR}"
      
      # Si c'est le frontend, on a besoin de passer l'API URL au build
      BUILD_ARGS=""
      if [[ "\${SERVICE_NAME}" == "${SERVICE_FRONTEND}" ]]; then
        BUILD_ARGS="--build-arg NEXT_PUBLIC_API_URL=https://api-biosante.sublymus.com"
      elif [[ "\${SERVICE_NAME}" == "biosante_httpsms_web" ]]; then
        ENV_BUILD_FILE="/srv/biosante/env/httpsms-web.build.env"
        if [[ -f "\${ENV_BUILD_FILE}" ]]; then
          echo ">> Chargement des build-args depuis \${ENV_BUILD_FILE}"
          while IFS='=' read -r key value || [[ -n "\$key" ]]; do
            if [[ ! "\$key" =~ ^# && -n "\$key" ]]; then
              BUILD_ARGS="\${BUILD_ARGS} --build-arg \${key}=\${value}"
            fi
          done < "\${ENV_BUILD_FILE}"
        else
          echo ">> WARN: Fichier de build \${ENV_BUILD_FILE} manquant"
        fi
      fi

      IMAGE_TAG="$(date +%Y%m%d%H%M%S)"
      \${DOCKER_CMD} build \${BUILD_ARGS} -t "\${IMAGE_NAME}:\${IMAGE_TAG}" .
      \${DOCKER_CMD} tag "\${IMAGE_NAME}:\${IMAGE_TAG}" "\${IMAGE_NAME}:latest"
      echo ">> Build terminé: \${IMAGE_NAME}:latest"
    ) 200>"\${LOCK_FILE}"
  fi
done
EOF
  run_command "sudo chmod +x \"$hook_path\""
  log_info "Hook Git configuré pour ${service_name}"
}

handle_init() {
  ensure_directories
  log_info "Initialisation BioSante terminée."
}

handle_setup_git() {
  setup_git_repo "$SERVICE_API" "${BIOSANTE_GIT_BASE_PATH}/api.git" "${BIOSANTE_SRC_BASE_PATH}/api" "$IMAGE_API"
  setup_git_repo "$SERVICE_FRONTEND" "${BIOSANTE_GIT_BASE_PATH}/frontend.git" "${BIOSANTE_SRC_BASE_PATH}/frontend" "$IMAGE_FRONTEND"
  setup_git_repo "$SERVICE_HTTPSMS_API" "${BIOSANTE_GIT_BASE_PATH}/httpsms-api.git" "${BIOSANTE_SRC_BASE_PATH}/httpsms-api" "$IMAGE_HTTPSMS_API"
  setup_git_repo "$SERVICE_HTTPSMS_WEB" "${BIOSANTE_GIT_BASE_PATH}/httpsms-web.git" "${BIOSANTE_SRC_BASE_PATH}/httpsms-web" "$IMAGE_HTTPSMS_WEB"
}

handle_deploy_infra() {
  determine_docker_cmd
  cat <<EOF | sudo tee "${BIOSANTE_BASE_PATH}/docker-compose.infra.yml" >/dev/null
version: '3.8'
services:
  crdb:
    image: cockroachdb/cockroach:v23.1.10
    command: start-single-node --insecure
    volumes:
      - ${BIOSANTE_VOLUMES_BASE_PATH}/crdb_data:/cockroach/cockroach-data
    networks:
      - ${SUBLYMUS_NETWORK}
    deploy:
      restart_policy:
        condition: on-failure

  garage:
    image: dxflrs/garage:v1.0.1
    volumes:
      - ${BIOSANTE_VOLUMES_BASE_PATH}/garage_data:/var/lib/garage/data
      - ${BIOSANTE_VOLUMES_BASE_PATH}/garage_meta:/var/lib/garage/meta
      - ${BIOSANTE_BASE_PATH}/garage.toml:/etc/garage.toml
    environment:
      - GARAGE_CONFIG_FILE=/etc/garage.toml
    networks:
      - ${SUBLYMUS_NETWORK}
    deploy:
      restart_policy:
        condition: on-failure

networks:
  ${SUBLYMUS_NETWORK}:
    external: true
EOF
  run_command "${DOCKER_CMD} stack deploy -c ${BIOSANTE_BASE_PATH}/docker-compose.infra.yml biosante_infra"
}

create_databases() {
  log_info "Création des bases de données..."
  # Trouver le conteneur en utilisant les labels Swarm
  local pg_container=$(docker ps --filter "label=com.docker.swarm.service.name=biosante_infra_crdb" --format "{{.Names}}" | head -n 1)
  
  if [[ -z "$pg_container" ]]; then
    # Fallback sur le nom simple au cas où
    pg_container=$(docker ps --filter "name=biosante_infra_crdb" --format "{{.Names}}" | head -n 1)
  fi

  if [[ -z "$pg_container" ]]; then
    log_warn "Conteneur CockroachDB introuvable. Vérification du service Swarm..."
    if ! docker service inspect biosante_infra_crdb >/dev/null 2>&1; then
      log_error "Service biosante_infra_crdb non trouvé."
      return 1
    fi
    log_warn "Le service existe mais le conteneur n'est pas encore actif. Réessayez dans 30s."
    return 1
  fi

  log_info "Initialisation de la DB sur $pg_container..."
  docker exec "$pg_container" ./cockroach sql --insecure --host=localhost -e "CREATE DATABASE IF NOT EXISTS defaultdb;"
  docker exec "$pg_container" ./cockroach sql --insecure --host=localhost -e "CREATE DATABASE IF NOT EXISTS httpsms;"
  log_info "Bases de données créées."
}

handle_deploy_apps() {
  determine_docker_cmd
  cat <<EOF | sudo tee "${BIOSANTE_BASE_PATH}/docker-compose.apps.yml" >/dev/null
version: '3.8'
services:
  api:
    image: ${IMAGE_API}:latest
    env_file:
      - ${BIOSANTE_ENV_BASE_PATH}/api.env
    networks:
      - ${SUBLYMUS_NETWORK}
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure

  frontend:
    image: ${IMAGE_FRONTEND}:latest
    networks:
      - ${SUBLYMUS_NETWORK}
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure

  httpsms-api:
    image: ${IMAGE_HTTPSMS_API}:latest
    env_file:
      - ${BIOSANTE_ENV_BASE_PATH}/httpsms.env
    networks:
      - ${SUBLYMUS_NETWORK}
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure

  httpsms-web:
    image: ${IMAGE_HTTPSMS_WEB}:latest
    environment:
      - NUXT_PUBLIC_HTTPSMS_API_URL=https://sms-biosante.sublymus.com/api
    networks:
      - ${SUBLYMUS_NETWORK}
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure

networks:
  ${SUBLYMUS_NETWORK}:
    external: true
EOF
  run_command "${DOCKER_CMD} stack deploy -c ${BIOSANTE_BASE_PATH}/docker-compose.apps.yml biosante_apps"
}

handle_create_db() {
  create_databases
}

show_help() {
  echo "Usage: biosante_cli [init|setup-git|deploy-infra|deploy-apps|create-db|help]"
}

main() {
  local cmd="${1:-help}"
  case "$cmd" in
    init) handle_init ;;
    setup-git) handle_setup_git ;;
    deploy-infra) handle_deploy_infra ;;
    deploy-apps) handle_deploy_apps ;;
    create-db) handle_create_db ;;
    help) show_help ;;
    *) log_error "Commande inconnue"; show_help; exit 1 ;;
  esac
}

main "$@"
