#!/bin/bash

set -euo pipefail

APP_NAME="wave-cli"
APP_VERSION="0.2.0"

WAVE_BASE_PATH="${WAVE_BASE_PATH:-/srv/wave}"
WAVE_GIT_BASE_PATH="${WAVE_GIT_BASE_PATH:-${WAVE_BASE_PATH}/git}"
WAVE_SRC_BASE_PATH="${WAVE_SRC_BASE_PATH:-${WAVE_BASE_PATH}/src}"
WAVE_ENV_BASE_PATH="${WAVE_ENV_BASE_PATH:-${WAVE_BASE_PATH}/env}"
WAVE_ENV_API_FILE="${WAVE_ENV_BASE_PATH}/wave_api.env"
WAVE_ENV_DASH_FILE="${WAVE_ENV_BASE_PATH}/wave_dash.env"
WAVE_VOLUMES_BASE_PATH="${WAVE_VOLUMES_BASE_PATH:-${WAVE_BASE_PATH}/volumes}"
WAVE_GLOBAL_ENV_EXAMPLE="${WAVE_BASE_PATH}/.env.example"
SUBLYMUS_GLOBAL_ENV="/srv/sublymus/.env"
SUBLYMUS_NETWORK="${SUBLYMUS_NETWORK:-sublymus_net}"

WAVE_API_SERVICE_NAME="${WAVE_API_SERVICE_NAME:-wave_api}"
WAVE_API_WORKER_SERVICE_NAME="${WAVE_API_WORKER_SERVICE_NAME:-wave_api_worker}"
WAVE_DASH_SERVICE_NAME="${WAVE_DASH_SERVICE_NAME:-wave_dash}"
WAVE_API_IMAGE="${WAVE_API_IMAGE:-sublymus/wave_api}"
WAVE_DASH_IMAGE="${WAVE_DASH_IMAGE:-sublymus/wave-dash}"
WAVE_API_PORT="${WAVE_API_PORT:-3333}"
WAVE_DASH_PORT="${WAVE_DASH_PORT:-3000}"

DEPLOY_USER="${WAVE_DEPLOY_USER:-$(whoami)}"
DEPLOY_GROUP="$(id -gn "${DEPLOY_USER}" 2>/dev/null || echo "${DEPLOY_USER}")"

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

ask_confirmation() {
  local prompt="${1:-Continuer ?}"
  local default="${2:-n}"
  local options="[y/N]"
  if [[ "$default" == "y" ]]; then
    options="[Y/n]"
  fi
  local response=""
  if ! tty -s; then
    response="$default"
  else
    read -r -p "${prompt} ${options} " response
  fi
  response="$(echo "${response:-$default}" | tr '[:upper:]' '[:lower:]')"
  [[ "$response" == "y" || "$response" == "yes" ]]
}

determine_docker_cmd() {
  if [[ -n "${DOCKER_CMD:-}" ]]; then
    return
  fi
  if groups "${USER}" 2>/dev/null | grep -q '\bdocker\b' && [[ -S /var/run/docker.sock && -w /var/run/docker.sock ]]; then
    DOCKER_CMD="docker"
  else
    DOCKER_CMD="sudo docker"
  fi
}

