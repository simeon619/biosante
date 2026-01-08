#!/bin/bash

## MISE A JOUR LINUX
# sudo apt update
# sudo apt install -y util-linux

## S'ASSURER DE LA PRESENCE DE flock  
# which flock

## CREE LE CLI
# cd /srv/sublymus
# sudo nano ./scripts/sublymus-cli
# sudo rm -f ./scripts/sublymus-cli
# sudo nano ./scripts/sublymus-cli

# sublymus-cli - Outil de gestion de la plateforme Sublymus
# Version: 0.1.10 # Version incrémentée

# Arrêter le script en cas d'erreur non gérée
set -e

# --- Configuration Globale et Constantes ---
APP_NAME="Sublymus CLI"
APP_VERSION="0.1.8"

# Chemins et noms de service FIXES (non interactifs pour la définition des chemins eux-mêmes)
SUBLYMUS_BASE_PATH="/srv/sublymus"
SCRIPTS_DIR="${SUBLYMUS_BASE_PATH}/scripts"
ENV_GLOBAL_FILE="${SUBLYMUS_BASE_PATH}/.env"
ENV_S_SERVER_FILE="${SUBLYMUS_BASE_PATH}/env/s_server.env"
ENV_S_SERVER_DIR="${SUBLYMUS_BASE_PATH}/env"
GIT_BASE_PATH="${SUBLYMUS_BASE_PATH}/git"
SRC_BASE_PATH="${SUBLYMUS_BASE_PATH}/src"
VOLUMES_BASE_PATH="${SUBLYMUS_BASE_PATH}/volumes"
COMPOSE_INFRA_FILE="${SUBLYMUS_BASE_PATH}/docker-compose.infrastructure.yml"
COMPOSE_NGINX_FILE="${SUBLYMUS_BASE_PATH}/docker-compose.nginx.yml"
NGINX_BASE_CONF_FILE="${SUBLYMUS_BASE_PATH}/nginx_base.conf"

SUBLYMUS_NETWORK="sublymus_net"
DEPLOY_USER="root" #"$(whoami)"

# Les variables suivantes seront peuplées par load_config_or_set_defaults ou interactivement
# et peuvent être surchargées par le fichier .env global.
# Les valeurs après ":-" sont des défauts ultimes si rien n'est trouvé/défini.
DB_USER_INFRA="s_server_pg_admin"
DB_DATABASE_INFRA="s_server_main_db"
YOUR_MAIN_DOMAIN=sublymus.com
DB_PASSWORD_INFRA=
  

# Couleurs pour les logs (IDENTIQUE)
COLOR_RESET='\033[0m'
COLOR_INFO='\033[0;32m'    # Vert
COLOR_WARN='\033[0;33m'    # Jaune
COLOR_ERROR='\033[0;31m'   # Rouge
COLOR_CMD='\033[0;36m'     # Cyan
COLOR_SUCCESS='\033[1;32m' # Vert Gras
COLOR_TITLE='\033[1;35m'   # Magenta Gras

# --- Fonctions Utilitaires ---
log_info() { echo -e "${COLOR_INFO}[INFO] $1${COLOR_RESET}"; }
log_warn() { echo -e "${COLOR_WARN}[WARN] $1${COLOR_RESET}"; }
log_error() { echo -e "${COLOR_ERROR}[ERROR] $1${COLOR_RESET}"; }
log_success() { echo -e "${COLOR_SUCCESS}[SUCCESS] $1${COLOR_RESET}"; }
log_title() { echo -e "\n${COLOR_TITLE}===== $1 =====${COLOR_RESET}"; }
log_cmd() { echo -e "${COLOR_CMD}  \$ $1${COLOR_RESET}"; }

USER_CONFIRMED="n"
ask_confirmation() { # (IDENTIQUE)
    local message="$1"; local default_action="${2:-n}"; local prompt_options="[y/N]"; local response
    if [ "$default_action" == "y" ]; then prompt_options="[Y/n]"; fi
    if ! tty -s; then USER_CONFIRMED="$default_action"; return; fi
    while true; do
        read -r -p "${message} ${prompt_options} " response
        response_lower=$(echo "$response" | tr '[:upper:]' '[:lower:]')
        if [ -z "$response_lower" ]; then USER_CONFIRMED="$default_action"; break
        elif [ "$response_lower" == "y" ] || [ "$response_lower" == "yes" ]; then USER_CONFIRMED="y"; break
        elif [ "$response_lower" == "n" ] || [ "$response_lower" == "no" ]; then USER_CONFIRMED="n"; break
        else echo "Veuillez répondre par 'y' (oui) ou 'n' (non)."; fi
    done
}

run_command() { # (IDENTIQUE)
    local cmd_string="$1"; local error_message="$2"; log_cmd "$cmd_string"; eval "$cmd_string"
    local exit_code=$?; if [ $exit_code -ne 0 ]; then log_error "${error_message} (Code: $exit_code)"; exit $exit_code; fi
}
run_command_silent() { eval "$1" > /dev/null 2>&1; return $?; }

determine_docker_cmd() {
    DOCKER_CMD="sudo docker"
    if groups "${USER}" | grep -q '\bdocker\b' && [[ -S /var/run/docker.sock && -w /var/run/docker.sock ]]; then
        DOCKER_CMD="docker"
    fi
    export DOCKER_CMD
}

# Charge les variables depuis le fichier .env global.
# Les chemins comme SUBLYMUS_BASE_PATH sont fixes (définis en haut du script).
# Cette fonction peuple les variables Bash avec les valeurs du .env ou les défauts.
load_config_or_set_defaults() {
    if [ -f "$ENV_GLOBAL_FILE" ]; then
        log_info "Chargement de la configuration depuis ${ENV_GLOBAL_FILE}..."
        # Exporter pour que les sous-shells/commandes y aient accès si besoin
        # shellcheck source=/dev/null
        set -a && source "$ENV_GLOBAL_FILE" && set +a

        # Réinjecter les variables exportées dans les variables Bash locales
        for var in $(grep -v '^#' "$ENV_GLOBAL_FILE" | sed -E 's/=.*//' ); do
            eval "$var=\"\${$var}\""
        done
    else
        log_warn "Fichier de configuration global ${ENV_GLOBAL_FILE} non trouvé. Utilisation des valeurs par défaut pour certaines variables."
    fi

   
    # Déterminer DOCKER_CMD (sudo docker ou docker)
    determine_docker_cmd
    export DOCKER_CMD # Rendre accessible aux fonctions

echo "=== Vérification des variables chargées depuis .env ==="
echo "SUBLYMUS_BASE_PATH=${SUBLYMUS_BASE_PATH}"
echo "SUBLYMUS_ENV_BASE_PATH=${SUBLYMUS_ENV_BASE_PATH}"
echo "SUBLYMUS_GIT_BASE_PATH=${SUBLYMUS_GIT_BASE_PATH}"
echo "SUBLYMUS_SRC_BASE_PATH=${SUBLYMUS_SRC_BASE_PATH}"
echo "SUBLYMUS_VOLUMES_BASE_PATH=${SUBLYMUS_VOLUMES_BASE_PATH}"

echo "SUBLYMUS_NETWORK=${SUBLYMUS_NETWORK}"

echo "SUBLYMUS_POSTGRES_DATA_VOLUME=${SUBLYMUS_POSTGRES_DATA_VOLUME}"
echo "SUBLYMUS_REDIS_DATA_VOLUME=${SUBLYMUS_REDIS_DATA_VOLUME}"
echo "SUBLYMUS_S_API_VOLUME_SOURCE_BASE=${SUBLYMUS_S_API_VOLUME_SOURCE_BASE}"
echo "SUBLYMUS_S_SERVER_UPLOADS_VOLUME=${SUBLYMUS_S_SERVER_UPLOADS_VOLUME}"
echo "SUBLYMUS_S_SERVER_KEYS_VOLUME=${SUBLYMUS_S_SERVER_KEYS_VOLUME}"
echo "SUBLYMUS_NGINX_CONF_VOLUME_ON_HOST=${SUBLYMUS_NGINX_CONF_VOLUME_ON_HOST}"
echo "SUBLYMUS_NGINX_LOGS_VOLUME_ON_HOST=${SUBLYMUS_NGINX_LOGS_VOLUME_ON_HOST}"
echo "SUBLYMUS_SSL_CERTS_VOLUME_ON_HOST=${SUBLYMUS_SSL_CERTS_VOLUME_ON_HOST}"
echo "SUBLYMUS_NGINX_ACME_CHALLENGE_VOLUME_ON_HOST=${SUBLYMUS_NGINX_ACME_CHALLENGE_VOLUME_ON_HOST}"

echo "YOUR_MAIN_DOMAIN=${YOUR_MAIN_DOMAIN}"
echo "SUBLYMUS_DEPLOY_USER=${SUBLYMUS_DEPLOY_USER}"

echo "DB_USER_INFRA=${DB_USER_INFRA}"
echo "DB_PASSWORD_INFRA=${DB_PASSWORD_INFRA}"
echo "DB_DATABASE_INFRA=${DB_DATABASE_INFRA}"

echo "GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}"
echo "GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}"

echo "BREVO_API_KEY_S_SERVER=${BREVO_API_KEY_S_SERVER}"
echo "MAIL_FROM_ADDRESS_S_SERVER=${MAIL_FROM_ADDRESS_S_SERVER}"
echo "SMTP_HOST_S_SERVER=${SMTP_HOST_S_SERVER}"
echo "SMTP_PORT_S_SERVER=${SMTP_PORT_S_SERVER}"
echo "SMTP_USERNAME_S_SERVER=${SMTP_USERNAME_S_SERVER}"
echo "VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}"
echo "VAPID_PRIVATE_KEY=${VAPID_PRIVATE_KEY}"
echo "VAPID_SUBJECT=${VAPID_SUBJECT}"
echo "WAVE_API_KEY=${WAVE_API_KEY}"
echo "WAVE_MANAGER_ID=${WAVE_MANAGER_ID}"
echo "WAVE_API_PORT=${WAVE_API_PORT}"
echo "WAVE_PLATFORM_WALLET_ID=${WAVE_PLATFORM_WALLET_ID}"
}

# --- Fonctions Spécifiques au Mode 'init' ---

is_service_running() {
    local service_name="$1"
    local running_count

    running_count=$(docker service ps "$service_name" \
        --filter "desired-state=running" \
        --format '{{.CurrentState}}' | grep -c '^Running ')

    if [[ "$running_count" -ge 1 ]]; then
        return 0  # ✅ Service running
    else
        return 1  # ❌ Service not running
    fi
}


func_install_system_updates_docker() { # (IDENTIQUE À LA VERSION PRÉCÉDENTE)
    log_title "Installation des Mises à Jour Système et Docker"
    log_info "Mise à jour des paquets système..."
    run_command "sudo apt update -qq && sudo apt upgrade -y -qq" "Échec de la mise à jour système."
    run_command "sudo apt install -y git curl wget ca-certificates software-properties-common apt-transport-https" "Échec de l'installation des paquets de base."
    if ! command -v docker &> /dev/null; then
        log_info "Docker non trouvé. Installation de Docker..."
        run_command "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg" "Échec ajout clé GPG Docker."
        run_command "echo \"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null" "Échec ajout dépôt Docker."
        run_command "sudo apt update -qq" "Échec mise à jour après ajout dépôt Docker."
        run_command "sudo apt install -y docker-ce docker-ce-cli containerd.io" "Échec installation Docker CE."
        log_info "Ajout de l'utilisateur '${USER}' au groupe docker..."
        if sudo usermod -aG docker "${USER}"; then
            log_success "Utilisateur ${USER} ajouté au groupe docker."
            log_warn "Une DÉCONNEXION/RECONNEXION ou l'exécution de 'newgrp docker' est nécessaire pour que ce changement prenne effet."
        else log_warn "Échec de l'ajout de ${USER} au groupe docker."; fi
    else log_info "Docker est déjà installé."; fi
    log_success "Mises à jour système et Docker terminées."
}

func_initialize_docker_swarm() { # (IDENTIQUE À LA VERSION PRÉCÉDENTE)
    log_title "Initialisation de Docker Swarm et Réseau Overlay"
    local current_docker_cmd="$DOCKER_CMD" # Utiliser la variable globale DOCKER_CMD
    if ! $current_docker_cmd info --format '{{.Swarm.LocalNodeState}}' | grep -q "active"; then
        log_info "Docker Swarm n'est pas actif. Initialisation..."
        local advertise_ip; advertise_ip=$(hostname -I | awk '{print $1}')
        log_info "Tentative d'initialisation du Swarm avec l'IP d'annonce : ${advertise_ip}"
        run_command "$current_docker_cmd swarm init --advertise-addr \"${advertise_ip}\"" "Échec de l'initialisation de Docker Swarm."
        log_success "Docker Swarm initialisé. Ce nœud est manager."
    else
        if $current_docker_cmd info --format '{{.Swarm.ControlAvailable}}' | grep -q "true"; then
            log_info "Ce nœud est déjà un manager Docker Swarm."
        else
            ADVERTISE_IP=$(hostname -I | awk '{print $1}')
            echo "Tentative d'initialisation du Swarm avec l'IP d'annonce : ${ADVERTISE_IP}"
            sudo docker swarm init --advertise-addr "${ADVERTISE_IP}"
            #log_error "Ce nœud est un worker Swarm. Le mode 'init' doit s'exécuter sur un nœud manager ou un nœud non-Swarm."; exit 1;
        fi
    fi
    if ! $current_docker_cmd network inspect "$SUBLYMUS_NETWORK" > /dev/null 2>&1; then
        log_info "Réseau Docker Swarm '${SUBLYMUS_NETWORK}' non trouvé. Création..."
        run_command "$current_docker_cmd network create --driver overlay --attachable \"$SUBLYMUS_NETWORK\"" "Échec création réseau Swarm ${SUBLYMUS_NETWORK}."
        log_success "Réseau Swarm '${SUBLYMUS_NETWORK}' créé."
    else log_info "Réseau Swarm '${SUBLYMUS_NETWORK}' existant."; fi
    log_success "Configuration Docker Swarm et Réseau terminée."
}

