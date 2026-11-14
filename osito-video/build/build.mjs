// Generates compositions/s1..s6.html from the shared rig. Run: node build/build.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import {
  C, rng, defs, bear, bunny, elephant, magicStar, skyRect, tinyStars, cloud, cottonMountains, hill, tree,
  cottage, flower, mushroom, fireflies, starPath, RUNTIME,
} from "./rig.mjs";

mkdirSync(new URL("../compositions/", import.meta.url), { recursive: true });

const place = (x, y, s, inner, extra = "") => `<g transform="translate(${x} ${y}) scale(${s})" ${extra}>${inner}</g>`;
const svgOpen = (id) => `<svg id="${id}" viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">`;
const shot = (id, start, dur, body, z = 1) =>
  `<div id="${id}" class="clip shot" data-start="${start}" data-duration="${dur}" style="z-index:${z}" data-layout-allow-overflow>${body}</div>`;

function scene(id, dur, shots, script, extraHtml = "", extraCss = "") {
  return `<template>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; background: #2F2752; }
    #root .shot { position: absolute; inset: 0; overflow: hidden; }
    #root .shot svg { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    ${extraCss}
  </style>
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" data-duration="${dur}">
    ${shots}
    ${extraHtml}
  </div>
  <script>
  (function(){
  ${RUNTIME}
  const tl = gsap.timeline({ paused: true });
  ${script}
  window.__timelines["${id}"] = tl;
  })();
  </script>
</template>
`;
}
const write = (name, html) => writeFileSync(new URL(`../compositions/${name}.html`, import.meta.url), html);

// fade a shot in (dissolve) by animating its svg child
const dissolveIn = (svgId, t, d = 0.4) => `tl.fromTo("#${svgId}",{opacity:0},{opacity:1,duration:${d},ease:"sine.inOut"},${t});`;

// ======================= SCENE 1 — el mundo de peluche (0–8) =======================
{
  const P = "s1";
  const ST = tinyStars(P, "s1b-st", 14, 11, [80, 40, 1760, 380], [6, 12]);
  const riverD = "M-100 1000 C 300 900 520 960 760 880 S 1180 780 1500 820 S 1900 760 2100 740";
  const smoke = [0, 1, 2].map((i) => `<circle id="s1a-smoke${i}" cx="0" cy="0" r="${16 + i * 4}" fill="#fff" opacity="0"/>`).join("");
  const a = `${svgOpen("s1a-svg")}${defs(P)}
  <g id="s1a-cam">
    ${skyRect("s1a-sky", [[0, "#F7B8CF"], [0.45, "#FBD3C6"], [0.8, "#FDE7CF"], [1, "#FFF1DC"]])}
    <circle cx="1320" cy="560" r="420" fill="url(#${P}-gWarm)"/>
    <circle cx="1320" cy="560" r="120" fill="#FFF1C4" opacity="0.9" filter="url(#${P}-blur3)"/>
    ${cloud(P, 380, 200, 1.1, 0.85)} ${cloud(P, 1620, 150, 0.9, 0.8)} ${cloud(P, 980, 260, 0.7, 0.7)}
    ${cottonMountains(P, 560, "url(#" + P + "-gLav)", 3, 8, 200)}
    ${cottonMountains(P, 660, "url(#" + P + "-gRose)", 5, 9, 150)}
    ${hill(P, "M-200 1180 L-200 760 C 200 680 520 740 820 720 S 1400 640 1700 700 S 2100 690 2200 700 L2200 1180 Z")}
    <path d="${riverD}" fill="none" stroke="#9FD3F2" stroke-width="70" stroke-linecap="round"/>
    <path id="s1a-shine" d="${riverD}" fill="none" stroke="#E9F7FF" stroke-width="10" stroke-linecap="round" stroke-dasharray="40 120"/>
    ${tree(P, 240, 820, 0.9, "gRose")} ${tree(P, 520, 760, 0.7, "gLav")} ${tree(P, 1500, 760, 0.75, "gMint")} ${tree(P, 1760, 800, 0.95, "gRose")}
    ${cottage(P, 700, 800, 0.55, "s1a-c1")} ${cottage(P, 1320, 760, 0.5, "s1a-c2")}
    ${hill(P, "M860 760 C 920 660 1120 660 1180 760 Z", "gMint")}
    ${cottage(P, 980, 700, 0.42, "s1a-c3")}
    <g transform="translate(1004 610)">${smoke}</g>
    ${place(1080, 712, 0.26, bear(P, "s1a-nubi"))}
    ${flower(140, 1000, 1.2, "#F6C1D4")} ${flower(420, 1040, 1, C.lav)} ${flower(1640, 1020, 1.1, "#FFF")} ${flower(1840, 1060, 1.2, "#F6C1D4")}
  </g>
  <g id="s1a-fg">${cloud(P, 300, 980, 2.6, 0.95)} ${cloud(P, 1700, 1040, 2.4, 0.95)}</g>
  <rect id="s1a-black" x="0" y="0" width="1920" height="1080" fill="#1E1834"/>
  </svg>`;

  const b = `${svgOpen("s1b-svg")}
  <g id="s1b-cam">
    ${skyRect("s1b-sky", [[0, "#B9A4DC"], [0.5, "#F2B5CB"], [1, "#FFE3CF"]])}
    <g id="s1b-stars">${ST.svg}</g>
    ${cloud(P, 1500, 300, 1.2, 0.7)} ${cloud(P, 300, 380, 0.9, 0.6)}
    ${cottonMountains(P, 700, "url(#" + P + "-gLav)", 8, 7, 220)}
    ${hill(P, "M-200 1200 L-200 900 C 300 760 700 740 980 760 S 1600 820 2200 900 L2200 1200 Z")}
    ${tree(P, 1560, 900, 1.25, "gRose")}
    ${cottage(P, 380, 900, 1.1, "s1b-c1")}
    ${flower(700, 990, 1.6, "#F6C1D4")} ${flower(1250, 1000, 1.5, C.lav)} ${flower(1330, 1050, 1.3, "#FFF")} ${flower(620, 1060, 1.4, C.lav)}
    ${place(980, 960, 1.55, bear(P, "s1b-nubi"))}
  </g></svg>`;

  const starIds = ST.list.map((_, i) => `"#s1b-st${i}i"`).join(",");
  const script = `
  H.setOrigins("s1a-nubi","bear"); H.setOrigins("s1b-nubi","bear");
  // 1A
  tl.fromTo("#s1a-black",{opacity:1},{opacity:0,duration:0.9,ease:"sine.inOut"},0);
  tl.fromTo("#s1a-cam",{scale:1,y:0,x:0},{scale:1.22,y:-40,x:-60,duration:5.4,ease:"sine.inOut",svgOrigin:"1060 700"},0);
  tl.fromTo("#s1a-fg",{x:0,y:0},{x:-260,y:40,duration:5.4,ease:"sine.inOut"},0);
  tl.fromTo("#s1a-shine",{strokeDashoffset:0},{strokeDashoffset:-480,duration:5.4,ease:"none"},0);
  [0,1,2].forEach(i=>{ tl.fromTo("#s1a-smoke"+i,{x:0,y:0,opacity:0,scale:0.6},{x:30+i*14,y:-90-i*20,opacity:0.9,scale:1.3,duration:1.2,ease:"sine.out"},2.4+i*0.5); tl.to("#s1a-smoke"+i,{opacity:0,duration:0.8},3.6+i*0.5); });
  H.idle(tl,"s1a-nubi",0,5.4,3);
  // 1B
  ${dissolveIn("s1b-svg", 5.0, 0.45)}
  tl.fromTo("#s1b-cam",{scale:1},{scale:1.08,duration:3.0,ease:"sine.inOut",svgOrigin:"980 700"},5.0);
  tl.fromTo([${starIds}],{scale:0,opacity:0},{scale:1,opacity:1,duration:0.5,ease:"back.out(2.4)",stagger:0.12},5.6);
  H.idle(tl,"s1b-nubi",5.0,3.0,7);
  H.blinks(tl,"s1b-nubi",5.0,8.0,5);
  tl.to("#s1b-nubi-head",{rotation:-7,duration:0.6,ease:"power2.out"},5.5);
  H.look(tl,"s1b-nubi",2,-5,5.5,0.4);
  H.mood(tl,"s1b-nubi","open",6.1);
  H.mood(tl,"s1b-nubi","smile",7.2);
  tl.to("#s1b-nubi-cheeks",{scale:1.25,svgOrigin:"0 -160",duration:0.4,ease:"back.out(2)"},7.2);
  `;
  write("s1", scene("s1", 8.0, shot("s1a", 0, 5.45, a, 1) + shot("s1b", 5.0, 3.0, b, 2), script));
}

