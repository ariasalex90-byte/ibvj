#!/bin/bash
# setup.sh — Primer arranque del sitio IBVJ con Docker
# Uso: bash setup.sh

set -e

# Cargar variables del .env si existe
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

WP_PORT=${WP_PORT:-8080}
PMA_PORT=${PMA_PORT:-8081}
OLD_URL="http://test2.local"
NEW_URL="http://localhost:${WP_PORT}"

echo "==> Levantando contenedores..."
docker compose up -d

echo "==> Esperando que MySQL esté listo..."
until docker compose exec db mysqladmin ping -h localhost -uroot -p"${DB_ROOT_PASSWORD:-root}" --silent 2>/dev/null; do
  printf "."
  sleep 3
done
echo " OK"

echo "==> Esperando que WordPress esté listo..."
until docker compose exec wordpress curl -s http://localhost > /dev/null 2>&1; do
  printf "."
  sleep 3
done
echo " OK"

echo "==> Actualizando URLs de ${OLD_URL} a ${NEW_URL}..."
docker compose run --rm \
  -e WORDPRESS_DB_HOST=db \
  -e WORDPRESS_DB_NAME=local \
  -e WORDPRESS_DB_USER=root \
  -e WORDPRESS_DB_PASSWORD="${DB_ROOT_PASSWORD:-root}" \
  --entrypoint wp \
  wordpress:cli \
  search-replace "${OLD_URL}" "${NEW_URL}" \
  --allow-root \
  --path=/var/www/html \
  --network=ibvj_default 2>/dev/null || \
docker compose exec wordpress bash -c "
  curl -sO https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar &&
  php wp-cli.phar search-replace '${OLD_URL}' '${NEW_URL}' --allow-root --path=/var/www/html
"

echo ""
echo "================================================"
echo " Sitio listo en:     ${NEW_URL}"
echo " phpMyAdmin en:      http://localhost:${PMA_PORT}"
echo " Admin WordPress:    ${NEW_URL}/wp-admin"
echo "================================================"
