# Google Flow prompts: envelope image, arch card image and intro video

The website already draws the envelope, the seal opening and the arch card in code, so it works without these files.
To get the photo-realistic look from the reference video, generate the 3 assets below in **Google Flow**,
save them in `public/media/` and fill the paths in `src/config.js → media`.

Replace `A&S` everywhere with **your initials** (bride & groom).

---

## 1) Closed envelope image: `public/media/envelope.jpg`

**Flow mode:** Create Image · **Aspect ratio:** 9:16 portrait

```
Ultra-realistic top-down macro photograph of a luxury Islamic wedding invitation envelope filling the entire
vertical 9:16 frame. Thick handmade cotton paper in warm ivory cream with a soft deckled texture. The top
envelope flap is a large V shape whose point meets in the exact centre of the frame. Sitting exactly on the
point of the flap is a round antique-gold metallic wax seal (about 40% of the frame width) with an irregular
melted wax edge, a raised inner rim, a delicate olive/laurel branch curving along its left side, and the
engraved serif monogram "A&S" in the centre. Soft realistic shadow under the seal.
The bottom quarter of the envelope has a scalloped, cusped Mughal-style edge outlined in a thin gold line,
decorated with fine gold-foil line-art floral sprigs (small five-petal flowers, slim leaves) rising upwards.
Below the scalloped edge is a deep emerald green panel with an intricate gold Islamic geometric eight-point
star lattice pattern, and in the bottom centre a small pointed Mughal arch in dark emerald with a gold outline.
Soft diffused daylight from the top left, shallow depth of field, elegant, premium, minimal, photorealistic,
8k detail. No people, no hands, no extra text, no watermark, nothing cut off at the edges.
```

---

## 2) Arch card with the centre left empty: `public/media/arch-card.jpg`

This goes behind the names. **The centre must stay EMPTY** because the website writes your names on top.

**Flow mode:** Create Image · **Aspect ratio:** 9:16 portrait

```
Ultra-realistic flat-lay photograph, vertical 9:16. Background: rich deep emerald green surface completely
covered with an intricate raised gold Islamic geometric pattern (interlaced eight-point stars, girih strapwork,
antique gold foil, subtle shine). In the centre, a large tall ivory cream paper card cut in an ornate Mughal
medallion / jharokha shape: a vertical oval with a scalloped, cusped edge, a small pointed onion-arch crown at
the top and a pointed arch at the bottom, framed with a thin embossed antique-gold border. The card fills about
90% of the frame height and 92% of the width. Fine gold line-art floral vines (small flowers, buds and leaves)
decorate only the inner border of the card: top corners, both sides, and a small bouquet at the bottom centre.
The middle 70% of the card is completely EMPTY plain cream paper with soft natural paper texture, with no text,
no letters and no calligraphy. A soft shadow lifts the card off the green background. Soft even studio lighting, luxury
wedding stationery, photorealistic, 8k, symmetrical, centred.
```

> If Flow writes random text inside the card, add: **"absolutely no text, blank card"** and regenerate.

---

## 3) Intro video (seal opening): `public/media/intro.mp4`

**Flow mode:** **Frames to Video**
- **First frame:** the `envelope.jpg` from step 1
- **Last frame:** *(optional)* a plain white image, or leave empty
- **Aspect ratio:** 9:16 · **Length:** 8s · **Model:** Veo (highest quality available)

```
Static locked-off camera, no camera movement, no zoom. The ivory envelope with the gold wax seal from the
first frame. After a short still moment, a thin crack appears down the middle of the gold wax seal. The seal
splits horizontally into two halves: the bottom half stays on the envelope, while the top half stays stuck to
the flap. The top V-shaped flap slowly lifts and folds upward and back out of the top of the frame, carrying
the top half of the seal with it. As the flap opens, warm soft golden-white light glows from inside the envelope
and grows brighter and brighter, with gentle light rays and floating sparkles, until the light completely
fills the frame and the whole screen fades to pure soft white. Elegant, slow, cinematic, luxurious, realistic
paper and wax physics, shallow depth of field. No hands, no people, no text appearing.
```

**Audio:** turn sound off, or use: *"soft paper rustle and a gentle magical shimmer, no music, no voice"*.
The website plays its own background music.

---

## 4) (Optional) Card reveal clip

The website already fades from white into the arch card. If you want that step as video too:

**Flow mode:** Frames to Video · **First frame:** plain white image · **Last frame:** `arch-card.jpg`

```
Static camera. Bright soft white light slowly fades away to reveal the ornate ivory Mughal arch card on the
emerald and gold geometric background. Gold foil details softly shimmer as the light settles. Calm, elegant,
cinematic, no text.
```

*(To use this clip, append it to the end of `intro.mp4` in any video editor, e.g. CapCut or Clipchamp.)*

---

## Tips

- **Generate 3 or 4 versions** of each and pick the best. AI often misspells monograms. If the letters keep
  coming out wrong, replace `the engraved serif monogram "A&S"` with `an engraved floral emblem` in prompts 1 and 3.
- Use the **same envelope image** as the first frame of the video, so the still screen and the video match perfectly.
- Keep the video **under about 6 MB** so it loads fast on phones (export 720p or 1080p MP4 from Flow; compress with
  HandBrake if needed).
- After saving the files, edit `src/config.js`:

```js
media: {
  envelopeImage: '/media/envelope.jpg',
  introVideo: '/media/intro.mp4',
  heroImage: '/media/arch-card.jpg',
},
```

- **Your photos** for the "A glimpse of our journey" carousel go in `public/photos/` and in `config.js → gallery.photos`.
- **Music:** put an MP3 at `public/music.mp3`.