// ======================= SCENE 2 — las estrellas se apagan (host 7.6–16) =======================
{
  const P = "s2";
  const ST = tinyStars(P, "s2a-st", 40, 21, [60, 30, 1800, 520], [6, 14]);
  const order = ST.list.map((p, i) => [p[0], i]).sort((x, y) => x[0] - y[0]).map((v) => v[1]);
  const trail = Array.from({ length: 10 }, (_, i) => `<circle id="s2a-tr${i}" r="${14 - i}" fill="#FFF0B0" opacity="0"/>`).join("");
  const a = `${svgOpen("s2a-svg")}${defs(P)}
  <g id="s2a-cam">
    ${skyRect("s2a-sky", [[0, "#2F2752"], [0.55, "#4B3F72"], [1, "#7A6AA8"]])}
    <rect id="s2a-dark" x="-400" y="-400" width="2720" height="1880" fill="#241D40" opacity="0"/>
    <g>${ST.svg}</g>
    <g id="s2a-fall" transform="translate(760 210)"><g id="s2a-falli"><circle r="60" fill="url(#${P}-gGlow)"/><path d="${starPath(26, 12)}" fill="${C.gold}" stroke="${C.gold}" stroke-width="8" stroke-linejoin="round"/></g></g>
    <g id="s2a-trail">${trail}</g>
    ${cottonMountains(P, 780, "#5D4F8C", 4, 8, 200)}
    ${hill(P, "M-200 1200 L-200 960 C 300 880 700 860 980 880 S 1600 920 2200 980 L2200 1200 Z", "gLav", "#B6A3DA")}
    ${cottage(P, 560, 960, 0.75, "s2a-c1")}
    <g opacity="0.85">${place(980, 900, 0.5, bear(P, "s2a-nubi"))}</g>
  </g></svg>`;

  const glints = `<g id="s2b-glint" opacity="0"><circle cx="-36" cy="-196" r="4" fill="#FFF4C2"/><circle cx="24" cy="-196" r="4" fill="#FFF4C2"/></g>`;
  const b = `${svgOpen("s2b-svg")}
  <g id="s2b-cam">
    ${skyRect("s2b-sky", [[0, "#2F2752"], [0.6, "#44386A"], [1, "#6B5C9A"]])}
    <circle cx="1560" cy="220" r="300" fill="#C9B6E8" opacity="0.12" filter="url(#${P}-soft)"/>
    ${cottonMountains(P, 760, "#55487F", 6, 7, 240)}
    <g filter="url(#${P}-blur3)">${tree(P, 260, 1000, 2.0, "gLav")} ${tree(P, 1720, 1040, 2.2, "gLav")}</g>
    ${place(960, 1016, 3.0, bear(P, "s2b-nubi") + glints)}
    <rect x="-400" y="-400" width="2720" height="1880" fill="#3A2F66" opacity="0.18"/>
  </g></svg>`;

  const ids = order.map((i) => `"#s2a-st${i}i"`).join(",");
  const trailT = Array.from({ length: 10 }, (_, i) => i);
  const script = `
  H.setOrigins("s2a-nubi","bear"); H.setOrigins("s2b-nubi","bear");
  ${dissolveIn("s2a-svg", 0, 0.45)}
  tl.fromTo("#s2a-cam",{y:-30},{y:40,duration:4.7,ease:"sine.inOut"},0);
  tl.to([${ids}],{scale:0.15,opacity:0,duration:0.35,ease:"power2.in",stagger:0.055},1.0);
  tl.to("#s2a-dark",{opacity:0.55,duration:2.6,ease:"sine.inOut"},1.0);
  // the last star falls toward the cotton forest
  const path=[[760,210],[980,250],[1200,330],[1400,450],[1560,590],[1700,760]];
  tl.to("#s2a-falli",{scale:1.2,duration:0.3,ease:"back.out(3)"},2.9);
  tl.to("#s2a-fall",{keyframes:{x:path.map(p=>p[0]-760),y:path.map(p=>p[1]-210)},duration:1.3,ease:"power1.in"},3.2);
  tl.to("#s2a-falli",{scale:0.5,opacity:0,duration:0.3},4.25);
  ${JSON.stringify(trailT)}.forEach(i=>{const k=Math.min(path.length-1,Math.floor(i/2)); tl.fromTo("#s2a-tr"+i,{x:path[k][0],y:path[k][1],opacity:0},{opacity:0.8-i*0.05,duration:0.12},3.25+i*0.11); tl.to("#s2a-tr"+i,{opacity:0,duration:0.5},3.45+i*0.11);});
  // 2B close-up
  ${dissolveIn("s2b-svg", 4.4, 0.25)}
  tl.fromTo("#s2b-cam",{scale:1},{scale:1.06,duration:4.0,ease:"sine.inOut",svgOrigin:"960 470"},4.4);
  H.idle(tl,"s2b-nubi",4.4,4.0,9,0.6);
  H.blinks(tl,"s2b-nubi",5.6,8.4,13);
  tl.set("#s2b-nubi-m-smile",{opacity:1},4.4);
  H.look(tl,"s2b-nubi",0,-4,4.5,0.2);
  tl.fromTo("#s2b-glint",{opacity:0,x:-14},{opacity:1,x:10,duration:0.6,ease:"sine.inOut"},4.6);
  tl.to("#s2b-glint",{opacity:0,duration:0.3},5.2);
  H.mood(tl,"s2b-nubi","worry",5.3,{brows:true});
  tl.to("#s2b-nubi-earL",{rotation:-16,duration:0.6,ease:"power2.out"},5.45);
  tl.to("#s2b-nubi-earR",{rotation:14,duration:0.7,ease:"power2.out"},5.55);
  tl.to("#s2b-nubi-armL",{rotation:-50,duration:0.7,ease:"back.out(1.6)"},5.9);
  tl.to("#s2b-nubi-armR",{rotation:48,duration:0.7,ease:"back.out(1.6)"},6.02);
  tl.to("#s2b-nubi-head",{rotation:4,duration:1.4,ease:"sine.inOut"},6.4);
  H.look(tl,"s2b-nubi",3,-2,6.6,0.6);
  `;
  write("s2", scene("s2", 8.4, shot("s2a", 0, 4.7, a, 1) + shot("s2b", 4.4, 4.0, b, 2), script));
}