func_create_persistent_volumes_dirs() { # (IDENTIQUE À LA VERSION PRÉCÉDENTE, utilise les constantes globales)
    log_title "Création des Répertoires pour Volumes Persistants"
    local postgres_data_vol="${VOLUMES_BASE_PATH}/postgres_data"
    local redis_data_vol="${VOLUMES_BASE_PATH}/redis_data"
    local s_server_uploads_vol="${VOLUMES_BASE_PATH}/s_server_uploads"
    local s_server_keys_vol="${VOLUMES_BASE_PATH}/s_server_keys"
    local api_store_volumes="${VOLUMES_BASE_PATH}/api_store_volumes"
    local nginx_conf_vol="${VOLUMES_BASE_PATH}/nginx_conf"
    local nginx_logs_vol="${VOLUMES_BASE_PATH}/nginx_logs"
    local ssl_certs_vol="${VOLUMES_BASE_PATH}/ssl_certs"
    local nginx_acme_challenge_vol="${VOLUMES_BASE_PATH}/nginx_acme_challenge"
    local paths_to_create_scripts=(
        "$SUBLYMUS_BASE_PATH" "$SCRIPTS_DIR" "$ENV_S_SERVER_DIR" "$GIT_BASE_PATH" "$SRC_BASE_PATH"
        "$VOLUMES_BASE_PATH" "$postgres_data_vol" "$redis_data_vol" "$s_server_uploads_vol" "$s_server_keys_vol"
        "$api_store_volumes" "${nginx_conf_vol}/sites-available" "${nginx_conf_vol}/sites-enabled"
        "$nginx_logs_vol" "$ssl_certs_vol" "$nginx_acme_challenge_vol" "${SUBLYMUS_BASE_PATH}/docker-compose" )
    for path_dir in "${paths_to_create_scripts[@]}"; do
        if [ ! -d "$path_dir" ]; then log_info "Création du répertoire: ${path_dir}"; run_command "sudo mkdir -p \"$path_dir\"" "Échec création ${path_dir}.";
        else log_info "Répertoire ${path_dir} existe déjà."; fi
    done
    log_success "Création des répertoires pour volumes terminée."
}

func_set_volumes_permissions() { # (IDENTIQUE À LA VERSION PRÉCÉDENTE)
    log_title "Application des Permissions sur les Volumes"
    local postgres_data_vol="${VOLUMES_BASE_PATH}/postgres_data"; local s_server_uploads_vol="${VOLUMES_BASE_PATH}/s_server_uploads"
    local s_server_keys_vol="${VOLUMES_BASE_PATH}/s_server_keys"; local api_store_volumes="${VOLUMES_BASE_PATH}/api_store_volumes"
    local nginx_conf_vol="${VOLUMES_BASE_PATH}/nginx_conf"; local nginx_logs_vol="${VOLUMES_BASE_PATH}/nginx_logs"
    local ssl_certs_vol="${VOLUMES_BASE_PATH}/ssl_certs"; local nginx_acme_challenge_vol="${VOLUMES_BASE_PATH}/nginx_acme_challenge"
    local pg_uid=70; local pg_gid=70; log_info "Permissions PostgreSQL (${postgres_data_vol}) -> ${pg_uid}:${pg_gid}"
    run_command "sudo chown -R ${pg_uid}:${pg_gid} \"${postgres_data_vol}\"" "Chown PG échoué."; run_command "sudo chmod -R 700 \"${postgres_data_vol}\"" "Chmod PG échoué."
    local s_server_proc_uid=1000; log_info "Permissions volumes s_server -> ${s_server_proc_uid}:${s_server_proc_uid}"
    run_command "sudo chown -R ${s_server_proc_uid}:${s_server_proc_uid} \"${s_server_uploads_vol}\"" "Chown s_uploads échoué."
    run_command "sudo chown -R ${s_server_proc_uid}:${s_server_proc_uid} \"${s_server_keys_vol}\"" "Chown s_keys échoué."
    run_command "sudo chown -R ${s_server_proc_uid}:${s_server_proc_uid} \"${api_store_volumes}\"" "Chown api_store_vols échoué."
    run_command "sudo chown -R ${s_server_proc_uid}:${s_server_proc_uid} \"${nginx_conf_vol}\"" "Chown nginx_conf échoué."
    run_command "sudo chmod -R ug+rwX \"${nginx_conf_vol}\"" "Chmod nginx_conf échoué."
    log_info "Permissions Nginx logs (${nginx_logs_vol})"; run_command "sudo chmod -R 777 \"${nginx_logs_vol}\"" "Chmod nginx_logs échoué."
    log_info "Permissions Certbot volumes (${ssl_certs_vol}, ${nginx_acme_challenge_vol})"
    run_command "sudo chown -R root:root \"${ssl_certs_vol}\"" "Chown ssl_certs échoué."; run_command "sudo chmod -R 755 \"${ssl_certs_vol}\"" "Chmod ssl_certs échoué."
    local nginx_proc_uid=101; run_command "sudo chown -R root:${nginx_proc_uid} \"${nginx_acme_challenge_vol}\"" "Chown acme échoué."
    run_command "sudo chmod -R 775 \"${nginx_acme_challenge_vol}\"" "Chmod acme échoué."
    log_success "Application des permissions sur les volumes terminée."
}

# Fonction pour demander une variable et la stocker, avec génération si secret et vide
# Usage: get_interactive_var VARIABLE_NAME "Prompt message" "valeur_actuelle" "est_secret (true/false)"
get_interactive_var() {
    local var_name_to_set="$1"
    local prompt_message="$2"
    local current_value="$3"
    local is_secret="${4:-false}" # Par défaut, pas un secret
    local input_value

    local display_current_value="non défini"
    if [ -n "$current_value" ]; then
        if [ "$is_secret" == "true" ]; then
            display_current_value="${current_value:0:3}***" # Affiche seulement les 3 premiers caractères pour les secrets
        else
            display_current_value="$current_value"
        fi
    fi
    
    read -r -p "${prompt_message} [actuel/défaut: ${display_current_value}]: " input_value

    if [ -z "$input_value" ]; then # L'utilisateur a appuyé sur Entrée
        if [ -n "$current_value" ]; then # Une valeur actuelle existait
            eval "$var_name_to_set=\"$current_value\"" # Garder la valeur actuelle
        elif [ "$is_secret" == "true" ]; then # Pas de valeur actuelle, c'est un secret, on génère
            eval "$var_name_to_set=\"\$(openssl rand -base64 18)\""
            log_info "Nouvelle valeur secrète générée pour ${var_name_to_set}."
        else
            # Pas de valeur actuelle, pas un secret, on laisse vide ou on pourrait mettre un défaut du script
            # Pour l'instant, on laisse tel quel, la variable Bash aura la valeur par défaut du script
            # ou sera vide si pas de défaut script.
            # eval "$var_name_to_set=\"\"" # Ou mettre un défaut spécifique ici
            log_info "Aucune nouvelle valeur entrée pour ${var_name_to_set}, utilise la valeur par défaut du script ou existante."
        fi
    else # L'utilisateur a entré une nouvelle valeur
        eval "$var_name_to_set=\"$input_value\""
    fi
}

func_generate_global_env_example_file() {
    log_title "Génération du Fichier Modèle .env.example Global (${ENV_GLOBAL_FILE}.example)"

    # Valeurs par défaut pour le template
    local default_main_domain="sublymus.com"
    local default_db_user="s_server_pg_admin"
    local default_db_name="s_server_main_db"
    local default_db_pass="StrongDBPasswordExample"     # Sera à changer

    # Générer le contenu du fichier .env.example
    local example_env_content
    example_env_content=$(cat <<EOF
# Fichier d'exemple pour la configuration globale de Sublymus (/srv/sublymus/.env)
# Copiez ce fichier en .env et personnalisez les valeurs.

# === Chemins de base sur l'hôte VPS (Normalement gérés par le script, ne pas modifier sauf si avancé) ===
SUBLYMUS_BASE_PATH=${SUBLYMUS_BASE_PATH}
SUBLYMUS_ENV_BASE_PATH=\${SUBLYMUS_BASE_PATH}/env
SUBLYMUS_GIT_BASE_PATH=\${SUBLYMUS_BASE_PATH}/git
SUBLYMUS_SRC_BASE_PATH=\${SUBLYMUS_BASE_PATH}/src
SUBLYMUS_VOLUMES_BASE_PATH=\${SUBLYMUS_BASE_PATH}/volumes

# === Réseau Docker Swarm ===
SUBLYMUS_NETWORK=${SUBLYMUS_NETWORK}

# === Volumes Docker (chemins sur l'hôte - gérés par le script) ===
SUBLYMUS_POSTGRES_DATA_VOLUME=\${SUBLYMUS_VOLUMES_BASE_PATH}/postgres_data
SUBLYMUS_REDIS_DATA_VOLUME=\${SUBLYMUS_VOLUMES_BASE_PATH}/redis_data
SUBLYMUS_S_API_VOLUME_SOURCE_BASE=\${SUBLYMUS_VOLUMES_BASE_PATH}/api_store_volumes
SUBLYMUS_S_SERVER_UPLOADS_VOLUME=\${SUBLYMUS_VOLUMES_BASE_PATH}/s_server_uploads
SUBLYMUS_S_SERVER_KEYS_VOLUME=\${SUBLYMUS_VOLUMES_BASE_PATH}/s_server_keys
SUBLYMUS_NGINX_CONF_VOLUME_ON_HOST=\${SUBLYMUS_VOLUMES_BASE_PATH}/nginx_conf
SUBLYMUS_NGINX_LOGS_VOLUME_ON_HOST=\${SUBLYMUS_VOLUMES_BASE_PATH}/nginx_logs
SUBLYMUS_SSL_CERTS_VOLUME_ON_HOST=\${SUBLYMUS_VOLUMES_BASE_PATH}/ssl_certs
SUBLYMUS_NGINX_ACME_CHALLENGE_VOLUME_ON_HOST=\${SUBLYMUS_VOLUMES_BASE_PATH}/nginx_acme_challenge

# === Configuration Utilisateur REQUISE ===
YOUR_MAIN_DOMAIN=${default_main_domain}

# PostgreSQL Infrastructure (pour la BDD principale de s_server)
DB_USER_INFRA=${default_db_user}
DB_PASSWORD_INFRA="${default_db_pass}"
DB_DATABASE_INFRA=${default_db_name}

# Google OAuth (REMPLISSEZ AVEC VOS CLÉS)
GOOGLE_CLIENT_ID=VOTRE_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=VOTRE_GOOGLE_CLIENT_SECRET

# Brevo / SMTP (REMPLISSEZ AVEC VOS INFORMATIONS)
BREVO_API_KEY_S_SERVER=
MAIL_FROM_ADDRESS_S_SERVER=contact@\${YOUR_MAIN_DOMAIN}
SMTP_HOST_S_SERVER=smtp-relay.brevo.com
SMTP_PORT_S_SERVER=587
SMTP_USERNAME_S_SERVER=
SMTP_PASSWORD_S_SERVER=

# Utilisateur pour les opérations de déploiement Git (normalement l'utilisateur courant)
SUBLYMUS_DEPLOY_USER=${DEPLOY_USER}

# Notification / Web-Push 
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=

WAVE_API_KEY=
WAVE_MANAGER_ID=
WAVE_API_PORT=3333
WAVE_PLATFORM_WALLET_ID=
EOF
) # Fin de example_env_content

    local example_file_path="${ENV_GLOBAL_FILE}.example"
    log_info "Écriture du fichier modèle ${example_file_path}..."
    if sudo printf '%s\n' "$example_env_content" > "$example_file_path"; then
        run_command "sudo chmod 644 \"$example_file_path\"" "Échec chmod ${example_file_path}"
        log_success "Fichier modèle ${example_file_path} généré avec succès."
        log_info "Veuillez copier ${example_file_path} vers ${ENV_GLOBAL_FILE} et le personnaliser."
    else
        log_error "Échec de l'écriture dans ${example_file_path}."
        return 1
    fi
}
func_configure_global_env_interactive() {
    log_title "Configuration Interactive du Fichier .env Global (${ENV_GLOBAL_FILE})"
    
    # Charger les valeurs existantes du fichier .env s'il existe pour les proposer
    # Les variables Bash globales (YOUR_MAIN_DOMAIN, DB_PASSWORD_INFRA etc.) ont déjà été
    # peuplées par load_config_or_set_defaults avec les valeurs du .env ou les défauts du script.

    # --- Demander les valeurs interactivenent ---
    log_info "Veuillez fournir/confirmer les informations suivantes."
    log_info "Laissez vide pour utiliser la valeur actuelle/par défaut ou générer un secret."

    get_interactive_var YOUR_MAIN_DOMAIN "Votre domaine principal (ex: sublymus.com)" "${YOUR_MAIN_DOMAIN}"
    if [ -z "$YOUR_MAIN_DOMAIN" ]; then log_error "Le domaine principal est requis."; exit 1; fi

    get_interactive_var DB_USER_INFRA "Utilisateur admin PostgreSQL pour l'infra" "${DB_USER_INFRA:-$DB_USER_INFRA_DEFAULT}"
    get_interactive_var DB_PASSWORD_INFRA "Mot de passe admin PostgreSQL (DB_PASSWORD_INFRA) 🔐" "${DB_PASSWORD_INFRA}" "true"
    get_interactive_var DB_DATABASE_INFRA "Nom de la BDD principale pour s_server" "${DB_DATABASE_INFRA:-$DB_DATABASE_INFRA_DEFAULT}"
   
    get_interactive_var GOOGLE_CLIENT_ID "Google Client ID" "${GOOGLE_CLIENT_ID}"
    get_interactive_var GOOGLE_CLIENT_SECRET "Google Client Secret  🔐" "${GOOGLE_CLIENT_SECRET}" "true"

    # Ajouter ici les demandes pour BREVO_API_KEY_S_SERVER, etc.
    # en utilisant get_interactive_var
    get_interactive_var BREVO_API_KEY_S_SERVER "Clé API Brevo (pour s_server)  🔐" "${BREVO_API_KEY_S_SERVER}" "true"
    # Pour SMTP, on peut demander les 4 d'un coup ou séparément
    get_interactive_var MAIL_FROM_ADDRESS_S_SERVER "Adresse email d'expédition par défaut" "${MAIL_FROM_ADDRESS_S_SERVER:-contact@${YOUR_MAIN_DOMAIN}}"
    get_interactive_var SMTP_HOST_S_SERVER "Hôte SMTP (ex: smtp-relay.brevo.com)" "${SMTP_HOST_S_SERVER}"
    SMTP_PORT_S_SERVER=587
    get_interactive_var SMTP_PORT_S_SERVER "Port SMTP (ex: 587)" "${SMTP_PORT_S_SERVER}"
    get_interactive_var SMTP_USERNAME_S_SERVER "Nom d'utilisateur SMTP" "${SMTP_USERNAME_S_SERVER}"
    get_interactive_var SMTP_PASSWORD_S_SERVER "Mot de passe SMTP 🔐" "${SMTP_PASSWORD_S_SERVER}" "true"

    # Wave API Configuration
    get_interactive_var WAVE_API_KEY "Wave API Key" "${WAVE_API_KEY}" "true"
    get_interactive_var WAVE_MANAGER_ID "Wave Manager ID" "${WAVE_MANAGER_ID}"
    get_interactive_var WAVE_API_URL "Wave API URL" "${WAVE_API_URL:-wave_api}"
    get_interactive_var WAVE_API_PORT "Wave API Port" "${WAVE_API_PORT:-3333}"
    get_interactive_var WAVE_PLATFORM_WALLET_ID "Wave Platform Wallet ID" "${WAVE_PLATFORM_WALLET_ID}"


    # --- Écrire dans le fichier .env global ---
    log_info "Mise à jour du fichier ${ENV_GLOBAL_FILE}..."
    # Utiliser sudo pour écrire si le fichier appartient à root ou nécessite des droits élevés
    # Ici, on suppose que l'utilisateur sublymus_admin a les droits sur /srv/sublymus/
    # Si ce script est lancé en root, pas besoin de sudo ici.
    # Si lancé en sublymus_admin et que sublymus_admin est propriétaire de /srv/sublymus, pas besoin.
    # Par sécurité, on peut l'ajouter si on n'est pas sûr.
    local writer_cmd=""
    if [ "$(id -u)" != "0" ] && ! [ -w "$ENV_GLOBAL_FILE" ] && [ -f "$ENV_GLOBAL_FILE" ]; then # Si non root ET pas droit écriture sur fichier existant
        writer_cmd="sudo "
    elif [ "$(id -u)" != "0" ] && ! [ -w "$(dirname "$ENV_GLOBAL_FILE")" ] && ! [ -f "$ENV_GLOBAL_FILE" ]; then # Si non root ET pas droit écriture sur dossier parent pour création
        writer_cmd="sudo "
    fi

    ${writer_cmd}bash -c "cat > \"$ENV_GLOBAL_FILE\" <<EOF
# Fichier de configuration global pour Sublymus - Généré par sublymus-cli
# Chemins (Gérés par le script, ne pas modifier manuellement sauf si vous savez ce que vous faites)
SUBLYMUS_BASE_PATH=${SUBLYMUS_BASE_PATH}
SUBLYMUS_ENV_BASE_PATH=\${SUBLYMUS_BASE_PATH}/env
SUBLYMUS_GIT_BASE_PATH=\${SUBLYMUS_BASE_PATH}/git
SUBLYMUS_SRC_BASE_PATH=\${SUBLYMUS_BASE_PATH}/src
SUBLYMUS_VOLUMES_BASE_PATH=\${SUBLYMUS_BASE_PATH}/volumes

SUBLYMUS_NETWORK=${SUBLYMUS_NETWORK}

SUBLYMUS_POSTGRES_DATA_VOLUME=\${SUBLYMUS_VOLUMES_BASE_PATH}/postgres_data
SUBLYMUS_REDIS_DATA_VOLUME=\${SUBLYMUS_VOLUMES_BASE_PATH}/redis_data
SUBLYMUS_S_API_VOLUME_SOURCE_BASE=\${SUBLYMUS_VOLUMES_BASE_PATH}/api_store_volumes
SUBLYMUS_S_SERVER_UPLOADS_VOLUME=\${SUBLYMUS_VOLUMES_BASE_PATH}/s_server_uploads
SUBLYMUS_S_SERVER_KEYS_VOLUME=\${SUBLYMUS_VOLUMES_BASE_PATH}/s_server_keys
SUBLYMUS_NGINX_CONF_VOLUME_ON_HOST=\${SUBLYMUS_VOLUMES_BASE_PATH}/nginx_conf
SUBLYMUS_NGINX_LOGS_VOLUME_ON_HOST=\${SUBLYMUS_VOLUMES_BASE_PATH}/nginx_logs
SUBLYMUS_SSL_CERTS_VOLUME_ON_HOST=\${SUBLYMUS_VOLUMES_BASE_PATH}/ssl_certs
SUBLYMUS_NGINX_ACME_CHALLENGE_VOLUME_ON_HOST=\${SUBLYMUS_VOLUMES_BASE_PATH}/nginx_acme_challenge

# === Configuration Utilisateur ===
YOUR_MAIN_DOMAIN=${YOUR_MAIN_DOMAIN}

# Utilisateur pour les opérations de déploiement Git (si différent de l'utilisateur courant)
SUBLYMUS_DEPLOY_USER=${DEPLOY_USER}

# PostgreSQL Infrastructure
DB_USER_INFRA=${DB_USER_INFRA}
DB_PASSWORD_INFRA=\"${DB_PASSWORD_INFRA}\"
DB_DATABASE_INFRA=${DB_DATABASE_INFRA}

# Redis Infrastructure
# REDIS_PASSWORD_INFRA=\"${REDIS_PASSWORD_INFRA}\"

# Google OAuth
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=\"${GOOGLE_CLIENT_SECRET}\"

# Brevo / SMTP (pour s_server par défaut, peut être surchargé dans s_server.env)
BREVO_API_KEY_S_SERVER=\"${BREVO_API_KEY_S_SERVER}\"
MAIL_FROM_ADDRESS_S_SERVER=${MAIL_FROM_ADDRESS_S_SERVER}
SMTP_HOST_S_SERVER=${SMTP_HOST_S_SERVER}
SMTP_PORT_S_SERVER=${SMTP_PORT_S_SERVER}
SMTP_USERNAME_S_SERVER=${SMTP_USERNAME_S_SERVER}
SMTP_PASSWORD_S_SERVER=\"${SMTP_PASSWORD_S_SERVER}\"

# Wave API Configuration
WAVE_API_KEY="${WAVE_API_KEY}"
WAVE_MANAGER_ID="${WAVE_MANAGER_ID}"
WAVE_API_URL="${WAVE_API_URL}"
WAVE_API_PORT="${WAVE_API_PORT}"
WAVE_PLATFORM_WALLET_ID="${WAVE_PLATFORM_WALLET_ID}"

EOF"
    # Appliquer des droits stricts au fichier .env
    if [ -f "$ENV_GLOBAL_FILE" ]; then run_command "sudo chmod 600 \"$ENV_GLOBAL_FILE\"" "Sécurisation ${ENV_GLOBAL_FILE} échouée."; fi
    log_success "Fichier .env global (${ENV_GLOBAL_FILE}) configuré."

    log_info "Rechargement des variables d'environnement pour le script courant..."
    load_config_or_set_defaults 
#    log_warn "La configuration interactive du .env global est disponible via './sublymus-cli config global-env --interactive'."
#    log_info "Pour l'initialisation, veuillez utiliser le fichier ${ENV_GLOBAL_FILE}.example."
}


