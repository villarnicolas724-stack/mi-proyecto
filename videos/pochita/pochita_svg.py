"""Pochita en SVG (fan art basado en la referencia del usuario). Cada parte tiene id para animarla:
  {p}-body (grupo entero), {p}-eyes (parpadeo), {p}-teeth (cadena), {p}-legs, {p}-tail.
mood: 'happy' (ojos abiertos), 'hurt' (ojos cerrados en X), 'angry' (ceño + ojos rojos)."""

OR, OR_D, OR_L, LINE, STEEL, STEEL_D = "#F08A2B", "#D86E1C", "#FFA94D", "#3A1C0B", "#5B5B5E", "#2B2B2E"


def pochita(p, mood="happy", w=None, h=None):
    teeth_l = "".join(f'<path d="M188,{34+k*16} l-11,8 l11,8Z"/>' for k in range(16))
    teeth_r = "".join(f'<path d="M212,{34+k*16} l11,8 l-11,8Z"/>' for k in range(16))
    if mood == "hurt":
        eyes = (f'<g id="{p}-eyes" stroke="{LINE}" stroke-width="9" stroke-linecap="round" fill="none">'
                f'<path d="M88,178 q27,22 54,0"/><path d="M258,178 q27,22 54,0"/></g>')
        mouth = f'<path d="M168,272 q16,-14 32,-2 q16,-12 32,2" stroke="{LINE}" stroke-width="6" fill="none" stroke-linecap="round"/>'
    else:
        pupil = "#B3121E" if mood == "angry" else "#141414"
        eyes = (f'<g id="{p}-eyes">'
                f'<circle cx="115" cy="185" r="46" fill="#FFFFFF" stroke="{LINE}" stroke-width="6"/>'
                f'<circle cx="115" cy="185" r="33" fill="{pupil}"/><circle cx="103" cy="172" r="8" fill="#FFFFFF" opacity=".85"/>'
                f'<circle cx="285" cy="185" r="46" fill="#FFFFFF" stroke="{LINE}" stroke-width="6"/>'
                f'<circle cx="285" cy="185" r="33" fill="{pupil}"/><circle cx="273" cy="172" r="8" fill="#FFFFFF" opacity=".85"/></g>')
        if mood == "angry":
            eyes += (f'<path d="M66,130 L160,158" stroke="{LINE}" stroke-width="14" stroke-linecap="round"/>'
                     f'<path d="M334,130 L240,158" stroke="{LINE}" stroke-width="14" stroke-linecap="round"/>')
        mouth = (f'<path d="M140,250 C150,284 182,290 196,262" stroke="{LINE}" stroke-width="7" fill="none" stroke-linecap="round"/>'
                 f'<path d="M260,250 C250,284 218,290 204,262" stroke="{LINE}" stroke-width="7" fill="none" stroke-linecap="round"/>')
    size = f'width="{w}" height="{h}"' if w else 'width="100%" height="100%"'
    return f'''<svg viewBox="0 0 400 420" {size} overflow="visible">
  <defs>
    <radialGradient id="{p}-g" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="{OR_L}"/><stop offset=".55" stop-color="{OR}"/><stop offset="1" stop-color="{OR_D}"/></radialGradient>
    <clipPath id="{p}-bladeclip"><rect x="160" y="10" width="80" height="262" rx="14"/></clipPath>
  </defs>
  <g id="{p}-body">
    <g id="{p}-tail"><path d="M350,300 C392,300 396,340 372,352" stroke="{LINE}" stroke-width="6" fill="none"/>
      <rect x="356" y="344" width="40" height="16" rx="8" fill="{STEEL_D}"/></g>
    <g id="{p}-legs" fill="{OR_D}" stroke="{LINE}" stroke-width="6">
      <rect x="112" y="318" width="54" height="72" rx="24"/><rect x="234" y="318" width="54" height="72" rx="24"/></g>
    <path d="M30,215 C30,105 105,52 200,52 C295,52 370,105 370,215 C370,318 298,362 200,362 C102,362 30,318 30,215Z" fill="url(#{p}-g)" stroke="{LINE}" stroke-width="7"/>
    <path d="M70,300 C110,345 290,345 330,300" stroke="{OR_D}" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/>
    <rect x="150" y="2" width="100" height="40" rx="12" fill="{STEEL_D}" stroke="{LINE}" stroke-width="5"/>
    <g clip-path="url(#{p}-bladeclip)"><g id="{p}-teeth" fill="{STEEL_D}">{teeth_l}{teeth_r}</g></g>
    <rect x="186" y="30" width="28" height="238" rx="14" fill="{STEEL}" stroke="{LINE}" stroke-width="5"/>
    <line x1="200" y1="44" x2="200" y2="254" stroke="#8C8C90" stroke-width="4"/>
    {eyes}
    {mouth}
  </g>
</svg>'''