// ======================= SCENE 3 — nuevos amigos (host 15.6–25) =======================
{
  const P = "s3";
  const nightSky = (id) => skyRect(id, [[0, "#3A3066"], [0.55, "#5A4C8A"], [1, "#9384C2"]]);
  const ST = tinyStars(P, "s3x", 10, 5, [80, 40, 1760, 300], [4, 8]);
  const bush = `<g filter="url(#${P}-fuzz)"><circle cx="-90" cy="-60" r="80" fill="url(#${P}-gMint)"/><circle cx="20" cy="-90" r="96" fill="url(#${P}-gMint)"/><circle cx="110" cy="-50" r="74" fill="url(#${P}-gMint)"/></g>
    ${flower(-70, -110, 1.1, "#F6C1D4")} ${flower(40, -150, 1.2, C.lav)} ${flower(110, -90, 1, "#fff")} ${flower(-20, -40, 1, "#F6C1D4")}`;
  const a = `${svgOpen("s3a-svg")}${defs(P)}
  <g id="s3a-cam">
    ${nightSky("s3a-sky")}<g opacity="0.8">${ST.svg}</g>
    <circle cx="300" cy="190" r="70" fill="#FFF7E8" opacity="0.95" filter="url(#${P}-fuzz)"/><circle cx="300" cy="190" r="200" fill="url(#${P}-gWarm)" opacity="0.4"/>
    <g id="s3a-far">${cottonMountains(P, 720, "#7464A6", 12, 9, 190)}
      ${tree(P, 200, 880, 1.1, "gLav")} ${tree(P, 760, 860, 0.9, "gRose")} ${tree(P, 1180, 870, 1.0, "gLav")} ${tree(P, 1900, 880, 1.2, "gRose")} ${tree(P, 2300, 860, 1.0, "gLav")}</g>
    ${hill(P, "M-300 1200 L-300 880 C 300 840 900 860 1300 850 S 2000 860 2400 880 L2400 1200 Z", "gMint")}
    <path d="M-300 1000 C 400 960 1100 980 2400 960" stroke="#E8D7BE" stroke-width="80" fill="none" stroke-linecap="round" opacity="0.9"/>
    <path d="M-300 1000 C 400 960 1100 980 2400 960" ${'fill="none" stroke="#CDB59A" stroke-width="2.5" stroke-dasharray="9 7"'}/>
    ${fireflies(P, "s3a-ff", 9, 3, [100, 300, 1700, 500])}
    <g id="s3a-lilaW">${place(1290, 960, 1.3, bunny(P, "s3a-lila"))}</g>
    ${place(1300, 970, 1.25, bush)}
    <g id="s3a-nubiW">${place(520, 990, 1.4, bear(P, "s3a-nubi", { lantern: true }))}</g>
  </g></svg>`;

  const b = `${svgOpen("s3b-svg")}
  <g id="s3b-cam">
    ${nightSky("s3b-sky")}
    <circle id="s3b-goal" cx="1780" cy="640" r="110" fill="url(#${P}-gGlow)" opacity="0"/>
    ${cottonMountains(P, 700, "#6D5E9F", 14, 8, 210)}
    ${tree(P, 160, 900, 1.4, "gLav")}
    ${hill(P, "M-300 1200 L-300 900 C 300 860 900 880 1300 870 S 2000 880 2400 900 L2400 1200 Z", "gMint")}
    ${fireflies(P, "s3b-ff", 8, 17, [100, 250, 1700, 500])}
    <g id="s3b-brunoW">${place(1560, 990, 1.25, elephant(P, "s3b-bruno"))}</g>
    ${tree(P, 1480, 1000, 1.9, "gRose")}
    ${place(560, 990, 1.25, bunny(P, "s3b-lila"))}
    ${place(800, 1000, 1.35, bear(P, "s3b-nubi", { lantern: true }))}
  </g></svg>`;

  const script = `
  ["s3a-nubi","s3b-nubi"].forEach(p=>H.setOrigins(p,"bear")); ["s3a-lila","s3b-lila"].forEach(p=>H.setOrigins(p,"bunny")); H.setOrigins("s3b-bruno","elephant");
  ${dissolveIn("s3a-svg", 0, 0.4)}
  // fireflies drift
  for(let i=0;i<9;i++){ tl.fromTo("#s3a-ff"+i,{x:0,y:0},{x:(i%2?40:-50),y:-30-(i%3)*12,duration:4.9,ease:"sine.inOut"},0); }
  for(let i=0;i<8;i++){ tl.fromTo("#s3b-ff"+i,{x:0,y:0},{x:(i%2?-36:44),y:-24-(i%3)*10,duration:5,ease:"sine.inOut"},4.4); }
  // Nubi walks in with the lantern while the camera tracks
  tl.fromTo("#s3a-nubiW",{x:-80},{x:380,duration:3.0,ease:"sine.inOut"},0.2);
  tl.fromTo("#s3a-far",{x:0},{x:-240,duration:4.9,ease:"sine.out"},0);
  H.walk(tl,"s3a-nubi",0.2,2.9,0.36);
  tl.fromTo("#s3a-nubi-lantern",{rotation:-6},{rotation:6,duration:0.36,ease:"sine.inOut",yoyo:true,repeat:7,svgOrigin:"86 -58"},0.2);
  H.blinks(tl,"s3a-nubi",0,4.9,21);
  // Lila: ears pop out of the bush, then her face, then she hops beside him
  tl.fromTo("#s3a-lilaW",{y:330},{y:170,duration:0.35,ease:"back.out(2.2)"},1.55);
  tl.to("#s3a-lilaW",{y:60,duration:0.4,ease:"back.out(2)"},2.25);
  H.blinks(tl,"s3a-lila",2.2,4.9,8);
  H.look(tl,"s3a-lila",-5,0,2.3,0.2);
  tl.to("#s3a-lilaW",{keyframes:{x:[0,-60,-150,-190],y:[60,-120,-60,0]},duration:0.6,ease:"power1.inOut"},3.15);
  tl.fromTo("#s3a-lila-body",{scaleY:1},{scaleY:0.88,duration:0.08,yoyo:true,repeat:1},3.75);
  H.mood(tl,"s3a-lila","laugh",3.2,{happy:true});
  H.idle(tl,"s3a-lila",3.8,1.1,4);
  H.look(tl,"s3a-nubi",5,-1,3.1,0.25);
  H.mood(tl,"s3a-nubi","open",3.15);
  H.mood(tl,"s3a-nubi","smile",3.9);
  H.idle(tl,"s3a-nubi",3.2,1.7,6);
  // 3B — Bruno peeks, steps out; Nubi offers a paw
  ${dissolveIn("s3b-svg", 4.5, 0.4)}
  tl.fromTo("#s3b-cam",{scale:1.12},{scale:1.0,duration:4.9,ease:"sine.inOut",svgOrigin:"960 800"},4.5);
  H.idle(tl,"s3b-nubi",4.5,4.9,12); H.idle(tl,"s3b-lila",4.5,4.9,14);
  H.blinks(tl,"s3b-nubi",4.5,9.4,31); H.blinks(tl,"s3b-lila",4.5,9.4,32); H.blinks(tl,"s3b-bruno",5.5,9.4,33);
  tl.set("#s3b-lila-m-smile",{opacity:1},4.5);
  tl.fromTo("#s3b-brunoW",{x:120},{x:-30,duration:0.6,ease:"power2.out"},4.9);
  H.look(tl,"s3b-bruno",-5,1,5.0,0.3);
  H.mood(tl,"s3b-bruno","worry",4.9,{brows:true});
  H.look(tl,"s3b-nubi",5,0,5.2,0.25); H.look(tl,"s3b-lila",5,0,5.3,0.25);
  tl.to("#s3b-brunoW",{x:-380,duration:1.4,ease:"sine.inOut"},6.0);
  H.walk(tl,"s3b-bruno",6.0,1.4,0.46);
  tl.to("#s3b-nubi-armR",{rotation:-78,duration:0.5,ease:"back.out(2)"},6.4);
  H.mood(tl,"s3b-nubi","smile",6.4);
  H.mood(tl,"s3b-bruno","laugh",7.1,{happy:true});
  tl.to("#s3b-bruno-trunk",{rotation:-24,duration:0.4,ease:"back.out(2)",yoyo:true,repeat:1},7.15);
  tl.to("#s3b-lila-body",{y:-40,duration:0.18,ease:"power2.out",yoyo:true,repeat:1},7.4);
  H.mood(tl,"s3b-lila","laugh",7.4,{happy:true});
  // everyone turns toward the distant glow
  tl.to("#s3b-goal",{opacity:1,duration:0.6},7.9);
  tl.fromTo("#s3b-goal",{scale:0.8},{scale:1.25,duration:0.7,ease:"sine.inOut",yoyo:true,repeat:1,svgOrigin:"1780 640"},7.9);
  tl.to("#s3b-nubi-armR",{rotation:0,duration:0.5,ease:"power2.inOut"},7.8);
  H.mood(tl,"s3b-bruno","open",8.1); H.mood(tl,"s3b-lila","open",8.15); H.mood(tl,"s3b-nubi","open",8.05);
  H.look(tl,"s3b-nubi",6,-2,8.0,0.3); H.look(tl,"s3b-lila",6,-2,8.08,0.3); H.look(tl,"s3b-bruno",6,-2,8.16,0.3);
  tl.to(["#s3b-nubi-head","#s3b-lila-head"],{rotation:6,duration:0.5,ease:"power2.out",stagger:0.08},8.0);
  `;
  write("s3", scene("s3", 9.4, shot("s3a", 0, 4.9, a, 1) + shot("s3b", 4.5, 4.9, b, 2), script));
}