#------------------------------------------
# ----------  Infrastructure stack --------
#------------------------------------------

func_generate_infra_compose_file() {
    log_title "Génération du Fichier Docker Compose pour l'Infrastructure"

    # Les variables comme SUBLYMUS_POSTGRES_DATA_VOLUME, SUBLYMUS_NETWORK,
    # DB_USER_INFRA, DB_PASSWORD_INFRA, DB_DATABASE_INFRA, REDIS_PASSWORD_INFRA
    # devraient être chargées depuis le .env global par load_config_or_set_defaults
    # qui est appelé avant cette fonction dans le mode 'init' (après la génération interactive du .env)

    if [ -z "$DB_PASSWORD_INFRA" ]; then
        log_warn "Le mot de passe PostgreSQL pour l'infrastructure (DB_PASSWORD_INFRA) n'est pas défini."
        ask_confirmation "Voulez-vous générer un mot de passe aléatoire pour PostgreSQL maintenant ?" "y"
        if [ "$USER_CONFIRMED" == "y" ]; then
            DB_PASSWORD_INFRA_GENERATED=$(openssl rand -base64 18)
            log_info "Mot de passe PostgreSQL généré : ${DB_PASSWORD_INFRA_GENERATED}"
            log_info "Ce mot de passe sera utilisé dans docker-compose.infrastructure.yml et doit être ajouté à /srv/sublymus/.env."
            # Optionnel: Mettre à jour .env global directement ?
            sed -i "/^DB_PASSWORD_INFRA=/c\DB_PASSWORD_INFRA=\"${DB_PASSWORD_INFRA_GENERATED}\"" "$ENV_GLOBAL_FILE"
            # Pour l'instant, on va juste l'utiliser et rappeler à l'utilisateur de le noter.
            export DB_PASSWORD_INFRA_TO_USE="${DB_PASSWORD_INFRA_GENERATED}" # Variable temporaire pour le heredoc
            log_warn "NOTEZ CE MOT DE PASSE PostgreSQL (DB_PASSWORD_INFRA): ${DB_PASSWORD_INFRA_GENERATED}"
            log_warn "Vous devrez l'ajouter à votre fichier /srv/sublymus/.env si ce n'est pas déjà fait."
        else
            log_error "Mot de passe PostgreSQL manquant. Impossible de continuer la génération du fichier compose."
            return 1
        fi
    else
        export DB_PASSWORD_INFRA_TO_USE="${DB_PASSWORD_INFRA}"
    fi

    local compose_content
    # Utilisation de `printf` pour éviter les problèmes d'expansion de variables dans `cat << EOF` si les mots de passe contiennent des `$`
    # et pour mieux gérer les guillemets.
    # Les variables Bash (ex: $DB_USER_INFRA) sont substituées par le shell avant que printf ne s'exécute.
    # Les variables Docker Compose (ex: ${DB_USER_INFRA}) sont pour Docker Compose lui-même.
    # Ici on veut que les valeurs Bash soient injectées dans le fichier.
    
    # S'assurer que les chemins des volumes sont définis
    local pg_data_vol_host="${SUBLYMUS_POSTGRES_DATA_VOLUME:-${VOLUMES_BASE_PATH}/postgres_data}"
    local redis_data_vol_host="${SUBLYMUS_REDIS_DATA_VOLUME:-${VOLUMES_BASE_PATH}/redis_data}"
    local network_name_compose="${SUBLYMUS_NETWORK:-sublymus_net}"

    # log_info $DB_USER_INFRA
    # log_info $DB_PASSWORD_INFRA_TO_USE
    # log_info $DB_DATABASE_INFRA

    # Vérifier que les variables ne sont pas vides
    if [ -z "$DB_USER_INFRA" ] || [ -z "$DB_PASSWORD_INFRA_TO_USE" ] || [ -z "$DB_DATABASE_INFRA" ] ; then
        log_error "Une ou plusieurs variables d'environnement critiques (DB_USER/PASS/DB_INFRA, REDIS_PASSWORD_INFRA) sont vides."
        log_error "Veuillez les définir dans /srv/sublymus/.env ou les fournir interactivement."
        return 1
    fi

    # Générer le contenu du fichier docker-compose.infrastructure.yml
    compose_content=$(cat <<EOF
version: '3.8'

# Fichier généré par sublymus-cli
# Les variables \${VAR_NAME} seront substituées par Docker Compose à partir des variables
# d'environnement du shell qui exécute 'docker stack deploy' OU à partir d'un fichier .env
# à côté de ce docker-compose.yml.
# Pour notre usage, on s'assure que les variables Bash sont exportées avant 'docker stack deploy'.

x-common-deploy-opts: &common-deploy-opts
  replicas: 1
  restart_policy:
    condition: on-failure
    delay: 5s
  placement:
    constraints: [node.role == manager]

services:
  postgres:
    image: postgres:15-alpine
    hostname: sublymus_infra_postgres
    volumes:
      - postgres_data_vol:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: "${DB_USER_INFRA}"
      POSTGRES_PASSWORD: "${DB_PASSWORD_INFRA_TO_USE}"
      POSTGRES_DB: "${DB_DATABASE_INFRA}"
    ports:
      - "5432:5432"
    networks:
      - sublymus_net_config
    deploy: *common-deploy-opts

  redis:
    image: redis:7-alpine
    hostname: sublymus_infra_redis
    volumes:
      - redis_data_vol:/data
    networks:
      - sublymus_net_config
    deploy: *common-deploy-opts

networks:
  sublymus_net_config:
    external: true
    name: "${network_name_compose}"

volumes:
  postgres_data_vol:
    driver_opts:
      type: none
      device: "${pg_data_vol_host}"
      o: bind
  redis_data_vol:
    driver_opts:
      type: none
      device: "${redis_data_vol_host}"
      o: bind
EOF
) # Fin de compose_content=$(cat <<EOF ... )

    if [ -f "$COMPOSE_INFRA_FILE" ]; then
        log_warn "Le fichier ${COMPOSE_INFRA_FILE} existe déjà."
        ask_confirmation "Voulez-vous l'écraser avec la nouvelle configuration générée ?" "n"
        if [ "$USER_CONFIRMED" != "y" ]; then
            log_info "Le fichier ${COMPOSE_INFRA_FILE} n'a pas été modifié."
            return 0 # Succès, mais pas de modification
        fi
    fi

    log_info "Écriture du fichier ${COMPOSE_INFRA_FILE}..."
    # Utiliser printf pour écrire le contenu pour éviter l'expansion non désirée
    if sudo printf '%s\n' "$compose_content" > "$COMPOSE_INFRA_FILE"; then
        run_command "sudo chmod 644 \"$COMPOSE_INFRA_FILE\"" "Échec chmod ${COMPOSE_INFRA_FILE}" # Permissions standard
        log_success "Fichier ${COMPOSE_INFRA_FILE} généré avec succès."
    else
        log_error "Échec de l'écriture dans ${COMPOSE_INFRA_FILE}."
        return 1
    fi
}

#------ func_deploy_infra_stack

func_deploy_infra_stack() {
    log_title "Déploiement/Mise à jour de la Stack Infrastructure (PostgreSQL, Redis)"

    if [ ! -f "$COMPOSE_INFRA_FILE" ]; then
        log_warn "Fichier Docker Compose pour l'infrastructure non trouvé: ${COMPOSE_INFRA_FILE}"
        ask_confirmation "Voulez-vous générer un fichier compose par défaut maintenant ?" "y"
        if [ "$USER_CONFIRMED" == "y" ]; then
            func_generate_infra_compose_file # Appelle la nouvelle fonction
            if [ $? -ne 0 ]; then # Si la génération a échoué ou a été annulée
                log_error "Génération du fichier compose annulée ou échouée. Impossible de déployer l'infra."
                return 1
            fi
        else
            log_error "Fichier compose manquant. Impossible de déployer l'infra."
            return 1
        fi
    fi

    log_info "Les variables d'environnement du fichier ${ENV_GLOBAL_FILE} seront utilisées pour ce déploiement."
    log_info "Vérifiez que DB_USER_INFRA, DB_PASSWORD_INFRA, DB_DATABASE_INFRA sont correctement définies."
    ask_confirmation "Prêt à déployer/mettre à jour la stack 'sublymus_infra' ?" "y"
    if [ "$USER_CONFIRMED" != "y" ]; then log_info "Déploiement annulé."; return 1; fi # return 1 pour indiquer un non-succès au mode appelant

    # S'assurer que les variables du .env global sont bien exportées pour que docker-compose les voie
    if [ -f "$ENV_GLOBAL_FILE" ]; then
        set -o allexport; source "$ENV_GLOBAL_FILE"; set +o allexport
    fi

    run_command "${DOCKER_CMD} stack deploy -c \"$COMPOSE_INFRA_FILE\" sublymus_infra" "Échec du déploiement de la stack 'sublymus_infra'."
    
    log_info "Attente de la stabilisation des services d'infrastructure (15 secondes)..."
    sleep 15

    log_info "Vérification de l'état des services de la stack 'sublymus_infra':"
    run_command "${DOCKER_CMD} stack services sublymus_infra" "Impossible de lister les services de sublymus_infra"
    run_command "${DOCKER_CMD} stack ps sublymus_infra" "Impossible d'afficher l'état des tâches de sublymus_infra"
    
    # Vérification basique de la connectivité (plus de tests dans un mode 'test' dédié)
    local pg_ready=false
    local redis_ready=false

    if ${DOCKER_CMD} service ps sublymus_infra_postgres -f "desired-state=running" -f "current-state=running" --format "{{.ID}}" | grep -q .; then
        pg_ready=true
    fi

    if ${DOCKER_CMD} service ps sublymus_infra_redis -f "desired-state=running" -f "current-state=running" --format "{{.ID}}" | grep -q .; then
        redis_ready=true
    fi

    if [ "$pg_ready" = true ] && [ "$redis_ready" = true ]; then
        log_success "Services PostgreSQL et Redis semblent être en cours d'exécution."
    else
        log_warn "Un ou plusieurs services d'infrastructure ne sont pas encore 'Running'. Vérifiez les logs."
        if [ "$pg_ready" = false ]; then log_warn "  - PostgreSQL n'est pas Running."; fi
        if [ "$redis_ready" = false ]; then log_warn "  - Redis n'est pas Running."; fi
        # On ne sort pas en erreur ici, car Swarm pourrait encore être en train de les démarrer.
    fi
    log_success "Déploiement/Mise à jour de la stack infrastructure terminé."
}

