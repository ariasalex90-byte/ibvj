#!/bin/bash
# copy-assets.sh
# Copia las imágenes y videos desde el WordPress local hacia web/assets/
# Ejecutar desde la raíz del proyecto: bash web/copy-assets.sh

set -e

SRC="app/public/wp-content/uploads/2026/03"
DEST_IMG="web/assets/images"
DEST_VID="web/assets/videos"

echo "Copiando assets de WordPress → web/assets/"

# ── Videos ───────────────────────────────────────────────────────────────────
cp "$SRC/church-banner-1.mp4"  "$DEST_VID/church-banner-1.mp4"
cp "$SRC/church-banner-2.mp4"  "$DEST_VID/church-banner-2.mp4"
cp "$SRC/church-banner-3.mp4"  "$DEST_VID/church-banner-3.mp4"
echo "✓ Videos copiados"

# ── Logo ─────────────────────────────────────────────────────────────────────
cp "$SRC/logo.jpg"             "$DEST_IMG/logo.jpg"
echo "✓ Logo copiado"

# ── Congregación (Bienvenida) ─────────────────────────────────────────────────
cp "$SRC/IMG-20251228-WA0014.jpg"   "$DEST_IMG/congregation.jpg"
echo "✓ Foto congregación copiada"

# ── Pastor ───────────────────────────────────────────────────────────────────
cp "$SRC/pastor.png"           "$DEST_IMG/pastor.png"
echo "✓ Foto pastor copiada"

# ── Ministerios ───────────────────────────────────────────────────────────────
cp "$SRC/IMG-20251227-WA0022.jpg"   "$DEST_IMG/ministerio-damas.jpg"
cp "$SRC/IMG-20250831-WA0026.jpg"   "$DEST_IMG/ministerio-jovenes.jpg"
cp "$SRC/IMG-20251206-WA0039.jpg"   "$DEST_IMG/ministerio-ninos.jpg"
cp "$SRC/IMG-20251228-WA0011.jpg"   "$DEST_IMG/ministerio-oracion.jpg"
cp "$SRC/IMG-20251228-WA0011.jpg"   "$DEST_IMG/ministerio-consolacion.jpg"
echo "✓ Fotos de ministerios copiadas"

# ── Sana Doctrina ─────────────────────────────────────────────────────────────
cp "$SRC/william.jpeg"                     "$DEST_IMG/william.jpeg"
cp "$SRC/misionero.jpeg"                   "$DEST_IMG/misionero.jpeg"
cp "$SRC/the_apostle_paul_1942.9.59.jpg"   "$DEST_IMG/apostle-paul.jpg"
echo "✓ Imágenes de doctrina copiadas"

# ── Evangelismo y Misiones ────────────────────────────────────────────────────
cp "$SRC/illustration.png"               "$DEST_IMG/illustration.png"
cp "$SRC/IMG-20251019-WA0016.jpg"        "$DEST_IMG/missions-event.jpg"
echo "✓ Imágenes de misiones copiadas"

echo ""
echo "✅ Listo. Todos los assets están en web/assets/"
echo "   Abre web/index.html en tu navegador para ver el sitio."