// ======================= SCENE 4 — la gran aventura (host 24.6–37) =======================
{
  const P = "s4";
  const forestSky = (id) => skyRect(id, [[0, "#3B3169"], [0.6, "#5E5092"], [1, "#8D7FC0"]]);
  const cottonTree = (x, y, s, c = "gWhite") => tree(P, x, y, s, c);
  const shafts = `<g opacity="0.16"><path d="M300 -50 L420 -50 L760 1100 L520 1100 Z" fill="#fff"/><path d="M980 -50 L1060 -50 L1300 1100 L1120 1100 Z" fill="#fff"/><path d="M1500 -50 L1600 -50 L1800 1100 L1620 1100 Z" fill="#fff"/></g>`;
  const fluff = Array.from({ length: 10 }, (_, i) => `<circle id="s4a-fl${i}" cx="1460" cy="${800 + (i % 4) * 20}" r="${10 + (i % 3) * 6}" fill="#fff" opacity="0"/>`).join("");
  const trio = (pre, xs, y, ss) =>
    `${place(xs[0], y, ss[0], bunny(P, pre + "-lila"))}${place(xs[1], y + 10, ss[1], bear(P, pre + "-nubi"))}${place(xs[2], y - 6, ss[2], elephant(P, pre + "-bruno"))}`;
  const a = `${svgOpen("s4a-svg")}${defs(P)}
  <g id="s4a-cam">
    ${forestSky("s4a-sky")}
    <g id="s4a-bg">${cottonMountains(P, 640, "#7767AA", 31, 10, 200)}
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => cottonTree(80 + i * 380, 860, 1.5 + (i % 2) * 0.3, i % 2 ? "gLav" : "gWhite")).join("")}</g>
    ${shafts}
    ${hill(P, "M-300 1200 L-300 900 C 400 880 1000 900 1500 890 S 2100 900 2400 910 L2400 1200 Z", "gLav", "#B7A6DD")}
    <g id="s4a-mush">${mushroom(P, 300, 1010, 1.2, "s4a-m1")} ${mushroom(P, 1250, 1030, 1.0, "s4a-m2")} ${mushroom(P, 1800, 1000, 1.3, "s4a-m3")}</g>
    ${cloud(P, 1520, 860, 1.7, 1, "s4a-block")}
    ${fluff}
    ${trio("s4a", [480, 720, 1010], 1000, [1.0, 1.05, 1.05])}
  </g></svg>`;

  const bridgeD = "M420 820 Q 960 690 1500 820";
  const b = `${svgOpen("s4b-svg")}
  <g id="s4b-cam">
    ${forestSky("s4b-sky")}
    ${cottonMountains(P, 600, "#7262A3", 41, 8, 220)}
    ${[0, 1, 2, 3, 4].map((i) => cottonTree(100 + i * 440, 760, 1.2, i % 2 ? "gWhite" : "gLav")).join("")}
    <rect x="-300" y="880" width="2520" height="400" fill="#9FD3F2"/>
    <path id="s4b-water" d="M-300 930 C 200 900 600 960 1000 930 S 1700 900 2300 930" fill="none" stroke="#E9F7FF" stroke-width="8" stroke-dasharray="30 60" opacity="0.9"/>
    <path id="s4b-water2" d="M-300 1010 C 300 980 800 1040 1200 1010 S 1800 990 2300 1010" fill="none" stroke="#E9F7FF" stroke-width="6" stroke-dasharray="20 70" opacity="0.7"/>
    ${hill(P, "M-300 1200 L-300 820 C 0 800 300 820 470 860 L520 1200 Z", "gMint")}
    ${hill(P, "M1400 1200 L1450 860 C 1600 820 1900 800 2300 820 L2300 1200 Z", "gMint")}
    <g id="s4b-bridge"><g filter="url(#${P}-fuzz)">
      <path d="${bridgeD}" fill="none" stroke="#F2B7CB" stroke-width="44" stroke-linecap="round"/>
      <path d="${bridgeD}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 8" opacity="0.8"/>
      <path d="M420 700 Q 960 570 1500 700" fill="none" stroke="#8EC9EE" stroke-width="10" stroke-linecap="round"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { const x = 420 + i * 135; const t = (x - 420) / 1080; const yb = 820 - 4 * 65 * t * (1 - t); const yt = 700 - 4 * 65 * t * (1 - t); return `<path d="M${x} ${yb.toFixed(1)} L${x} ${yt.toFixed(1)}" stroke="#C9B6E8" stroke-width="7" stroke-linecap="round"/>`; }).join("")}
    </g></g>
    <g id="s4b-trio">${place(0, 0, 1, `${place(-260, 0, 0.72, bunny(P, "s4b-lila"), 'id="s4b-lilaW"')}${place(-60, 6, 0.78, bear(P, "s4b-nubi"), 'id="s4b-nubiW"')}${place(-470, 0, 0.74, elephant(P, "s4b-bruno"), 'id="s4b-brunoW"')}`)}</g>
  </g></svg>`;

  const c = `${svgOpen("s4c-svg")}
  <g id="s4c-cam">
    ${forestSky("s4c-sky")}
    ${cottonMountains(P, 620, "#6A5B9C", 51, 8, 230)}
    ${[0, 1, 2, 3].map((i) => cottonTree(140 + i * 560, 800, 1.5, i % 2 ? "gLav" : "gWhite")).join("")}
    ${hill(P, "M-300 1200 L-300 900 C 400 870 1000 890 1500 880 S 2100 900 2400 910 L2400 1200 Z", "gLav", "#B7A6DD")}
    <ellipse id="s4c-leak" cx="1260" cy="960" rx="520" ry="150" fill="url(#${P}-gGlow)" opacity="0.5"/>
    <g id="s4c-mound" filter="url(#${P}-fuzz)">
      <circle cx="1260" cy="760" r="250" fill="url(#${P}-gWhite)"/><circle cx="1020" cy="860" r="170" fill="url(#${P}-gWhite)"/><circle cx="1500" cy="850" r="190" fill="url(#${P}-gWhite)"/><circle cx="1360" cy="620" r="150" fill="url(#${P}-gWhite)"/><circle cx="1140" cy="640" r="130" fill="url(#${P}-gWhite)"/>
      <rect x="860" y="870" width="820" height="110" rx="50" fill="url(#${P}-gWhite)"/></g>
    <g transform="translate(1010 905) scale(0.6) rotate(-18)"><g id="s4c-tipW">${magicStar(P, "s4c-star")}</g></g>
    <g filter="url(#${P}-fuzz)"><circle cx="1110" cy="930" r="105" fill="url(#${P}-gWhite)"/><circle cx="960" cy="985" r="70" fill="url(#${P}-gWhite)"/></g>
    <rect id="s4c-warm" x="-400" y="-400" width="2720" height="1880" fill="#FFC96B" opacity="0"/>
    ${trio("s4c", [230, 450, 700], 1040, [1.15, 1.25, 1.2])}
  </g></svg>`;

  const script = `
  ["a","b","c"].forEach(s=>{H.setOrigins("s4"+s+"-nubi","bear");H.setOrigins("s4"+s+"-lila","bunny");H.setOrigins("s4"+s+"-bruno","elephant");});
  ${dissolveIn("s4a-svg", 0, 0.4)}
  // 4A — walking through the cotton forest; Bruno blows the cotton cloud away
  tl.fromTo("#s4a-bg",{x:0},{x:-520,duration:4.8,ease:"none"},0);
  tl.fromTo("#s4a-mush",{x:0},{x:-260,duration:1.8,ease:"sine.out"},0);
  ["s4a-lila","s4a-nubi","s4a-bruno"].forEach((p,i)=>{ H.walk(tl,p,0.05*i,1.75,p.endsWith("bruno")?0.46:0.36,p.endsWith("lila")); H.blinks(tl,p,0,4.8,40+i); });
  ["s4a-lila","s4a-nubi"].forEach((p,i)=>H.look(tl,p,5,0,0.1+i*0.05,0.2));
  tl.set(["#s4a-lila-m-smile","#s4a-nubi-m-smile","#s4a-bruno-m-smile"],{opacity:1},0);
  H.mood(tl,"s4a-nubi","open",1.7); H.mood(tl,"s4a-lila","open",1.75);
  H.look(tl,"s4a-bruno",6,-3,1.7,0.2);
  tl.to("#s4a-bruno-trunk",{rotation:-62,duration:0.45,ease:"back.out(1.6)"},1.85);
  tl.to("#s4a-bruno-head",{scaleX:1.04,scaleY:0.97,duration:0.2,yoyo:true,repeat:1},2.25);
  tl.to("#s4a-block",{x:760,y:-120,opacity:0,scale:2.0,duration:1.2,ease:"power2.in"},2.3);
  for(let i=0;i<10;i++){ tl.fromTo("#s4a-fl"+i,{x:0,y:0,opacity:0},{x:200+i*55,y:-60-(i%5)*40,opacity:0.9,duration:0.9,ease:"power2.out"},2.3+i*0.04); tl.to("#s4a-fl"+i,{opacity:0,duration:0.4},3.1+i*0.04); }
  tl.to("#s4a-bruno-trunk",{rotation:0,duration:0.5,ease:"power2.inOut"},2.9);
  H.mood(tl,"s4a-lila","laugh",2.45,{happy:true}); tl.to("#s4a-lila-body",{y:-34,duration:0.16,yoyo:true,repeat:3},2.5);
  H.mood(tl,"s4a-nubi","laugh",2.6,{happy:true}); H.mood(tl,"s4a-bruno","smile",2.9);
  ["s4a-lila","s4a-nubi","s4a-bruno"].forEach((p,i)=>H.walk(tl,p,3.2+0.05*i,1.6,p.endsWith("bruno")?0.46:0.36));
  tl.to("#s4a-mush",{x:-520,duration:1.6,ease:"none"},3.2);
  // 4B — crossing the wool bridge
  tl.fromTo("#s4b-cam",{scale:1.32,x:-307,y:-250},{scale:1.22,x:-211,y:-172,duration:4.4,ease:"sine.inOut"},4.0);
  ${dissolveIn("s4b-svg", 4.0, 0.3)}
  tl.fromTo("#s4b-water",{strokeDashoffset:0},{strokeDashoffset:-300,duration:4.4,ease:"none"},4.0);
  tl.fromTo("#s4b-water2",{strokeDashoffset:0},{strokeDashoffset:260,duration:4.4,ease:"none"},4.0);
  tl.fromTo("#s4b-bridge",{rotation:-0.8},{rotation:0.8,duration:0.55,ease:"sine.inOut",yoyo:true,repeat:7,svgOrigin:"960 760"},4.0);
  const arc=(x)=>{const t=(x-420)/1080; return 868-4*65*t*(1-t);};
  const xs=[420,620,800,960,1120,1300,1520,1760];
  tl.set("#s4b-trio",{x:0,y:0},4.0);
  // the trio group carries them across; each walker rides the arc
  const leg=(id,off,t0,t1,from,to)=>{const k=[]; for(let i=0;i<=8;i++){const x=from+(to-from)*i/8; k.push(x);} tl.fromTo(id,{x:k[0]+off,y:arc(Math.min(1500,Math.max(420,k[0])))},{keyframes:{x:k.map(v=>v+off),y:k.map(v=>arc(Math.min(1500,Math.max(420,v))))},duration:t1-t0,ease:"none"},t0);};
  leg("#s4b-lilaW",0,4.0,6.0,560,1060); leg("#s4b-nubiW",0,4.0,6.0,560,1000);
  leg("#s4b-lilaW",0,6.6,8.4,1060,1650); leg("#s4b-nubiW",0,6.6,8.4,1000,1560);
  leg("#s4b-brunoW",0,4.0,5.3,460,760); leg("#s4b-brunoW",0,6.3,8.4,760,1380);
  ["s4b-lila","s4b-nubi"].forEach((p,i)=>{H.walk(tl,p,4.0,2.0,0.36,i===0); H.walk(tl,p,6.6,1.8,0.36,i===0); H.blinks(tl,p,4,8.4,50+i);});
  H.walk(tl,"s4b-bruno",4.0,1.3,0.46); H.walk(tl,"s4b-bruno",6.3,2.1,0.46);
  tl.set(["#s4b-lila-m-smile","#s4b-nubi-m-smile","#s4b-bruno-m-smile"],{opacity:1},4.0);
  H.mood(tl,"s4b-bruno","worry",5.3,{brows:true});
  tl.to("#s4b-bruno-body",{rotation:-3,duration:0.3,yoyo:true,repeat:3,svgOrigin:"0 0"},5.3);
  H.look(tl,"s4b-nubi",-6,0,5.5,0.25); H.look(tl,"s4b-lila",-6,0,5.6,0.25);
  tl.to("#s4b-nubi-armL",{rotation:70,duration:0.4,ease:"back.out(2)"},5.7);
  H.mood(tl,"s4b-nubi","smile",5.7); H.mood(tl,"s4b-bruno","smile",6.15);
  tl.to("#s4b-nubi-armL",{rotation:0,duration:0.4},6.6);
  H.look(tl,"s4b-nubi",5,0,6.6,0.25); H.look(tl,"s4b-lila",5,0,6.6,0.25); H.look(tl,"s4b-bruno",4,0,6.3,0.25);
  // 4C — discovery
  ${dissolveIn("s4c-svg", 8.0, 0.4)}
  tl.fromTo("#s4c-cam",{scale:1},{scale:1.16,duration:4.4,ease:"sine.inOut",svgOrigin:"1100 820"},8.0);
  ["s4c-lila","s4c-nubi","s4c-bruno"].forEach((p,i)=>{H.idle(tl,p,8.0,4.4,60+i); H.blinks(tl,p,8.0,12.4,70+i); H.look(tl,p,6,-1,8.0,0.01);});
  tl.set(["#s4c-lila-m-smile","#s4c-nubi-m-smile","#s4c-bruno-m-smile"],{opacity:1},8.0);
  tl.fromTo("#s4c-leak",{opacity:0.35},{opacity:0.9,duration:0.7,ease:"sine.inOut",yoyo:true,repeat:5},8.0);
  tl.fromTo("#s4c-tipW",{y:120,scale:0.8},{y:0,scale:1,duration:0.8,ease:"back.out(2)",svgOrigin:"0 0"},9.1);
  tl.to("#s4c-warm",{opacity:0.12,duration:1.2},9.1);
  H.mood(tl,"s4c-nubi","open",9.25); H.mood(tl,"s4c-lila","open",9.3); H.mood(tl,"s4c-bruno","open",9.4);
  H.look(tl,"s4c-nubi",-6,0,10.4,0.2); H.look(tl,"s4c-lila",6,0,10.45,0.2); H.look(tl,"s4c-bruno",-5,1,10.55,0.2);
  H.mood(tl,"s4c-lila","laugh",10.7,{happy:true}); tl.to("#s4c-lila-body",{y:-30,duration:0.18,yoyo:true,repeat:1},10.75);
  H.mood(tl,"s4c-nubi","smile",10.8); H.mood(tl,"s4c-bruno","smile",10.9);
  H.look(tl,"s4c-nubi",6,-2,11.4,0.3); H.look(tl,"s4c-lila",6,-2,11.45,0.3); H.look(tl,"s4c-bruno",6,-2,11.5,0.3);
  `;
  write("s4", scene("s4", 12.4, shot("s4a", 0, 4.4, a, 1) + shot("s4b", 4.0, 4.4, b, 2) + shot("s4c", 8.0, 4.4, c, 3), script));
}

