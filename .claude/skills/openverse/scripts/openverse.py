#!/usr/bin/env python3
"""Search and download openly licensed audio and images from Openverse (api.openverse.org).

  python openverse.py search audio "whoosh" [--license cc0] [--commercial] [--max-dur 3] [-n 20] [--json]
  python openverse.py search image "city at night" [--license cc0,by] [-n 20]
  python openverse.py get audio ID [ID ...] --out DIR      # downloads file + appends to DIR/credits.json

Standard library only. No API key needed (anonymous rate limit applies).
"""
import argparse
import json
import os
import re
import ssl
import sys
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://api.openverse.org/v1"
UA = os.environ.get("OPENVERSE_UA", "openverse-skill/1.0 (Claude Code skill; downloads CC media found via https://openverse.org) python-urllib")


def _ctx():
    for p in (os.environ.get("SSL_CERT_FILE"), "/root/.ccr/ca-bundle.crt"):
        if p and Path(p).exists():
            return ssl.create_default_context(cafile=p)
    return ssl.create_default_context()


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, context=_ctx(), timeout=60) as r:
        data = r.read()
    return data if binary else json.loads(data)


def search(kind, q, license=None, commercial=False, max_dur=None, n=20, page=1, source=None):
    params = {"q": q, "page_size": min(n, 20) if max_dur else n, "page": page}
    if license:
        params["license"] = license
    if commercial:
        params["license_type"] = "commercial"
    if source:
        params["source"] = source
    out, pg = [], page
    while len(out) < n:
        params["page"] = pg
        d = fetch(f"{API}/{kind}/?{urllib.parse.urlencode(params)}")
        res = d.get("results", [])
        for r in res:
            if max_dur and kind == "audio" and (r.get("duration") or 0) > max_dur * 1000:
                continue
            out.append(r)
        if not res or pg >= (d.get("page_count") or 1) or pg - page >= 4:
            break
        pg += 1
    return out[:n]


def credit_line(r):
    lic = (r.get("license") or "").upper()
    ver = r.get("license_version") or ""
    lic_txt = "CC0" if lic == "CC0" else ("Public Domain Mark" if lic == "PDM" else f"CC {lic} {ver}".strip())
    return f'"{r.get("title")}" by {r.get("creator") or "unknown"} ({r.get("source")}), {lic_txt} - {r.get("foreign_landing_url")}'


def cmd_search(a):
    rs = search(a.kind, a.query, a.license, a.commercial, a.max_dur, a.n, source=a.source)
    if a.json:
        print(json.dumps(rs, indent=1, ensure_ascii=False))
        return
    for r in rs:
        dur = f'{(r.get("duration") or 0) / 1000:5.1f}s ' if a.kind == "audio" else ""
        print(f'{r["id"]}  {dur}{r.get("license"):6} {r.get("source"):12} {r.get("title", "")[:60]}')
    print(f"{len(rs)} results", file=sys.stderr)


def cmd_get(a):
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    cred_path = out / "credits.json"
    credits = json.loads(cred_path.read_text()) if cred_path.exists() else []
    for i in a.ids:
        r = fetch(f"{API}/{a.kind}/{i}/")
        url = r["url"]
        ext = Path(urllib.parse.urlparse(url).path).suffix or (".mp3" if a.kind == "audio" else ".jpg")
        name = re.sub(r"[^A-Za-z0-9._-]+", "_", f'{r.get("title") or i}')[:60] + f"_{i[:8]}{ext}"
        try:
            (out / name).write_bytes(fetch(url, binary=True))
        except Exception as e:
            print(f"{i}: download failed from {urllib.parse.urlparse(url).netloc}: {e}", file=sys.stderr)
            continue
        entry = {"file": name, "id": i, "title": r.get("title"), "creator": r.get("creator"),
                 "source": r.get("source"), "license": r.get("license"),
                 "license_version": r.get("license_version"), "license_url": r.get("license_url"),
                 "landing_url": r.get("foreign_landing_url"), "credit": credit_line(r)}
        credits = [c for c in credits if c.get("id") != i] + [entry]
        print(f"wrote {out / name}  [{r.get('license')}]")
    cred_path.write_text(json.dumps(credits, indent=1, ensure_ascii=False))
    print(f"credits: {cred_path}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("search")
    s.add_argument("kind", choices=["audio", "image"])
    s.add_argument("query")
    s.add_argument("--license", help="comma list: cc0,pdm,by,by-sa,by-nc,...")
    s.add_argument("--source", help="comma list, e.g. wikimedia_audio,jamendo,freesound,wikimedia,flickr")
    s.add_argument("--commercial", action="store_true", help="only licenses allowing commercial use")
    s.add_argument("--max-dur", type=float, help="audio: max duration in seconds")
    s.add_argument("-n", type=int, default=20)
    s.add_argument("--json", action="store_true")
    s.set_defaults(f=cmd_search)
    g = sp.add_parser("get")
    g.add_argument("kind", choices=["audio", "image"])
    g.add_argument("ids", nargs="+")
    g.add_argument("--out", required=True)
    g.set_defaults(f=cmd_get)
    a = p.parse_args()
    if a.kind == "image":
        a.kind = "images"
    a.f(a)


if __name__ == "__main__":
    main()
