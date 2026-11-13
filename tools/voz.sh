#!/bin/bash
# Genera voz en off en español con edge-tts.
# Uso: tools/voz.sh guion.txt salida.mp3 [voz]
# Voces: es-ES-AlvaroNeural, es-ES-ElviraNeural, es-MX-JorgeNeural, es-MX-DaliaNeural, es-AR-TomasNeural
set -e
TXT="$1"; OUT="$2"; VOZ="${3:-es-ES-AlvaroNeural}"
[ -z "$TXT" ] || [ -z "$OUT" ] && { echo "Uso: $0 guion.txt salida.mp3 [voz]"; exit 1; }
ARGS=()
[ -n "$HTTPS_PROXY" ] && ARGS+=(--proxy "$HTTPS_PROXY")
[ -f /root/.ccr/ca-bundle.crt ] && export SSL_CERT_FILE=/root/.ccr/ca-bundle.crt
edge-tts "${ARGS[@]}" --voice "$VOZ" --file "$TXT" --write-media "$OUT" --write-subtitles "${OUT%.*}.srt"
echo "Listo: $OUT (+ subtítulos ${OUT%.*}.srt)"