load_sublymus_defaults() {
  if [[ -f "$SUBLYMUS_GLOBAL_ENV" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$SUBLYMUS_GLOBAL_ENV"
    set +a
  fi
}

ensure_directories() {
  local dirs=(
    "$WAVE_BASE_PATH"
    "$WAVE_GIT_BASE_PATH"
    "$WAVE_SRC_BASE_PATH"
    "$WAVE_ENV_BASE_PATH"
    "$WAVE_VOLUMES_BASE_PATH"
  )
  for dir in "${dirs[@]}"; do
    if [[ ! -d "$dir" ]]; then
      run_command "sudo mkdir -p \"$dir\"" "Impossible de créer ${dir}"
    fi
    run_command "sudo chown -R ${DEPLOY_USER}:${DEPLOY_GROUP} \"$dir\"" "Impossible de changer le propriétaire de ${dir}"
    run_command "sudo chmod -R ug+rwX \"$dir\"" "Impossible de changer les permissions de ${dir}"
  done
}

ensure_docker_prereqs() {
  if ! command -v docker >/dev/null 2>&1; then
    log_error "Docker est requis. Installez-le avant d'utiliser ${APP_NAME}."
    exit 1
  fi
  determine_docker_cmd
  if ! ${DOCKER_CMD} info >/dev/null 2>&1; then
    log_error "Impossible d'accéder au daemon Docker. Vérifiez vos permissions."
    exit 1
  fi
  if ! ${DOCKER_CMD} info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null | grep -q 'active'; then
    log_error "Docker Swarm doit être initialisé sur ce nœud."
    exit 1
  fi
  if ! ${DOCKER_CMD} network inspect "$SUBLYMUS_NETWORK" >/dev/null 2>&1; then
    log_error "Réseau ${SUBLYMUS_NETWORK} introuvable. Créez-le (docker network create --driver overlay --attachable ${SUBLYMUS_NETWORK})."
    exit 1
  fi
}

read_env_value() {
  local file="$1"
  local key="$2"
  if [[ -f "$file" ]]; then
    grep -E "^${key}=" "$file" | tail -n 1 | cut -d'=' -f2- | tr -d '"' || true
  fi
}

prompt_value() {
  local var_name="$1"
  local message="$2"
  local current_value="$3"
  local secret="${4:-false}"
  local display="${current_value:-vide}"
  if [[ "$secret" == "true" && -n "$current_value" ]]; then
    display="${current_value:0:3}***"
  fi
  local input=""
  read -r -p "${message} [${display}]: " input || true
  if [[ -z "$input" ]]; then
    input="$current_value"
  fi
  eval "$var_name=\"\$input\""
}

write_env_file() {
  local file="$1"
  local content="$2"
  echo "$content" | sudo tee "$file" >/dev/null
  run_command "sudo chmod 640 \"$file\"" "Impossible de définir les permissions de ${file}"
  run_command "sudo chown ${DEPLOY_USER}:${DEPLOY_GROUP} \"$file\"" "Impossible de définir le propriétaire de ${file}"
  log_info "Fichier ${file} mis à jour."
}

generate_api_env_example() {
  load_sublymus_defaults
  cat <<EOF | sudo tee "${WAVE_ENV_API_FILE}.example" >/dev/null
NODE_ENV=production
HOST=0.0.0.0
PORT=${WAVE_API_PORT}
APP_KEY=<générez-une-cle>
LOG_LEVEL=info

DB_HOST=${DB_HOST:-sublymus_infra_postgres}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER_INFRA:-wave_api}
DB_PASSWORD=<mot-de-passe-db>
DB_DATABASE=${DB_DATABASE_INFRA:-wave_api_db}

REDIS_HOST=${REDIS_HOST:-sublymus_infra_redis}
REDIS_PORT=${REDIS_PORT:-6379}
REDIS_PASSWORD=

WAVE_API_KEY=<api-key-wave>
WAVE_WEBHOOK_SECRET=<fourni-par-wave>
WAVE_CHECKOUT_SUCCESS_URL=https://wallet.sublymus.com/success
WAVE_CHECKOUT_ERROR_URL=https://wallet.sublymus.com/error
EOF
  log_info "Exemple ${WAVE_ENV_API_FILE}.example généré."
}

configure_api_env() {
  ensure_directories
  load_sublymus_defaults
  
  # Lire les valeurs existantes si le fichier existe déjà
  local current_app_key current_db_user current_db_password current_db_name current_api_key current_webhook_secret current_success_url current_error_url current_db_host current_db_port
  current_app_key="$(read_env_value "$WAVE_ENV_API_FILE" APP_KEY)"
  current_db_host="$(read_env_value "$WAVE_ENV_API_FILE" DB_HOST)"
  current_db_port="$(read_env_value "$WAVE_ENV_API_FILE" DB_PORT)"
  current_db_user="$(read_env_value "$WAVE_ENV_API_FILE" DB_USER)"
  current_db_password="$(read_env_value "$WAVE_ENV_API_FILE" DB_PASSWORD)"
  current_db_name="$(read_env_value "$WAVE_ENV_API_FILE" DB_DATABASE)"
  current_api_key="$(read_env_value "$WAVE_ENV_API_FILE" WAVE_API_KEY)"
  current_webhook_secret="$(read_env_value "$WAVE_ENV_API_FILE" WAVE_WEBHOOK_SECRET)"
  current_success_url="$(read_env_value "$WAVE_ENV_API_FILE" WAVE_CHECKOUT_SUCCESS_URL)"
  current_error_url="$(read_env_value "$WAVE_ENV_API_FILE" WAVE_CHECKOUT_ERROR_URL)"

  # Valeurs par défaut depuis sublymus .env ou valeurs existantes
  local app_key="${current_app_key:-$(openssl rand -hex 32)}"
  local db_host="${current_db_host:-sublymus_infra_postgres}"
  local db_port="${current_db_port:-5432}"
  local db_user="${current_db_user:-${DB_USER_INFRA:-wave_api}}"
  local db_password="${current_db_password:-${DB_PASSWORD_INFRA:-}}"
  local db_database="${current_db_name:-wave_api_db}"
  local wave_api_key="${current_api_key:-}"
  local wave_webhook_secret="${current_webhook_secret:-}"
  local success_url="${current_success_url:-https://wallet.sublymus.com/success}"
  local error_url="${current_error_url:-https://wallet.sublymus.com/error}"

  local content
  content=$(cat <<EOF
NODE_ENV=production
HOST=0.0.0.0
PORT=${WAVE_API_PORT}
APP_KEY=${app_key}
LOG_LEVEL=info

DB_CONNECTION=pg
DB_HOST=${db_host}
DB_PORT=${db_port}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_DATABASE=${db_database}

REDIS_HOST=${REDIS_HOST:-sublymus_infra_redis}
REDIS_PORT=${REDIS_PORT:-6379}
REDIS_PASSWORD=${REDIS_PASSWORD:-}

WAVE_API_KEY=${wave_api_key}
WAVE_WEBHOOK_SECRET=${wave_webhook_secret}
WAVE_CHECKOUT_SUCCESS_URL=${success_url}
WAVE_CHECKOUT_ERROR_URL=${error_url}
EOF
)
  write_env_file "$WAVE_ENV_API_FILE" "$content"
  log_info "Fichier ${WAVE_ENV_API_FILE} généré. Modifiez-le pour ajuster les valeurs (notamment WAVE_API_KEY et WAVE_WEBHOOK_SECRET)."
}

generate_dash_env_example() {
  cat <<EOF | sudo tee "${WAVE_ENV_DASH_FILE}.example" >/dev/null
NODE_ENV=production
HOST=0.0.0.0
PORT=${WAVE_DASH_PORT}
VITE_API_URL=https://wallet.sublymus.com
EOF
  log_info "Exemple ${WAVE_ENV_DASH_FILE}.example généré."
}

configure_dash_env_interactive() {
  ensure_directories
  local current_port current_api_url
  current_port="$(read_env_value "$WAVE_ENV_DASH_FILE" PORT)"
  current_api_url="$(read_env_value "$WAVE_ENV_DASH_FILE" VITE_API_URL)"
  prompt_value DASH_PORT "PORT (wave-dash)" "${current_port:-${WAVE_DASH_PORT}}"
  prompt_value VITE_API_URL "VITE_API_URL (URL publique de wave_api)" "${current_api_url:-https://wallet.sublymus.com}"
  local content
  content=$(cat <<EOF
NODE_ENV=production
HOST=0.0.0.0
PORT=${DASH_PORT}
VITE_API_URL=${VITE_API_URL}
EOF
)
  write_env_file "$WAVE_ENV_DASH_FILE" "$content"
}

setup_git_repo() {
  local service_name="$1"
  local repo_path="$2"
  local checkout_dir="$3"
  local image_name="$4"
  local lock_file="/var/lock/${service_name}_hook.lock"

  if [[ ! -d "$repo_path" ]]; then
    run_command "sudo mkdir -p \"$repo_path\"" "Impossible de créer ${repo_path}"
    run_command "sudo git init --bare \"$repo_path\"" "Impossible d'initialiser ${repo_path}"
  fi
  run_command "sudo chown -R ${DEPLOY_USER}:${DEPLOY_GROUP} \"$repo_path\"" "Impossible de définir le propriétaire de ${repo_path}"
  run_command "sudo chmod -R 775 \"$repo_path\"" "Impossible de régler les permissions de ${repo_path}"

  run_command "sudo mkdir -p \"$checkout_dir\"" "Impossible de créer ${checkout_dir}"
  run_command "sudo chown -R ${DEPLOY_USER}:${DEPLOY_GROUP} \"$checkout_dir\"" "Impossible de définir le propriétaire de ${checkout_dir}"

  local hook_path="${repo_path}/hooks/post-receive"
  cat <<'EOF' | sudo tee "$hook_path" >/dev/null
#!/bin/bash
set -euo pipefail

SERVICE_NAME="__SERVICE_NAME__"
PROJECT_DIR="__PROJECT_DIR__"
IMAGE_NAME="__IMAGE_NAME__"
TARGET_BRANCH="${TARGET_BRANCH:-refs/heads/main}"
LOCK_FILE="__LOCK_FILE__"

determine_docker_cmd() {
  if groups "${USER}" 2>/dev/null | grep -q '\bdocker\b' && [[ -S /var/run/docker.sock && -w /var/run/docker.sock ]]; then
    echo "docker"
  else
    echo "sudo docker"
  fi
}

DOCKER_CMD="$(determine_docker_cmd)"

mkdir -p "${PROJECT_DIR}"

while read -r oldrev newrev refname; do
  if [[ "$refname" == "$TARGET_BRANCH" ]]; then
    (
      flock -n 200 || exit 0
      echo ">> Déploiement ${SERVICE_NAME} (commit ${newrev:0:7})"
      git --work-tree="${PROJECT_DIR}" --git-dir="${PWD}" checkout -f "$newrev"
      cd "${PROJECT_DIR}"
      IMAGE_TAG="$(date +%Y%m%d%H%M%S)"
      ${DOCKER_CMD} build -t "${IMAGE_NAME}:${IMAGE_TAG}" .
      ${DOCKER_CMD} tag "${IMAGE_NAME}:${IMAGE_TAG}" "${IMAGE_NAME}:latest"
      echo ">> Utiliser wave-cli deploy : pour la suite"
    ) 200>"${LOCK_FILE}"
  fi
done
EOF

  run_command "sudo sed -i \"s#__SERVICE_NAME__#${service_name}#g\" \"$hook_path\"" "Impossible de configurer le hook ${service_name}"
  run_command "sudo sed -i \"s#__PROJECT_DIR__#${checkout_dir//\//\\/}#g\" \"$hook_path\"" "Impossible de configurer PROJECT_DIR pour ${service_name}"
  run_command "sudo sed -i \"s#__IMAGE_NAME__#${image_name}#g\" \"$hook_path\"" "Impossible de configurer IMAGE_NAME pour ${service_name}"
  run_command "sudo sed -i \"s#__LOCK_FILE__#${lock_file//\//\\/}#g\" \"$hook_path\"" "Impossible de configurer LOCK_FILE pour ${service_name}"
  run_command "sudo chmod +x \"$hook_path\"" "Impossible de rendre le hook exécutable"
  log_info "Hook post-receive configuré pour ${service_name}."
}

clone_repo() {
  local name="$1"
  local url="$2"
  local target_dir="$3"
  local branch="${4:-main}"
  if [[ -z "$url" ]]; then
    log_error "URL du dépôt ${name} manquante."
    exit 1
  fi
  if [[ -d "$target_dir/.git" ]]; then
    log_warn "${target_dir} existe déjà. Pull du dernier code."
    run_command "sudo -u ${DEPLOY_USER} git -C \"$target_dir\" fetch origin" "Impossible de fetch ${name}"
    run_command "sudo -u ${DEPLOY_USER} git -C \"$target_dir\" checkout $branch" "Impossible de checkout ${name}"
    run_command "sudo -u ${DEPLOY_USER} git -C \"$target_dir\" pull origin $branch" "Impossible de mettre à jour ${name}"
  else
    run_command "sudo rm -rf \"$target_dir\"" "Impossible de nettoyer ${target_dir}"
    run_command "sudo -u ${DEPLOY_USER} git clone --branch \"$branch\" \"$url\" \"$target_dir\"" "Impossible de cloner ${name}"
  fi
  run_command "sudo chown -R ${DEPLOY_USER}:${DEPLOY_GROUP} \"$target_dir\"" "Impossible de définir le propriétaire de ${target_dir}"
}

deploy_service() {
  local service_name="$1"
  local image="$2"
  local env_file="$3"
  local internal_port="$4"
  local label="$5"
  local recreate="$6"

  ensure_docker_prereqs
  if [[ ! -f "$env_file" ]]; then
    log_error "Fichier ${env_file} introuvable. Lancez 'wave-cli config ...' avant le déploiement."
    exit 1
  fi

  if ${DOCKER_CMD} service inspect "$service_name" >/dev/null 2>&1; then
    if [[ "$recreate" == "true" ]]; then
      log_warn "Service ${service_name} existant. Suppression avant recréation..."
      ${DOCKER_CMD} service rm "$service_name"
      sleep 3
    else
      log_info "Service ${service_name} existant. Mise à jour de l'image uniquement."
      ${DOCKER_CMD} service update --force --image "${image}" "$service_name"
      return
    fi
  fi

  ${DOCKER_CMD} service create \
    --name "$service_name" \
    --with-registry-auth \
    --replicas 1 \
    --constraint 'node.role == manager' \
    --network "$SUBLYMUS_NETWORK" \
    --env-file "$env_file" \
    --restart-condition on-failure \
    --restart-delay 5s \
    --health-cmd "wget --quiet --spider http://0.0.0.0:${internal_port}/ || exit 1" \
    --health-interval 20s \
    --health-retries 3 \
    --health-start-period 20s \
    --label "managed-by=${APP_NAME}" \
    --label "wave-component=${label}" \
    "$image"
  log_info "Service ${service_name} déployé."
}

deploy_worker_service() {
  local service_name="$1"
  local image="$2"
  local env_file="$3"
  local recreate="$4"

  ensure_docker_prereqs
  if [[ ! -f "$env_file" ]]; then
    log_error "Fichier ${env_file} introuvable. Lancez 'wave-cli config ...' avant le déploiement."
    exit 1
  fi

  # Vérifier si le service existe
  if ${DOCKER_CMD} service inspect "$service_name" >/dev/null 2>&1; then
    if [[ "$recreate" == "true" ]]; then
      log_warn "Service ${service_name} existant. Suppression avant recréation..."
      ${DOCKER_CMD} service rm "$service_name"
      sleep 3
    else
      # Service existe : mettre à jour l'image (Docker Swarm gérera le redémarrage si nécessaire)
      log_info "Service ${service_name} existant. Mise à jour de l'image..."
      ${DOCKER_CMD} service update --force --image "${image}" "$service_name"
      return
    fi
  fi

  # Créer le service worker (pas de healthcheck car pas de port HTTP)
  log_info "Création du service worker ${service_name}..."
  ${DOCKER_CMD} service create \
    --name "$service_name" \
    --with-registry-auth \
    --replicas 1 \
    --constraint 'node.role == manager' \
    --network "$SUBLYMUS_NETWORK" \
    --env-file "$env_file" \
    --restart-condition on-failure \
    --restart-delay 5s \
    --label "managed-by=${APP_NAME}" \
    --label "wave-component=worker" \
    "$image" \
    node ace worker:start
  log_info "Service worker ${service_name} déployé."
}

create_wave_database() {
  load_sublymus_defaults
  ensure_docker_prereqs
  
  local db_name="wave_api_db"
  local db_user="${DB_USER_INFRA:-}"
  local db_password="${DB_PASSWORD_INFRA:-}"
  local db_host="sublymus_infra_postgres"
  
  if [[ -z "$db_user" || -z "$db_password" ]]; then
    log_error "Impossible de créer la base de données: DB_USER_INFRA ou DB_PASSWORD_INFRA manquants dans ${SUBLYMUS_GLOBAL_ENV}"
    return 1
  fi
  
  log_info "Création de la base de données ${db_name}..."
  
  # Vérifier si le service PostgreSQL existe
  if ! ${DOCKER_CMD} service inspect "$db_host" >/dev/null 2>&1; then
    log_error "Service PostgreSQL ${db_host} introuvable. Assurez-vous que la stack sublymus_infra est déployée."
    return 1
  fi
  
  # Trouver un conteneur PostgreSQL en cours d'exécution
  local pg_container
  pg_container=$(${DOCKER_CMD} ps --filter "name=${db_host}" --format "{{.Names}}" | head -n 1)
  
  if [[ -z "$pg_container" ]]; then
    # Essayer de trouver via le service Swarm (nom de la tâche)
    local pg_task_id
    pg_task_id=$(${DOCKER_CMD} service ps "$db_host" -f "desired-state=running" -f "current-state=running" --format "{{.ID}}" | head -n 1)
    if [[ -n "$pg_task_id" ]]; then
      # Le nom du conteneur dans Swarm est généralement: <service>.<task_id>
      pg_container="${db_host}.${pg_task_id}"
    else
      log_error "Aucun conteneur PostgreSQL en cours d'exécution trouvé."
      return 1
    fi
  fi
  
  # Vérifier si la base existe déjà
  local db_exists
  db_exists=$(${DOCKER_CMD} exec "$pg_container" psql -U "$db_user" -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "$db_name" && echo "yes" || echo "no")
  
  if [[ "$db_exists" == "yes" ]]; then
    log_info "La base de données ${db_name} existe déjà."
    return 0
  fi
  
  # Créer la base de données via docker exec
  if ${DOCKER_CMD} exec "$pg_container" psql -U "$db_user" -c "CREATE DATABASE ${db_name};" 2>/dev/null; then
    log_info "Base de données ${db_name} créée avec succès."
    return 0
  fi
  
  # Alternative: utiliser psql via docker run sur le réseau
  log_warn "Échec de la création via exec direct. Tentative alternative..."
  if ${DOCKER_CMD} run --rm --network "$SUBLYMUS_NETWORK" \
    -e PGPASSWORD="$db_password" \
    postgres:15-alpine \
    psql -h "$db_host" -U "$db_user" -d postgres -c "CREATE DATABASE ${db_name};" 2>/dev/null; then
    log_info "Base de données ${db_name} créée avec succès (méthode alternative)."
    return 0
  fi
  
  log_error "Impossible de créer la base de données ${db_name}."
  return 1
}

handle_init() {
  ensure_docker_prereqs
  ensure_directories
  load_sublymus_defaults
  
  # Générer les fichiers .env
  if [[ ! -f "$WAVE_ENV_API_FILE" ]]; then
    configure_api_env
  else
    log_info "Fichier ${WAVE_ENV_API_FILE} existe déjà."
  fi
  
  if [[ ! -f "${WAVE_ENV_DASH_FILE}.example" ]]; then
    generate_dash_env_example
  fi
  
  # Créer la base de données
  create_wave_database
  
  cat <<EOF | sudo tee "$WAVE_GLOBAL_ENV_EXAMPLE" >/dev/null
WAVE_BASE_PATH=${WAVE_BASE_PATH}
WAVE_GIT_BASE_PATH=${WAVE_GIT_BASE_PATH}
WAVE_SRC_BASE_PATH=${WAVE_SRC_BASE_PATH}
WAVE_ENV_BASE_PATH=${WAVE_ENV_BASE_PATH}
WAVE_VOLUMES_BASE_PATH=${WAVE_VOLUMES_BASE_PATH}
SUBLYMUS_NETWORK=${SUBLYMUS_NETWORK}
WAVE_API_DOMAIN=wallet.sublymus.com
WAVE_DASH_DOMAIN=wallet-dash.sublymus.com
EOF
  log_info "Structure initiale prête. Modifiez ${WAVE_ENV_API_FILE} pour ajuster les valeurs (WAVE_API_KEY, WAVE_WEBHOOK_SECRET, etc.)."
}

handle_config() {
  local target="$1"
  local flag="${2:-}"
  case "$target" in
    api-env)
      if [[ "$flag" == "--generate-example" ]]; then
        generate_api_env_example
      else
        configure_api_env
      fi
      ;;
    dash-env)
      if [[ "$flag" == "--generate-example" ]]; then
        generate_dash_env_example
      else
        configure_dash_env_interactive
      fi
      ;;
    *)
      log_error "Cible inconnue pour config: ${target}"
      exit 1
      ;;
  esac
}

