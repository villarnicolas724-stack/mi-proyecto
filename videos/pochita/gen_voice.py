"""Genera la voz por frase con Chatterbox multilingüe (es), verifica con Whisper y reintenta con otra semilla."""
import json, re, difflib, unicodedata, subprocess
from pathlib import Path
import perth
if perth.PerthImplicitWatermarker is None: perth.PerthImplicitWatermarker = perth.DummyWatermarker
import torch, torchaudio as ta, whisper
torch.set_num_threads(4)
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
P = Path(__file__).parent; out = P / "assets/vo2"; out.mkdir(parents=True, exist_ok=True)
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu"); wm = whisper.load_model("small")
norm = lambda s: re.sub(r"[^a-zñ ]", "", unicodedata.normalize("NFKD", s.lower()).encode("ascii", "ignore").decode().replace("~", "")).split()
meta = {}
for sid, sents in json.load(open(P / "script.json")):
    meta[sid] = []
    for i, txt in enumerate(sents):
        f = out / f"{sid}_{i}.wav"; best = (-1, None)
        for seed in (11, 23, 37, 51):
            torch.manual_seed(seed)
            w = m.generate(txt, language_id="es", exaggeration=0.8, cfg_weight=0.35, temperature=0.75)
            ta.save(str(f), w, m.sr)
            hyp = wm.transcribe(str(f), language="es", initial_prompt="Pochita, Denji, Makima, Chainsaw Man, Tatsuki Fujimoto, yakuza")["text"]
            r = difflib.SequenceMatcher(None, norm(txt), norm(hyp)).ratio()
            dur = w.shape[-1] / m.sr
            ok_len = dur < 2.2 + len(txt) * 0.11
            print(sid, i, seed, round(r, 3), round(dur, 2), hyp.strip(), flush=True)
            if ok_len and r > best[0]:
                best = (r, seed); subprocess.run(["cp", str(f), str(f) + ".best"])
            if r >= 0.93 and ok_len: break
        subprocess.run(["mv", str(f) + ".best", str(f)])
        meta[sid].append({"text": txt, "file": str(f.relative_to(P)), "score": best[0], "seed": best[1]})
json.dump(meta, open(P / "assets/vo2/meta.json", "w"), ensure_ascii=False, indent=1)
print("DONE")