func_deploy_infra_stack() {
    log_title "Déploiement/Mise à jour de la Stack Infrastructure (PostgreSQL, Redis)"
    if [ ! -f "$COMPOSE_INFRA_FILE" ]; then
        log_warn "Fichier Docker Compose infra non trouvé: ${COMPOSE_INFRA_FILE}"
        ask_confirmation "Générer un fichier compose par défaut maintenant ?" "y"
        if [ "$USER_CONFIRMED" == "y" ]; then func_generate_infra_compose_file; if [ $? -ne 0 ]; then return 1; fi
        else log_error "Fichier compose manquant."; return 1; fi
    fi
    log_info "Variables de ${ENV_GLOBAL_FILE} seront utilisées."
    ask_confirmation "Prêt à déployer/MAJ la stack 'sublymus_infra' ?" "y"
    if [ "$USER_CONFIRMED" != "y" ]; then log_info "Déploiement annulé."; return 1; fi
    if [ -f "$ENV_GLOBAL_FILE" ]; then set -o allexport; source "$ENV_GLOBAL_FILE"; set +o allexport; fi
    run_command "${DOCKER_CMD} stack deploy -c \"$COMPOSE_INFRA_FILE\" sublymus_infra" "Échec déploiement 'sublymus_infra'."
    log_info "Attente stabilisation (15s)..."; sleep 15
    log_info "Vérification état services 'sublymus_infra':"
    run_command "${DOCKER_CMD} stack services sublymus_infra" "Err listage services infra"
    run_command "${DOCKER_CMD} stack ps sublymus_infra" "Err état tâches infra"
    local pg_ready=false; local redis_ready=false
    if ${DOCKER_CMD} service ps sublymus_infra_postgres -f "desired-state=running" -f "current-state=running" --format "{{.ID}}" | grep -q .; then pg_ready=true; fi
    if ${DOCKER_CMD} service ps sublymus_infra_redis -f "desired-state=running" -f "current-state=running" --format "{{.ID}}" | grep -q .; then redis_ready=true; fi
    if [ "$pg_ready" = true ] && [ "$redis_ready" = true ]; then log_success "PostgreSQL et Redis semblent Running.";
    else log_warn "Un/plusieurs services infra ne sont pas Running. Vérifiez logs."; if [ "$pg_ready" = false ]; then log_warn "  - PG non Running."; fi; if [ "$redis_ready" = false ]; then log_warn "  - Redis non Running."; fi; fi
    log_success "Déploiement/MAJ stack infra terminé."
}


#-----------------------------------------
# ----------    S_Server Env   ----------- 
#-----------------------------------------

# Fonction générique pour déployer un service frontend (Node.js/Vike)
func_deploy_frontend_service() {
    local service_name="$1"
    local image_name="$2"
    local internal_port="$3"
    local replicas="${4:-1}"

    log_title "Déploiement/Mise à jour du Service ${service_name}"

    if ! ${DOCKER_CMD} image inspect "$image_name" > /dev/null 2>&1; then
        log_error "Image Docker ${image_name} non trouvée localement."
        log_info "Assurez-vous qu'elle a été construite (via 'git push vps_deploy main' pour ${service_name})."
        return 1
    fi

    log_info "Démarrage/Mise à jour du service Swarm '${service_name}'..."
    local service_exists=false
    if ${DOCKER_CMD} service inspect "$service_name" > /dev/null 2>&1; then
        service_exists=true
    fi

    # Healthcheck command
    local health_cmd="wget --quiet --spider http://localhost:${internal_port}/health || exit 1"

    if [ "$service_exists" = false ]; then
        log_info "Service '${service_name}' non trouvé. Création..."
        run_command "${DOCKER_CMD} service create \
          --name \"${service_name}\" \
          --replicas \"${replicas}\" \
          --network \"${SUBLYMUS_NETWORK}\" \
          --env PORT=${internal_port} \
          --env REDIS_HOST=sublymus_infra_redis \
          --env SERVICE_ID=${service_name} \
          --constraint 'node.role == manager' \
          --restart-condition \"on-failure\" \
          --restart-delay \"5s\" \
          --health-cmd \"${health_cmd}\" \
          --health-interval 20s \
          --health-timeout 5s \
          --health-start-period 30s \
          --health-retries 3 \
          \"${image_name}\"" \
          "Échec création service ${service_name}."
        log_success "Service ${service_name} créé."
    else
        log_info "Mise à jour du service ${service_name}..."
        run_command "${DOCKER_CMD} service update \
            --image \"$image_name\" \
            --replicas \"${replicas}\" \
            --env-add PORT=${internal_port} \
            --env-add REDIS_HOST=sublymus_infra_redis \
            --env-add SERVICE_ID=${service_name} \
            --force \
            --health-cmd \"${health_cmd}\" \
            --health-interval 20s \
            --health-timeout 5s \
            --health-start-period 30s \
            --health-retries 3 \
            \"${service_name}\"" \
            "Échec MAJ service ${service_name}."
        log_success "Service ${service_name} mis à jour."
    fi
    
    log_info "Attente pour le démarrage/stabilisation de ${service_name} (15 secondes)..."
    sleep 15
    if ! is_service_running "$service_name"; then
        echo "❌ Le service ${service_name} n'a pas démarré correctement. Vérifiez les logs avec './sublymus-cli logs ${service_name} -f'."
        # return 1 # On ne bloque pas forcément tout, mais on signale
    else
        echo "✅ Le service ${service_name} est démarré."
    fi
}

func_deploy_s_admin_service() {
    func_deploy_frontend_service "s_admin" "sublymus/s_admin:latest" "3008"
}

func_deploy_s_dashboard_service() {
    func_deploy_frontend_service "s_dashboard" "sublymus/s_dashboard:latest" "3005"
}

func_deploy_s_welcome_service() {
    func_deploy_frontend_service "s_welcome" "sublymus/s_welcome:latest" "3003"
}

func_deploy_s_server_service() {
    log_title "Déploiement/Mise à jour du Service s_server"

    local s_server_service_name="s_server" # Nom du service Swarm
    local s_server_image="sublymus/s_server:latest"
    local s_server_replicas=1
    # ENV_S_SERVER_FILE est global

    # Chemins HÔTE pour les bind mounts (lus depuis .env global ou défauts)
    local s_server_uploads_host_path="${SUBLYMUS_S_SERVER_UPLOADS_VOLUME:-${VOLUMES_BASE_PATH}/s_server_uploads}"
    local s_server_keys_host_path="${SUBLYMUS_S_SERVER_KEYS_VOLUME:-${VOLUMES_BASE_PATH}/s_server_keys}"
    local s_api_volumes_base_host_path="${SUBLYMUS_S_API_VOLUME_SOURCE_BASE:-${VOLUMES_BASE_PATH}/api_store_volumes}"
    local nginx_conf_shared_host_path="${SUBLYMUS_NGINX_CONF_VOLUME_ON_HOST:-${VOLUMES_BASE_PATH}/nginx_conf}"

    # Lire les chemins cibles DANS le conteneur s_server depuis son propre .env
    # S'assurer que s_server.env existe et a été configuré
    if [ ! -f "$ENV_S_SERVER_FILE" ]; then
        log_error "Fichier ${ENV_S_SERVER_FILE} non trouvé. Exécutez d'abord './sublymus-cli setup-s-server-env'."
        return 1
    fi

    # Fonction pour lire une variable spécifique de s_server.env
    read_s_server_env_var() {
        grep "^${1}=" "$ENV_S_SERVER_FILE" | cut -d'=' -f2- | sed 's/"//g' # Enlève les guillemets pour les chemins
    }

    local s_server_uploads_target_in_container; s_server_uploads_target_in_container=$(read_s_server_env_var "FILE_STORAGE_PATH")
    local s_server_keys_target_in_container; s_server_keys_target_in_container=$(read_s_server_env_var "S_SECRET_KEYS_CONTAINER_PATH")
    local s_api_volumes_base_target_in_container; s_api_volumes_base_target_in_container=$(read_s_server_env_var "S_API_VOLUME_SOURCE_BASE_IN_S_SERVER")
    local nginx_conf_shared_target_in_container; nginx_conf_shared_target_in_container=$(read_s_server_env_var "NGINX_CONF_BASE_IN_S_SERVER_CONTAINER")
    local s_server_internal_port; s_server_internal_port=$(read_s_server_env_var "PORT")

log_info " s_server_uploads_target_in_container [ $s_server_uploads_target_in_container ] [ $FILE_STORAGE_PATH ]"
log_info " s_server_keys_target_in_container [ $s_server_keys_target_in_container ] [ $S_SECRET_KEYS_CONTAINER_PATH ]"
log_info " s_api_volumes_base_target_in_container [ $s_api_volumes_base_target_in_container ] [ $S_API_VOLUME_SOURCE_BASE_IN_S_SERVER ]"
log_info " nginx_conf_shared_target_in_container [ $nginx_conf_shared_target_in_container ] [ $NGINX_CONF_BASE_IN_S_SERVER_CONTAINER ]"
log_info " s_server_internal_port [ $s_server_internal_port ] [ $PORT ]"

    if [ -z "$s_server_uploads_target_in_container" ] || \
       [ -z "$s_server_keys_target_in_container" ] || \
       [ -z "$s_api_volumes_base_target_in_container" ] || \
       [ -z "$nginx_conf_shared_target_in_container" ] || \
       [ -z "$s_server_internal_port" ]; then
        log_error "Une ou plusieurs variables de chemin cible ou le PORT ne sont pas définies dans ${ENV_S_SERVER_FILE}."
        log_info "Vérifiez FILE_STORAGE_PATH, S_SECRET_KEYS_CONTAINER_PATH, S_API_VOLUME_SOURCE_BASE_IN_S_SERVER, NGINX_CONF_BASE_IN_S_SERVER_CONTAINER, PORT."
        return 1
    fi
    
    if ! ${DOCKER_CMD} image inspect "$s_server_image" > /dev/null 2>&1; then
        log_error "Image Docker ${s_server_image} non trouvée localement."
        log_info "Assurez-vous qu'elle a été construite (via 'git push vps_deploy main' pour s_server)."
        return 1
    fi

    log_info "Démarrage/Mise à jour du service Swarm '${s_server_service_name}'..."
    local service_exists=false
    if ${DOCKER_CMD} service inspect "$s_server_service_name" > /dev/null 2>&1; then
        service_exists=true
    fi

    # Healthcheck command construite dynamiquement avec le port
    local health_cmd="wget --quiet --spider http://0.0.0.0:${s_server_internal_port}/health || exit 1"

    if [ "$service_exists" = false ]; then
        log_info "Service '${s_server_service_name}' non trouvé. Création..."
        run_command "${DOCKER_CMD} service create \
          --name \"${s_server_service_name}\" \
          --replicas \"${s_server_replicas}\" \
          --network \"${SUBLYMUS_NETWORK}\" \
          --env-file \"${ENV_S_SERVER_FILE}\" \
          --mount \"type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock\" \
          --mount \"type=bind,source=${s_server_keys_host_path},target=${s_server_keys_target_in_container}\" \
          --mount \"type=bind,source=${s_server_uploads_host_path},target=${s_server_uploads_target_in_container}\" \
          --mount \"type=bind,source=${s_api_volumes_base_host_path},target=${s_api_volumes_base_target_in_container}\" \
          --mount \"type=bind,source=${nginx_conf_shared_host_path},target=${nginx_conf_shared_target_in_container}\" \
          --constraint 'node.role == manager' \
          --restart-condition \"on-failure\" \
          --restart-delay \"5s\" \
          --health-cmd \"${health_cmd}\" \
          --health-interval 20s \
          --health-timeout 5s \
          --health-start-period 30s \
          --health-retries 3 \
          \"${s_server_image}\"" \
          "Échec création service ${s_server_service_name}."
        log_success "Service ${s_server_service_name} créé."
    else
        log_info "Mise à jour du service ${s_server_service_name}..."
        run_command "${DOCKER_CMD} service update \
            --image \"$s_server_image\" \
            --replicas \"$s_server_replicas\" \
            --force \
            --health-cmd \"${health_cmd}\" \
            --health-interval 20s \
            --health-timeout 5s \
            --health-start-period 30s \
            --health-retries 3 \
            \"${s_server_service_name}\"" \
            "Échec MAJ service ${s_server_service_name}."
        log_success "Service ${s_server_service_name} mis à jour."
    fi
    log_info "Attente pour le démarrage/stabilisation de s_server (30 secondes)..."
    sleep 30
    run_command "${DOCKER_CMD} service ps \"$s_server_service_name\" --no-trunc" "Impossible d'afficher le statut de ${s_server_service_name}"
    # Vérifier si au moins une tâche est 'Running'
    if ! is_service_running "s_server"; then
        echo "❌ Le service s_server n'a pas démarré correctement. Vérifiez les logs avec './sublymus-cli logs s_server -f'."
        exit 1
    fi

    echo "✅ Le service s_server est démarré."
    log_success "Déploiement/Mise à jour de s_server terminé."
}