handle_setup_git() {
  ensure_directories
  setup_git_repo "$WAVE_API_SERVICE_NAME" "${WAVE_GIT_BASE_PATH}/wave_api.git" "${WAVE_SRC_BASE_PATH}/wave_api" "$WAVE_API_IMAGE"
  setup_git_repo "$WAVE_DASH_SERVICE_NAME" "${WAVE_GIT_BASE_PATH}/wave_dash.git" "${WAVE_SRC_BASE_PATH}/wave-dash" "$WAVE_DASH_IMAGE"
  log_info "Dépôts git configurés. Ajoutez-les comme remotes : ${DEPLOY_USER}@<VPS>:${WAVE_GIT_BASE_PATH}/<repo>.git"
}

handle_clone_sources() {
  ensure_directories
  local api_url="${WAVE_API_REPO_URL:-}"
  local dash_url="${WAVE_DASH_REPO_URL:-}"
  local branch="main"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --api-url=*) api_url="${1#*=}" ;;
      --dash-url=*) dash_url="${1#*=}" ;;
      --branch=*) branch="${1#*=}" ;;
      *)
        log_error "Option inconnue: $1"
        exit 1
        ;;
    esac
    shift
  done
  if [[ -z "$api_url" || -z "$dash_url" ]]; then
    log_error "Fournissez --api-url et --dash-url ou définissez WAVE_API_REPO_URL/WAVE_DASH_REPO_URL."
    exit 1
  fi
  clone_repo "wave_api" "$api_url" "${WAVE_SRC_BASE_PATH}/wave_api" "$branch"
  clone_repo "wave-dash" "$dash_url" "${WAVE_SRC_BASE_PATH}/wave-dash" "$branch"
  log_info "Sources clonées."
}