// ======================= SCENE 5 — juntos lo conseguimos (host 36.6–49) =======================
{
  const P = "s5";
  const sky = (id) => skyRect(id, [[0, "#3B3169"], [0.6, "#5E5092"], [1, "#8D7FC0"]]);
  const mound = (id) => `<g id="${id}" filter="url(#${P}-fuzz)">
      <circle cx="1560" cy="640" r="330" fill="url(#${P}-gWhite)"/><circle cx="1300" cy="820" r="220" fill="url(#${P}-gWhite)"/><circle cx="1820" cy="780" r="260" fill="url(#${P}-gWhite)"/><circle cx="1500" cy="420" r="190" fill="url(#${P}-gWhite)"/>
      <rect x="1150" y="860" width="1000" height="260" rx="60" fill="url(#${P}-gWhite)"/></g>`;
  const pops = Array.from({ length: 14 }, (_, i) => `<circle id="s5a-p${i}" cx="${1220 + (i % 5) * 40}" cy="${560 + (i % 7) * 60}" r="${9 + (i % 3) * 5}" fill="#fff" opacity="0"/>`).join("");
  const a = `${svgOpen("s5a-svg")}${defs(P)}
  <g id="s5a-cam">
    ${sky("s5a-sky")}
    ${cottonMountains(P, 600, "#6A5B9C", 61, 8, 230)}
    ${hill(P, "M-300 1200 L-300 940 C 400 920 1000 930 1500 920 S 2100 930 2400 940 L2400 1200 Z", "gLav", "#B7A6DD")}
    <ellipse id="s5a-crack" cx="1500" cy="700" rx="260" ry="320" fill="url(#${P}-gGlow)" opacity="0.4"/>
    ${mound("s5a-mound")}
    <ellipse id="s5a-crack2" cx="1360" cy="760" rx="140" ry="220" fill="url(#${P}-gGlow)" opacity="0"/>
    ${pops}
    ${place(560, 1050, 1.12, elephant(P, "s5a-bruno"), 'id="s5a-brunoW"')}
    ${place(780, 1070, 1.22, bunny(P, "s5a-lila"), 'id="s5a-lilaW"')}
    ${place(1080, 1070, 1.3, bear(P, "s5a-nubi"), 'id="s5a-nubiW"')}
    <rect id="s5a-warm" x="-400" y="-400" width="2720" height="1880" fill="#FFC96B" opacity="0.06"/>
  </g></svg>`;

  const sparks = Array.from({ length: 16 }, (_, i) => `<path id="s5b-sp${i}" d="${starPath(10, 4.5)}" fill="#FFF3B0" opacity="0"/>`).join("");
  const petals = Array.from({ length: 12 }, (_, i) => `<circle id="s5b-pe${i}" cx="960" cy="860" r="${18 + (i % 4) * 8}" fill="url(#${P}-gWhite)" opacity="0"/>`).join("");
  const b = `${svgOpen("s5b-svg")}
  <g id="s5b-cam">
    ${sky("s5b-sky")}
    <rect id="s5b-lift" x="-400" y="-400" width="2720" height="1880" fill="#FFD983" opacity="0"/>
    ${cottonMountains(P, 760, "#6A5B9C", 71, 8, 230)}
    ${hill(P, "M-300 1300 L-300 1000 C 400 980 1000 990 1500 980 S 2100 990 2400 1000 L2400 1300 Z", "gLav", "#B7A6DD")}
    <g transform="translate(960 880) scale(0.6)"><g id="s5b-starW">${magicStar(P, "s5b-star")}</g></g>
    <g id="s5b-halfL" filter="url(#${P}-fuzz)"><circle cx="820" cy="900" r="200" fill="url(#${P}-gWhite)"/><circle cx="700" cy="980" r="150" fill="url(#${P}-gWhite)"/><circle cx="900" cy="760" r="140" fill="url(#${P}-gWhite)"/></g>
    <g id="s5b-halfR" filter="url(#${P}-fuzz)"><circle cx="1100" cy="900" r="200" fill="url(#${P}-gWhite)"/><circle cx="1230" cy="990" r="150" fill="url(#${P}-gWhite)"/><circle cx="1020" cy="760" r="140" fill="url(#${P}-gWhite)"/></g>
    ${petals}
    <g id="s5b-sparks" transform="translate(960 430)">${sparks}</g>
    ${place(330, 1070, 0.95, bunny(P, "s5b-lila"))}${place(540, 1080, 1.0, bear(P, "s5b-nubi"))}${place(1560, 1070, 0.95, elephant(P, "s5b-bruno"))}
  </g>
  <rect id="s5b-flash" x="0" y="0" width="1920" height="1080" fill="#FFF6D8" opacity="0"/></svg>`;

  const dust = Array.from({ length: 18 }, (_, i) => `<path id="s5c-d${i}" d="${starPath(9, 4)}" fill="#FFF3B0" opacity="0" transform="translate(${100 + ((i * 397) % 1720)} ${-40})"/>`).join("");
  const c = `${svgOpen("s5c-svg")}
  <g id="s5c-cam">
    <g id="s5c-bg">${sky("s5c-sky")}
      <circle cx="960" cy="-80" r="900" fill="url(#${P}-gGlow)"/>
      ${cottonMountains(P, 700, "#7767AA", 81, 8, 220)}</g>
    <circle id="s5c-glow" cx="960" cy="-60" r="700" fill="url(#${P}-gGlow)" opacity="0.4"/>
    <g id="s5c-chars">
    ${place(470, 980, 2.2, bunny(P, "s5c-lila"))}
    ${place(1460, 1060, 1.95, elephant(P, "s5c-bruno"))}
    ${place(960, 1000, 2.35, bear(P, "s5c-nubi"))}
    </g>
    <rect id="s5c-warm" x="-400" y="-400" width="2720" height="1880" fill="#FFD27A" opacity="0.1"/>
    ${dust}
  </g></svg>`;

  const script = `
  ["a","b","c"].forEach(s=>{H.setOrigins("s5"+s+"-nubi","bear");H.setOrigins("s5"+s+"-lila","bunny");H.setOrigins("s5"+s+"-bruno","elephant");});
  ${dissolveIn("s5a-svg", 0, 0.35)}
  // 5A — pushing together: lean in, effort faces, the cotton squishes
  const R=H.rng(5); const jx=[],jy=[]; for(let i=0;i<14;i++){jx.push((R()-0.5)*10);jy.push((R()-0.5)*8);}
  tl.fromTo("#s5a-cam",{x:0,y:0,scale:1},{keyframes:{x:jx,y:jy},duration:4.9,ease:"none"},0);
  tl.fromTo("#s5a-cam",{scale:1},{scale:1.06,duration:4.9,ease:"sine.inOut",svgOrigin:"1100 800"},0);
  [["s5a-nubi",0.3],["s5a-lila",0.42],["s5a-bruno",0.55]].forEach(([p,t],i)=>{
    tl.to("#"+p+"W",{x:"+=30",duration:0.4,ease:"power2.inOut"},t);
    tl.to("#"+p+"-body",{rotation:9,duration:0.4,ease:"power2.out",svgOrigin:"0 0"},t);
    tl.to("#"+p+"-head",{rotation:10,x:12,duration:0.4,ease:"power2.out"},t+0.05);
    tl.to("#"+p+"-armR",{rotation:-84,duration:0.35,ease:"back.out(1.5)"},t+0.05);
    tl.to("#"+p+"-armL",{rotation:-40,duration:0.4,ease:"back.out(1.5)"},t+0.12);
    H.mood(tl,p,"effort",t+0.2,{brows:true});
    tl.to("#"+p+"-cheeks",{scale:1.45,duration:0.3,ease:"back.out(2)"},t+0.25);
    tl.fromTo("#"+p+"-body",{scaleX:1},{scaleX:1.04,duration:0.3,ease:"sine.inOut",yoyo:true,repeat:11},t+0.6);
    H.look(tl,p,6,0,t,0.2);
  });
  tl.set(["#s5a-nubi-cheeks","#s5a-lila-cheeks","#s5a-bruno-cheeks"],{svgOrigin:"0 -160"},0);
  tl.to("#s5a-bruno-trunk",{rotation:-70,duration:0.5,ease:"back.out(1.4)"},0.75);
  tl.fromTo("#s5a-mound",{scaleX:1,x:0},{keyframes:{scaleX:[1,0.95,0.97,0.92,0.94,0.88,0.9,0.85],x:[0,30,20,50,40,80,70,100]},duration:4.0,ease:"none",svgOrigin:"1920 1000"},0.7);
  tl.to("#s5a-crack",{opacity:0.85,duration:3.8,ease:"sine.in"},0.8);
  tl.fromTo("#s5a-crack2",{opacity:0},{opacity:0.9,duration:0.4,yoyo:true,repeat:5,ease:"sine.inOut"},2.4);
  tl.to("#s5a-warm",{opacity:0.16,duration:3.5},1);
  for(let i=0;i<14;i++){ const t=1.2+i*0.24; tl.fromTo("#s5a-p"+i,{x:0,y:0,opacity:0},{x:-40-(i%4)*30,y:-80-(i%5)*35,opacity:0.95,duration:0.5,ease:"power2.out"},t); tl.to("#s5a-p"+i,{opacity:0,y:"+=30",duration:0.4},t+0.5); }
  // 5B — flash, the cotton opens, the star wakes and rises
  ${dissolveIn("s5b-svg", 4.5, 0.12)}
  tl.fromTo("#s5b-flash",{opacity:0.95},{opacity:0,duration:0.6,ease:"power2.out"},4.55);
  tl.fromTo("#s5b-halfL",{x:0,rotation:0},{x:-640,y:120,rotation:-18,duration:1.4,ease:"power3.out",svgOrigin:"820 900"},4.55);
  tl.fromTo("#s5b-halfR",{x:0,rotation:0},{x:640,y:120,rotation:18,duration:1.4,ease:"power3.out",svgOrigin:"1100 900"},4.55);
  for(let i=0;i<12;i++){ const a=-Math.PI*(0.1+0.8*(i/11)); tl.fromTo("#s5b-pe"+i,{x:0,y:0,opacity:0.95},{x:Math.cos(a)*(380+(i%3)*120),y:Math.sin(a)*(300+(i%4)*60),opacity:0,duration:1.5,ease:"power2.out"},4.55); }
  tl.fromTo("#s5b-starW",{y:0,scale:1},{y:-740,scale:1.85,duration:2.2,ease:"power2.out",svgOrigin:"0 0"},4.7);
  tl.fromTo("#s5b-star-glow",{scale:0.6},{scale:1.4,duration:2.6,ease:"sine.out",svgOrigin:"0 0"},4.7);
  tl.to("#s5b-star-body",{rotation:360,duration:2.2,ease:"power2.out",svgOrigin:"0 0"},4.7);
  tl.to("#s5b-star-closed",{opacity:0,duration:0.12},6.05); tl.to("#s5b-star-open",{opacity:1,duration:0.12},6.05);
  tl.fromTo("#s5b-star-body",{scale:1},{scale:1.15,duration:0.18,yoyo:true,repeat:1,svgOrigin:"0 0"},6.05);
  tl.to("#s5b-lift",{opacity:0.22,duration:2},5.2);
  for(let i=0;i<16;i++){ const a=i/16*Math.PI*2; const r1=160+(i%3)*50; tl.fromTo("#s5b-sp"+i,{x:Math.cos(a)*60,y:Math.sin(a)*60,opacity:0,rotation:0},{x:Math.cos(a+1.4)*r1,y:Math.sin(a+1.4)*r1,opacity:1,rotation:180,duration:1.4,ease:"sine.out"},5.9+i*0.03); tl.to("#s5b-sp"+i,{opacity:0,duration:0.6},7.6+i*0.03); }
  tl.fromTo("#s5b-cam",{y:0},{y:60,duration:4.4,ease:"sine.inOut"},4.5);
  ["s5b-lila","s5b-nubi","s5b-bruno"].forEach((p,i)=>{H.idle(tl,p,4.5,4.4,80+i); H.blinks(tl,p,6.4,8.9,90+i); H.look(tl,p,i===2?-4:4,-6,4.8+i*0.06,0.3); H.mood(tl,p,"open",5.0+i*0.08); H.mood(tl,p,"laugh",6.3+i*0.1,{happy:true});});
  tl.to(["#s5b-nubi-head","#s5b-lila-head"],{rotation:-8,duration:0.5,stagger:0.07},4.9);
  // 5C — faces in the starlight
  ${dissolveIn("s5c-svg", 8.5, 0.4)}
  tl.fromTo("#s5c-bg",{x:40},{x:-50,duration:3.9,ease:"sine.inOut"},8.5);
  tl.fromTo("#s5c-chars",{x:-20},{x:30,duration:3.9,ease:"sine.inOut"},8.5);
  tl.fromTo("#s5c-glow",{opacity:0.35,scale:1},{opacity:1,scale:1.25,duration:3.9,ease:"sine.in",svgOrigin:"960 -60"},8.5);
  tl.to("#s5c-warm",{opacity:0.24,duration:3.9},8.5);
  for(let i=0;i<18;i++){ tl.fromTo("#s5c-d"+i,{y:-40,opacity:0},{y:300+(i%5)*120,opacity:0.95,rotation:90,duration:2.4,ease:"sine.out"},8.6+(i%6)*0.25); tl.to("#s5c-d"+i,{opacity:0,duration:0.8},10.8+(i%6)*0.2); }
  ["s5c-lila","s5c-nubi","s5c-bruno"].forEach((p,i)=>{H.idle(tl,p,8.5,3.9,100+i,0.7); H.blinks(tl,p,8.5,12.4,110+i); H.look(tl,p,0,-5,8.5,0.01);});
  tl.set(["#s5c-lila-m-open","#s5c-nubi-m-open","#s5c-bruno-m-open"],{opacity:1},8.5);
  tl.set(["#s5c-lila-m-smile","#s5c-nubi-m-smile","#s5c-bruno-m-smile"],{opacity:0},8.5);
  H.look(tl,"s5c-nubi",-6,0,9.4,0.25); H.look(tl,"s5c-lila",6,1,9.5,0.25); H.look(tl,"s5c-bruno",-6,1,9.6,0.25);
  H.look(tl,"s5c-nubi",6,0,10.0,0.25);
  H.mood(tl,"s5c-lila","laugh",10.3,{happy:true}); H.mood(tl,"s5c-nubi","laugh",10.4,{happy:true}); H.mood(tl,"s5c-bruno","laugh",10.5,{happy:true});
  tl.to(["#s5c-lila-cheeks","#s5c-nubi-cheeks","#s5c-bruno-cheeks"],{scale:1.3,duration:0.4,stagger:0.1,ease:"back.out(2)",svgOrigin:"0 -160"},10.4);
  `;
  write("s5", scene("s5", 12.4, shot("s5a", 0, 4.9, a, 1) + shot("s5b", 4.5, 4.4, b, 2) + shot("s5c", 8.5, 3.9, c, 3), script));
}

