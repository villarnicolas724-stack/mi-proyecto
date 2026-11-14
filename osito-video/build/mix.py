import subprocess
voice=[("n1",1.2),("n2",9.0),("n3",17.0),("n4",27.4),("n5",39.6),("n6",50.0)]
sfx=[("pop0",3.0,-14),("glock",5.75,-16),("glock",6.1,-19),("glock",6.45,-19),
("cel_a",8.7,-10),("cel_b",9.3,-10),("cel_c",9.9,-10),("cel_a",10.4,-13),("fall",10.75,-8)]
sfx+=[("step",15.85+i*0.36,-20) for i in range(8)]
sfx+=[("hop1",17.15,-10),("hop2",18.75,-10),("hop1",19.35,-13),("velvet",21.6,-12),("hop1",23.0,-12),("glock",23.5,-14),
("gust",26.3,-8),("hop1",27.1,-14),("hop2",27.45,-14),("cloth",30.0,-10),("cloth",31.0,-12),("shim_a",33.7,-8),
("velvet",37.0,-10),("pop0",38.0,-16),("pop2",38.7,-16),("pop4",39.4,-16),("pop0",40.1,-16),("pop2",40.8,-16),
("rev",40.4,-8),("burst",41.12,-6),("shim_b",42.0,-8),("kal",45.2,-12),("pop2",46.95,-16),
("velvet",48.8,-10),("rev",49.97,-8),("shim_c",50.7,-8),("kal",51.0,-10),("glock",52.9,-16),
("pop0",52.95,-14),("pop2",53.2,-14),("pop4",53.45,-14),("pop0",53.75,-14),("pop2",54.05,-14),("pop4",54.35,-14),
("bloom",56.4,-8)]
args=["ffmpeg","-hide_banner","-loglevel","error","-y"]
M="assets/music/frost_waltz.mp3"
args+=["-i",M,"-i",M]
for v,_ in voice: args+=["-i",f"assets/voz/{v}.wav"]
for s,_,_ in sfx: args+=["-i",f"assets/sfx/{s}.wav"]
f=[]
f.append("[0:a]atrim=0:41.5,asetpts=PTS-STARTPTS,afade=t=in:d=0.8,aresample=48000,aformat=channel_layouts=stereo[mA]")
f.append("[1:a]atrim=88:109.5,asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,adelay=39500|39500[mB]")
f.append("[mA][mB]acrossfade=d=0.01[dummy]") if False else None
f.append("[mA]afade=t=out:st=39.5:d=2[mA2]")
f.append("[mB]afade=t=in:st=39.5:d=2,afade=t=out:st=57.3:d=2.7[mB2]")
f.append("[mA2][mB2]amix=inputs=2:normalize=0,volume=0.8[music]")
vl=[]
for i,(v,t) in enumerate(voice):
    ms=int(t*1000); f.append(f"[{2+i}:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-16:TP=-2,aresample=48000,adelay={ms}|{ms}[v{i}]"); vl.append(f"[v{i}]")
f.append("".join(vl)+f"amix=inputs={len(vl)}:normalize=0,apad=whole_dur=61,asplit=2[voice][sc]")
f.append("[music][sc]sidechaincompress=threshold=0.02:ratio=5:attack=60:release=500:makeup=1[mduck]")
sl=[]
base=2+len(voice)
for i,(s,t,g) in enumerate(sfx):
    ms=int(t*1000); f.append(f"[{base+i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g}dB,adelay={ms}|{ms}[s{i}]"); sl.append(f"[s{i}]")
f.append("".join(sl)+f"amix=inputs={len(sl)}:normalize=0[fx]")
f.append("[mduck][voice][fx]amix=inputs=3:normalize=0,apad=whole_dur=60,atrim=0:60,loudnorm=I=-15:TP=-1.5:LRA=11,aresample=48000[out]")
f=[x for x in f if x]
args+=["-filter_complex",";".join(f),"-map","[out]","-ar","48000","-ac","2","assets/mix.wav"]
subprocess.run(args,check=True)