handle_deploy() {
  local deploy_api=false
  local deploy_dash=false
  local recreate=true
  if [[ $# -eq 0 ]]; then
    deploy_api=true
    deploy_dash=true
  fi
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --api) deploy_api=true ;;
      --dash) deploy_dash=true ;;
      --all) deploy_api=true; deploy_dash=true ;;
      --no-recreate) recreate=false ;;
      *)
        log_error "Option inconnue: $1"
        exit 1
        ;;
    esac
    shift
  done
  if [[ "$deploy_api" == "true" ]]; then
    deploy_service "$WAVE_API_SERVICE_NAME" "${WAVE_API_IMAGE}:latest" "$WAVE_ENV_API_FILE" "$WAVE_API_PORT" "api" "$recreate"
    # Déployer automatiquement le worker avec l'API
    deploy_worker_service "$WAVE_API_WORKER_SERVICE_NAME" "${WAVE_API_IMAGE}:latest" "$WAVE_ENV_API_FILE" "$recreate"
  fi
  if [[ "$deploy_dash" == "true" ]]; then
    deploy_service "$WAVE_DASH_SERVICE_NAME" "${WAVE_DASH_IMAGE}:latest" "$WAVE_ENV_DASH_FILE" "$WAVE_DASH_PORT" "dash" "$recreate"
  fi
}

