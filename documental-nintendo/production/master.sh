#!/usr/bin/env bash
# Masterizado: normaliza el audio del render a -16 LUFS / -1.5 dBTP en dos pasadas; el vídeo se copia sin recodificar.
set -euo pipefail
IN=${1:-renders/nintendo_documental_raw.mov}
OUT=${2:-renders/nintendo_documental_1080p.mp4}
STATS=$(ffmpeg -hide_banner -nostats -i "$IN" -map 0:a -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$STATS" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -y -i "$IN" -map 0:v -map 0:a -c:v copy \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" \
  -ar 48000 -c:a aac -b:a 256k -movflags +faststart "$OUT"
echo "entrada: I=$(get input_i) LUFS, TP=$(get input_tp) dBTP"
