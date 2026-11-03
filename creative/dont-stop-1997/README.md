# FUTURIST, FUNKT!DE — "DON'T STOP"
## Instagram Reel · Music Video Treatment & Shooting Storyboard
### Working title: **"SIDE A — BERLIN, AUGUST '97"**

> *One cassette. One pair of orange-foam headphones. A city in August 1997.*
> *The song plays first in one person's headphones. It passes from friend to friend until it reaches a rooftop and plays out loud for everyone.*
> *The last word is "DON'T—". The cut lands before "stop", and the Reel loops.*

---

## 0. Contents

1. [The idea](#1-the-idea)
2. [Music map: the first 24.96 s of the track](#2-music-map-the-first-2496-s-of-the-track)
3. [Look & feel](#3-look--feel)
4. [Cast & wardrobe bible](#4-cast--wardrobe-bible)
5. [Locations](#5-locations)
6. [Master timeline](#6-master-timeline-at-a-glance)
7. [Shot-by-shot storyboard + AI prompts](#7-shot-by-shot-storyboard)
8. [AI generation playbook](#8-ai-generation-playbook)
9. [Edit, grade & finishing](#9-edit-grade--finishing)
10. [Delivery specs](#10-delivery-specs)

Companion files: [`shotlist.csv`](./shotlist.csv) (frame-accurate EDL-style list for the editor).

---

## 1. The idea

### Logline
A girl walks through Berlin on a hot late afternoon in August 1997 with the song playing in her headphones. She shares it with a boy on a scooter. Two friends fall in step, a girl leaves a laundromat to follow, and the group runs up a tenement stairwell. At the top she takes off the headphones and opens the rooftop door. The track drops and the whole roof is dancing to it out loud.

### Why this concept works with *this* track
The track's own structure gives the story.

| What the music does | What the film does |
|---|---|
| **Bars 1–9:** a high-passed, thin intro with no sub-bass. It sounds like music heard through headphones. | **ACT I, "INSIDE THE HEADPHONES".** We hear exactly what Lena hears. The filtered sound is diegetic. |
| The hats build for six bars, then pull back in bar 9 | The cutting gets faster as friends join, then holds one still shot (Lena takes the headphones off and looks into the lens). |
| **Bar 10: the DROP.** Kick and sub-bass arrive. | **ACT II, "OUT LOUD".** The rooftop door opens on the downbeat. The bass the audience was missing in Act I is now everywhere. |
| A short vocal call, "don't stop", on beat 4 of every second bar | Two lip-sync moments: the whole roof shouts it, then Lena mouths "Don't—" into the lens. |
| The Reel is cut *before* the second "stop" | The film never says "stop". It loops back to the PLAY button. Instagram's autoplay loop carries the idea. |

### Mood keywords
Freedom · late-summer heat · friends you haven't met yet · flirtation without a script · the moment a song becomes *everyone's* · 1997 before smartphones.

### What we are deliberately NOT doing
- No club interiors, lasers, fog or neon. The party happens on a roof in daylight.
- No cyberpunk or "future" visuals. The future here is the music, not the image.
- No VHS. This is **film**: grain, halation, gate weave, light-struck frames. No tracking lines.
- No glossy ad framing. Nobody holds a pose for the camera. The look is editorial, the behaviour is real.
- No performance lip-sync of verses. The only mouthed words are the hook.

### Reference shelf (for feeling, not to copy)
- **Wolfgang Tillmans' and Corinne Day's 1990s youth and editorial photography**: candid intimacy, natural light, imperfect skin, friends as models.
- **Christopher Doyle's step-printed handheld in 1990s Hong Kong cinema**: used once only (shot 16).
- **Mid-90s street-level independent cinema shot on 16 mm**: restless handheld, real locations, non-actors.
- **Late-90s European music-TV aesthetics**: small white locator credit lower-left, hard cuts, film-originated and transferred through telecine.

---

## 2. Music map: the first 24.96 s of the track

Measured from the supplied master `Futurist, Funktide - Don't Stop (Radio Edit)).wav` (44.1 kHz / 16-bit, 3:40.8) with beat tracking, band-energy analysis and vocal stem separation.

### Key numbers

| Parameter | Value |
|---|---|
| Tempo | **125.00 BPM**, 4/4, rock-steady (FL Studio grid) |
| 1 beat | 0.48 s = **12 frames @ 25 fps** |
| 1 bar | 1.92 s = **48 frames @ 25 fps** |
| 1/8 note | 6 frames · 1/16 note = 3 frames |
| Audio IN point | **0.070 s** into the WAV (sample 3 087). This is the first audible sample and also bar 1, beat 1. |
| Audio OUT point | **25.030 s** into the WAV (sample 1 103 823), 10 ms fade-out |
| **Reel length** | **24.96 s = 624 frames = exactly 13 bars** |

> **Why 25 fps:** 1990s European music videos were shot for PAL (25 fps). At 125 BPM, 25 fps puts every beat on a whole frame: 12 frames per beat, 48 per bar. Every cut in this storyboard lands on an exact frame number.

All times below are on the **Reel timeline** (= WAV time − 0.070 s).

### Structure

```
BAR │  1  │  2  │  3  │  4  │  5  │  6  │  7  │  8  │  9  ║ 10  │ 11  │ 12  │ 13  │
SEC │0.00 │1.92 │3.84 │5.76 │7.68 │9.60 │11.52│13.44│15.36║17.28│19.20│21.12│23.04│→24.96
FRM │  0  │ 48  │ 96  │ 144 │ 192 │ 240 │ 288 │ 336 │ 384 ║ 432 │ 480 │ 528 │ 576 │→624
────┼─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────╫─────┴─────┴─────┴─────┤
MIX │swell│ HIGH-PASSED GROOVE, no sub-bass ("headphones") ║ FULL MIX: kick + sub +│
    │ ▲hit│   hats ▁▂▃▄▅▆▇ build ……………………… ▇ │pull ║ rolling offbeat bass  │
    │ f27 │                                       │back ║                       │
VOX │     │  ~sung line from 3.2 s ───────────────────▶ ║    "don't  ║ "DON'T—"│
    │     │                                             ║     STOP!" ║   (cut) │
────┴─────┴─────────────────────────────────────────────╨─────────────────────────┘
          ACT I — INSIDE THE HEADPHONES (17.28 s)          ACT II — OUT LOUD (7.68 s)
```

### Sync points

| Event | Time | Frame | Musical position | Used for |
|---|---|---|---|---|
| Reverse swell from silence | 0.00–1.0 s | 0–25 | bar 1 | Film-leader flash burns away (S01) |
| **First transient** | **1.086 s** | **27** | bar 1, beat 3 + 1/16 | Thumb presses **PLAY** (S01) |
| Groove fully running (8ths) | 1.44 s | 36 | bar 1, beat 4 | |
| Sung vocal line enters | ≈3.2 s | ≈80 | bar 2, beat 3 | Lena mouths along (S02) |
| Vocal accent | 9.12 s | 228 | bar 5, beat 4 | Marco's grin peaks (S05) |
| Hats peak | 13.44–15.36 s | 336–383 | bar 8 | Quarter-note flash montage (S10) |
| Hats pull back (pre-drop) | 15.36 s | 384 | bar 9 | The only still, held shot (S11) |
| **DROP: kick + sub enter** | **17.28 s** | **432** | **bar 10, beat 1** | **Rooftop door opens** (S12) |
| Vocal hook #1, "don't" | 20.82 s | ≈520 | bar 11, beat 4& | Crowd inhales, arms rise (S15) |
| Vocal hook #1, "STOP!" | 21.12 s | 528 | bar 12, beat 1 | Arms pump, the peak shout (S15) |
| Vocal hook #2, "DON'T—" | 24.48 s | 612 | bar 13, beat 4 | Lena mouths it into the lens (S18) |
| *(would-be "stop" + bar 14 kick)* | *24.97 s* | *624* | *bar 14, beat 1* | **Cut before it.** Loop to frame 0. |

> **Lyric check:** the two-syllable vocal stab after the drop is read as the title hook "don't stop". Confirm by ear. If the word is different, S15 and S18 still work as shouts or mouthed words. Adjust the mouth shape only.

---

## 3. Look & feel

### Camera (if shot for real, and the vocabulary we "prompt" the AI with)
- **Format:** Super 16 mm, colour negative.
- **Body:** Aaton XTR Prod or Arri SR3, both late-90s documentary and music-video workhorses.
- **Vertical trick:** mount the camera **rotated 90°**. The Super 16 negative (7.41 × 12.52 mm) then becomes a 1:1.69 vertical frame. Extracting 9:16 loses only about 5 % of the negative, where a centre-crop from a horizontal frame would lose about 66 %.
- **Lenses:** Zeiss Super Speed primes (9.5 / 12 / 16 / 25 mm, T1.3) for intimacy; Canon 8–64 mm T2.4 zoom for long-lens walking shots. A ¼ Black Pro-Mist in Act II only.
- **Stocks:**
  - Act I day exteriors: **Kodak EXR 50D (7245)**. Fine grain, crisp sun.
  - Laundromat, stairwell and rooftop golden hour: **Kodak Vision 500T (7279)**, pushed +1 stop. Coarse grain, milky blacks, cyan-leaning shadows under daylight.
- **Frame rate & shutter:** 25 fps, 180° (natural motion blur). Exceptions: S10 at 45° shutter (staccato) and S16 step-printed.
- **Operating:** shoulder-mounted handheld throughout. Small sways, micro-corrections, occasional reframes. No gimbal or Steadicam float, no drones, no dolly polish.

### Light
Natural light only, plus practicals that belong to the location (laundromat fluorescents, stairwell window).
- **Act I (≈5–6 pm):** hard, high sun through chestnut trees. Dappled light and shadow strobes across faces, bounced fill from pale facades. Contrast is high but blacks are never crushed.
- **Stairwell:** dim, warm and cool mixed, hard slashes of daylight through tall windows.
- **Act II (golden hour, ≈8:30 pm):** low sun directly **behind** the subjects. Rim light, natural flare, airborne dust and haze, an amber-to-magenta sky.

### Colour palette

| Swatch | Hex | Role |
|---|---|---|
| Sun-bleached cream | `#EFE3C8` | highlights, skies, pale facades |
| Tobacco amber | `#B9783A` | golden-hour skin, sunlight |
| Faded olive | `#7C7A4E` | trees, laundromat tiles, midtones |
| Brick rust | `#A4553A` | facades, roof tar, warmth anchor |
| Ice-blue satin | `#BFD3D6` | Lena's slip dress (hero colour) |
| Headphone orange | `#E2742B` | the hero prop, in every act |
| Cherry red | `#A8322D` | Noor's cardigan (single accent) |
| Telecine teal shadow | `#2F4A4C` | shadows |
| Lifted black | `#1D1A17` | darkest point. Never pure black. |

### Texture rules (authentic, not a filter)
- **Grain:** real scanned Super 16 grain, 50D-fine in Act I exteriors and 500T-coarse elsewhere. Strongest in shadows and the blue channel.
- **Halation:** a thin red-orange glow around hard highlights (sun, windows, chrome).
- **Gate weave:** 0.3–0.6 px slow drift. Not a jitter.
- **Exposure flicker:** ±1–2 %, irregular.
- **Dust and hair:** three or four events in the whole Reel, 1–2 frames each, plus one gate hair for about 10 frames in S07.
- **Light-struck frames:** only at the start (S01), into the drop (2 frames) and at the roll-out ending (6 frames).
- **Never:** VHS lines, RGB-split glitches, scratch-everywhere overlays, fake "film burn" transitions between every shot.

---

## 4. Cast & wardrobe bible

Casting approach: **street-cast real people**. Two professional models at most (Lena and Safi); everyone else is art-school, skate or record-shop kids. The faces should be specific and memorable, never generically "perfect". Wardrobe is real vintage. **No visible logos.**

> Paste each character's **PROMPT BLOCK** verbatim into every prompt where that character appears. Identical wording plus a reference still is what keeps AI characters consistent.

### LENA (lead, 22)
The one with the headphones. Self-contained, magnetic, amused by the world. She never tries to be noticed, and that is why everyone follows her.
- Hair: messy chin-length **bleached platinum bob with dark roots**, often tucked behind one ear.
- Face: freckles, natural brows, bare skin, a little lip gloss.
- Wardrobe: **pale ice-blue satin bias-cut slip dress** over a fitted **white ribbed tank top**. A **navy nylon track jacket with white piping** tied around the waist. **Chunky silver-white platform trainers.** Thin silver chain choker, small silver hoops, tiny **oval amber-lens sunglasses** pushed up into her hair.
- Hero props: **orange-foam on-ear headphones** with a thin metal band; a **silver portable cassette player**; a **smoke-translucent cassette** with a white paper label (title handwritten in post).

```
LENA PROMPT BLOCK:
a 22-year-old Northern European woman with a messy chin-length bleached platinum bob with dark roots, freckles, natural brows and bare skin, wearing a pale ice-blue satin slip dress over a white ribbed tank top, a navy nylon track jacket with white piping tied around her waist, chunky silver-white platform trainers, small silver hoop earrings, a thin silver chain choker, tiny oval amber sunglasses pushed up in her hair, and small orange-foam on-ear headphones with a thin metal band
```

### MARCO (24)
The scooter boy. Easy charm and a quick laugh. He's the first to get it.
```
MARCO PROMPT BLOCK:
a 24-year-old Southern European man with olive skin, dark middle-parted curtain hair and three-day stubble, wearing a burgundy knit polo shirt with a short zip, a thin gold chain, wide stone-grey cargo trousers, brown suede low trainers and small black oval sunglasses
```
Prop: a **pale-mint vintage Italian-style scooter** (no badges) and a cream open-face helmet.

### SAFI (23)
The tall one, the fashion-editorial presence. Cool until she laughs, then she's the loudest.
```
SAFI PROMPT BLOCK:
a tall 23-year-old Black woman with a close-cropped bleached-blonde buzz cut and strong brows, wearing a black ribbed tank top, a long silver chain, a silver cuff bracelet, wide-leg charcoal tailored trousers, black square-toe leather boots and tiny rectangular silver-frame sunglasses
```

### JONAS (21)
Lanky, goofy, a very bad and very confident dancer. The comic release.
```
JONAS PROMPT BLOCK:
a lanky 21-year-old pale young man with shaggy brown curtain hair falling into his eyes, wearing a faded grey short-sleeve t-shirt layered over a green-and-cream striped long-sleeve top, baggy light-wash jeans with frayed hems, worn suede skate shoes and a beaded necklace
```

### NOOR (22)
In the laundromat, bored, until the music walks past the window. Her chemistry with Marco is Act II's small story.
```
NOOR PROMPT BLOCK:
a 22-year-old woman of North African heritage with dark hair in a sleek high ponytail with two face-framing strands, thin brows, brown lip liner with gloss, gold hoop earrings, wearing a cherry-red cropped cardigan over a white tank top and low-rise wide light-blue jeans
```

### Rooftop crowd (15–20)
Mixed late-90s European youth: mesh tops, band-style tees with no text, bucket hats, slip skirts, track jackets, cargo trousers, small sunglasses, bleached tips, a few piercings. Real bodies, real faces, varied ages from 19 to 30. No "club kid" costume and no rave clichés (no glow sticks, whistles or face paint).

---

## 5. Locations

Berlin, August 1997: the city between the Wall and the money. Unrenovated tenements, construction cranes on the skyline, empty courtyards, a lot of sky.

| ID | Location | Key details | Light |
|---|---|---|---|
| L1 | **Street** (Prenzlauer Berg / Mitte style) | Cobblestones, tram tracks, peeling ochre-grey Altbau facades with old bullet scars, chestnut trees, an early-90s pastel hatchback at the kerb | Hard afternoon sun, dappled shade |
| L2 | **Laundromat** | Big shop window with reflections, green tiles, rows of machines, fluorescent tubes | Cool fluorescent inside vs warm street outside |
| L3 | **Tenement stairwell** | Spiral stair, worn wooden banister, chipped green-and-cream walls, tiled landings, skylight at top, battered grey steel roof door | Dim; slashes of hard window light |
| L4 | **Rooftop** | Tar-paper roof, chimney stacks, TV antennas, satellite dishes, sagging washing line, beer crates, silver boombox and two old hi-fi speakers. In the haze: cranes and the TV tower. | Golden hour, sun behind the crowd |

Time compresses across the 25 seconds, from late afternoon to golden hour. The light itself tells you something is building.

---

## 6. Master timeline at a glance

**25 fps · 624 frames · 24.96 s · 18 shots (21 incl. S10a–d)**

| # | Title | In → Out (s) | Frames | Len | Bar.beat | Sync point |
|---|---|---|---|---|---|---|
| **S01** | PLAY | 0.00 → 1.92 | 0–47 | 48f | 1.1–1.4 | Leader burn-out; **PLAY on f27** |
| **S02** | LENA | 1.92 → 5.76 | 48–143 | 96f | 2.1–3.4 | Mouths along at ≈f80 |
| **S03** | THE STREET | 5.76 → 7.68 | 144–191 | 48f | 4.1–4.4 | Safi slides off the car on beat 3 |
| **S04** | SHARE | 7.68 → 8.64 | 192–215 | 24f | 5.1–5.2 | Earcup reaches his ear on beat 2 |
| **S05** | HE GETS IT | 8.64 → 9.60 | 216–239 | 24f | 5.3–5.4 | Grin peaks on f228 |
| **S06** | FEET | 9.60 → 10.56 | 240–263 | 24f | 6.1–6.2 | Footfalls every 12f |
| **S07** | THE LINE | 10.56 → 11.52 | 264–287 | 24f | 6.3–6.4 | Vocal phrase starts on the cut |
| **S08** | NOOR | 11.52 → 12.48 | 288–311 | 24f | 7.1–7.2 | She looks up on beat 2 |
| **S09** | SHE FOLLOWS | 12.48 → 13.44 | 312–335 | 24f | 7.3–7.4 | Door swings on beat 3 |
| **S10a** | BANISTER | 13.44 → 13.92 | 336–347 | 12f | 8.1 | Hand slap on the beat |
| **S10b** | SAFI LAUGHS | 13.92 → 14.40 | 348–359 | 12f | 8.2 | |
| **S10c** | LANDING | 14.40 → 14.88 | 360–371 | 12f | 8.3 | |
| **S10d** | SPIRAL | 14.88 → 15.36 | 372–383 | 12f | 8.4 | |
| **S11** | THE DOOR | 15.36 → 17.28 | 384–431 | 48f | 9.1–9.4 | Look to lens; **2 flash frames f430–431** |
| **S12** | THE ROOF | 17.28 → 19.20 | 432–479 | 48f | **10.1 DROP** | Door bursts open on f432 |
| **S13** | LENA DANCES | 19.20 → 20.16 | 480–503 | 24f | 11.1–11.2 | |
| **S14** | ATTRACTION | 20.16 → 20.80 | 504–519 | 16f | 11.3–11.4 | Cut 1 frame before the vocal |
| **S15** | DON'T STOP! | 20.80 → 21.60 | 520–539 | 20f | 11.4& → 12.2 | **"STOP!" fists pump on f528** |
| **S16** | STEP PRINT | 21.60 → 23.04 | 540–575 | 36f | 12.2–12.4 | 12.5 fps step-print |
| **S17** | THE CIRCLE | 23.04 → 24.00 | 576–599 | 24f | 13.1–13.2 | Jonas spins on beat 1 |
| **S18** | DON'T— | 24.00 → 24.96 | 600–623 | 24f | 13.3–13.4 | **Mouths "Don't" f612**; roll-out f618–623 → LOOP |

### Cutting curve (shot lengths in frames)
```
ACT I   S01 S02 S03 │ S04 S05 S06 S07 S08 S09 │ S10a b  c  d │ S11 ║ ACT II  S12 S13 S14 S15 S16 S17 S18
         48  96  48 │  24  24  24  24  24  24 │  12 12 12 12 │  48 ║          48  24  16  20  36  24  24
        └── calm ──┘ └──── accelerating ─────┘ └─ frantic ──┘ HOLD ║         DROP └── syncopated groove ──┘
```
Act I follows the **hi-hat build**: long, then half-bar, then quarter-note cuts, then one held bar of stillness. Act II follows the **bassline and the vocal**: syncopated lengths (16 / 20 / 36 frames) so the cuts groove instead of marching.

---

## 7. Shot-by-shot storyboard

Format per shot: **Visual · Camera · Light & atmosphere · Action & emotion · Edit rhythm · AI prompt** (+ risks and plan B where an AI is likely to struggle).

Every AI prompt below is **self-contained and copy-paste ready**. Generate each clip at **5 s, 9:16**, then pick the frame range you need (see §8).

---

### ACT I — INSIDE THE HEADPHONES  `bars 1–9 · 0:00.00–0:17.28`

---

#### S01 · "PLAY"
`0:00.00 → 0:01.92 · f0–47 · 48 frames · bar 1 (swell)`

**Visual.** The Reel opens on light-struck orange-white film leader (a real scan, added in post) that burns away during the audio swell. Under it is an extreme close-up of a sun-warmed wooden windowsill. A hand slides a smoke-translucent cassette into a silver portable player, snaps the lid shut, and the thumb presses PLAY. The reels start to turn. The label reads **DON'T STOP** in black marker, and **FUTURIST, FUNKT!DE** on the J-card edge. This handwriting is the only title in the film.

**Camera.** Macro (a 25 mm with a diopter, about 10 cm from the subject). Handheld, breathing slightly. Focus hunts for a moment, then lands on the button just before the press.

**Light & atmosphere.** Raking late-afternoon sun from frame left, dust floating in the beam, warm amber highlights on chrome, soft shadow. Intimate and tactile, like a ritual.

**Action & emotion.** Chipped silver nail polish and a casual, practised move. She has done this a thousand times. Anticipation.

**Edit rhythm.** Hold one continuous shot. Leader burn from f0 to about f10, riding the swell. **The PLAY press bottoms out on f27**, exactly on the first musical transient (1.086 s). Optional: lay a real cassette-deck "clunk" foley at −18 dB on f27. Hard cut to S02 on the bar line (f48).

**AI prompt**
```
Extreme close-up macro shot, vertical 9:16. A sun-warmed, paint-chipped wooden windowsill in an old Berlin apartment in August 1997. A young woman's hand with chipped silver nail polish slides a smoke-translucent cassette tape with a plain white paper label into an open silver portable cassette player, snaps the lid shut, and her thumb presses the PLAY button down firmly; the tape reels begin to turn behind the little window. Raking late-afternoon sunlight from the left, floating dust particles in the beam, warm amber glints on brushed metal, soft deep shadows. Handheld macro camera with a tiny breathing drift, very shallow depth of field, the focus briefly hunts and then lands on the button. Shot on Super 16mm film, Kodak 500T, 25fps, 180-degree shutter, fine organic film grain, slight halation on highlights, warm faded colors, lifted milky blacks, telecine transfer look. Real-time speed, no slow motion. No text, no logos.
```
**Risk / plan B.** Hand-object interaction is the classic AI failure. Generate 6–10 takes and use only the 0.6 s around the press. Label text and the leader burn are **added in post** (handwritten scan, planar-tracked). Plan B: lock off on the turning reels, with the click carried by sound and a 2-frame flash.

---

#### S02 · "LENA"
`0:01.92 → 0:05.76 · f48–143 · 96 frames · bars 2–3`

**Visual.** The longest shot in the film, and our introduction to Lena. A medium close-up as she walks briskly down a sunlit street, orange-foam headphones on, lost in the song. Chestnut-tree shadows flicker across her face. Behind her, soft and out of focus, are peeling ochre facades.

**Camera.** 16 mm lens. The operator walks backwards just ahead of her at a three-quarter profile, slightly below eye level. Natural shoulder sway, with one small reframe when she tucks her hair.

**Light & atmosphere.** Hard sun filtered by trees. Moving dapples and bright flashes strobe across her skin almost in rhythm with the hats. Pale walls give natural bounce fill. Heat and dust; it's August.

**Action & emotion.** She ignores the camera completely. At about f80, when the vocal enters, she mouths a few words to herself and half-smiles. She tucks a strand behind her ear and glances at something off-frame. Private joy and quiet confidence.

**Edit rhythm.** Hold for two full bars. This is the only long breath in Act I: let the audience fall for her. Optional: a **90s music-TV locator credit**, small white Helvetica lower-left (inside the safe zone, see §10), fading in on f60 and out on f136:
`Futurist, FunkT!de` / `"Don't Stop"` / `(Radio Edit)`.

**AI prompt**
```
Medium close-up, vertical 9:16, Berlin street, August 1997, late afternoon. A 22-year-old Northern European woman with a messy chin-length bleached platinum bob with dark roots, freckles, natural brows and bare skin, wearing a pale ice-blue satin slip dress over a white ribbed tank top, a navy nylon track jacket with white piping tied around her waist, small silver hoop earrings, a thin silver chain choker, tiny oval amber sunglasses pushed up in her hair, and small orange-foam on-ear headphones with a thin metal band, walks briskly along the pavement, lost in the music. She does not look at the camera: she silently mouths a few words of the song to herself, half-smiles, and tucks a strand of hair behind her ear. Handheld camera walking backwards just in front of her at a three-quarter profile, slightly below eye level, natural operator sway. Hard sunlight filtering through chestnut trees throws moving dappled shadows and bright flashes across her face. Out-of-focus background: crumbling ochre tenement facades with peeling plaster. Shot on Super 16mm film, 25fps, 180-degree shutter, natural motion blur, fine organic film grain, soft halation, warm faded colors, lifted blacks, cream highlights, slightly teal shadows, telecine look. Candid, unposed, real skin texture with pores and freckles. Real-time speed, no slow motion.
```

---

#### S03 · "THE STREET"
`0:05.76 → 0:07.68 · f144–191 · 48 frames · bar 4`

**Visual.** A wide, low establishing shot of the world. Lena crosses a cobblestone street with tram tracks. Safi and Jonas sit on the bonnet of a pastel-blue early-90s hatchback. They clock her and slide off to follow.

**Camera.** 9.5 mm wide lens, low, about 40 cm off the cobbles. Static handheld with a slight pan to follow Lena left to right.

**Light & atmosphere.** Hard, warm, low-ish sun. Long shadows across the cobblestones, a slightly overexposed bleached sky, vertical facades leaning in from the wide lens.

**Action & emotion.** Safi slides off the car first, on beat 3 (about f168). Jonas follows half a beat late and nearly trips. They don't call out; they just *go*. Curiosity and instinct.

**Edit rhythm.** One bar, hard cut on the bar line. This is where the cutting starts to accelerate.

**AI prompt**
```
Wide shot, vertical 9:16, low angle with a 9.5mm wide-angle lens close to the cobblestones. An unrenovated Berlin street in August 1997: tram tracks, peeling ochre and grey tenement facades with old bullet scars, chestnut trees, an early-1990s pastel-blue hatchback car parked at the curb with no badges. A young woman with a bleached platinum bob, a pale ice-blue satin slip dress and orange-foam headphones crosses the street from left to right. Two friends sitting on the car's bonnet watch her pass: a tall 23-year-old Black woman with a close-cropped bleached-blonde buzz cut in a black ribbed tank top, a long silver chain and wide-leg charcoal trousers, and a lanky 21-year-old pale young man with shaggy brown curtain hair in a grey t-shirt over a striped long-sleeve and baggy light jeans. The woman slides off the bonnet first, the young man follows a moment later, nearly tripping, and they both fall into step behind her, laughing. Handheld camera, slight pan to follow. Hard warm late-afternoon sunlight, long shadows on the cobblestones, slightly overexposed sky. Shot on Super 16mm film, 25fps, 180-degree shutter, organic film grain, gentle gate weave, warm faded colors, lifted blacks, telecine look. Candid, documentary, unposed. Real-time speed, no slow motion.
```

---

#### S04 · "SHARE"
`0:07.68 → 0:08.64 · f192–215 · 24 frames · bar 5, beats 1–2`

**Visual.** Marco rolls up at walking pace on a pale-mint scooter. Without breaking stride, Lena lifts one earcup off her own ear and presses it to his. Their heads lean together; one pair of headphones, two people.

**Camera.** 25 mm. Handheld, tracking alongside at the same speed, medium two-shot in profile.

**Light & atmosphere.** Backlit. A soft natural flare from the sun in the top corner, dust from the road, golden edges on hair.

**Action & emotion.** Spontaneous and a little cheeky: she doesn't ask, she just shares. The first spark of flirtation.

**Edit rhythm.** Half a bar. The earcup touches his ear **on beat 2 (f204)**; cut on beat 3.

**AI prompt**
```
Medium two-shot in profile, vertical 9:16, handheld camera tracking alongside at walking pace on a sunlit Berlin street in 1997. A 24-year-old Southern European man with olive skin, dark middle-parted curtain hair and three-day stubble, in a burgundy knit zip polo and a thin gold chain, rolls slowly on a pale mint vintage Italian-style scooter with no badges, right next to a young woman with a bleached platinum bob in a pale ice-blue satin slip dress who keeps walking. Without stopping, she lifts one orange-foam ear pad of her headphones off her own ear and presses it against his ear; their heads lean close together, sharing one pair of headphones, his hand stays on the handlebar. Backlit by warm low sun with a soft natural lens flare in the top corner, dusty air, golden rim light on hair. Spontaneous, playful, a hint of flirtation. Shot on Super 16mm film, 25fps, 180-degree shutter, natural motion blur, fine film grain, soft halation, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```
**Risk / plan B.** Earcup-to-ear contact can warp. Plan B: she pulls the headphones off and drops them over his neck, or she simply holds the Walkman out and he leans in to listen.

---

#### S05 · "HE GETS IT"
`0:08.64 → 0:09.60 · f216–239 · 24 frames · bar 5, beats 3–4`

**Visual.** A close-up of Marco on the scooter, one earcup to his ear. The music hits him: eyebrows up, a grin breaks, he nods on the beat. His sunglasses slide down his nose and he looks over them at her.

**Camera.** 25 mm, close. Handheld, moving with him, small bounces.

**Light & atmosphere.** Warm low sun on his face, golden skin, soft sunlit facades behind.

**Action & emotion.** A real, unscripted laugh. Recognition: "where did you *find* this?"

**Edit rhythm.** Half a bar. **The grin peaks on f228**, matching the vocal accent at 9.12 s. The nods sit on beats 3 and 4 (f216, f228).

**AI prompt**
```
Close-up, vertical 9:16, of a 24-year-old Southern European man with olive skin, dark middle-parted curtain hair and three-day stubble, in a burgundy knit zip polo and a thin gold chain, riding slowly on a scooter on a sunlit Berlin street in 1997, holding one orange-foam headphone ear pad to his ear. As the music hits him, his eyebrows rise, a wide genuine grin breaks across his face and he starts nodding to the beat; his small black oval sunglasses slide down his nose and he glances over them at someone just off-camera. Handheld camera moving with him, slight bounce. Warm low sunlight on his face, golden skin tones, out-of-focus sunlit facades behind. Natural, unscripted laughter, real skin texture. Shot on Super 16mm film, 25fps, 180-degree shutter, fine organic film grain, soft halation, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```

---

#### S06 · "FEET"
`0:09.60 → 0:10.56 · f240–263 · 24 frames · bar 6, beats 1–2`

**Visual.** An ankle-height tracking insert. Four pairs of feet walk *in step* on cobbles and tram rails (platform trainers, square-toe boots, suede skate shoes) beside the scooter's front wheel. Satin and wide trouser hems swing.

**Camera.** 9.5 mm, about 15 cm off the ground. The operator crouches and walks backwards, bumps included.

**Light & atmosphere.** Long forward shadows, sun glinting on the tram rails, dust kicked up.

**Action & emotion.** This is the moment they become a group. A shared rhythm without anyone saying a word.

**Edit rhythm.** Half a bar. **Footfalls land on f240 and f252** (one step per beat). 125 BPM is a natural brisk walking pace, so ask the actors to walk to a click and they will match the song.

**AI prompt**
```
Low tracking shot at ankle height, vertical 9:16, camera gliding backwards just above old cobblestones and tram rails in Berlin, 1997. Four pairs of feet walk in step in the same rhythm, one footstep every beat at 125 BPM: chunky silver-white platform trainers under a swinging pale ice-blue satin slip dress hem, black square-toe leather boots under wide-leg charcoal trousers, worn suede skate shoes under frayed light-wash jeans, and the front wheel of a pale mint scooter rolling alongside. Hard late-afternoon sunlight, long shadows stretching forward, sunlight glinting on the tram rails, dust kicked up by the steps. Handheld, slightly bumpy, energetic. Shot on Super 16mm film, 25fps, 180-degree shutter, natural motion blur, organic film grain, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```

---

#### S07 · "THE LINE"
`0:10.56 → 0:11.52 · f264–287 · 24 frames · bar 6, beats 3–4`

**Visual.** A telephoto, head-on shot of the four walking toward camera in a loose line down the middle of the street. Lena is in the centre, Safi tall beside her, Jonas bumping Safi, Marco pushing the scooter. This is the fashion-editorial frame of the film, but nobody is posing.

**Camera.** Long end of the Canon 8–64 mm, compressed perspective. Handheld with small framing corrections.

**Light & atmosphere.** Backlit, heat shimmer above the cobbles, rim light on hair, warm haze. **One gate hair in frame for about 10 frames** (post) for authenticity.

**Action & emotion.** They talk and laugh, someone stumbles. Confidence without intention. They look like a band before they are one.

**Edit rhythm.** Half a bar. The cut lands exactly where the sung vocal phrase restarts (10.56 s).

**AI prompt**
```
Telephoto long-lens shot with compressed perspective, vertical 9:16, head-on. Four young friends walk toward the camera in a loose line down the middle of a sunlit cobblestone street in Berlin in 1997: in the center a young woman with a bleached platinum bob, pale ice-blue satin slip dress and orange-foam headphones; beside her a tall Black woman with a bleached-blonde buzz cut, black tank top and long silver chain; a lanky young man with shaggy brown curtain hair in a striped long-sleeve jostling her shoulder; and an olive-skinned young man in a burgundy zip polo pushing a pale mint scooter. Backlit by the low sun, warm haze, heat shimmer above the cobblestones, rim light on their hair. Like a 1990s fashion editorial but completely unposed: they talk, laugh, one of them stumbles slightly. Handheld long lens with small framing corrections. Shot on Super 16mm film, 25fps, 180-degree shutter, organic film grain, soft halation, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```

---

#### S08 · "NOOR"
`0:11.52 → 0:12.48 · f288–311 · 24 frames · bar 7, beats 1–2`

**Visual.** A shot through a laundromat window. The glass carries warm reflections of the street and the blurred silhouettes of the group passing. Inside, Noor sits on a running washing machine flicking through a magazine under green fluorescent light. She looks up, and a slow half-smile follows.

**Camera.** 25 mm, outside the glass. Static handheld sway. The focus racks from the reflections to Noor's face.

**Light & atmosphere.** Cool green fluorescent interior against warm golden reflections. Two worlds on one pane of glass.

**Action & emotion.** Boredom becomes curiosity. **She looks up on beat 2 (f300).**

**Edit rhythm.** Half a bar. The colour temperature shift is the cut's punctuation.

**AI prompt**
```
Medium shot through the large front window of a 1990s Berlin laundromat, vertical 9:16. The glass carries reflections of a sunlit street and the blurred silhouettes of a group of friends walking past outside. Inside, a 22-year-old woman of North African heritage with dark hair in a sleek high ponytail with two face-framing strands, thin brows, brown lip liner with gloss and gold hoop earrings, wearing a cherry-red cropped cardigan over a white tank top and low-rise wide light-blue jeans, sits on top of a running washing machine flicking through a magazine, under green-tinted fluorescent tube light, green tiled walls and rows of machines behind her. She looks up, notices the group outside, and a slow half-smile spreads across her face. Handheld camera with slight sway, focus racking from the reflections on the glass to her face. Mixed light: cool fluorescent interior versus warm golden street reflections. Shot on Super 16mm film, Kodak 500T, 25fps, 180-degree shutter, visible organic film grain, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```

---

#### S09 · "SHE FOLLOWS"
`0:12.48 → 0:13.44 · f312–335 · 24 frames · bar 7, beats 3–4`

**Visual.** Noor pushes out of the glass door and jogs into the street after the group, ponytail swinging. The magazine is left spinning on the machine.

**Camera.** 16 mm. A whip-pan from the door, then the operator runs behind and beside her. Shaky but controlled.

**Light & atmosphere.** From cool interior into blazing sun. The highlights briefly blow out and then recover, as a film stock would.

**Action & emotion.** Impulse and freedom: the decision takes less than a second.

**Edit rhythm.** Half a bar. **The door swings open on beat 3 (f312).** Cut on the bar line into the stairwell.

**AI prompt**
```
Handheld follow shot, vertical 9:16. A 22-year-old woman of North African heritage with a sleek high dark ponytail, gold hoop earrings, a cherry-red cropped cardigan and low-rise wide light-blue jeans pushes open the glass door of a 1990s laundromat and jogs out into a sunlit Berlin street to catch up with a group of friends ahead, her ponytail swinging. The camera whip-pans to follow and runs after her from behind and to the side, shaky but controlled. She bursts from the cool fluorescent interior into bright warm late-afternoon sun; the highlights briefly overexpose and recover like film. Impulsive, free, joyful. Shot on Super 16mm film, 25fps, 180-degree shutter, natural motion blur, organic film grain, soft halation, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```

---

#### S10 · "STAIRS" (flash montage, quarter-note cuts)
`0:13.44 → 0:15.36 · f336–383 · 4 × 12 frames · bar 8 (hi-hat peak)`

**Visual.** Four fragments of the group storming up a 1900s tenement stairwell. They feel stolen rather than composed.

| Sub | Frames | Image |
|---|---|---|
| **10a** | f336–347 | A hand slaps the worn wooden banister mid-run |
| **10b** | f348–359 | Safi laughing, head thrown back, a window slash across her face |
| **10c** | f360–371 | Jonas and Marco bump shoulders on a landing, Marco's cream helmet swinging |
| **10d** | f372–383 | Looking straight up the spiral: Lena takes the steps two at a time toward the skylight |

**Camera.** **45° shutter** (crisp, staccato, almost no motion blur, so the energy stutters). Handheld, close, fast.

**Light & atmosphere.** Dim tenement interior on 500T: coarse grain, chipped green-and-cream walls, hard slashes of daylight through tall windows, dust in the air.

**Action & emotion.** Breathless, laughing, a little reckless. The pulse of the hats made physical.

**Edit rhythm.** **One cut per beat** (12 f), the fastest cutting in the film. Cuts hit **f336, 348, 360, 372**.

**AI prompts**
```
10a — Close-up, vertical 9:16: a young hand slaps the worn, polished wooden banister of an old 1900s Berlin tenement staircase while running upward, chipped green-and-cream painted walls, a hard slash of daylight from a tall stairwell window, dust in the air. Crisp staccato motion as if shot with a narrow 45-degree shutter, handheld, fast. Shot on Super 16mm film, Kodak 500T pushed one stop, coarse organic grain, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```
```
10b — Close-up, vertical 9:16: a tall 23-year-old Black woman with a close-cropped bleached-blonde buzz cut, a black ribbed tank top and a long silver chain laughs with her head thrown back while running up an old Berlin tenement staircase, a hard slash of window light crossing her face, chipped green walls behind. Crisp staccato motion, narrow 45-degree shutter, handheld, breathless energy, genuine laughter, real skin texture. Shot on Super 16mm film, Kodak 500T pushed, coarse organic grain, halation on the window light, warm faded colors, lifted blacks. Real-time speed, no slow motion.
```
```
10c — Medium shot, vertical 9:16, on a tiled landing of an old Berlin tenement stairwell: a lanky young man with shaggy brown curtain hair in a striped long-sleeve and an olive-skinned young man in a burgundy zip polo carrying a cream open-face helmet bump shoulders and laugh as they run up past the camera. Crisp staccato motion, narrow 45-degree shutter, handheld, chaotic and joyful. Dim interior with hard window light. Shot on Super 16mm film, Kodak 500T pushed, coarse grain, warm faded colors, lifted blacks. Real-time speed, no slow motion.
```
```
10d — Looking straight up the spiral stairwell of an old 1900s Berlin tenement toward a bright skylight, vertical 9:16, wooden banister spiraling upward. A young woman with a bleached platinum bob and a pale ice-blue satin slip dress runs up the stairs two at a time, seen from below through the spiral, orange-foam headphones on her ears. Crisp staccato motion, narrow 45-degree shutter, handheld. Strong contrast between the dim stairwell and the glowing skylight, halation around the skylight. Shot on Super 16mm film, Kodak 500T pushed, coarse grain, warm faded colors, lifted blacks. Real-time speed, no slow motion.
```

---

#### S11 · "THE DOOR" (pre-drop hold)
`0:15.36 → 0:17.28 · f384–431 · 48 frames · bar 9 (hats pull back)`

**Visual.** The top of the stairs. A battered grey steel roof door, with daylight blazing through its cracks, frames Lena from behind. She stops, catches her breath, turns, and **looks straight into the lens** for the first time. Slowly, she slides the headphones down to her neck. Behind her the others crowd the last steps, chests heaving, grinning.

**Camera.** 25 mm. A very slow handheld push-in from medium close-up to close-up. After the frantic S10, this is the stillest shot in the film.

**Light & atmosphere.** Dim, warm interior. Hard knife-edges of sun from the door seams, airborne dust, heavy grain in the shadows. It feels like the moment before a flash.

**Action & emotion.** A quiet, knowing smile that says "ready?". Calm control in the middle of everyone else's excitement. **The headphones leave her ears on beat 3 (f408)**. In the story, this is where the filtered sound will "open up".

**Edit rhythm.** Hold the whole bar against the music's pull-back; the stillness is the tension. **The last 2 frames (f430–431) are light-struck** (a real flash-frame scan, orange-white), as if the door is opening into the sun. Hard cut into the drop.

**AI prompt**
```
Medium close-up slowly pushing in to a close-up, vertical 9:16, at the top of a dim old Berlin tenement staircase. Behind her, a battered grey steel rooftop door with blazing daylight leaking through its cracks and edges. A 22-year-old Northern European woman with a messy chin-length bleached platinum bob with dark roots, freckles, bare skin, a pale ice-blue satin slip dress over a white ribbed tank top and small orange-foam on-ear headphones stops, catches her breath, turns and looks straight into the camera lens, then slowly slides the headphones down onto her neck with a quiet, confident, knowing smile. Behind her on the last steps, four friends crowd together, breathing hard and grinning. Slow handheld push-in. Dim warm interior, hard knife-edge shafts of sunlight from the door seams, dust floating in the light, deep shadows with heavy grain. Tension and anticipation. Shot on Super 16mm film, Kodak 500T pushed one stop, 25fps, 180-degree shutter, coarse organic film grain, halation around the light leaks, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```
**Risk / plan B.** The direct look plus a slow push is a face-heavy shot, where AI "uncanny" shows most. Keep her face partly in shadow, generate many takes, and choose one with real micro-expressions (blinks, breath). Plan B: shoot it over her shoulder toward the glowing door, so she turns her head only to profile.

---

### ACT II — OUT LOUD  `bars 10–13 · 0:17.28–0:24.96`

---

#### S12 · "THE ROOF" (DROP)
`0:17.28 → 0:19.20 · f432–479 · 48 frames · bar 10 — the drop`

**Visual.** On the downbeat the steel door flies open. Sunlight overexposes the negative, then the rooftop reveals itself: tar paper, chimney stacks, TV antennas, a sagging washing line, beer crates, a silver boombox and two old hi-fi speakers. About twenty young people **turn as the bass lands and erupt into dancing.** In the haze beyond: construction cranes and the TV tower.

**Camera.** 12 mm. The operator **bursts through the door** and keeps pushing forward into the crowd. It's handheld and chaotic, but the subject stays readable.

**Light & atmosphere.** Golden hour. The low sun sits directly behind the crowd: rim light, natural flare, hazy amber air. Add ¼ Black Pro-Mist bloom from here to the end.

**Action & emotion.** The release the whole first act was holding back. Joy, freedom and noise. Bodies move freely and nobody dances "well".

**Edit rhythm.** **The cut is on f432, exactly on the drop.** The 2 flash frames before it make the entry hit harder. Hold the full bar: the audience needs one complete bar of the new sound to feel it.

**AI prompt**
```
Handheld camera bursts through a battered steel door onto a Berlin rooftop at golden hour in August 1997, vertical 9:16, 12mm wide lens. The door swings open and blinding sunlight briefly overexposes the frame, then reveals a tar-paper roof with chimney stacks, old TV antennas, satellite dishes and a sagging washing line, about twenty young people in late-1990s clothes (mesh tops, slip dresses, track jackets, cargo trousers, small sunglasses, bleached hair), a big silver boombox and two old hi-fi speakers standing on beer crates. As the camera rushes forward among them, the crowd turns and erupts into loose, joyful, unchoreographed dancing. In the hazy distance: the city skyline with construction cranes and a TV tower. The low sun directly behind the crowd, strong backlight, natural lens flare, warm golden haze, glowing rim light on hair. Shot on Super 16mm film, Kodak 500T, 25fps, 180-degree shutter, natural motion blur, organic film grain, strong halation and soft bloom on highlights, warm faded colors, lifted blacks, telecine look. Real people, candid documentary energy. Real-time speed, no slow motion.
```

---

#### S13 · "LENA DANCES"
`0:19.20 → 0:20.16 · f480–503 · 24 frames · bar 11, beats 1–2`

**Visual.** A medium shot of Lena dancing with her eyes closed, headphones around her neck, the bob whipping across her face, the satin dress catching the sun.

**Camera.** 25 mm, handheld, moving with her and wobbling slightly.

**Light & atmosphere.** The sun sits right behind her head, giving a halo of rim light and a soft natural flare. Out-of-focus dancers and chimneys behind.

**Action & emotion.** Loose shoulders and hips riding the rolling offbeat bass. For the first time she's not in control; she's *in it*. Freedom and confidence.

**Edit rhythm.** Half a bar. Her hip and shoulder accents fall on the off-beats (the bassline): f486, f498.

**AI prompt**
```
Medium shot, vertical 9:16, on a tar-paper Berlin rooftop at golden hour in 1997. A 22-year-old Northern European woman with a messy chin-length bleached platinum bob with dark roots and freckles, wearing a pale ice-blue satin slip dress over a white ribbed tank top, orange-foam headphones hanging around her neck, dances with her eyes closed: loose, unchoreographed movement of shoulders and hips to a rolling bassline, her hair whipping across her face, the satin catching the light. The low sun directly behind her head creates a soft natural flare and a glowing golden rim around her hair. Handheld camera moving with her, slight wobble. Out-of-focus dancers and chimney stacks behind. Freedom and confidence. Shot on Super 16mm film, Kodak 500T, 25fps, 180-degree shutter, natural motion blur, organic film grain, halation and soft bloom, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```

---

#### S14 · "ATTRACTION"
`0:20.16 → 0:20.80 · f504–519 · 16 frames · bar 11, beat 3 → just before the hook`

**Visual.** A close two-shot of Marco and Noor dancing face to face, very close. A look held a beat too long; then she laughs and pushes him back by the chest.

**Camera.** 25 mm. Handheld, half-circling them.

**Light & atmosphere.** Hard warm side light, faces half in shadow, a sheen of sweat.

**Action & emotion.** Attraction, tension and a playful refusal. A whole romance in 16 frames.

**Edit rhythm.** **16 frames, cut 1 frame before the vocal** ("don't" starts at 20.815 s, i.e. f520.4), so the shout lands on a fresh image.

**AI prompt**
```
Close two-shot, vertical 9:16, on a Berlin rooftop at golden hour in 1997. A 24-year-old olive-skinned man with dark middle-parted curtain hair and stubble, in a burgundy knit zip polo and a thin gold chain, and a 22-year-old woman of North African heritage with a sleek high dark ponytail, gold hoops, brown lip liner and a cherry-red cropped cardigan dance face to face, very close; they hold eye contact a moment too long with obvious attraction, then she laughs and playfully pushes him away with one hand on his chest. Warm hard side light from the low sun, faces half in shadow, a light sheen of sweat. Handheld camera half-circling them. Spontaneous, intimate, natural micro-expressions. Shot on Super 16mm film, Kodak 500T, 25fps, 180-degree shutter, organic film grain, halation, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```

---

#### S15 · "DON'T STOP!" (vocal hook #1)
`0:20.80 → 0:21.60 · f520–539 · 20 frames · bar 11 beat 4& → bar 12 beat 2`

**Visual.** A low-angle wide from inside the crowd. Everyone throws their arms up and shouts it together toward the sky. On "**STOP!**" the fists pump down. Hands, hair and heads are silhouetted against the blazing sun.

**Camera.** 9.5 mm, from about waist height pointing up. Handheld, shoved upward with the crowd's movement.

**Light & atmosphere.** Pure backlight: silhouettes, a big natural flare, gold dust in the air.

**Action & emotion.** Euphoria and collective release. **This is the cover frame** (see §10).

**Edit rhythm.** Arms rise during "don't" (f520–527). **Fists pump on f528, the bar 12 downbeat and the "STOP!"** Slip the clip by a frame or two until the visual peak sits exactly on f528. Cut after the vocal tail (f540).

**AI prompt**
```
Low-angle wide shot from the middle of a rooftop crowd at golden hour, vertical 9:16, 9.5mm wide lens pointing up. Around twenty young people in late-1990s clothes throw their arms up together and shout joyfully toward the sky with mouths wide open, then pump their fists down hard on the beat, in one collective moment of release. Their hands, hair and heads are silhouetted against the low blazing sun, big natural lens flare, golden dust and haze in the air. Handheld camera shoved upward with the crowd, energetic, slightly shaky. Euphoria. Shot on Super 16mm film, Kodak 500T, 25fps, 180-degree shutter, natural motion blur, organic film grain, strong halation and bloom, warm faded colors, lifted blacks, telecine look. Real people, candid. Real-time speed, no slow motion.
```

---

#### S16 · "STEP PRINT"
`0:21.60 → 0:23.04 · f540–575 · 36 frames · bar 12, beats 2–4`

**Visual.** Safi dances alone at the very edge of the roof against the setting sun, the city far below in haze. Her motion **smears and stutters** with the late-90s step-printed look: each image is held for two frames and streaks with motion blur.

**Camera.** 16 mm, drifting around her. In a real shoot: 12 fps with a slow shutter, printed twice.

**Light & atmosphere.** An amber-to-magenta sky with Safi as a deep silhouette. Her silver chain and cuff flare into streaks of light.

**Action & emotion.** Time stretches. A private trance in the middle of the party, and the most "fashion film" image in the Reel.

**Edit rhythm.** 36 frames, the longest shot in Act II: a breath inside the groove. Cut on bar 13's downbeat.

**AI prompt**
```
Medium-wide shot, vertical 9:16: a tall 23-year-old Black woman with a close-cropped bleached-blonde buzz cut, a black ribbed tank top, a long silver chain, a silver cuff bracelet and wide-leg charcoal trousers dances alone at the very edge of a Berlin rooftop against the low setting sun, the city far below in warm haze with construction cranes on the skyline. Fluid, hypnotic, eyes half closed. Handheld camera slowly drifting around her. Amber and magenta sky, her figure in deep silhouette with glowing rim light, highlights on the silver chain and cuff. Shot on Super 16mm film, Kodak 500T, organic film grain, strong halation and bloom, warm faded colors, lifted blacks, telecine look. Real-time speed.
```
**Post (essential).** Do the step-print in post rather than asking the AI for it. Take the 25 fps clip, add heavy motion blur (a 360° shutter equivalent or a 2-frame blend), then **hold every frame for 2 frames (12.5 fps)**. In Resolve: Retime → Frame Blend + Motion Blur, then a 12.5 fps posterise in Fusion. In After Effects: CC Force Motion Blur followed by Posterize Time 12.5.

---

#### S17 · "THE CIRCLE"
`0:23.04 → 0:24.00 · f576–599 · 24 frames · bar 13, beats 1–2`

**Visual.** A high, almost top-down angle from a chimney ladder. The crowd has formed a loose circle, clapping and laughing, while Jonas spins in the middle with awkward, total commitment. Long golden-hour shadows streak across the tar paper.

**Camera.** 12 mm from about 3 m up. Handheld wobble.

**Light & atmosphere.** Raking golden light. The shadows are longer than the people, which is graphic and beautiful from above.

**Action & emotion.** Communal joy and comic release. Everyone belongs.

**Edit rhythm.** Half a bar. **Jonas starts his spin on f576** (bar 13, beat 1).

**AI prompt**
```
High-angle, almost top-down shot from a chimney ladder, vertical 9:16, 12mm wide lens: on a tar-paper Berlin rooftop at golden hour in 1997, a crowd of young people in late-1990s clothes forms a loose circle, clapping and laughing, as a lanky young man with shaggy brown curtain hair, a striped long-sleeve and baggy light jeans spins clumsily but with total confidence in the middle. Very long golden-hour shadows stretch across the roof surface. Handheld camera from above with slight wobble. Warm, joyful, communal. Shot on Super 16mm film, Kodak 500T, 25fps, 180-degree shutter, natural motion blur, organic film grain, halation, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```

---

#### S18 · "DON'T—" (vocal hook #2 → loop)
`0:24.00 → 0:24.96 · f600–623 · 24 frames · bar 13, beats 3–4 → END`

**Visual.** Lena, breathless and glowing, steps right up to the camera. She lifts the headphones from her neck and **puts them over the lens**, as if she's putting them on *you*. As she does, she mouths "**Don't—**" with a cheeky grin. The orange foam fills the frame, the image goes soft and dark, and the film **runs out**: orange-white roll-out flare. Then it loops to S01's leader.

**Camera.** 25 mm, close. Handheld. She comes to the camera.

**Light & atmosphere.** The sun behind her and her hair on fire with rim light, then orange foam, then light-struck film.

**Action & emotion.** Complicity. She hands the song to the viewer.

**Edit rhythm.** **She mouths "Don't" on f612** (24.48 s, bar 13 beat 4). The foam covers the lens around f614–617. **Roll-out burn f618–623.** **Hard end at f624**, one frame before the "stop" and the bar 14 kick (24.97 s). The track never says "stop": Instagram loops straight back to frame 0, where the leader burns and the thumb presses PLAY again. **DON'T [STOP].**

**AI prompt**
```
Close-up, vertical 9:16, on a Berlin rooftop at golden hour in 1997. A 22-year-old Northern European woman with a messy chin-length bleached platinum bob with dark roots and freckles, wearing a pale ice-blue satin slip dress, breathless and glowing after dancing, steps right up to the camera, lifts the orange-foam on-ear headphones from around her neck and places them over the camera lens; as she does, she silently mouths one short word to the lens with a cheeky, complicit grin. The orange foam ear pad comes toward the lens and fills the frame, the image goes soft and dark. The low sun behind her sets her hair glowing with rim light, natural flare. Handheld, very close, intimate. Shot on Super 16mm film, Kodak 500T, 25fps, 180-degree shutter, organic film grain, halation and bloom, warm faded colors, lifted blacks, telecine look. Real-time speed, no slow motion.
```
**Risk / plan B.** Objects approaching and covering the lens are hard for AI. Plan B 1: she reaches out and **covers the lens with her palm** (AI handles this well), then the roll-out burn. Plan B 2: cut f600–613 as a close-up of her mouthing "Don't—", then f614–623 as a separate macro of the orange foam rushing at the lens, then the burn.

---

## 8. AI generation playbook

### Pipeline (recommended)
1. **Character sheets first.** For each character, generate 6–8 stills with the PROMPT BLOCK (front, ¾, profile, full-body, in their wardrobe) in your stills model. Pick one hero image each. These become your **reference images** for every video generation.
2. **Keyframes.** For each shot, generate a 9:16 still using the shot prompt *minus the motion sentences*, with the character reference attached. Approve the frames as a storyboard before spending on video.
3. **Image-to-video.** Animate each approved keyframe with the full shot prompt in an image-to-video model (whichever you have access to, e.g. Kling, Veo, Runway, Sora, Hailuo, Seedance). Always:
   - **9:16**, highest resolution available, **5 s** duration, real-time speed;
   - character reference images or "elements" attached where supported;
   - the negative prompt below where supported;
   - **3–6 takes per shot** (10 for S01, S04, S11, S15 and S18).
4. **Choose frames, not clips.** Our shots are 12–96 frames long. Take the most natural slice, usually from the middle of a generation. **Skip the first ~0.5 s** (AI "wake-up" stiffness) and the **last ~1 s** (identity drift and morphing).
5. **Discard any audio** the model generates.
6. **Conform** to 25 fps. If a model outputs 24 fps, speed it up 4 % to 25 fps (exactly what PAL telecine did to 24 fps film in 1997). **Do not use optical-flow interpolation** on AI clips; it creates mush.

### Negative prompt (paste where supported)
```
digital video look, 4K hyper-sharpness, HDR, oversaturated colors, neon, cyberpunk, futuristic, LED lights, smartphones, modern cars, modern buildings, logos, brand names, readable text, watermarks, subtitles, VHS tracking lines, scanlines, chromatic aberration, glitch effects, excessive scratches, fake film burn overlays, plastic skin, airbrushed faces, beauty filter, perfectly symmetrical model faces, dead eyes, morphing faces, warped hands, extra fingers, fused limbs, floating objects, slow motion, gimbal float, drone shot, CGI, 3D render, video game look, bokeh balls, nightclub, lasers, fog machine, stage lighting, posing for the camera, stock-footage look
```

### Rules for faces and movement (avoiding the AI look)
- **Faces in motion, not in portraits.** Only S02, S11 and S18 hold a face for longer than half a second. Elsewhere faces are moving, partly occluded (hair, sunglasses, shadow) or small in frame.
- **Ask for micro-behaviour,** not emotions: "tucks hair behind her ear", "glances off-camera", "nearly trips", "catches her breath". Specific small actions read as real.
- **Always write "real-time speed, no slow motion".** Most models default to dreamy slow motion, which kills groove.
- **Always write "handheld … natural operator sway".** Otherwise you get gimbal float.
- **Ask for "fine" grain only, and add the real grain in post.** AI-generated grain "boils" and is inconsistent between shots. One real scanned grain across all shots is what makes them look like *one roll of film*.
- **No readable text from the AI.** The cassette label "DON'T STOP" and the J-card are **handwritten on paper, scanned, and tracked on** in post (Mocha or Resolve planar tracker).
- **Hands and objects** (S01, S04, S18) are the riskiest. Over-generate, keep the slice short, and use the plan B options above.

### Consistency checklist (before the edit)
- [ ] Lena's hair is the *same* bleached bob with dark roots in every shot
- [ ] The headphones are always **orange foam** (the hero prop and the colour anchor)
- [ ] Slip dress colour is ice-blue, never white or silver
- [ ] Marco's scooter is the same mint green
- [ ] No modern objects in the background (phones, modern cars, LED signs, recent graffiti styles)
- [ ] Sun direction is consistent within each act

---

## 9. Edit, grade & finishing

### Edit setup
- Timeline: **1080 × 1920, 25 fps**.
- Audio: the WAV from **0.070 s to 25.030 s**, placed at 00:00:00:00, with a **10 ms fade-out** only.
- Markers on every bar (every 48 frames) and on the sync frames: **27, 228, 432, 528, 612, 624**.
- **Hard cuts only.** The only transitions are **film** events: leader burn (S01), 2 flash frames (f430–431) and roll-out (f618–623), all from **real film-scan elements** blended in Screen or Add mode.
- Cut **on** the beat frame. For the drop and the hooks, check by eye that the visual action peak (door opening, fists pumping) sits on the beat frame, and slip the clip ±1–2 frames if not.
- The edit must **loop**: play f600–623, then f0–48, on repeat, and check that the roll-out → leader transition feels like one continuous film event.

### Grade (DaVinci Resolve node order)
1. **Normalise the AI.** Pull saturation down 15–25 %, soften contrast, and soften the image slightly (≈0.3–0.5 px blur). AI micro-detail is unnaturally crisp for 16 mm, whose effective resolution was about 1.2–1.5 K.
2. **Balance** every shot to a common look per act (match skin first).
3. **Film/telecine look:**
   - lift blacks to about 3–5 % (target `#1D1A17`) and never crush;
   - gentle highlight roll-off with cream highlights (`#EFE3C8`);
   - warm, rosy-amber skin; nudge shadows slightly teal (`#2F4A4C`);
   - Act I is warm-neutral with more contrast; the stairwell is green-cream; Act II is golden with an amber-magenta sky.
4. **Halation:** a red-orange glow on the brightest highlights (sun, windows, chrome, the satin dress). Stronger in Act II.
5. **Bloom / Pro-Mist:** Act II only, subtle.
6. **Grain:** a **real Super 16 scan** (fine 50D-type for Act I exteriors, coarse 500T-type for the laundromat, stairwell and roof) in Overlay or Soft Light at 35–50 %, heavier in shadows. Set it slightly *stronger* than feels right, because Instagram compression smooths grain.
7. **Gate weave** 0.3–0.6 px with slow random drift, and **exposure flicker** ±1–2 %.
8. **Dust:** 3–4 single dust events plus one gate hair in S07. That's all.
9. **Vignette:** subtle, mainly on 9.5 mm shots.

### Sound
The track only. Optional, very low: a **real cassette PLAY "clunk"** on f27. No other foley and no AI audio.

---

## 10. Delivery specs

| Item | Spec |
|---|---|
| Container / codec | MP4, H.264 High profile, 4:2:0, 2-pass VBR ≈ 16–20 Mbps |
| Resolution / fps | **1080 × 1920, 25 fps**, progressive |
| Duration | **24.96 s (624 frames)** |
| Audio | AAC-LC 320 kbps, 48 kHz stereo (resampled from the 44.1 kHz master), peaks ≤ −1 dBTP |
| Instagram | Turn on *Upload at highest quality* in the app's data or media quality settings before uploading |
| Safe zones | Keep faces and key action inside the **central 1080 × 1440 (3:4)**, which is what the profile grid shows. Keep the bottom ~420 px clear of key content (caption and UI) and the right ~140 px clear of buttons. The S02 locator credit goes left-aligned at roughly 60–66 % of frame height, *above* the caption zone. |
| **Cover frame** | **S15 @ f528**: arms up, silhouetted against the sun, on "STOP!" (it also reads well in a 3:4 crop). Alternative: S13. |
| Disclosure | The footage is AI-generated and photorealistic, so switch on Instagram's AI label when posting. The "lost 1997 film" feeling is the style, not a claim. |

### Alternate cut (if a "complete phrase" ending is preferred)
**21.60 s / 540 frames:** end on S15 after the full "DON'T STOP!" (f539), with the roll-out burn over f534–539. You lose the loop idea but end on the shouted hook. It's still within 20–25 s.

---

*Creative concept, storyboard and music analysis prepared for Futurist, FunkT!de — "Don't Stop" (Radio Edit).*