show_help() {
  cat <<EOF
${APP_NAME} v${APP_VERSION}

Commandes disponibles :
  init                         Prépare /srv/wave (répertoires, .env, crée la DB)
  config api-env [--generate-example]  Génère/modifie wave_api.env (non-interactif)
  config dash-env [--generate-example]
  setup-git                    Crée les dépôts bare + hooks post-receive
  clone-sources --api-url=... --dash-url=... [--branch=main]
  deploy [--api|--dash|--all] [--no-recreate]
  help                         Affiche cette aide

Notes:
- La gestion fine des services (logs, stop/start) se fait directement avec docker.
- Les DNS ne sont pas gérés ici (wallet.sublymus.com / wallet-dash.sublymus.com à configurer manuellement).
- Les images Docker sont construites automatiquement par les hooks post-receive lors d'un push.
EOF
}

main() {
  local cmd="${1:-help}"
shift || true
  case "$cmd" in
    init) handle_init "$@" ;;
    config) handle_config "${1:-}" "${2:-}" ;;
    setup-git) handle_setup_git ;;
    clone-sources) handle_clone_sources "$@" ;;
    deploy) handle_deploy "$@" ;;
    help|--help|-h|"") show_help ;;
    *)
      log_error "Commande inconnue: $cmd"
show_help
      exit 1
      ;;
  esac
}

main "$@"