func_generate_ssl_certificates_interactive() {
    log_title "Génération des Certificats SSL Wildcard (Manuel via DNS-01)"

    local certbot_service_name="sublymus_proxy_certbot" # Nom du service certbot
    local certbot_container_id

    # Récupérer dynamiquement le conteneur actif du service certbot
    certbot_container_id=$(${DOCKER_CMD} ps --filter "name=${certbot_service_name}" --filter "status=running" --format "{{.ID}}" | head -n 1)

    if [ -z "$certbot_container_id" ]; then
        log_error "Aucun conteneur Docker actif trouvé pour le service '${certbot_service_name}'."
        log_info "Veuillez déployer la stack proxy avec: ./sublymus-cli deploy-nginx-proxy"
        return 1
    fi

    if [ -z "$YOUR_MAIN_DOMAIN" ]; then
        log_error "Variable YOUR_MAIN_DOMAIN non définie. Configurez ${ENV_GLOBAL_FILE} ou relancez './sublymus-cli init'."
        return 1
    fi

    local user_email_for_ssl

    # Essayer de lire depuis s_server.env ou .env global si MAIL_FROM_ADDRESS_S_SERVER est défini
    if [ -n "$MAIL_FROM_ADDRESS_S_SERVER" ]; then
        user_email_for_ssl="$MAIL_FROM_ADDRESS_S_SERVER"
        log_info "Utilisation de l'email ${user_email_for_ssl} (depuis la configuration) pour Let's Encrypt."
        ask_confirmation "Est-ce correct, ou voulez-vous en entrer un autre ?" "y"
        if [ "$USER_CONFIRMED" != "y" ]; then
            read -r -p "Entrez votre adresse e-mail pour Let's Encrypt (notifications d'expiration): " user_email_for_ssl
        fi
    else
        read -r -p "Entrez votre adresse e-mail pour Let's Encrypt (notifications d'expiration): " user_email_for_ssl
    fi

    if [ -z "$user_email_for_ssl" ]; then
        log_error "Adresse e-mail requise pour Let's Encrypt."
        return 1
    fi

    log_info "Préparation de la commande Certbot pour les domaines: *.${YOUR_MAIN_DOMAIN} et ${YOUR_MAIN_DOMAIN}"
    log_warn "Certbot va vous demander d'ajouter des enregistrements TXT à votre zone DNS (Hostinger)."
    log_warn "Ce processus est interactif et manuel. Assurez-vous d'avoir accès à votre panneau DNS Hostinger."
    ask_confirmation "Prêt à lancer Certbot pour la génération des certificats ?" "y"
    if [ "$USER_CONFIRMED" != "y" ]; then
        log_info "Génération des certificats annulée."
        return 1
    fi

    local certbot_cmd
    certbot_cmd="${DOCKER_CMD} exec -it ${certbot_container_id} certbot certonly \
        --manual \
        --preferred-challenges dns \
        --email \"${user_email_for_ssl}\" \
        --server https://acme-v02.api.letsencrypt.org/directory \
        --agree-tos \
        --no-eff-email \
        -d \"*.${YOUR_MAIN_DOMAIN}\" \
        -d \"${YOUR_MAIN_DOMAIN}\""

    log_info "Exécution de la commande Certbot (suivez les instructions à l'écran) :"
    log_cmd_display_only="docker exec -it ${certbot_container_id} certbot certonly ..."
    log_cmd "$log_cmd_display_only"

    # Exécuter la commande réelle
    eval "$certbot_cmd"
    local certbot_exit_code=$?

    if [ $certbot_exit_code -eq 0 ]; then
        log_success "Certbot a terminé avec succès (ou les certificats sont déjà à jour et valides)."
        log_info "Les certificats devraient être disponibles DANS LE CONTENEUR CERTBOT à /etc/letsencrypt/live/${YOUR_MAIN_DOMAIN}/"
        log_info "Et sur l'HÔTE dans ${SUBLYMUS_SSL_CERTS_VOLUME_ON_HOST:-${VOLUMES_BASE_PATH}/ssl_certs}/live/${YOUR_MAIN_DOMAIN}/"
        log_warn "Nginx doit maintenant être configuré pour utiliser ces certificats."
        log_info "Un redémarrage/resynchronisation de s_server est nécessaire pour que RoutingService génère les confs Nginx HTTPS."
        log_info "Exécutez: ./sublymus-cli restart s_server  OU  ./sublymus-cli platform sync-nginx (commande future)"
    else
        log_error "Certbot a échoué ou a été annulé (Code de sortie: ${certbot_exit_code})."
        log_info "Vérifiez les messages de Certbot ci-dessus pour plus de détails."
        log_info "Causes fréquentes : échec de la validation DNS (enregistrement TXT incorrect ou non propagé), limites de taux Let's Encrypt."
        return 1
    fi
}


func_trigger_s_server_platform_sync() {
    log_title "Déclenchement de la Synchronisation de la Plateforme par s_server"
    # Option 1: Commande Ace (si tu en crées une)
    # local s_server_task_id=$(${DOCKER_CMD} service ps "s_server" -f "desired-state=running" -f "current-state=running" --format "{{.ID}}" --no-trunc | head -n 1)
    # if [ -n "$s_server_task_id" ]; then
    #    run_command "${DOCKER_CMD} exec \"${s_server_task_id}\" node ace platform:sync" "Échec déclenchement synchro via ace."
    #    log_success "Synchronisation de la plateforme demandée à s_server via ace."
    # else
    #    log_error "Impossible de trouver une tâche s_server pour déclencher la synchro."
    # fi

    # Option 2: API Admin (plus propre, mais nécessite que l'API soit déjà accessible)
    # Pour l'instant, s_server fait une synchro au démarrage. Un redémarrage suffit.
    log_info "s_server effectue une synchronisation au démarrage. Si besoin de forcer une nouvelle synchro :"
    log_info "  Utilisez une route API admin (TODO) ou redémarrez s_server :"
    log_info "  ./sublymus-cli restart s_server"
    # Ou si on veut vraiment le faire ici :
    # run_command "${DOCKER_CMD} service update --force s_server" "Echec redémarrage s_server pour synchro"
    # log_info "s_server redémarré pour déclencher la synchronisation."
    log_success "Synchronisation de la plateforme (implicite au démarrage de s_server) en cours."
}

func_generate_s_server_env_file() {
    log_title "Génération/Mise à jour du Fichier s_server.env (${ENV_S_SERVER_FILE})"

    # S'assurer que les variables globales (YOUR_MAIN_DOMAIN, DB_USER_INFRA, etc.) sont chargées
    # load_config_or_set_defaults a déjà été appelé si on n'est pas dans le flow 'init' direct.
    # Si on est dans 'init', il a été appelé après la génération du .env global.

    if [ -z "$YOUR_MAIN_DOMAIN" ]; then
        log_error "La variable YOUR_MAIN_DOMAIN n'est pas définie dans le .env global ou via le script."
        log_info "Veuillez exécuter './sublymus-cli init' et la configurer, ou l'ajouter à ${ENV_GLOBAL_FILE}."
        return 1
    fi

    # Lire les valeurs existantes de s_server.env pour les préserver si possible (idempotence)
    # et utiliser des valeurs par défaut sinon.
    # La fonction read_existing_value doit être définie (ou copiée depuis ton ancien script setup-env-vars)
    # Pour l'instant, on va simplifier et générer avec des valeurs basées sur le .env global et des défauts.
    # Une version plus avancée lirait chaque clé et la préserverait/mettrait à jour.

    local s_server_env_content
    # Générer le contenu de s_server.env
    # Les variables comme ${DB_USER_INFRA} sont celles chargées depuis le .env global.
    # Celles avec _S_SERVER sont spécifiques à ce fichier.
    # Important: Les chemins des volumes DANS s_server doivent correspondre aux TARGETS des mounts
    # définis dans la commande `docker service create s_server` (dans func_deploy_s_server_service).

    local app_key_s_server="${APP_KEY:-$(openssl rand -hex 32)}" # Lire APP_KEY du .env global ou générer
    local internal_api_secret_s_server="${INTERNAL_API_SECRET:-$(openssl rand -hex 32)}"

    # Chemins DANS LE CONTENEUR s_server
    local s_server_uploads_target_in_container="/app/s_server_data/uploads"
    local s_server_keys_target_in_container="/app/s_server_data/keys"
    local s_api_volumes_base_target_in_container="/app/s_server_data/api_store_volumes"
    local nginx_conf_shared_target_in_container="/app_data/nginx_generated_conf" # Base pour sites-available/enabled

    s_server_env_content=$(cat <<EOF
# --- s_server Application ---
TZ=UTC
PORT=${S_SERVER_INTERNAL_PORT:-5555}
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=${app_key_s_server}
NODE_ENV=production

# --- Configuration des services applicatifs globaux (ports internes) ---
APP_SERVICE_WELCOME=s_welcome
S_WELCOME_INTERNAL_PORT=${S_WELCOME_INTERNAL_PORT:-3003}
APP_SERVICE_DASHBOARD=s_dashboard
S_DASHBOARD_INTERNAL_PORT=${S_DASHBOARD_INTERNAL_PORT:-3005}
APP_SERVICE_DOCS=s_docs
S_DOCS_INTERNAL_PORT=${S_DOCS_INTERNAL_PORT:-3007}
APP_SERVICE_ADMIN=s_admin
S_ADMIN_INTERNAL_PORT=${S_ADMIN_INTERNAL_PORT:-3008}

# --- Base de Données (pour s_server lui-même) ---
DB_CONNECTION=pg
DB_HOST=sublymus_infra_postgres
DB_PORT=5432
DB_USER=${DB_USER_INFRA}
DB_PASSWORD=${DB_PASSWORD_INFRA}
DB_DATABASE=${DB_DATABASE_INFRA}

# --- Redis ---
REDIS_HOST=sublymus_infra_redis
REDIS_PORT=6379
REDIS_PASSWORD=

# --- Google OAuth ---
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
SITE_URL=https://${YOUR_MAIN_DOMAIN}
GOOGLE_CALLBACK=/auth/google/callback

# --- Configuration Mail (Ex: Brevo via SMTP) ---
MAIL_CONNECTION=smtp
BREVO_API_KEY=${BREVO_API_KEY_S_SERVER}
MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS_S_SERVER:-contact@${YOUR_MAIN_DOMAIN}}
MAIL_FROM_NAME=Sublymus Platform
SMTP_HOST=${SMTP_HOST_S_SERVER:-smtp-relay.brevo.com}
SMTP_PORT=${SMTP_PORT_S_SERVER:-587}
SMTP_USERNAME=${SMTP_USERNAME_S_SERVER}
SMTP_PASSWORD=${SMTP_PASSWORD_S_SERVER}
SMTP_ENCRYPTION=tls

# --- Configuration Fichiers & Volumes (chemins DANS le conteneur s_server) ---
FILE_STORAGE_PATH=${s_server_uploads_target_in_container}
FILE_STORAGE_URL=/fs

S_API_VOLUME_TARGET_IN_S_API_CONTAINER=/app_data
S_API_VOLUME_SOURCE_BASE_IN_S_SERVER=${s_api_volumes_base_target_in_container}

NGINX_CONF_BASE_IN_S_SERVER_CONTAINER=${nginx_conf_shared_target_in_container}
NGINX_SITES_AVAILABLE_SUBDIR=sites-available
NGINX_SITES_ENABLED_SUBDIR=sites-enabled
NGINX_MAIN_SERVER_CONF_FILENAME=000-sublymus_platform.conf
NGINX_SERVICE_NAME_IN_SWARM=sublymus_proxy_nginx_proxy

S_SECRET_KEYS_CONTAINER_PATH=${s_server_keys_target_in_container}

# --- Configuration Sublymus Spécifique ---
SERVER_USER=s_server
SERVER_DOMAINE=${YOUR_MAIN_DOMAIN}
INTERNAL_API_SECRET=${internal_api_secret_s_server}
DOCKER_SWARM_NETWORK_NAME=${SUBLYMUS_NETWORK}
S_API_INTERNAL_BASE_URL_PREFIX=http://api_store_


# Notification / Web-Push 
VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}
VAPID_PRIVATE_KEY=${VAPID_PRIVATE_KEY}
VAPID_SUBJECT=${VAPID_SUBJECT}

VAPID_SUBJECT=${VAPID_SUBJECT}

WAVE_API_URL=${WAVE_API_URL}
WAVE_API_KEY=${WAVE_API_KEY}
WAVE_MANAGER_ID=${WAVE_MANAGER_ID}
WAVE_API_PORT=${WAVE_API_PORT}
WAVE_PLATFORM_WALLET_ID=${WAVE_PLATFORM_WALLET_ID}

# --- Headers Nginx (doivent correspondre à RoutingService/utils.ts) ---
TARGET_API_HEADER=x-target-api-service
STORE_URL_HEADER=x-base-url
SERVER_URL_HEADER=x-server-url

# --- Paramètres de fonctionnement interne de s_server (depuis ton .env de dev) ---
NEW_INSTANCE_RUNING=3
TEST_API_INTERVAL=1000
TEST_API_MAX_TENTATIVE=20
MAX_RELAUNCH_API_INSTANCE=2
DELAY_BEFOR_SERVER_DELETE_API_AFTER_REQUEST=60000
EOF
) # Fin de s_server_env_content=$(cat <<EOF ... )

    local s_server_env_dir
    s_server_env_dir=$(dirname "$ENV_S_SERVER_FILE")
    run_command "sudo mkdir -p \"$s_server_env_dir\"" "Création dossier ${s_server_env_dir} échouée."

    if [ -f "$ENV_S_SERVER_FILE" ]; then
        log_warn "Le fichier ${ENV_S_SERVER_FILE} existe déjà."
        ask_confirmation "Voulez-vous l'écraser avec la nouvelle configuration générée ?" "n"
        if [ "$USER_CONFIRMED" != "y" ]; then
            log_info "Le fichier ${ENV_S_SERVER_FILE} n'a pas été modifié."
            return 0
        fi
    fi

    log_info "Écriture du fichier ${ENV_S_SERVER_FILE}..."
    if sudo printf '%s\n' "$s_server_env_content" > "$ENV_S_SERVER_FILE"; then
        run_command "sudo chmod 640 \"$ENV_S_SERVER_FILE\"" "Sécurisation ${ENV_S_SERVER_FILE} échouée."
        # Assigner au DEPLOY_USER pour que les scripts futurs puissent le lire si besoin,
        # ou à l'utilisateur qui va lancer s_server si différent.
        run_command "sudo chown ${DEPLOY_USER}:${DEPLOY_USER} \"$ENV_S_SERVER_FILE\"" "Chown ${ENV_S_SERVER_FILE} échoué." # Ou root:root si Docker le lit en root
        log_success "Fichier ${ENV_S_SERVER_FILE} généré avec succès."
    else
        log_error "Échec de l'écriture dans ${ENV_S_SERVER_FILE}."
        return 1
    fi
}