// ======================= SCENE 6 — la luz vuelve (host 48.6–60) =======================
{
  const P = "s6";
  const ST = tinyStars(P, "s6a-st", 60, 61, [40, 20, 1840, 640], [5, 14]);
  const trail = Array.from({ length: 16 }, (_, i) => `<path id="s6a-tr${i}" d="${starPath(9, 4)}" fill="#FFF3B0" opacity="0" transform="translate(${960 + ((i * 53) % 60) - 30} ${1050 - i * 50})"/>`).join("");
  const a = `${svgOpen("s6a-svg")}${defs(P)}
  <g id="s6a-cam">
    ${skyRect("s6a-sky", [[0, "#2A2350"], [0.6, "#463A72"], [1, "#7466A6"]])}
    <rect id="s6a-lift" x="-400" y="-400" width="2720" height="1880" fill="#8A78C4" opacity="0"/>
    <g>${ST.svg}</g>
    ${trail}
    <circle id="s6a-ring" cx="960" cy="260" r="40" fill="none" stroke="#FFE59A" stroke-width="18" opacity="0"/>
    <circle id="s6a-ring2" cx="960" cy="260" r="40" fill="none" stroke="#FFF6D0" stroke-width="6" opacity="0"/>
    <g transform="translate(960 1150) scale(0.7)"><g id="s6a-starW">${magicStar(P, "s6a-star")}</g></g>
    ${cottonMountains(P, 860, "#4E4282", 91, 9, 200)}
    ${hill(P, "M-300 1300 L-300 1010 C 400 980 1000 1000 1500 990 S 2100 1000 2400 1010 L2400 1300 Z", "gLav", "#B7A6DD")}
    ${cottage(P, 520, 1030, 0.6, "s6a-c1")} ${cottage(P, 1420, 1030, 0.55, "s6a-c2")}
  </g></svg>`;

  const STb = tinyStars(P, "s6b-st", 46, 71, [40, 20, 1840, 420], [5, 12]);
  const conf = (() => {
    const R = rng(77);
    const cols = ["#F6C1D4", "#8EC9EE", "#C9B6E8", "#FBE38E", "#BFE6D3", "#fff"];
    return Array.from({ length: 70 }, (_, i) => `<rect id="s6b-cf${i}" x="${Math.round(R() * 1920)}" y="${-60 - Math.round(R() * 500)}" width="${14 + Math.round(R() * 10)}" height="${9 + Math.round(R() * 6)}" rx="3" fill="${cols[i % cols.length]}"/>`).join("");
  })();
  const sheep = (x, y, s, id) => `<g transform="translate(${x} ${y}) scale(${s})"><g id="${id}" filter="url(#${P}-fuzz)"><rect x="-34" y="-30" width="14" height="32" rx="7" fill="#8A7A9A"/><rect x="20" y="-30" width="14" height="32" rx="7" fill="#8A7A9A"/>
    <circle cx="-30" cy="-60" r="34" fill="url(#${P}-gWhite)"/><circle cx="10" cy="-74" r="40" fill="url(#${P}-gWhite)"/><circle cx="40" cy="-54" r="30" fill="url(#${P}-gWhite)"/>
    <ellipse cx="-58" cy="-74" rx="24" ry="22" fill="#A898B8"/><circle cx="-64" cy="-78" r="4" fill="${C.eye}"/><circle cx="-50" cy="-78" r="4" fill="${C.eye}"/><path d="M-63 -66 Q-57 -61 -51 -66" stroke="${C.eye}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g></g>`;
  const duck = (x, y, s, id) => `<g transform="translate(${x} ${y}) scale(${s})"><g id="${id}" filter="url(#${P}-fuzz)"><ellipse cx="0" cy="-36" rx="38" ry="34" fill="url(#${P}-gStar)"/><circle cx="-16" cy="-82" r="26" fill="url(#${P}-gStar)"/><ellipse cx="-42" cy="-78" rx="14" ry="7" fill="#F7A65A"/><circle cx="-20" cy="-88" r="4" fill="${C.eye}"/></g></g>`;
  const string = (x1, x2, y, sag, id, n) => {
    let s = `<path d="M${x1} ${y} Q ${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}" fill="none" stroke="#8D7FB8" stroke-width="3"/>`;
    for (let i = 1; i < n; i++) {
      const t = i / n; const x = x1 + (x2 - x1) * t; const yy = y + 4 * sag * t * (1 - t);
      s += `<g id="${id}${i}" opacity="0.25"><circle cx="${x.toFixed(1)}" cy="${(yy + 10).toFixed(1)}" r="20" fill="url(#${P}-gWarm)"/><circle cx="${x.toFixed(1)}" cy="${(yy + 8).toFixed(1)}" r="7" fill="${["#FFE59A", "#F6C1D4", "#8EC9EE", "#C9B6E8"][i % 4]}"/></g>`;
    }
    return s;
  };
  const b = `${svgOpen("s6b-svg")}
  <g id="s6b-cam">
    ${skyRect("s6b-sky", [[0, "#3A3070"], [0.6, "#6A5BA0"], [1, "#B19FD6"]])}
    <g>${STb.svg}</g>
    ${cottonMountains(P, 640, "#7A6AB0", 101, 9, 200)}
    ${hill(P, "M-300 1300 L-300 860 C 300 820 900 840 1300 830 S 2000 840 2500 860 L2500 1300 Z", "gMint")}
    ${string(-100, 700, 600, 50, "s6b-la", 10)} ${string(700, 1500, 620, 60, "s6b-lb", 10)} ${string(1500, 2300, 590, 50, "s6b-lc", 10)}
    ${tree(P, 120, 880, 1.2, "gRose")} ${tree(P, 1950, 880, 1.25, "gLav")}
    ${cottage(P, 420, 900, 0.95, "s6b-c1")} ${cottage(P, 1060, 870, 0.85, "s6b-c2")} ${cottage(P, 1680, 900, 0.95, "s6b-c3")}
    ${sheep(700, 1010, 1.1, "s6b-v1")} ${duck(860, 1030, 1.0, "s6b-v2")} ${sheep(1320, 1020, 1.15, "s6b-v3")} ${duck(1480, 1040, 1.05, "s6b-v4")} ${sheep(240, 1050, 1.0, "s6b-v5")} ${duck(1900, 1040, 1.0, "s6b-v6")}
    ${conf}
  </g></svg>`;

  const STc = tinyStars(P, "s6c-st", 50, 81, [40, 20, 1840, 460], [5, 12]);
  const c = `${svgOpen("s6c-svg")}
  <g id="s6c-cam">
    ${skyRect("s6c-sky", [[0, "#2E2660"], [0.55, "#5E4F96"], [1, "#B19FD6"]])}
    <g>${STc.svg}</g>
    <g transform="translate(960 150) scale(0.55)">${magicStar(P, "s6c-star")}</g>
    ${cottonMountains(P, 760, "#7A6AB0", 111, 9, 200)}
    ${hill(P, "M-400 1400 L-400 960 C 300 920 900 930 1300 930 S 2000 940 2500 960 L2500 1400 Z", "gMint")}
    ${cottage(P, 300, 990, 0.7, "s6c-c1")} ${cottage(P, 1640, 990, 0.7, "s6c-c2")}
    <g id="s6c-hug">
      <g id="s6c-brunoS">${place(1210, 950, 1.4, elephant(P, "s6c-bruno"))}</g>
      <g id="s6c-lilaS">${place(730, 960, 1.5, bunny(P, "s6c-lila"))}</g>
      <g id="s6c-nubiS">${place(965, 970, 1.6, bear(P, "s6c-nubi"))}</g>
    </g>
  </g>
  <rect id="s6c-black" x="0" y="0" width="1920" height="1080" fill="#14102A" opacity="0"/></svg>`;

  const words = ["LA AMISTAD HACE", "BRILLAR EL MUNDO"];
  let li = 0;
  const title = `<div id="s6-title" class="clip" data-start="7.9" data-duration="3.5">${words
    .map((w, wi) => `<div class="s6-line" id="s6-line${wi}">${[...w].map((ch) => `<span class="s6-ch" id="s6-ch${li++}">${ch === " " ? "&nbsp;" : ch}</span>`).join("")}</div>`)
    .join("")}</div>`;
  const css = `#s6-title { position:absolute; left:0; right:0; top:150px; text-align:center; z-index:10; font-family:"Nunito", sans-serif; font-weight:800; color:#FFF6E5; }
   #root .s6-line { font-size:104px; line-height:1.08; letter-spacing:0.04em; text-shadow: 0 0 22px rgba(251,227,142,0.85), 0 0 60px rgba(251,211,110,0.55), 0 6px 0 #C9A56A, 0 10px 24px rgba(40,25,80,0.55); }
   #root .s6-ch { display:inline-block; }`;

  const script = `
  ["a","c"].forEach(s=>{});
  H.setOrigins("s6c-nubi","bear"); H.setOrigins("s6c-lila","bunny"); H.setOrigins("s6c-bruno","elephant");
  ${dissolveIn("s6a-svg", 0, 0.4)}
  // 6A — the star returns to the sky and relights every star
  tl.fromTo("#s6a-starW",{y:0,scale:1},{y:-1270,scale:1.25,duration:2.0,ease:"power2.inOut",svgOrigin:"0 0"},0.2);
  tl.to("#s6a-star-closed",{opacity:0,duration:0.01},0); tl.to("#s6a-star-open",{opacity:1,duration:0.01},0);
  tl.to("#s6a-star-body",{rotation:-360,duration:2.0,ease:"power2.inOut",svgOrigin:"0 0"},0.2);
  for(let i=0;i<16;i++){ tl.fromTo("#s6a-tr"+i,{opacity:0,scale:0.4},{opacity:0.95,scale:1,duration:0.15},0.25+i*0.105); tl.to("#s6a-tr"+i,{opacity:0,y:"+=40",duration:0.7},0.5+i*0.105); }
  tl.fromTo("#s6a-ring",{attr:{r:40},opacity:0.95},{attr:{r:1500},opacity:0,duration:2.0,ease:"power2.out"},2.1);
  tl.fromTo("#s6a-ring2",{attr:{r:30},opacity:0.9},{attr:{r:1300},opacity:0,duration:2.2,ease:"power2.out"},2.2);
  tl.fromTo("#s6a-star-glow",{scale:1},{scale:2.4,duration:0.5,yoyo:true,repeat:1,ease:"sine.inOut",svgOrigin:"0 0"},2.1);
  const pts=${JSON.stringify(ST.list)}; pts.forEach((p,i)=>{const d=Math.hypot(p[0]-960,p[1]-260); tl.fromTo("#s6a-st"+i+"i",{scale:0,opacity:0},{scale:1,opacity:1,duration:0.45,ease:"back.out(2.6)"},2.15+d/1100);});
  tl.to("#s6a-lift",{opacity:0.35,duration:2},2.2);
  ["s6a-c1","s6a-c2"].forEach((c,i)=>{tl.to("#"+c+"-glow",{opacity:1,duration:0.4},2.8+i*0.2);});
  tl.fromTo("#s6a-cam",{y:-80},{y:20,duration:4.4,ease:"sine.inOut"},0);
  // 6B — the valley lights up and celebrates
  ${dissolveIn("s6b-svg", 4.0, 0.4)}
  tl.fromTo("#s6b-cam",{x:60},{x:-100,duration:4.4,ease:"sine.inOut"},4.0);
  const bulbs=[]; ["a","b","c"].forEach(k=>{for(let i=1;i<10;i++) bulbs.push("#s6b-l"+k+i);});
  tl.to(bulbs,{opacity:1,duration:0.2,stagger:0.05,ease:"power1.out"},4.3);
  ["s6b-c1","s6b-c2","s6b-c3"].forEach((c,i)=>tl.to("#"+c+"-glow",{opacity:1,duration:0.35},4.4+i*0.25));
  for(let i=1;i<=6;i++){ tl.fromTo("#s6b-v"+i,{y:0},{y:-46-(i%3)*10,duration:0.26+(i%2)*0.05,ease:"power2.out",yoyo:true,repeat:7},4.3+i*0.09); }
  for(let i=0;i<70;i++){ tl.fromTo("#s6b-cf"+i,{y:0,rotation:0},{y:1250+(i%7)*40,x:(i%2?60:-60),rotation:(i%2?1:-1)*(360+i*7),duration:3.4+(i%5)*0.3,ease:"none"},4.6+(i%10)*0.08); }
  // 6C — the hug, the crane out, the title
  ${dissolveIn("s6c-svg", 8.0, 0.4)}
  tl.fromTo("#s6c-cam",{scale:1.25,y:20},{scale:0.95,y:0,duration:3.4,ease:"sine.inOut",svgOrigin:"960 820"},8.0);
  tl.set(["#s6c-nubi-heyes","#s6c-lila-heyes","#s6c-bruno-heyes"],{opacity:1},8.0);
  tl.set(["#s6c-nubi-eyeL","#s6c-nubi-eyeR","#s6c-lila-eyeL","#s6c-lila-eyeR","#s6c-bruno-eyeL","#s6c-bruno-eyeR"],{opacity:0},8.0);
  tl.set(["#s6c-nubi-m-laugh","#s6c-lila-m-laugh","#s6c-bruno-m-laugh"],{opacity:1},8.0);
  tl.set(["#s6c-nubi-m-smile","#s6c-lila-m-smile","#s6c-bruno-m-smile"],{opacity:0},8.0);
  tl.set("#s6c-nubi-armL",{rotation:-70},8.0); tl.set("#s6c-nubi-armR",{rotation:70},8.0);
  tl.set("#s6c-lila-armR",{rotation:-75},8.0); tl.set("#s6c-bruno-armL",{rotation:72},8.0);
  tl.set(["#s6c-lila-head"],{rotation:10},8.0); tl.set(["#s6c-bruno-head"],{rotation:-8},8.0);
  tl.fromTo("#s6c-hug",{rotation:-2.5},{rotation:2.5,duration:0.75,ease:"sine.inOut",yoyo:true,repeat:3,svgOrigin:"960 1000"},8.0);
  tl.fromTo("#s6c-nubi-head",{rotation:-3},{rotation:4,duration:0.8,ease:"sine.inOut",yoyo:true,repeat:3},8.1);
  H.idle(tl,"s6c-nubi",8.0,3.4,120); H.idle(tl,"s6c-lila",8.0,3.4,121); H.idle(tl,"s6c-bruno",8.0,3.4,122);
  tl.fromTo(".s6-ch",{opacity:0,y:30,scale:0.85},{opacity:1,y:0,scale:1,duration:0.5,ease:"back.out(2.2)",stagger:0.04},7.95);
  tl.to("#s6c-black",{opacity:1,duration:0.5,ease:"sine.in"},10.9);
  tl.to("#s6-title",{opacity:0,duration:0.5,ease:"sine.in"},10.9);
  `;
  write("s6", scene("s6", 11.4, shot("s6a", 0, 4.4, a, 1) + shot("s6b", 4.0, 4.4, b, 2) + shot("s6c", 8.0, 3.4, c, 3), script, title, css));
}
console.log("built s1..s6");
