---
name: openverse
description: Search and download openly licensed sound effects, music and images from Openverse (api.openverse.org - Freesound, Jamendo, Wikimedia, Flickr and more), filtered by license (CC0, CC BY, commercial use) and duration, with a credits.json written next to every download. Use when a video, game or page needs real recorded SFX, ambience, music or images that are free to use, when the user mentions Openverse, Creative Commons or CC0 media, or when real-sfx / real-sound / earshot need source recordings.
---

# openverse: openly licensed media

Script: `python .claude/skills/openverse/scripts/openverse.py` (stdlib only, no key).

```bash
# search (prints: id, duration, license, source, title)
python .claude/skills/openverse/scripts/openverse.py search audio "soft whoosh" --license cc0 --max-dur 3 -n 20
python .claude/skills/openverse/scripts/openverse.py search image "mountain sunrise" --commercial
# download by id into a folder; appends title/creator/license/credit line to FOLDER/credits.json
python .claude/skills/openverse/scripts/openverse.py get audio ID1 ID2 --out media/sfx
```

## Rules
- **Licenses**: prefer `--license cc0` (no credit needed). `by` / `by-sa` need the credit line from `credits.json`
  in the video description or end card. `by-nc` / `by-nc-nd` / `nd`: never for commercial work; `nd` cannot be edited
  (trimming / processing a sound counts as a derivative). Pass `--commercial` when the work is commercial.
- **You cannot hear.** Rank and trim candidates with the `earshot` skill (`earshot rank "query" files...`,
  `earshot find FILE "query"`, `earshot realness`) before calling a sound right. Download 5-10 candidates, not one.
- **Hosts and known limits** (checked 2026-11-13 from a cloud session): search always works. Files come from each
  source, not from Openverse: `cdn.freesound.org` answers an empty 403 to direct downloads (hotlink protection) and
  `upload.wikimedia.org` can answer 429 to shared cloud IPs. When a download fails, give the user the `landing_url`
  to download by hand (then put the file in the repo), or try another `--source` (e.g. `jamendo`, which needs the host
  `prod-1.storage.jamendo.com` allowed). A proxy 403 with "connect_rejected" means a host not yet allowed.
- `--source` filters by provider: `freesound`, `wikimedia_audio`, `jamendo`, `ccmixter` (audio); `wikimedia`, `flickr`… (images).
- For a real-sfx library: download into a folder, then `python .claude/skills/real-sfx/scripts/setup.py add-library
  openverse FOLDER --tier extra --index`.
- Anonymous API limit is low (~100 requests/day burst limits); avoid loops of many searches.