#-----------------------------------------
# -------- Git Repo - Git Clone ---------- 
#-----------------------------------------
func_setup_one_git_repository() {
    local service_name="$1"
    local current_deploy_user="$2"
    local current_deploy_group="$3"

    local repo_path="${GIT_BASE_PATH}/${service_name}.git"
    local project_checkout_dir="${SRC_BASE_PATH}/${service_name}"

    log_info "  Configuration du dépôt individuel pour ${service_name}..."

    if [ ! -d "$repo_path" ]; then
        log_info "    Création du dépôt bare: ${repo_path}"
        run_command "sudo mkdir -p \"$repo_path\"" "Création ${repo_path} échouée."
        run_command "sudo git init --bare \"$repo_path\"" "Git init bare ${repo_path} échoué."
    else
        log_info "    Dépôt bare ${repo_path} existe déjà."
    fi
    run_command "sudo chown -R \"${current_deploy_user}\":\"${current_deploy_group}\" \"$repo_path\"" "Chown ${repo_path} échoué."
    run_command "sudo chmod -R g+rws \"$repo_path\"" "Chmod ${repo_path} échoué."

    if [ ! -d "$project_checkout_dir" ]; then
        log_info "    Création du répertoire de checkout: ${project_checkout_dir}"
        run_command "sudo mkdir -p \"$project_checkout_dir\"" "Création ${project_checkout_dir} échouée."
    else
        log_info "    Répertoire de checkout ${project_checkout_dir} existe déjà."
    fi
    run_command "sudo chown -R \"${current_deploy_user}\":\"${current_deploy_group}\" \"$project_checkout_dir\"" "Chown ${project_checkout_dir} échoué."
    run_command "sudo chmod -R 775 \"$project_checkout_dir\"" "Chmod ${project_checkout_dir} échoué."

    local hook_path="${repo_path}/hooks/post-receive"
    log_info "    Configuration du hook post-receive: ${hook_path}"

 local hook_content; hook_content=$(cat <<EOF
#!/bin/bash
# Hook post-receive pour ${service_name}

SERVICE_NAME="${service_name}"
PROJECT_DIR="${project_checkout_dir}"
DOCKER_IMAGE_NAME="sublymus/\${SERVICE_NAME}"
TARGET_BRANCH="refs/heads/main"

echo "===== Hook post-receive pour \${SERVICE_NAME} déclenché ====="
while read oldrev newrev refname; do
    if [[ "\${refname}" == "\${TARGET_BRANCH}" ]]; then
        (
            flock -n 200 || { echo "Hook déjà en cours pour \${SERVICE_NAME}."; exit 1; }
            echo "Push détecté pour \${SERVICE_NAME} sur \${TARGET_BRANCH}."
            mkdir -p "\${PROJECT_DIR}"
            chown -R "${current_deploy_user}":"${current_deploy_group}" "\${PROJECT_DIR}"
            echo "Checkout..."
            sudo -u "${current_deploy_user}" git --work-tree="\${PROJECT_DIR}" --git-dir="\${PWD}" checkout -f "\${newrev}"
            if [ \$? -ne 0 ]; then echo "❌ ERREUR: Checkout Git échoué."; exit 1; fi

            IMAGE_TAG=\$(date +%Y%m%d%H%M%S)
            FULL_IMAGE_NAME="\${DOCKER_IMAGE_NAME}:\${IMAGE_TAG}"
            LATEST_IMAGE_NAME="\${DOCKER_IMAGE_NAME}:latest"

            echo "🔨 Build Docker: \${LATEST_IMAGE_NAME}"
            cd "\${PROJECT_DIR}" || exit 1
            docker build -t "\${FULL_IMAGE_NAME}" .
            if [ \$? -ne 0 ]; then echo "❌ ERREUR: Build Docker échoué."; exit 1; fi
            docker tag "\${FULL_IMAGE_NAME}" "\${LATEST_IMAGE_NAME}"
            echo "✅ Image Docker \${LATEST_IMAGE_NAME} construite."

            case "\${SERVICE_NAME}" in
                "s_welcome"|"s_dashboard"|"s_docs"|"s_admin")
                    echo "🔁 Mise à jour directe du service Swarm: \${SERVICE_NAME}"
                    docker service update --image "\${LATEST_IMAGE_NAME}" --force "\${SERVICE_NAME}"
                    ;;
                theme_*)
                    echo "🔍 Recherche des services utilisant l’image: \${LATEST_IMAGE_NAME}"
                     docker service update --image "\${LATEST_IMAGE_NAME}" --force "\${SERVICE_NAME}"
                    ;;
                s_api*)
                    echo "🔍 Mise à jour des services utilisant une API version spécifique: \${SERVICE_NAME}"
                    for service in \$(docker service ls --format '{{.Name}}'); do
                        IMAGE=\$(docker service inspect "\$service" --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}')
                        if [[ "\$IMAGE" == "sublymus/\${SERVICE_NAME}:latest" ]]; then
                            echo "🔄 Mise à jour du service '\$service' (image = \$IMAGE)"
                            docker service update --image "\${LATEST_IMAGE_NAME}" --force "\$service"
                        fi
                    done
                    ;;

                "s_server")
                    echo "📦 Le Déploiement de s_server se fera par l'admin via sublymus-cli"
                    ;;
                *)
                    echo "⚠️ Service \${SERVICE_NAME} non géré automatiquement dans ce hook."
                    ;;
            esac
        ) 200>"/var/lock/\${SERVICE_NAME}_hook.lock"
        echo "===== Hook pour \${SERVICE_NAME} terminé ====="
    fi
done
exit 0
EOF
)

    if sudo printf '%s\n' "$hook_content" > "$hook_path"; then
        run_command "sudo chmod +x \"$hook_path\"" "Chmod hook ${hook_path} échoué."
        run_command "sudo chown \"${current_deploy_user}\":\"${current_deploy_group}\" \"$hook_path\"" "Chown hook ${hook_path} échoué."
        log_info "    Hook post-receive configuré pour ${service_name}."
    else
        log_error "    Échec écriture hook pour ${service_name}."
        return 1
    fi

    log_info "--- Dépôt ${service_name} prêt. Remote: ${current_deploy_user}@YOUR_VPS_IP_OR_DOMAIN:${repo_path} ---"
}

# Configure un seul dépôt Git bare et son hook post-receive
# Arguments: $1 = service_name, $2 = deploy_user, $3 = deploy_group

func_setup_git_repositories() {
    log_title "Configuration des Dépôts Git Bare et Hooks (Services Core et Thème par Défaut)"
    
    local deploy_group
    deploy_group=$(id -g -n "$DEPLOY_USER") # DEPLOY_USER est global

    # Services "core" et le thème par défaut sont configurés ici.
    # Les autres thèmes seront ajoutés via `add-theme`.
    local core_services_to_gitify=(
        "s_server" "s_welcome" "s_dashboard" "s_docs" "s_admin"
        "s_api" # Le template pour les API des stores
        "theme_0" # Thème par défaut
    )
    
    log_info "Utilisateur de déploiement pour Git: ${DEPLOY_USER}:${deploy_group}"
    log_info "Chemin de base des dépôts Git: ${GIT_BASE_PATH}"

    run_command "sudo mkdir -p \"$GIT_BASE_PATH\"" "Création ${GIT_BASE_PATH} échouée."
    run_command "sudo chown \"${DEPLOY_USER}\":\"${deploy_group}\" \"$GIT_BASE_PATH\"" "Chown ${GIT_BASE_PATH} échoué."
    run_command "sudo chmod 775 \"$GIT_BASE_PATH\"" "Chmod ${GIT_BASE_PATH} échoué."

   
    for service_name in "${core_services_to_gitify[@]}"; do
        func_setup_one_git_repository "$service_name" "$DEPLOY_USER" "$deploy_group"
        if [ $? -ne 0 ]; then
            log_warn "Échec de la configuration du dépôt pour ${service_name}. Le script continue..."
        fi
    done
  
    log_success "Configuration des Dépôts Git principaux terminée."
}

# Clone une source Git unique
# Arguments: $1 = service_name, $2 = repo_url, $3 = deploy_user, $4 = deploy_group
func_clone_one_source() {
    local service_name="$1"
    local repo_url="$2"
    local current_deploy_user="$3"
    local current_deploy_group="$4"
    local clone_dir="${SRC_BASE_PATH}/${service_name}"

    log_info "  Traitement du clonage pour ${service_name} depuis ${repo_url}..."

    if [ -d "$clone_dir" ]; then
        log_warn "  Répertoire ${clone_dir} existe."
        ask_confirmation "  Voulez-vous le supprimer et re-cloner (r) ou tenter une mise à jour (m) ?" "y"
        if [ "$USER_CONFIRMED" == "r" ]; then
            run_command "sudo rm -rf \"$clone_dir\"" "Suppression ${clone_dir} échouée."
            log_info "  Clonage de ${repo_url} vers ${clone_dir}..."
            run_command "sudo -u \"${current_deploy_user}\" git clone --quiet \"${repo_url}\" \"${clone_dir}\"" "Clonage ${service_name} échoué."
        elif [ "$USER_CONFIRMED" == "m" ]; then
            if sudo -u "${current_deploy_user}" git -C "${clone_dir}" rev-parse --is-inside-work-tree > /dev/null 2>&1; then
                log_info "  Mise à jour de ${clone_dir}..."
                run_command "sudo -u \"${current_deploy_user}\" git -C \"${clone_dir}\" pull origin main" "Pull ${service_name} échoué."
            else
                log_warn "  ${clone_dir} n'est pas un dépôt git valide. Suppression et re-clonage."
                run_command "sudo rm -rf \"$clone_dir\"" "Suppression ${clone_dir} échouée."
                log_info "  Clonage de ${repo_url} vers ${clone_dir}..."
                run_command "sudo -u \"${current_deploy_user}\" git clone --quiet \"${repo_url}\" \"${clone_dir}\"" "Clonage ${service_name} échoué."
            fi
        else
            log_info "  Clonage/Mise à jour de ${service_name} ignoré."
            return 0 # Pas une erreur, juste ignoré
        fi
    else
        log_info "  Clonage de ${repo_url} vers ${clone_dir}..."
        run_command "sudo -u \"${current_deploy_user}\" git clone --quiet \"${repo_url}\" \"${clone_dir}\"" "Clonage ${service_name} échoué."
    fi
    run_command "sudo chown -R \"${current_deploy_user}\":\"${current_deploy_group}\" \"${clone_dir}\"" "Chown ${clone_dir} (final) échoué."
    log_info "  Sources pour ${service_name} prêtes dans ${clone_dir}."
}

func_clone_initial_sources() {
    log_title "Clonage des Sources Initiales depuis GitHub (pour premier build)"
    local deploy_group
    deploy_group=$(id -g -n "$DEPLOY_USER")

    # Définir les URLs GitHub ici.
    local core_git_hub_repos=(
        "s_server https://github.com/molompiok/s_server.git"
        "s_welcome https://github.com/molompiok/s_welcome.git"
        "s_dashboard https://github.com/molompiok/s_dashboard.git"
        "s_docs https://github.com/molompiok/s_docs.git"
        "s_admin https://github.com/molompiok/s_admin.git"
        "s_api https://github.com/molompiok/s_api.git"
        "theme_0 https://github.com/molompiok/theme_0.git"
    )

    run_command "sudo mkdir -p \"$SRC_BASE_PATH\"" "Création ${SRC_BASE_PATH} échouée."
    run_command "sudo chown -R \"${DEPLOY_USER}\":\"${deploy_group}\" \"$SRC_BASE_PATH\"" "Chown ${SRC_BASE_PATH} échoué."

    for repo_info_line in "${core_git_hub_repos[@]}"; do
        local service_name repo_url
        IFS=' ' read -r service_name repo_url <<< "$repo_info_line"
        func_clone_one_source "$service_name" "$repo_url" "$DEPLOY_USER" "$deploy_group"
    done
    log_success "Clonage des Sources Initiales (Core) terminé."
}

##########################################
#  Déploiement de Nginx Proxy et Certbot
##########################################

# +++> NOUVELLE FONCTION : Génération des fichiers pour la stack Nginx Proxy
func_generate_nginx_proxy_stack_files() {
    log_title "Génération des Fichiers pour la Stack Nginx Proxy et Certbot"

    # Chemins des fichiers à générer (basés sur les constantes globales)
    local compose_nginx_path="$COMPOSE_NGINX_FILE" # Ex: /srv/sublymus/docker-compose.nginx.yml
    local nginx_base_conf_path="$NGINX_BASE_CONF_FILE" # Ex: /srv/sublymus/nginx_base.conf

    # S'assurer que le dossier parent pour le compose existe
    local compose_dir
    compose_dir=$(dirname "$compose_nginx_path")
    run_command "sudo mkdir -p \"$compose_dir\"" "Création dossier ${compose_dir} échouée."
    run_command "sudo chown \"${DEPLOY_USER}\":\"$(id -g -n ${DEPLOY_USER})\" \"${compose_dir}\"" "Chown ${compose_dir} échoué."


    # --- Contenu de docker-compose.nginx.yml ---
    # Les variables ${VAR} seront substituées par le shell lors du `cat <<EOF`
    # car elles sont définies dans load_config_or_set_defaults ou en haut du script.
    local compose_nginx_content
    compose_nginx_content=$(cat <<EOF
version: '3.8'

# Généré par sublymus-cli
# Les variables comme \${SUBLYMUS_NGINX_CONF_VOLUME_ON_HOST} sont lues depuis l'environnement
# du shell qui exécute 'docker stack deploy' (normalement via le .env global /srv/sublymus/.env).

services:
  nginx_proxy:
    image: nginx:1.25-alpine
    hostname: sublymus_nginx_proxy # Pour référence, pas crucial pour la résolution externe
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "${SUBLYMUS_NGINX_CONF_VOLUME_ON_HOST:-${VOLUMES_BASE_PATH}/nginx_conf}:/etc/nginx/sublymus_conf:ro"
      - "${SUBLYMUS_SSL_CERTS_VOLUME_ON_HOST:-${VOLUMES_BASE_PATH}/ssl_certs}:/etc/letsencrypt:ro" # RO, Certbot écrira via son propre mount
      - "${SUBLYMUS_NGINX_LOGS_VOLUME_ON_HOST:-${VOLUMES_BASE_PATH}/nginx_logs}:/var/log/nginx"
      - "${nginx_base_conf_path}:/etc/nginx/nginx.conf:ro" # Chemin absolu du fichier de base
    networks:
      - sublymus_net_config # Utilise le nom du réseau défini dans .env
    deploy:
      replicas: 1
      placement:
        constraints: [node.role == manager]
      restart_policy:
        condition: on-failure
        delay: 5s

  certbot:
    image: certbot/certbot:latest
    volumes:
      - "${SUBLYMUS_SSL_CERTS_VOLUME_ON_HOST:-${VOLUMES_BASE_PATH}/ssl_certs}:/etc/letsencrypt:rw" # RW pour Certbot
      # Le volume pour le challenge webroot n'est plus nécessaire pour DNS-01 (wildcard)
      # - "${SUBLYMUS_NGINX_ACME_CHALLENGE_VOLUME_ON_HOST:-${VOLUMES_BASE_PATH}/nginx_acme_challenge}:/var/www/certbot"
    entrypoint: ["/bin/sh", "-c"]
    command: ["exec sleep infinity"] # Pour garder le conteneur actif pour `docker exec`
    # Pas besoin de le mettre sur sublymus_net_config si on utilise DNS-01

networks:
  sublymus_net_config:
    external: true
    name: "${SUBLYMUS_NETWORK}" # Utilise la variable chargée

# Déclaration des volumes pour référence, Docker les créera si les chemins hôtes existent
# ou Swarm utilisera les chemins hôtes directement pour les bind mounts.
# Pour la clarté, on peut les lister, mais ils sont implicitement gérés par les bind mounts ci-dessus.
# volumes:
#   sublymus_nginx_conf_vol_placeholder: # Noms différents pour éviter conflit avec ceux de infra
#     driver_opts:
#       type: none
#       device: "${SUBLYMUS_NGINX_CONF_VOLUME_ON_HOST:-${VOLUMES_BASE_PATH}/nginx_conf}"
#       o: bind
#   sublymus_ssl_certs_vol_placeholder:
#     driver_opts:
#       type: none
#       device: "${SUBLYMUS_SSL_CERTS_VOLUME_ON_HOST:-${VOLUMES_BASE_PATH}/ssl_certs}"
#       o: bind
EOF
) # Fin de compose_nginx_content

    # --- Contenu de nginx_base.conf ---
    local nginx_base_conf_content
    nginx_base_conf_content=$(cat <<EOF
# Fichier généré par sublymus-cli : ${nginx_base_conf_path}

user nginx;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    # server_tokens off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log warn;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    client_max_body_size 50M;

    # SSL Settings (Globaux)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m; # 10m ~ 40000 sessions
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    # Générer avec: sudo openssl dhparam -out /srv/sublymus/volumes/ssl_certs/dhparam.pem 2048
    # et monter ce fichier dans le conteneur Nginx et décommenter:
    # ssl_dhparam /etc/letsencrypt/dhparam.pem;

    # HTTP Strict Transport Security (HSTS)
    # À DÉCOMMENTER ET TESTER APRÈS QUE HTTPS FONCTIONNE PARFAITEMENT
    # map \$scheme \$hsts_header {
    #    https   "max-age=63072000; includeSubDomains; preload";
    # }
    # add_header Strict-Transport-Security \$hsts_header always;

    # OCSP Stapling
    # ssl_stapling on;
    # ssl_stapling_verify on;
    # resolver 1.1.1.1 1.0.0.1 8.8.8.8 8.8.4.4 valid=300s; # Résolveurs DNS fiables
    # resolver_timeout 5s;

    # Inclure les configurations générées par s_server
    # s_server écrit dans le volume monté sur /etc/nginx/sublymus_conf
    # et crée des liens dans /etc/nginx/sublymus_conf/sites-enabled/
    include /etc/nginx/sublymus_conf/sites-enabled/*.conf;

    # Serveur HTTP par défaut pour redirection et challenges ACME (si HTTP-01 est utilisé)
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _; # Attrape tous les domaines non spécifiquement configurés

        # Pour le challenge HTTP-01 (non utilisé pour wildcard DNS-01, mais bon à avoir)
        # Si tu montes un volume pour les challenges ACME dans Nginx sur /var/www/html/.well-known/acme-challenge
        # location /.well-known/acme-challenge/ {
        #     alias /var/www/html/.well-known/acme-challenge/; # Ajuste le chemin si différent
        #     try_files \$uri =404;
        # }

        # Rediriger tout le reste vers HTTPS une fois les certificats en place et les vhosts SSL configurés
        # Pour l'instant, on peut retourner 404 ou 444 pour le trafic HTTP non géré.
        # location / {
        #    return 301 https://\$host\$request_uri;
        # }
        return 444; # Ou une page "Site en construction"
    }

    # Un serveur HTTPS par défaut est également une bonne pratique,
    # surtout si tu as un certificat wildcard.
    # Il attrapera les requêtes HTTPS vers des sous-domaines non explicitement définis.
    # server {
    #     listen 443 ssl http2 default_server;
    #     listen [::]:443 ssl http2 default_server;
    #     server_name _;

    #     ssl_certificate /etc/letsencrypt/live/${YOUR_MAIN_DOMAIN:-sublymus.com}/fullchain.pem; # Certificat du domaine principal ou wildcard
    #     ssl_certificate_key /etc/letsencrypt/live/${YOUR_MAIN_DOMAIN:-sublymus.com}/privkey.pem;
    #     # include /etc/nginx/snippets/ssl-params.conf; # Si tu as un snippet

    #     return 404; # Ou une page d'erreur/information
    # }
}
EOF
) # Fin de nginx_base_conf_content

    # Écriture des fichiers
    write_if_needed "$compose_nginx_path" "$compose_nginx_content" "Docker Compose Nginx"
    write_if_needed "$nginx_base_conf_path" "$nginx_base_conf_content" "Nginx Base Config"

    log_success "Fichiers pour la stack Nginx Proxy générés/vérifiés."
}

# Helper pour écrire un fichier si nécessaire (avec confirmation d'écrasement)
# Usage: write_if_needed "chemin_fichier" "contenu" "Description du fichier"
write_if_needed() {
    local file_path="$1"
    local content="$2"
    local description="$3"
    local writer_cmd="" # Pour sudo si besoin

    if [ "$(id -u)" != "0" ] && ! [ -w "$(dirname "$file_path")" ] && ! [ -d "$(dirname "$file_path")" ]; then writer_cmd="sudo "; fi
    if [ "$(id -u)" != "0" ] && [ -f "$file_path" ] && ! [ -w "$file_path" ]; then writer_cmd="sudo "; fi

    if [ -f "$file_path" ]; then
        log_warn "Le fichier ${description} (${file_path}) existe déjà."
        ask_confirmation "Voulez-vous l'écraser avec la configuration générée ?" "n"
        if [ "$USER_CONFIRMED" != "y" ]; then
            log_info "Le fichier ${description} n'a pas été modifié."
            return 0
        fi
    fi
    log_info "Écriture du fichier ${description} : ${file_path}..."
    if ${writer_cmd}printf '%s\n' "$content" > "$file_path"; then
        run_command "${writer_cmd}chmod 644 \"$file_path\"" "Échec chmod ${file_path}"
        log_success "Fichier ${description} généré/mis à jour."
    else
        log_error "Échec de l'écriture dans ${file_path} pour ${description}."
        return 1
    fi
}

func_deploy_nginx_proxy_stack() {
    log_title "Déploiement/Mise à jour de la Stack Nginx Proxy et Certbot"


    if [ ! -f "$COMPOSE_NGINX_FILE" ] || [ ! -f "$NGINX_BASE_CONF_FILE" ]; then
        log_warn "Un ou plusieurs fichiers de configuration pour Nginx sont manquants."
        ask_confirmation "Voulez-vous générer les fichiers par défaut maintenant (${COMPOSE_NGINX_FILE}, ${NGINX_BASE_CONF_FILE}) ?" "y"
        if [ "$USER_CONFIRMED" == "y" ]; then
            func_generate_nginx_proxy_stack_files # Appelle la nouvelle fonction
            if [ $? -ne 0 ]; then
                log_error "Génération des fichiers de configuration Nginx échouée. Impossible de déployer la stack proxy."
                return 1
            fi
        else
            log_error "Fichiers de configuration Nginx manquants. Impossible de déployer la stack proxy."
            return 1
        fi
    fi

    log_info "Les variables d'environnement du fichier ${ENV_GLOBAL_FILE} (notamment pour les chemins des volumes) seront utilisées."
    ask_confirmation "Prêt à déployer/mettre à jour la stack 'sublymus_proxy' ?" "y"
    if [ "$USER_CONFIRMED" != "y" ]; then log_info "Déploiement annulé."; return 1; fi

    if [ -f "$ENV_GLOBAL_FILE" ]; then
        set -o allexport; source "$ENV_GLOBAL_FILE"; set +o allexport
    fi

    run_command "${DOCKER_CMD} stack deploy -c \"$COMPOSE_NGINX_FILE\" sublymus_proxy" "Échec du déploiement de la stack 'sublymus_proxy'."
    
    log_info "Attente de la stabilisation des services Nginx et Certbot (10 secondes)..."
    sleep 10

    log_info "Vérification de l'état des services de la stack 'sublymus_proxy':"
    run_command "${DOCKER_CMD} stack services sublymus_proxy" "Impossible de lister les services de sublymus_proxy"
    run_command "${DOCKER_CMD} stack ps sublymus_proxy" "Impossible d'afficher l'état des tâches de sublymus_proxy"

    local nginx_ready=false; local certbot_ready=false
    if ${DOCKER_CMD} service ps sublymus_proxy_nginx_proxy -f "desired-state=running" -f "current-state=running" --format "{{.ID}}" | grep -q .; then nginx_ready=true; fi
    if ${DOCKER_CMD} service ps sublymus_proxy_certbot -f "desired-state=running" -f "current-state=running" --format "{{.ID}}" | grep -q .; then certbot_ready=true; fi

    if [ "$nginx_ready" = true ] && [ "$certbot_ready" = true ]; then
        log_success "Services Nginx Proxy et Certbot semblent être en cours d'exécution."
    else
        log_warn "Un ou plusieurs services de la stack proxy ne sont pas 'Running'. Vérifiez les logs."
    fi
    log_success "Déploiement/Mise à jour de la stack Nginx Proxy terminé."
}

#-----------------------------------------
# --- Fonctions pour les modes/actions ---
#-----------------------------------------
show_help() {
    # <xxx Ancien printf pour APP_NAME et APP_VERSION
    # +++> Utilisation de variables pour APP_NAME et APP_VERSION
    printf "${COLOR_TITLE}%s - v%s${COLOR_RESET}\n" "${APP_NAME}" "${APP_VERSION}"
    # <===
    echo "Outil en ligne de commande pour gérer la plateforme Sublymus."
    echo ""
    printf "${COLOR_WARN}UTILISATION:${COLOR_RESET}\n"
    echo "  ./sublymus-cli <mode> [options]"
    echo ""
    printf "${COLOR_WARN}MODES D'INITIALISATION ET DE CONFIGURATION DE BASE:${COLOR_RESET}\n"
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "init" "Initialise un VPS nu (Docker, Swarm, dossiers, .env.example)."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "config global-env" "Options pour le fichier /srv/sublymus/.env :"
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "  --interactive" "  Configure interactivement /srv/sublymus/.env."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "  --generate-example" "  Génère /srv/sublymus/.env.example."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "config nginx-stack-files" "Options pour les fichiers de la stack Nginx :"
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "  --generate" "  Génère docker-compose.nginx.yml et nginx_base.conf."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "setup-s-server-env" "Génère/Met à jour le fichier /srv/sublymus/env/s_server.env."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "setup-git" "Configure les dépôts Git bare et hooks pour les services core."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "clone-sources" "(Optionnel) Clone les sources des services core depuis GitHub."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "add-theme <nom> [--git-url=URL]" "Configure un dépôt Git pour un nouveau thème."

    echo ""
    printf "${COLOR_WARN}MODES DE DÉPLOIEMENT ET GESTION DE LA PLATEFORME:${COLOR_RESET}\n"
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "deploy-infra" "Déploie/Met à jour la stack infrastructure (PostgreSQL, Redis)."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "deploy-nginx-proxy" "Déploie/Met à jour la stack Nginx Proxy et Certbot."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "deploy-s-server" "Déploie s_server, lance migrations & synchro plateforme."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "setup-ssl" "Guide interactif pour générer les certificats SSL wildcard (DNS-01)."
    # Les commandes suivantes sont des wrappers pour des actions sur des services existants
    # Leur implémentation complète viendra, mais elles sont conceptuellement là.
    # printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "start <service_name>" "(TODO) Démarre un service Swarm spécifique."
    # printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "stop <service_name>" "(TODO) Arrête un service Swarm spécifique."
    # printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "restart <service_name>" "(TODO) Redémarre un service Swarm spécifique."
    # printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "scale <service_name> --r=<N>" "(TODO) Met à l'échelle un service Swarm."

    echo ""
    printf "${COLOR_WARN}MODES DE DIAGNOSTIC ET D'INFORMATION:${COLOR_RESET}\n"
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "status [--service=<nom>]" "Affiche l'état de la plateforme ou d'un service."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "logs <nom_serv> [-f] [--tail=N]" "Affiche les logs d'un service Swarm."
    printf "  ${COLOR_CMD}%-25s${COLOR_RESET} %s\n" "help" "Affiche cette aide."

    # <xxx Section des modes TODO (Tier 1 non encore implémentés)
    # <xxx printf "  ${COLOR_CMD}deploy <service_name | --all>${COLOR_RESET} (TODO) Déploie/Met à jour un service applicatif ou tous.\n"
    # <xxx printf "  ${COLOR_CMD}update <service_name | --all>${COLOR_RESET} (TODO) Similaire à deploy, focus sur la mise à jour.\n"
    # <===

    echo ""
    printf "${COLOR_WARN}COMMANDES FUTURES ENVISAGÉES (Tier 2 & 3):${COLOR_RESET}\n"
    echo "  db (backup, restore, migrate), git-admin, user-admin, store-admin,"
    echo "  garbage-collect, platform (sync, backup), doctor, exec, shell, env, version."
    echo ""
}


show_status() {
    log_title "État de la Plateforme Sublymus"
    local service_filter="$1" # Argument optionnel --service=<name>

    log_info "--- Informations Docker Swarm ---"
    if run_command_silent "${DOCKER_CMD} info --format '{{.Swarm.LocalNodeState}}' | grep -q 'active'"; then
        run_command "${DOCKER_CMD} info --format 'Node ID: {{.Swarm.NodeID}} \nSwarm: {{.Swarm.LocalNodeState}} \nIs Manager: {{.Swarm.ControlAvailable}} \nNodes: {{.Swarm.Nodes}} \nManagers: {{.Swarm.Managers}}'" "Vérification info Swarm"
        log_info "Liste des nœuds du Swarm:"
        run_command "${DOCKER_CMD} node ls" "Affichage des noeuds Swarm"
    else
        log_warn "Docker Swarm n'est pas actif ou initialisé."
    fi

    log_info "\n--- Réseau Principal Sublymus (${SUBLYMUS_NETWORK}) ---"
    if run_command_silent "${DOCKER_CMD} network inspect \"$SUBLYMUS_NETWORK\""; then
        run_command "${DOCKER_CMD} network inspect \"$SUBLYMUS_NETWORK\" --format 'ID: {{.Id}}\nName: {{.Name}}\nDriver: {{.Driver}}\nScope: {{.Scope}}\nAttachable: {{.Attachable}}'" "Inspection du réseau ${SUBLYMUS_NETWORK}"
    else
        log_warn "Réseau ${SUBLYMUS_NETWORK} non trouvé."
    fi

    log_info "\n--- Stacks Docker Actives ---"
    run_command "${DOCKER_CMD} stack ls" "Listage des stacks"

    log_info "\n--- Services de la Stack 'sublymus_infra' ---"
    if run_command_silent "${DOCKER_CMD} stack services sublymus_infra"; then
        run_command "${DOCKER_CMD} stack ps sublymus_infra" "Statut des services sublymus_infra"
    else
        log_warn "Stack sublymus_infra non trouvée ou sans services."
    fi
    
    log_info "\n--- Services de la Stack 'sublymus_proxy' ---"
    if run_command_silent "${DOCKER_CMD} stack services sublymus_proxy"; then
        run_command "${DOCKER_CMD} stack ps sublymus_proxy" "Statut des services sublymus_proxy"
    else
        log_warn "Stack sublymus_proxy non trouvée ou sans services."
    fi

    local services_to_check=("s_server" "s_welcome" "s_dashboard" "s_docs" "s_admin") # Ajouter d'autres si besoin
    for srv in "${services_to_check[@]}"; do
        if [ -n "$service_filter" ] && [ "$service_filter" != "$srv" ]; then
            continue # Si un filtre est appliqué et ne correspond pas, on saute
        fi
        log_info "\n--- Service Applicatif: ${srv} ---"
        if run_command_silent "${DOCKER_CMD} service inspect \"$srv\""; then
            run_command "${DOCKER_CMD} service ps \"$srv\" --no-trunc" "Statut du service ${srv}"
        else
            log_warn "Service ${srv} non trouvé."
        fi
    done
    # TODO: Ajouter des checks plus spécifiques (connectivité BDD, Redis, healthchecks des apps)
}

get_service_logs() {
    local service_name="$1"
    local follow_flag="$2" # "-f" ou ""
    local tail_lines="${3:-50}" # Nombre de lignes par défaut

    if [ -z "$service_name" ]; then
        log_error "Nom du service manquant pour la commande 'logs'."
        show_help
        exit 1
    fi
    log_info "Affichage des logs pour le service '${service_name}' (tail: ${tail_lines}, follow: ${follow_flag:-non})..."
    run_command "${DOCKER_CMD} service logs ${follow_flag} --tail \"${tail_lines}\" \"${service_name}\"" "Récupération des logs pour ${service_name}"
}

# ... (Autres fonctions pour deploy-s-server, etc. viendront plus tard) ...

# --- Logique Principale et Gestion des Arguments ---
main() {
    # Si aucune commande n'est passée, afficher l'aide
    if [ -z "$1" ]; then show_help; exit 0; fi

    local MODE="$1"; shift

    #Charger la configuration initiale SAUF pour 'init' avant la génération du .env
    if [ "$MODE" != "init" ]; then
        load_config_or_set_defaults
    else
        # Pour init, si .env n'existe pas encore, on définit juste DOCKER_CMD
        DOCKER_CMD="sudo docker"
        if groups "${USER}" | grep -q '\bdocker\b' && [[ -S /var/run/docker.sock && -w /var/run/docker.sock ]]; then DOCKER_CMD="docker"; fi
        export DOCKER_CMD
    fi


    # Vérifier Docker seulement si ce n'est pas le mode 'init' qui va l'installer
    determine_docker_cmd

    case "$MODE" in
        "init")
            log_title "Mode INIT: Initialisation Complète du VPS et de la Plateforme Sublymus"
            ask_confirmation "Cette action va configurer le VPS pour Sublymus. Continuer ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi

            func_install_system_updates_docker
            # Re-déterminer DOCKER_CMD après installation potentielle et ajout au groupe
            if groups "${USER}" | grep -q '\bdocker\b' && [[ -S /var/run/docker.sock && -w /var/run/docker.sock ]]; then DOCKER_CMD="docker"; export DOCKER_CMD; fi
            
            func_initialize_docker_swarm
            func_create_persistent_volumes_dirs
            func_set_volumes_permissions
            
            if [ ! -f "$ENV_GLOBAL_FILE" ]; then
                log_warn "Le fichier de configuration global ${ENV_GLOBAL_FILE} n'existe pas."
                func_generate_global_env_example_file
                log_error "VEUILLEZ CONFIGURER ${ENV_GLOBAL_FILE} à partir de ${ENV_GLOBAL_FILE}.example et relancer les étapes suivantes."
                log_info "Vous pouvez utiliser './sublymus-cli config global-env --edit' (TODO) pour une édition guidée après l'avoir créé."
                exit 1 # On s'arrête ici pour que l'utilisateur configure son .env
            else
                log_info "Utilisation du fichier de configuration global existant : ${ENV_GLOBAL_FILE}"
                load_config_or_set_defaults # Charger les valeurs pour la suite
                # Optionnel: Afficher certaines valeurs pour confirmation (sans les secrets)
                log_info "  Domaine Principal configuré : ${YOUR_MAIN_DOMAIN}"
                log_info "  Utilisateur DB Infra     : ${DB_USER_INFRA}"
            fi
            
            # Proposer de générer le fichier compose pour l'infra (comme avant)
            ask_confirmation "Voulez-vous générer/vérifier le fichier docker-compose.infrastructure.yml maintenant ?" "y"
            if [ "$USER_CONFIRMED" == "y" ]; then
                func_generate_infra_compose_file
            else
                log_info "Génération du fichier docker-compose pour l'infrastructure ignorée."
                log_warn "Vous devrez le créer manuellement ou via './sublymus-cli config infra-compose --generate' avant de pouvoir déployer l'infra."
            fi
           
           ask_confirmation "Générer/Vérifier les fichiers pour la stack Nginx (docker-compose.nginx.yml, nginx_base.conf) ?" "y"
            if [ "$USER_CONFIRMED" == "y" ]; then
                func_generate_nginx_proxy_stack_files
            fi

            log_info "L'initialisation de base du VPS est terminée."
            log_info "Prochaines étapes suggérées (commandes ./sublymus-cli) :"
            log_info "  deploy-infra             : Déploie PostgreSQL, Redis."
            log_info "  deploy-nginx-proxy      : Déploie Nginx, Certbot."
            log_info "  setup-s-server-env       : Configure l'environnement pour s_server."
            log_info "  setup-git                : Configure les dépôts Git pour les services core et thème par défaut."
            log_info "  clone-sources            : (Optionnel) Clone les sources des services core depuis GitHub."
            log_info "  add-theme <nom_theme> [--git-url=...] : Pour ajouter d'autres thèmes."
            log_info "  (Effectuez les 'git push' initiaux pour chaque service depuis votre machine locale)"
            log_info "  deploy-s-server"
            log_info "  deploy-s-admin"
            log_info "  deploy-s-dashboard"
            log_info "  deploy-s-welcome"
            log_info "  deploy-all               : Déploie tout d'un coup."
            log_info "  setup-ssl                : Pour générer vos certificats HTTPS"
            ;;
        "deploy-infra")
            log_title "Mode DEPLOY-INFRA: Déploiement de PostgreSQL et Redis"
            ask_confirmation "Déployer/Mettre à jour la stack d'infrastructure (PostgreSQL, Redis) ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            func_deploy_infra_stack
            log_info "Prochaine étape suggérée : ./sublymus-cli setup-s-server-env"
            ;;
        
        "deploy-nginx-proxy")
            log_title "Mode DEPLOY-NGINX-PROXY: Déploiement de Nginx et Certbot"
            ask_confirmation "Déployer/Mettre à jour la stack 'sublymus_proxy' (Nginx, Certbot) ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            func_deploy_nginx_proxy_stack
            log_info "Prochaine étape suggérée : ./sublymus-cli setup-s-server-env (si pas déjà fait) OU ./sublymus-cli setup-ssl"
            ;;
        "setup-s-server-env")
            log_title "Mode SETUP-S-SERVER-ENV: Génération du .env pour s_server"
            ask_confirmation "Générer/Mettre à jour ${ENV_S_SERVER_FILE} ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            func_generate_s_server_env_file
            log_info "Prochaine étape suggérée : ./sublymus-cli setup-git"
            ;;
        "deploy-s-server") # (MODIFIÉ pour inclure les étapes)
            log_title "Mode DEPLOY-S-SERVER: Déploiement et Configuration Initiale de s_server"
            ask_confirmation "Déployer/Mettre à jour s_server, lancer ses migrations et la synchronisation de la plateforme ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            
            func_deploy_s_server_service
            # if [ $? -ne 0 ]; then log_error "Le déploiement de s_server a échoué. Opérations suivantes annulées."; exit 1; fi
            # La synchronisation est gérée par s_server à son démarrage (via preload file)
            log_info "s_server devrait être en train de se synchroniser avec la plateforme."
            log_info "Surveillez les logs de s_server avec: ./sublymus-cli logs s_server -f"
            
            log_info "Prochaine étape suggérée : ./sublymus-cli setup-ssl (si pas déjà fait) ou ./sublymus-cli status"
            ;;
        "deploy-s-admin")
            log_title "Mode DEPLOY-S-ADMIN"
            ask_confirmation "Déployer/Mettre à jour s_admin ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            func_deploy_s_admin_service
            ;;
        "deploy-s-dashboard")
            log_title "Mode DEPLOY-S-DASHBOARD"
            ask_confirmation "Déployer/Mettre à jour s_dashboard ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            func_deploy_s_dashboard_service
            ;;
        "deploy-s-welcome")
            log_title "Mode DEPLOY-S-WELCOME"
            ask_confirmation "Déployer/Mettre à jour s_welcome ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            func_deploy_s_welcome_service
            ;;
        "deploy-all")
            log_title "Mode DEPLOY-ALL: Déploiement de TOUS les services"
            ask_confirmation "Déployer Infra, Proxy, s_server, s_admin, s_dashboard, s_welcome ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            
            func_deploy_infra_stack
            func_deploy_nginx_proxy_stack
            func_deploy_s_server_service
            func_deploy_s_admin_service
            func_deploy_s_dashboard_service
            func_deploy_s_welcome_service
            
            log_success "Déploiement complet terminé."
            ;;
        "setup-ssl")
            log_title "Mode SETUP-SSL: Génération des Certificats SSL via Certbot"
            # S'assurer que la stack proxy (certbot) est déployée
            if ! ${DOCKER_CMD} service inspect sublymus_proxy_certbot > /dev/null 2>&1; then
                log_warn "Service sublymus_proxy_certbot non trouvé."
                ask_confirmation "Voulez-vous déployer la stack Nginx/Certbot maintenant ?" "y"
                if [ "$USER_CONFIRMED" == "y" ]; then
                    func_deploy_nginx_proxy_stack
                    if [ $? -ne 0 ]; then log_error "Déploiement stack proxy échoué. SSL annulé."; exit 1; fi
                else
                    log_error "Stack proxy non déployée. SSL annulé."; exit 1;
                fi
            fi
            func_generate_ssl_certificates_interactive
            ;;
        "setup-git") # (MODIFIÉ)
            log_title "Mode SETUP-GIT: Configuration des Dépôts Git et Hooks"
            ask_confirmation "Configurer les dépôts Git pour les services core et le thème par défaut ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            func_setup_git_repositories # Appelle la fonction refactorisée
            log_info "Utilisez './sublymus-cli add-theme <nom> pour ajouter d'autres thèmes."
            ;;
        "clone-sources") 
            log_title "Mode CLONE-SOURCES: Clonage des dépôts GitHub des services Core"
            ask_confirmation "Cloner/Mettre à jour les sources des services core depuis GitHub vers ${SRC_BASE_PATH} ?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Opération annulée."; exit 0; fi
            func_clone_initial_sources # Appelle la fonction refactorisée
            ;;
        "add-theme")
            log_title "Mode ADD-THEME: Ajout d'un nouveau thème"
            if [ -z "$1" ]; then
                log_error "Nom du thème manquant. Usage: ./sublymus-cli add-theme <nom_du_theme> [--git-url=<url>]"
                exit 1
            fi
            local theme_name_input="$1"
            local theme_service_name # Nom final avec préfixe theme_
            local theme_git_url=""

            # Extraire --git-url si présent
            # Simple parsing, pourrait être amélioré avec getopts
            if [[ "$2" == "--git-url="* ]]; then
                theme_git_url="${2#--git-url=}"
            fi

            # Ajouter le préfixe "theme_" si absent
            if [[ "$theme_name_input" =~ ^theme_ ]]; then
                theme_service_name="$theme_name_input"
            else
                theme_service_name="theme_${theme_name_input}"
            fi
            log_info "Nom de service du thème sera: ${theme_service_name}"

            ask_confirmation "Ajouter le thème '${theme_service_name}' ${theme_git_url:+"et cloner depuis ${theme_git_url} "}?" "y"
            if [ "$USER_CONFIRMED" != "y" ]; then log_info "Ajout du thème annulé."; exit 0; fi

            local deploy_group; deploy_group=$(id -g -n "$DEPLOY_USER")
            func_setup_one_git_repository "$theme_service_name" "$DEPLOY_USER" "$deploy_group"
            if [ $? -ne 0 ]; then log_error "Échec configuration dépôt Git pour ${theme_service_name}."; exit 1; fi

            if [ -n "$theme_git_url" ]; then
                func_clone_one_source "$theme_service_name" "$theme_git_url" "$DEPLOY_USER" "$deploy_group"
                if [ $? -ne 0 ]; then log_warn "Échec clonage source pour ${theme_service_name}, mais dépôt Git créé."; fi
            else
                log_info "Aucune URL Git fournie. Créez le répertoire /srv/sublymus/src/${theme_service_name} et pushez votre code."
            fi
            
            log_info "Thème ${theme_service_name} configuré pour déploiement Git."
            log_info "N'oubliez pas d'enregistrer ce thème dans s_server (via API admin ou commande ace) pour qu'il soit utilisable."
            ;;
        "config") # (MODIFIÉ pour inclure la nouvelle option)
            # ... (global-env existant) ...
            # +++>
            if [ "$1" == "nginx-stack-files" ] && ( [ "$2" == "--generate" ] || [ "$2" == "--regenerate" ] ); then
                load_config_or_set_defaults # Assurer que les variables globales sont chargées
                ask_confirmation "Ceci va (re)générer docker-compose.nginx.yml et nginx_base.conf. Continuer ?" "y"
                if [ "$USER_CONFIRMED" == "y" ]; then
                    func_generate_nginx_proxy_stack_files
                else
                    log_info "Génération des fichiers de la stack Nginx annulée."
                fi
            # <===
            # ... (else pour option de config inconnue) ...
            elif [ "$1" == "global-env" ] && [ "$2" == "--interactive" ]; then
                load_config_or_set_defaults
                func_configure_global_env_interactive
                load_config_or_set_defaults
            elif [ "$1" == "global-env" ] && [ "$2" == "--generate-example" ]; then
                func_generate_global_env_example_file
            else
                log_error "Option de configuration inconnue. Usage: config global-env [--interactive | --generate-example] | config nginx-stack-files --generate"
                show_help
            fi
            ;;
        "status")
            local service_name_filter=""
            if [[ "$1" == "--service="* ]]; then service_name_filter="${1#--service=}";
            elif [ -n "$1" ] && [[ ! "$1" == --* ]]; then service_name_filter="$1"; fi
            show_status "$service_name_filter"
            ;;
        "logs")
            local service_to_log="$1"; local follow_opt=""; local tail_opt="50"; shift
            while [ "$#" -gt 0 ]; do case "$1" in -f|--follow) follow_opt="-f";; --tail=*) tail_opt="${1#--tail=}";; *) log_error "Option inconnue: $1"; show_help; exit 1;; esac; shift; done
            get_service_logs "$service_to_log" "$follow_opt" "$tail_opt"
            ;;
        "help" | "--help" | "-h") show_help ;;
        *) log_error "Mode inconnu: $MODE"; show_help; exit 1 ;;
    esac

    log_success "Opération CLI '$MODE' terminée."
}

# Exécuter la fonction principale
main "$@"