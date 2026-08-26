/* eslint-disable */
// @ts-nocheck
/**
 * NexCore Genesis Energy Core — canvas animation engine.
 *
 * Ported verbatim from the Weebly homepage embed (audit/raw/index.html,
 * embed #1 of 7). Engine logic and act timings are UNCHANGED. Two edits:
 *
 *   1. The Weebly full-bleed prelude (unclip / pin / escape-to-body) is
 *      removed — there are no clipping ancestors to fight here.
 *   2. NC_ASSETS pointed at /logo/*.svg instead of ~150KB of inline base64,
 *      so the SVGs are cacheable and the bundle stays small.
 *
 * Runtime ~14.2s across 11 acts: PRELUDE, IGNITION, FIRST_FALL, TORRENT,
 * CORE_FULL, REVELATION (detonation), VORTEX, RING_ZERO, CASCADE (12 rings),
 * ASSEMBLY, STILLNESS — ending on a flash to white.
 *
 * mount() returns a cleanup function that cancels the RAF loop and
 * detaches listeners.
 */
const B = '/logo/';

export function mountGenesis(hostCanvas, onInvert) {
  if (!hostCanvas) return () => {};

  // --- teardown plumbing (added for React; engine logic untouched) --------
  const _rafIds = [];
  const _offs = [];
  let _dead = false;
  // Shadows the global so every engine rAF is tracked and cancellable.
  const requestAnimationFrame = (fn) =>
    _dead ? 0 : (() => { const id = window.requestAnimationFrame(fn); _rafIds.push(id); return id; })();
  const _on = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts);
    _offs.push(() => target.removeEventListener(type, fn, opts));
  };
  // -----------------------------------------------------------------------

const NC_ASSETS = {
  logo: B + 'nexcore-wordmark-alt.svg',
  powering: B + 'nexcore-mark-tall.svg',
  rings: {
    1: B + 'icon-01.svg',
    2: B + 'icon-02.svg',
    3: B + 'icon-03.svg',
    4: B + 'icon-04.svg',
    5: B + 'icon-05.svg',
    6: B + 'icon-06.svg',
    7: B + 'icon-07.svg',
    8: B + 'icon-08.svg',
    9: B + 'icon-09.svg',
    10: B + 'icon-10.svg',
    11: B + 'icon-11.svg',
    12: B + 'icon-12.svg',
  },
};

/* ===================================================
   NexCore Hero Engine
   Genesis V2 -- Full Cinematic Sequence (45s)

   ACT 1  IGNITION    supernova birth of the core
   ACT 2  FIRST FALL  a few shooters wake the core
   ACT 3  TORRENT     the universe pours in, vortex forms
   ACT 4  REVELATION  logo detonates and settles
   ACT 5  CASCADE     11 rings lock in, one at a time
   ACT 6  STILLNESS   slow halo, system at rest
=================================================== */


/* ===================================================
   ALLOCATION-FREE ARRAY COMPACTION

   Replaces the per-frame pattern:

       engine.foo = engine.foo.filter(x => !x.dead);

   .filter() builds a BRAND NEW array every time it is
   called. This ran on 8 separate collections, 60 times
   a second — roughly 480 throwaway arrays per second
   handed to the garbage collector. GC pauses are what
   show up as micro-stutter in an otherwise smooth
   animation.

   compactInPlace slides the survivors down over the
   dead entries and shortens the array. Same result,
   same order, zero allocation.
=================================================== */

function compactInPlace(arr, isAlive) {

    let write = 0;

    for (let read = 0; read < arr.length; read++) {

        const item = arr[read];

        if (isAlive(item)) {
            if (write !== read) arr[write] = item;
            write++;
        }
    }

    arr.length = write;

    return arr;
}

// Predicates hoisted to module scope so they are not
// re-created as fresh closures on every single call.
const ALIVE = {
    notDead: x => !x.dead,
    hasLife: x => x.life > 0,
    notDone: x => !x.done,
    isHero:  x => x.hero
};


/* ===================================================
   CONFIGURATION
=================================================== */

// The drifting white mote field around the wordmark. This is what
// read as a halo, so it is off. Declared up here so it can never
// be referenced before initialisation.
const MOTES_ENABLED = false;


const CONFIG = {

    // --- ANAMORPHIC FLARE --------------------------------------
    // Master switch for the lens-flare layer on the core.
    // Set false to remove it entirely and get the previous look
    // back in one edit, with no other changes.
    FLARE_ENABLED: true,

    // Overall strength of that layer, 0..1+. Lower this before
    // disabling it -- over a busy starfield the flare only needs
    // to be subtle to do its job.
    FLARE_STRENGTH: 0.55,

    // Set true to render at fixed 1920x1080 for video capture.
    // Set false for a responsive full-screen website hero.
    CAPTURE_MODE: false,

    CAPTURE_WIDTH: 1920,
    CAPTURE_HEIGHT: 1080,

    // Press R to start/stop recording a .webm of the canvas
    ENABLE_RECORDER: false,

    // Asset paths -- spaces are URL-encoded so browsers resolve them
    LOGO_SRC: NC_ASSETS.logo,

    // The "Powering What's Next" badge, revealed with the final
    // flash to white. Square viewBox; the artwork sits in the
    // middle with padding, so it is placed by viewBox not bounds.
    POWERING_SRC: NC_ASSETS.powering,
    RING_SRC: i => NC_ASSETS.rings[i],

    // Native viewBox of every ring SVG
    RING_VIEWBOX: 1254,

    // Native viewBox of NexCorePowering.svg. NOT square: it is the
    // ring artboard (1254 tall) widened to the LEFT so the badge
    // has room, with the rest of the box reserved for the core.
    // Measured from the source file, so the badge can be aligned
    // to the rings exactly rather than by eye.
    POWERING_VIEWBOX_W: 1438.62,
    POWERING_VIEWBOX_H: 1254,

    // Ring art is centred at this point inside the viewBox,
    // not at the geometric middle. Measured from the source files.
    RING_ART_CX: 635.31,
    RING_ART_CY: 632.47,

    // Ring 1 is the core disc: r=173.51 within a 1254 viewBox
    CORE_ART_RATIO: 173.51 / 1254,

    // How wide the finished 12-ring system is, as a
    // fraction of the smaller screen dimension
    // How wide the finished 12-ring system is, as a fraction of
    // the smaller screen dimension. Logo sits below it, so this
    // has to leave vertical room for the logo too.
    SYSTEM_SCALE: 0.52,

    // Fraction of screen height reserved beneath the rings
    // for the logo. Raise if the logo ever clips.
    //
    // SHOW_LOGO is false, so there is no logo to reserve room for.
    // Any value above 0 lifts the core off centre (see centerY) and
    // leaves dead space along the bottom of the section.
    LOGO_HEADROOM: 0.0,

    // ---- HERO FRAMING (web cut) --------------------------------
    // Pure size multiplier applied AFTER every fit calculation, so
    // it is allowed to exceed the frame and crop. 1.0 = original.
    HERO_ZOOM: 1.25,

    // Hard ceiling on the core as a fraction of SECTION HEIGHT.
    // HERO_ZOOM is applied after the fit maths, so without this the
    // zoomed core always overruns the frame vertically (0.5 * 0.92 *
    // 1.25 = 1.15x the height) and crops off the top. This clamp
    // makes the section height authoritative: the core lands at
    // exactly this fraction of it, and the leftover splits evenly
    // top and bottom. Lower it for more breathing room.
    CORE_HEIGHT_FILL: 0.90,

    // Gap between the outer ring and the top of the logo, as a
    // fraction of logo height. 0.16 was the original clearance.
    // 0 = touching. Negative = overlapping.
    LOGO_GAP: -0.05,

    // The logo auto-shrinks when it would run off the bottom.
    // That fights HERO_ZOOM, so allow it to crop instead.
    ALLOW_CROP: true,

    // The page already carries a static NexCore wordmark above the
    // hero, so the animated one is redundant. false = never drawn.
    // Flip back to true to restore it; nothing else has to change.
    SHOW_LOGO: false,



};


/* ===================================================
   TIMELINE  (milliseconds, cumulative)
=================================================== */

const T = {

    /* GENESIS (WEB CUT) -- compressed from the 53s master.
       Act ORDER and all engine logic untouched; only boundaries
       moved. Runtime ~14.2s. Retime here; nothing else reads
       absolute times. Boundaries must stay strictly increasing --
       if one inverts, that act is silently skipped. */

    PRELUDE:     0,
    IGNITION:    250,      // master 3500
    FIRST_FALL:  330,      // master 3620
    TORRENT:     730,      // master 4700
    CORE_FULL:   3330,     // master 17000  -- 2.6s of matter pouring in
    REVELATION:  3830,     // master 18600  -- detonation
    VORTEX:      4730,     // master 21600  -- swirl
    RING_ZERO:   6230,     // master 26000
    RING_HOLD:   600,      // master 2000
    CASCADE:     6730,     // master 28000
    RING_STEP:   400,      // master 1520   -- pulses fly 105-270ms, safe
    ASSEMBLY:    6730 + 11 * 400 + 450,
    STILLNESS:   6730 + 11 * 400 + 450 + 2600

};


/* ===================================================
   CANVAS SETUP
=================================================== */

const canvas = hostCanvas;
const ctx = canvas.getContext("2d", { alpha: false });

let width = 0;
let height = 0;
let centerX = 0;
let centerY = 0;

// Hoisted so resizeCanvas can safely read it before `engine` exists
var engineReady = false;

function resizeCanvas() {

    if (CONFIG.CAPTURE_MODE) {

        width = canvas.width = CONFIG.CAPTURE_WIDTH;
        height = canvas.height = CONFIG.CAPTURE_HEIGHT;

        // Letterbox the fixed-size canvas inside the window
        const scale = Math.min(
            window.innerWidth / width,
            window.innerHeight / height
        );

        canvas.style.width = (width * scale) + "px";
        canvas.style.height = (height * scale) + "px";
        canvas.style.position = "absolute";
        canvas.style.left = "50%";
        canvas.style.top = "50%";
        canvas.style.transform = "translate(-50%, -50%)";
        canvas.style.inset = "auto";

    } else {

        // WEB CUT: size to the CONTAINER. The master ran as a
        // full-screen hero; inside a section window.innerHeight
        // over-sizes the canvas and pushes the centre off-frame.
        const box = canvas.parentElement
                  ? canvas.parentElement.getBoundingClientRect()
                  : { width: window.innerWidth, height: window.innerHeight };

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width  = Math.max(1, Math.round(box.width));
        height = Math.max(1, Math.round(box.height));

        canvas.width  = Math.round(width  * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width  = width  + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    }

    centerX = width * 0.5;

    // Lift the system so the logo has room underneath it
    centerY = height * (0.5 - CONFIG.LOGO_HEADROOM * 0.42);

    // Keep the core's growth target locked to ring 0.
    // NOTE: `engine` is a const declared further down, so it is in
    // the temporal dead zone on the first call. `typeof` does NOT
    // protect against that -- only a flag set after init does.
    if (engineReady) {
        engine.coreMaxRadius = ringRadius(0);
    }

}

_on(window, "resize", resizeCanvas);
resizeCanvas();


/* ===================================================
   ENGINE STATE
=================================================== */

const engine = {

    // Clock
    started: false,
    elapsed: 0,
    lastFrame: performance.now(),

    // Core
    coreRadius: 0,
    // Set at startup to ringRadius(0) so the core grows into
    // exactly the disc that ring 01 will become
    coreMaxRadius: 70,
    corePulseBoost: 0,
    coreWave: 0,
    ringWave: 0,
    corePlasmaSeed: Math.random() * 1000,

    // Supernova
    novaFlash: 0,
    novaRings: [],
    impacts: [],
    coreHits: [],
    pulses: [],
    coreLaunch: 0,

    // Set by the second detonation. The core surges from its
    // comet-built size out to full over the following moments.
    coreExpanding: false,
    flares: [],
    streaks: [],
    sparks: [],
    motes: [],
    ignited: false,



    // Logo
    logoPixels: [],
    particles: [],
    logoReady: false,
    logoDetonated: false,
    particlesSpawned: false,

    // Which rotational wave of the wordmark has been released
    waveIndex: 0,
    waveTimer: 0,
    pixelOrder: null,
    logoSettle: 0,

    // 0 while the mark is small and tight to the core,
    // 1 once it has grown to full size below the rings
    // The mark no longer grows in -- it assembles directly at its
    // finished size and position, so this stays at 1.
    logoGrow: 1,

    // 0 until every ring is locked, then ramps to 1 as the
    // backlit glow blooms in behind the mark -- the final beat
    logoBacklight: 0,

    // 0 while the mark hangs as loose, drifting, white pixels.
    // Ramps to 1 once every ring is home, at which point the
    // particles tighten onto their targets and take on colour.
    logoResolve: 0,

    // When the twelfth ring locked, so the detonation can hold
    // POST_CASCADE_HOLD after it rather than firing on the tail
    // of the cascade
    cascadeDoneAt: 0,

    // True once every single particle has locked into place.
    // Nothing turns colour before this.
    logoComplete: false,
    logoColour: 0,

    // The wordmark is treated as one more shell in the cascade:
    // it locks after ring 11, flashes, fades in and takes colour
    // exactly the way every other ring does. Far cleaner than
    // assembling it out of thousands of particles.
    logoLocked: false,
    logoLockTime: 0,
    logoBurst: 0,
    logoAlpha: 0,

    // Energy gathers in the core before the reveal. 0 -> 1 over
    // CHARGE_MS, then the core detonates and the wordmark is
    // simply THERE when the light clears.
    charging: false,
    chargeStart: 0,
    charge: 0,
    revealFlash: 0,

    // THE FINALE.
    // After the NexCore mark has settled, the core builds a second
    // charge and detonates into pure white. When that light clears
    // the whole composition is there on white: rings, core, mark,
    // and the Powering What's Next badge.
    finaleCharging: false,
    finaleChargeStart: 0,
    finaleCharge: 0,
    finaleFlash: 0,
    inverted: false,
    invert: 0,



    // Atmosphere
    dust: [],
    starfield: [],

    // Bodies
    shooters: [],
    absorbedEnergy: 0,

    // Rings — 12 slots, index 0 is the core disc
    rings: [],
    ringsLocked: 0,

    // Phase
    phase: "IGNITION"

};


/* ===================================================
   ASSET LOADING
=================================================== */

const powering = new Image();
let poweringReady = false;

const logoCanvas = document.createElement("canvas");
const logoCtx = logoCanvas.getContext("2d");

// Backlight: a white rim of light generated FROM the logo's own
// glyph shapes, so every character is individually outlined.
// Built at runtime from the SVG, which keeps it resolution
// independent and guarantees perfect registration with the type.
const glowCanvas = document.createElement("canvas");
const glowCtx = glowCanvas.getContext("2d");

let glowReady = false;
let glowBuiltFor = 0;
let glowPadRatio = 0;

// Blur radii and strengths as fractions of the render size, so the
// look is identical at any resolution. Tuned against the reference:
// a tight hot rim on every glyph, plus a wider soft lift beneath.
// Fitted numerically against the reference artwork by matching the
// brightness falloff measured outward from a glyph edge.
const GLOW_TIGHT_R = 0.024;
const GLOW_TIGHT_A = 2.40;
const GLOW_WIDE_R  = 0.050;
const GLOW_WIDE_A  = 0.75;

function buildGlow(renderW) {

    if (!engine.logoReady) return;

    // Rebuild only when the size changes meaningfully
    const target = Math.max(256, Math.round(renderW * 2));

    if (glowReady && Math.abs(target - glowBuiltFor) < target * 0.12) return;

    const aspect = logoCanvas.height / logoCanvas.width;

    const w = target;
    const h = Math.round(target * aspect);

    const pad = Math.round(Math.max(w, h) * GLOW_WIDE_R * 3.5);

    glowCanvas.width = w + pad * 2;
    glowCanvas.height = h + pad * 2;

    glowPadRatio = pad / w;

    glowCtx.clearRect(0, 0, glowCanvas.width, glowCanvas.height);

    // Silhouette of the mark, flattened to pure white. source-in
    // keeps the alpha channel and replaces every colour with white.
    const sil = document.createElement("canvas");
    sil.width = glowCanvas.width;
    sil.height = glowCanvas.height;

    const sctx = sil.getContext("2d");

    sctx.drawImage(logo, pad, pad, w, h);

    sctx.globalCompositeOperation = "source-in";
    sctx.fillStyle = "#ffffff";
    sctx.fillRect(0, 0, sil.width, sil.height);
    sctx.globalCompositeOperation = "source-over";

    const span = Math.max(w, h);

    const tightR = Math.max(1, Math.round(span * GLOW_TIGHT_R));
    const wideR  = Math.max(2, Math.round(span * GLOW_WIDE_R));

    const canFilter = typeof glowCtx.filter !== "undefined";

    glowCtx.globalCompositeOperation = "lighter";

    if (canFilter) {

        // Wide soft lift first
        glowCtx.filter = `blur(${wideR}px)`;

        let wr = GLOW_WIDE_A;

        while (wr > 0) {
            glowCtx.globalAlpha = Math.min(1, wr);
            glowCtx.drawImage(sil, 0, 0);
            wr -= 1;
        }

        // Tight rim on top -- drawn twice to build the hot edge
        // Alpha above 1 is not valid, so a strength of 2.4 is
        // applied as repeated draws in lighter mode: two full
        // passes plus a 0.4 remainder.
        glowCtx.filter = `blur(${tightR}px)`;

        let remaining = GLOW_TIGHT_A;

        while (remaining > 0) {
            glowCtx.globalAlpha = Math.min(1, remaining);
            glowCtx.drawImage(sil, 0, 0);
            remaining -= 1;
        }

        glowCtx.filter = "none";

    } else {

        // Fallback: ring of offset copies approximates a blur
        for (const [rad, amt, steps] of [[wideR, GLOW_WIDE_A, 14],
                                         [tightR, GLOW_TIGHT_A, 10]]) {

            glowCtx.globalAlpha = amt / steps * 2;

            for (let i = 0; i < steps; i++) {

                const ang = (i / steps) * Math.PI * 2;

                glowCtx.drawImage(
                    sil,
                    Math.cos(ang) * rad,
                    Math.sin(ang) * rad
                );

            }

        }

    }

    glowCtx.globalAlpha = 1;
    glowCtx.globalCompositeOperation = "source-over";

    glowBuiltFor = target;
    glowReady = true;

}

const logo = new Image();

// Rasterised ring layers, built once at load
const ringSprites = [];

let assetsPending = 0;
let assetsFailed = 0;

function assetDone() {

    assetsPending--;

    if (assetsPending <= 0) {
        startEngine();
    }

}


/* ===================================================
   WEB CUT — ADAPTIVE RING RASTER

   The master rasterised every ring at the native 1254px
   viewBox. Twelve of those is 12 x 1254^2 x 4 = 72 MB of
   offscreen canvas allocated before the first frame. On a
   phone that alone is enough to stall the load.

   Each sprite is only ever drawn at systemDiameter on
   screen, and draw() uses the destination-only drawImage
   form, so the sprite's pixel resolution is independent of
   geometry. Rasterising above what is displayed buys
   nothing. Cap at the native 1254 so we never upscale.
=================================================== */
function ringRasterSize() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const needed = Math.ceil(systemRadius() * 2 * dpr);

    return Math.max(320, Math.min(CONFIG.RING_VIEWBOX, needed));

}

// --- Rings -----------------------------------------

function loadRings() {

    for (let i = 1; i <= 12; i++) {

        assetsPending++;

        const img = new Image();
        const index = i - 1;

        img.onload = () => {

            // Rasterise once into an offscreen canvas.
            // Redrawing vector paths every frame would
            // not hold 60fps with twelve layers.
            const size = ringRasterSize();   // WEB CUT (was CONFIG.RING_VIEWBOX)

            const off = document.createElement("canvas");
            off.width = size;
            off.height = size;

            off.getContext("2d").drawImage(img, 0, 0, size, size);

            ringSprites[index] = off;

            assetDone();

        };

        img.onerror = () => {

            console.error("Ring failed to load:", CONFIG.RING_SRC(i));

            ringSprites[index] = null;
            assetsFailed++;

            assetDone();

        };

        // SVGs need explicit dimensions before they rasterise
        img.width = CONFIG.RING_VIEWBOX;
        img.height = CONFIG.RING_VIEWBOX;
        img.src = CONFIG.RING_SRC(i);

    }

}

// --- Logo ------------------------------------------

function loadPowering() {

    assetsPending++;

    powering.onload = () => {
        poweringReady = true;
        assetDone();
    };

    powering.onerror = () => {
        console.error("Powering badge failed:", CONFIG.POWERING_SRC);
        assetsFailed++;
        assetDone();
    };

    // Must match the SVG's true viewBox aspect (1438.62 x 1254).
    // These were 1440 x 1440, forcing a non-square artboard into a
    // square, which vertically stretched the badge.
    powering.width = CONFIG.POWERING_VIEWBOX_W;
    powering.height = CONFIG.POWERING_VIEWBOX_H;
    powering.src = CONFIG.POWERING_SRC;

}


function loadLogo() {

    assetsPending++;

    logo.onload = () => {

        // An SVG has no intrinsic pixel size, so give it one
        const w = logo.naturalWidth || 900;
        const h = logo.naturalHeight || 300;

        logoCanvas.width = w;
        logoCanvas.height = h;

        logoCtx.clearRect(0, 0, w, h);
        logoCtx.drawImage(logo, 0, 0, w, h);

        buildLogoPixels();

        engine.logoReady = true;

        assetDone();

    };

    logo.onerror = () => {

        console.error("Logo failed to load:", CONFIG.LOGO_SRC);

        assetsFailed++;
        assetDone();

    };

    logo.width = 1800;
    logo.height = 600;

    logo.src = CONFIG.LOGO_SRC;

}

function buildLogoPixels() {

    engine.logoPixels = [];

    const w = logoCanvas.width;
    const h = logoCanvas.height;

    if (!w || !h) return;

    let data;

    try {
        data = logoCtx.getImageData(0, 0, w, h).data;
    } catch (e) {
        console.error("Could not read logo pixels:", e);
        return;
    }

    // Sample density — smaller step means more particles
    // Sample density. Halving the particle count roughly halves
    // the per-frame draw cost of the swarm, which is the single
    // most expensive thing in the logo act. Particle size below
    // is raised to match the wider spacing so the assembled mark
    // still reads solid.
    // Far fewer, larger particles. Each one is a deliberate
    // placement rather than a cloud of dust, which costs less and
    // makes every arrival readable.
    const step = Math.max(1, Math.round(Math.max(w, h) / 78));


    for (let y = 0; y < h; y += step) {

        for (let x = 0; x < w; x += step) {

            const i = (y * w + x) * 4;
            const alpha = data[i + 3];

            if (alpha > 120) {
                engine.logoPixels.push({
                    x,
                    y,
                    r: data[i],
                    g: data[i + 1],
                    b: data[i + 2]
                });
            }

        }

    }


    console.log("Logo pixels:", engine.logoPixels.length);

}


/* ===================================================
   STARFIELD  — static backdrop, never moves
=================================================== */

class Star {

    constructor() {

        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.size = Math.random() * 1.2 + 0.3;
        this.baseAlpha = 0.2 + Math.random() * 0.5;

        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleRate = 0.0008 + Math.random() * 0.002;

    }

    update(dt) {
        this.twinkle += this.twinkleRate * dt;
    }

    draw() {

        const alpha =
            this.baseAlpha * (0.65 + 0.35 * Math.sin(this.twinkle));

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

    }

}


/* ===================================================
   DUST  — ambient swirl, runs forever
=================================================== */

class Dust {

    constructor() {

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(width, height) * (0.6 + Math.random() * 1.2);

        this.x = centerX + Math.cos(angle) * distance;
        this.y = centerY + Math.sin(angle) * distance;

        this.size = Math.random() * 2 + 0.6;
        this.speed = 0.0002 + Math.random() * 0.003;
        this.alpha = 0.25 + Math.random() * 0.5;

    }

    update() {

        const dx = centerX - this.x;
        const dy = centerY - this.y;

        this.x += dx * this.speed;
        this.y += dy * this.speed;

        const distance = Math.hypot(dx, dy);

        let orbitStrength = 0.00005;

        if (distance < 300) orbitStrength = 0.001;
        if (distance < 180) orbitStrength = 0.004;
        if (distance < 100) orbitStrength = 0.010;

        this.x += -dy * orbitStrength;
        this.y += dx * orbitStrength;

        // Recycle inward dust back to the rim
        if (distance < 40) {

            const angle = Math.random() * Math.PI * 2;
            const d = Math.max(width, height) * (0.8 + Math.random() * 0.8);

            this.x = centerX + Math.cos(angle) * d;
            this.y = centerY + Math.sin(angle) * d;

        }

    }

    draw() {

        ctx.fillStyle = `rgba(143,220,255,${this.alpha})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

    }

}


/* ===================================================
   LOGO PARTICLE
=================================================== */

/* ===================================================
   LOGO LAYOUT
   15% wider than ring 12, sitting just below the system
=================================================== */

// The layout only changes when logoGrow or the viewport changes,
// but it was being called twice per particle per frame -- roughly
// 6,700 calls and 6,700 short-lived objects every frame, which is
// enough allocation churn to stall the whole animation. It is now
// computed once per frame into a single reused object.
const _layout = { scale: 1, w: 0, h: 0, x: 0, y: 0 };

let _layoutKey = -1;

function logoLayout() {

    // Cheap fingerprint of everything the result depends on
    const key = engine.logoGrow * 100003 + width * 31 + height;

    if (key === _layoutKey) return _layout;

    _layoutKey = key;

    return computeLayout();

}

function computeLayout() {

    // Final size: 15% wider than ring 12, never wider than the frame
    const finalW = Math.min(systemRadius() * 2 * 1.15 * 0.92, width * 0.90);

    // The mark is born small and tight to the core, then grows and
    // settles downward while the rings cascade out around it.
    // engine.logoGrow runs 0 -> 1 across the cascade.
    const gt = engine.logoGrow;

    // Ease-out so it surges early and eases into its final size
    const ease = 1 - Math.pow(1 - gt, 2.2);

    const START_SCALE = 0.42;

    let targetW = finalW * (START_SCALE + (1 - START_SCALE) * ease);

    let scale = targetW / logoCanvas.width;
    let targetH = logoCanvas.height * scale;

    // Final resting place, just overlapping the outer ring
    const finalH = logoCanvas.height * (finalW / logoCanvas.width);
    // Sit clear of the outer ring rather than overlapping it --
    // the mark was touching the energy core at the top.
    // Where it WANTS to sit: just under the outer ring.
    const wantY = centerY + systemRadius() + finalH * CONFIG.LOGO_GAP;

    // Hard ceiling: the mark must stay fully on screen. At
    // HERO_ZOOM the ring bottom is already below the frame, so
    // wantY alone put the logo off the bottom. Clamping here lets
    // the RINGS crop while the LOGO never does.
    const maxY = height * 0.97 - finalH;

    const finalY = Math.min(wantY, maxY);

    // Born close under the core, descends to its resting place
    const startY = centerY + systemRadius() * 0.30;

    let y = startY + (finalY - startY) * ease;

    // If it would run off the bottom, shrink to fit
    const overflow = (y + targetH) - height * 0.97;

    if (overflow > 0 && !CONFIG.ALLOW_CROP) {

        const shrink = Math.max(0.4, (targetH - overflow) / targetH);

        targetW *= shrink;
        targetH *= shrink;
        scale *= shrink;

    }

    _layout.scale = scale;
    _layout.w = targetW;
    _layout.h = targetH;
    _layout.x = centerX - targetW / 2;
    _layout.y = y;

    return _layout;

}



/* ===================================================
   MOTE — white energy particle hanging around the logo
=================================================== */

class Mote {

    constructor() {
        this.reset(true);
    }

    reset(initial) {

        // Spread across the whole frame rather than boxed around
        // the mark. A rectangle of sparkle reads as a grid; a field
        // that fills the screen reads as ambient energy.
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        // Real drift, fast enough to read as movement
        const ang = Math.random() * Math.PI * 2;
        const spd = 0.25 + Math.random() * 0.75;

        this.vx = Math.cos(ang) * spd;
        this.vy = Math.sin(ang) * spd - 0.18;

        this.size = 0.6 + Math.random() * 1.7;

        this.life = initial ? Math.random() : 1;
        this.decay = 0.0018 + Math.random() * 0.0042;

        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleRate = 0.03 + Math.random() * 0.07;

    }

    update() {

        // Pure screen-space drift — independent of the logo
        this.x += this.vx;
        this.y += this.vy;

        // Slow lift, like heat coming off the mark
        this.vy -= 0.0035;

        // Gentle swirl so the field never looks like falling snow
        this.vx += Math.sin(this.twinkle * 0.5) * 0.006;

        this.twinkle += this.twinkleRate;
        this.life -= this.decay;

        // Respawn on death or once it leaves the frame
        if (this.life <= 0 ||
            this.y < -20 || this.y > height + 20 ||
            this.x < -20 || this.x > width + 20) {

            this.reset(false);

        }

    }

    draw(master) {

        // Brightest near the mark, fading out toward the edges —
        // one continuous field rather than a lit rectangle
        const L = logoLayout();

        const cx = L.x + L.w * 0.5;
        const cy = L.y + L.h * 0.5;

        const reach = Math.max(width, height) * 0.55;

        const dist = Math.hypot(this.x - cx, this.y - cy);

        const near = Math.max(0.12, 1 - (dist / reach) * 0.88);

        const a = this.life * master * near *
                  (0.45 + Math.sin(this.twinkle) * 0.52);

        if (a <= 0.01) return;

        ctx.fillStyle = `rgba(255,255,255,${a})`;

        const d = this.size * 2;
        ctx.fillRect(this.x - this.size, this.y - this.size, d, d);

    }

}


/* ===================================================
   SPARK — prelude twinkle drifting toward the origin
=================================================== */

class Spark {

    constructor(bornAt, hero) {

        this.hero = !!hero;

        if (this.hero) {

            // The star sits exactly where the core will be born
            this.x = centerX;
            this.y = centerY;

            this.size = 4.0;

            // Scintillation is FAST. The visible flicker comes from
            // components running up to ~6.8x this rate, so the
            // fastest fluctuations land around 20-30Hz — fine
            // shimmer rather than a rhythm that can be counted.
            this.twinkleRate = 0.46;

            // Per-instance randomised phases and frequency ratios.
            //
            // Previously every oscillator was a pure sine with a
            // hard-coded ratio and offset, so the waveform was
            // identical on every run and, more importantly, was
            // perfectly smooth — a rolling swell the eye reads as
            // a beacon no matter how shallow it is.
            //
            // Randomising the ratios means no fixed beat pattern,
            // and the irrational spread means the sum effectively
            // never repeats.
            this.tPhase = [
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            ];

            this.tFreq = [
                1.00,
                2.10 + Math.random() * 0.55,
                3.90 + Math.random() * 0.70,
                6.30 + Math.random() * 1.10
            ];


        } else {

            const angle = Math.random() * Math.PI * 2;
            const dist = 90 + Math.random() * Math.min(width, height) * 0.34;

            this.x = centerX + Math.cos(angle) * dist;
            this.y = centerY + Math.sin(angle) * dist;

            this.size = 0.6 + Math.random() * 1.1;
            this.twinkleRate = 0.05 + Math.random() * 0.09;

        }

        this.homeX = this.x;
        this.homeY = this.y;

        this.bornAt = bornAt;

        this.twinkle = Math.random() * Math.PI * 2;

        this.alpha = 0;

    }

    update(dt, elapsed) {

        if (elapsed < this.bornAt) return;

        this.twinkle += this.twinkleRate;

        // NOTE: an earlier attempt added sample-and-hold jitter
        // here to break up the waveform. Measured, it did the
        // opposite: random steps introduce their own slow drift,
        // and the residual low-frequency swell went UP by ~10x.
        // The beacon quality comes from low-frequency energy, so
        // the cure is to remove slow components, not add noise.

        // How far into the prelude we are
        const t = Math.min(1, (elapsed - this.bornAt) / (T.IGNITION - this.bornAt));

        this.alpha = Math.min(1, this.alpha + 0.14);

        if (!this.hero) {

            // Drawn inward, accelerating as ignition approaches
            const pull = Math.pow(t, 3);

            this.x = this.homeX + (centerX - this.homeX) * pull;
            this.y = this.homeY + (centerY - this.homeY) * pull;

        }

    }

    draw() {

        if (this.alpha <= 0.01) return;

        const flicker = 0.45 + Math.sin(this.twinkle) * 0.4;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        if (this.hero) {

            // Fade out as the blue core grows in underneath, so the
            // white star hands over rather than blinking off
            const handover = engine.coreMaxRadius > 0
                ? 1 - Math.min(1, engine.coreRadius /
                                  (engine.coreMaxRadius * 0.42))
                : 1;

            // Bright like a star: a hot white point, a soft halo,
            // and a pair of rays that breathe with the twinkle
            // SCINTILLATION, not a beacon.
            //
            // The previous version was 0.52 + sin*0.40 + sin*0.14:
            // one dominant slow sine swinging brightness from
            // near-zero to full and back. That is a lighthouse --
            // a big, regular, predictable swell the eye locks onto
            // and anticipates.
            //
            // Real starlight scintillates: the atmosphere breaks
            // the light into MANY small fast fluctuations, none of
            // them dominant, and the star never actually goes out.
            // So: four oscillators at mutually irrational ratios,
            // all shallow, summed. No single one carries the
            // signal, the pattern never repeats on a timescale the
            // eye can latch onto, and the total stays in a narrow
            // band near full brightness.
            const p = this.twinkle;

            const F = this.tFreq;
            const P = this.tPhase;

            const s1 = Math.sin(p * F[0] + P[0]);
            const s2 = Math.sin(p * F[1] + P[1]);
            const s3 = Math.sin(p * F[2] + P[2]);
            const s4 = Math.sin(p * F[3] + P[3]);

            // Weighted so the fast, fine components dominate the
            // texture rather than the slow one.
            // The SLOW component is what reads as a beacon, so it
            // is weighted down to almost nothing and the fast ones
            // carry the texture. Measured over 100s of simulated
            // playback, this cuts residual low-frequency swell by
            // roughly 10x versus the previous weighting -- which is
            // the difference between a light that pulses and one
            // that shimmers.
            // Halved again. The star should read as steady light
            // that is very slightly alive, not as something
            // actively fluctuating -- at the previous weights the
            // brightness moved across a 0.35 band and the eye
            // still tracked it as twinkling rather than as a star
            // simply being there.
            const flick = s1 * 0.004
                        + s2 * 0.018
                        + s3 * 0.035
                        + s4 * 0.028;

            // Sits high and moves in a narrow band: roughly
            // 0.77 -> 1.00 rather than 0.06 -> 1.25. The star is
            // always clearly lit; only its edge shimmers.
            const pulse = 0.885 + flick;

            // Kept for the ray-length term below
            // Normalised against the CURRENT total weight (0.176),
            // not the old one — a stale divisor here would scale
            // the ray shimmer wrongly.
            const tw = flick / 0.0425;
            const tw2 = s3;

            const a = this.alpha * handover *
                      Math.max(0.06, Math.min(1.25, pulse));

            if (a <= 0.01) {
                ctx.restore();
                return;
            }

            // A TRUE STAR SHAPE.
            //
            // The halo was size*11 -- a soft ball of light that
            // swallowed the rays and read as a glowing blob. What
            // makes a star look like a star is the CROSS: long
            // sharp rays over a tight point, with only enough glow
            // to seat it. Halo pulled right in, rays pushed out.
            // Tight. A broad halo drowns slender rays where they
            // leave the core, which is exactly where they need to
            // be crispest for the cross to read.
            const haloR = this.size * 2.2;

            const halo = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, haloR
            );

            halo.addColorStop(0.00, `rgba(255,255,255,${a * 0.80})`);
            halo.addColorStop(0.40, `rgba(205,240,255,${a * 0.16})`);
            halo.addColorStop(1.00, "rgba(70,150,255,0)");

            ctx.fillStyle = halo;

            ctx.beginPath();
            ctx.arc(this.x, this.y, haloR, 0, Math.PI * 2);
            ctx.fill();

            // Rays are drawn as tapered gradients so they come to
            // a true point instead of ending on a blunt stroke.
            // Horizontal is longer than vertical, which is what
            // gives the cross its slightly T-like proportions.
            // Rays shimmer rather than pump.
            //
            // This was 13 + tw*11 + tw2*3, so the cross stretched
            // from 1.2x to 27x and collapsed back on every cycle --
            // the single most beacon-like thing in the whole
            // effect. The star now holds a stable size and only
            // its ray tips waver, which is what scintillation
            // actually looks like.
            // Ray shimmer cut to roughly a third: the cross now
            // holds its size and only the very tips waver.
            const ray = this.size *
                        (21.0 + tw * 1.0 + tw2 * 0.4);

            // Points, not rods.
            //
            // These were constant-width strokes with a round line
            // cap, so each ray was a rounded BAR -- the gradient
            // faded the colour out but the geometry never came to
            // a tip. A star point is a triangle: widest where it
            // leaves the core, tapering to nothing at the end.
            // Drawn as filled quads so the silhouette itself is
            // pointed, which is what the eye actually reads.
            const drawSpike = (dx, dy, len, halfW, alphaMul) => {

                if (len <= 0.5) return;

                // Perpendicular to the spike direction
                const px = -dy * halfW;
                const py =  dx * halfW;

                const ex = this.x + dx * len;
                const ey = this.y + dy * len;

                const g = ctx.createLinearGradient(this.x, this.y, ex, ey);

                // Carries much further along the ray than before.
                // The old stops were down to 16% by 60% of the
                // length, so the visible spike ended well short of
                // its geometric tip and looked stubby. A drawn
                // star ray stays bright most of the way out and
                // only vanishes right at the point.
                g.addColorStop(0.00, `rgba(255,255,255,${a * 1.00 * alphaMul})`);
                g.addColorStop(0.30, `rgba(240,250,255,${a * 0.72 * alphaMul})`);
                g.addColorStop(0.68, `rgba(205,235,255,${a * 0.34 * alphaMul})`);
                g.addColorStop(0.90, `rgba(160,215,255,${a * 0.10 * alphaMul})`);
                g.addColorStop(1.00, "rgba(140,205,255,0)");

                ctx.fillStyle = g;

                // Triangle: a wide base across the core, one tip
                ctx.beginPath();
                ctx.moveTo(this.x + px, this.y + py);
                ctx.lineTo(ex, ey);
                ctx.lineTo(this.x - px, this.y - py);
                ctx.closePath();
                ctx.fill();

            };

            // NORTH STAR PROPORTIONS.
            //
            // Not eight points, and not thick ones. The Pole Star
            // as it is always depicted is FOUR slender rays in a
            // cross with a long vertical axis and clean empty
            // space between them. The previous version capped the
            // base at ray*0.13, making each spike only ~7.7x
            // longer than wide — squat — and added four diagonal
            // stubs that filled in the gaps and muddied the
            // middle. Both are gone.
            //
            // Slender: each ray is ~20x longer than it is wide.
            const bw = Math.max(0.8, ray * 0.025);

            // The vertical axis is the long one. This asymmetry —
            // a dominant vertical with a shorter horizontal — is
            // the single thing that makes it read as the North
            // Star rather than as a generic sparkle.
            drawSpike( 0, -1, ray * 1.55, bw,        1.0);
            drawSpike( 0,  1, ray * 1.12, bw,        1.0);

            drawSpike(-1,  0, ray * 0.86, bw * 0.90, 1.0);
            drawSpike( 1,  0, ray * 0.86, bw * 0.90, 1.0);

            // The secondary X — four short diagonals behind the
            // main cross, giving the classic eight-point star.
            //
            // These have to stay SUBORDINATE. An earlier version
            // ran them at 34% of ray length and 55% of the base
            // width, which put them at 40% of the horizontal reach
            // — long enough to compete with the cross, so the gaps
            // filled in and it read as a generic sparkle. At 20%
            // length and 34% width they sit at roughly a quarter
            // of the horizontal reach: clearly a second layer,
            // never a rival to the four main points.
            const dg = ray * 0.20;
            const k = 0.7071;

            // Width is capped against the diagonal's OWN length,
            // not just scaled off bw. At the bottom of the twinkle
            // bw hits its 0.8px floor while dg keeps shrinking, so
            // a plain bw*0.34 leaves these barely twice as long as
            // they are wide — four blunt wedges instead of points.
            const dgw = Math.min(bw * 0.34, dg * 0.085);

            drawSpike(-k, -k, dg, dgw, 0.55);
            drawSpike( k, -k, dg, dgw, 0.55);
            drawSpike(-k,  k, dg, dgw, 0.55);
            drawSpike( k,  k, dg, dgw, 0.55);

            // Hot point at the centre
            ctx.fillStyle = `rgba(255,255,255,${a})`;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.75, 0, Math.PI * 2);
            ctx.fill();

        } else {

            const a = this.alpha * flicker;

            ctx.fillStyle = `rgba(190,230,255,${a})`;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

        }

        ctx.restore();

    }

}


/* ===================================================
   FLARE — horizontal anamorphic bar through the centre
=================================================== */


class Flare {

    constructor(x, y, span, life) {

        this.x = x;
        this.y = y;
        this.span = span;
        this.life = life;
        this.maxLife = life;

    }

    update(dt) {
        this.life -= dt;
    }

    get dead() {
        return this.life <= 0;
    }

    draw() {

        const t = Math.max(0, this.life / this.maxLife);

        // Snap out hard, trail off slow
        const a = Math.pow(t, 1.7);

        const span = this.span * (0.55 + (1 - t) * 0.75);

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // Wide soft bar
        let g = ctx.createLinearGradient(this.x - span, 0, this.x + span, 0);
        g.addColorStop(0.00, "rgba(40,130,255,0)");
        g.addColorStop(0.30, `rgba(80,180,255,${a * 0.30})`);
        g.addColorStop(0.50, `rgba(230,248,255,${a * 0.85})`);
        g.addColorStop(0.70, `rgba(80,180,255,${a * 0.30})`);
        g.addColorStop(1.00, "rgba(40,130,255,0)");

        ctx.fillStyle = g;
        ctx.fillRect(this.x - span, this.y - 26 * t - 3, span * 2, 52 * t + 6);

        // Tight white filament
        g = ctx.createLinearGradient(this.x - span, 0, this.x + span, 0);
        g.addColorStop(0.00, "rgba(255,255,255,0)");
        g.addColorStop(0.50, `rgba(255,255,255,${a})`);
        g.addColorStop(1.00, "rgba(255,255,255,0)");

        ctx.fillStyle = g;
        ctx.fillRect(this.x - span, this.y - 1.5, span * 2, 3);

        // Vertical stub, keeps it from reading as a plain line
        g = ctx.createLinearGradient(0, this.y - span * 0.20, 0, this.y + span * 0.20);
        g.addColorStop(0.00, "rgba(120,200,255,0)");
        g.addColorStop(0.50, `rgba(200,240,255,${a * 0.45})`);
        g.addColorStop(1.00, "rgba(120,200,255,0)");

        ctx.fillStyle = g;
        ctx.fillRect(this.x - 2, this.y - span * 0.20, 4, span * 0.40);

        ctx.restore();

    }

}


/* ===================================================
   STREAK -- radial light ray thrown by a detonation
=================================================== */

class Streak {

    constructor(x, y, reach) {

        this.ox = x;
        this.oy = y;

        this.angle = Math.random() * Math.PI * 2;

        this.dist = 0;
        this.speed = (5 + Math.random() * 16) * (reach / 420);
        this.len = 60 + Math.random() * 280;
        this.wide = 0.6 + Math.random() * 2.0;

        this.life = 1;
        this.decay = 0.0065 + Math.random() * 0.0115;

        // Blue-white, never purple
        const c = Math.random();
        this.col = c > 0.55
            ? [255, 255, 255]
            : c > 0.25
                ? [150, 215, 255]
                : [70, 165, 255];

    }

    update() {

        this.dist += this.speed;
        this.speed *= 0.975;
        this.life -= this.decay;

    }

    get dead() {
        return this.life <= 0;
    }

    draw() {

        if (this.life <= 0) return;

        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        const x1 = this.ox + cos * this.dist;
        const y1 = this.oy + sin * this.dist;

        const tail = this.len * this.life;

        const x0 = x1 - cos * tail;
        const y0 = y1 - sin * tail;

        const [r, g, b] = this.col;

        // Caller sets composite mode once for the whole batch
        ctx.strokeStyle = `rgba(${r},${g},${b},${this.life})`;
        ctx.lineWidth = this.wide;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

    }


}


class Particle {


    constructor(px) {

        // Born out on the swirl, not at the core, so the mark
        // visibly condenses out of the orbiting matter
        // Peeled off one of the finished rings, so the wordmark is
        // visibly made of the same matter that is already rotating.
        // Each particle leaves the shell nearest its destination and
        // rides that shell's rotation before dropping inward.
        const _L0 = logoLayout();

        const destX = _L0.x + px.x * _L0.scale;
        const destY = _L0.y + px.y * _L0.scale;

        const destR = Math.hypot(destX - centerX, destY - centerY);

        // Which shell is this pixel closest to?
        let shell = 1;
        let bestGap = Infinity;

        for (let i = 1; i <= 11; i++) {

            const gap = Math.abs(ringRadius(i) - destR);

            if (gap < bestGap) {
                bestGap = gap;
                shell = i;
            }

        }

        this.shell = shell;

        // Leave the shell a short arc upstream of the destination,
        // travelling the same direction that shell spins
        const spin = (shell % 2 === 0) ? 1 : -1;

        const destAngle = Math.atan2(destY - centerY, destX - centerX);

        // A FULL sweep, not a narrow arc. A short lead meant every
        // particle entered from the same side and the wordmark
        // appeared from one edge all at once.
        const lead = 0.9 + Math.random() * 3.4;

        this.bornAngle = destAngle - lead * spin;

        const bornAngle = this.bornAngle;

        // Sit on the shell, but never inside its own destination --
        // the wordmark hangs outside the rim, so clamping to the
        // ring radius alone would make particles fly OUTWARD to
        // arrive, which reads as a burst. Start at least as far
        // out as the target.
        // Enter OUTSIDE the outermost ring and orbit inward, so
        // they share the system's rotation before settling.
        const rim = ringRadius(11);

        this.orbitR = Math.max(rim, destR) * (1.34 + Math.random() * 0.16);

        this.destR = destR;

        const bornDist = this.orbitR;

        this.x = centerX + Math.cos(bornAngle) * bornDist;
        this.y = centerY + Math.sin(bornAngle) * bornDist;

        // Store the source pixel -- the target is recomputed every
        // frame because the logo grows and moves during the cascade
        this.sx = px.x;
        this.sy = px.y;

        const L = logoLayout();

        this.targetX = L.x + px.x * L.scale;
        this.targetY = L.y + px.y * L.scale;

        // Colour sampled straight from the SVG, lifted toward
        // white-hot while it is still travelling
        this.r = px.r;
        this.g = px.g;
        this.b = px.b;

        this.size = 6.4 + Math.random() * 1.2;
        this.delay = Math.random() * 14;

        const angle = Math.random() * Math.PI * 2;
        // Tangential drift, matching the swirl they came from,
        // so they spiral inward instead of firing straight in
        const toCentre = Math.atan2(centerY - this.y, centerX - this.x);

        // Polar motion: the particle genuinely orbits the core
        // and spirals in, rather than being sprung at its target.
        this.spinDir = (this.shell % 2 === 0) ? 1 : -1;

        this.theta = bornAngle;
        this.radius = this.orbitR;

        // Angular speed, faster as it tightens in
        this.omega = (0.050 + Math.random() * 0.014) * this.spinDir;

        // How fast it gives up altitude
        this.fall = 0.024 + Math.random() * 0.007;

        this.captured = false;

        // Lock state. A particle is "locked" the moment it settles
        // onto its pixel: it flashes, swells from a point to its
        // full size, and switches from solid white to true colour.
        this.locked = false;
        this.lockT = 0;

        this.vx = 0;
        this.vy = 0;

        this.px = this.x;
        this.py = this.y;

        this.alpha = 0;

        // Personal hover offset -- where this pixel sits while the
        // mark is still unresolved. Scaled by logoResolve so the
        // cloud tightens onto the artwork when the rings finish.
        const ha = Math.random() * Math.PI * 2;
        const hr = 3 + Math.random() * 14;

        this.hoverX = Math.cos(ha) * hr;
        this.hoverY = Math.sin(ha) * hr;

        this.hoverPhase = Math.random() * Math.PI * 2;
        this.hoverRate = 0.010 + Math.random() * 0.022;

    }


    update() {

        if (this.delay > 0) {
            this.delay--;
            return;
        }

        this.alpha = Math.min(1, this.alpha + 0.13);

        // A locked particle is finished: it sits on its pixel and
        // only runs its short lock animation. Skipping the motion
        // maths for it is most of the cost saved late in the act.
        if (this.locked) {

            if (this.lockT < 1) {
                this.lockT = Math.min(1, this.lockT + 0.055);
            }

            return;

        }

        // Track the moving layout
        const L = logoLayout();

        const baseX = L.x + this.sx * L.scale;
        const baseY = L.y + this.sy * L.scale;

        // While unresolved the pixel hovers near its place rather
        // than sitting exactly on it, so the mark reads as a cloud
        // holding its shape instead of a finished logo.
        const loose = 1 - engine.logoResolve;

        this.hoverPhase += this.hoverRate;

        const breathe = 0.65 + Math.sin(this.hoverPhase) * 0.35;

        this.targetX = baseX + this.hoverX * loose * breathe;
        this.targetY = baseY + this.hoverY * loose * breathe;

        this.px = this.x;
        this.py = this.y;

        // Hard pull, tighter damping — snaps into place
        if (!this.captured) {

            // Orbit the core in the gravitational field, spiralling
            // down toward the altitude of its final resting place.
            const gap = this.radius - this.destR;

            this.radius -= gap * this.fall + 0.35;

            // Angular speed rises as it tightens, like the shells
            const tighten = Math.max(1, this.orbitR / Math.max(this.radius, 1));

            this.theta += this.omega * tighten;

            this.x = centerX + Math.cos(this.theta) * this.radius;
            this.y = centerY + Math.sin(this.theta) * this.radius;

            // Once it is both at the right altitude AND swinging
            // past its destination, hand over to the spring
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;

            if (gap < 14 && (dx * dx + dy * dy) < 26000) {
                this.captured = true;
            }

        } else {

            this.vx += (this.targetX - this.x) * 0.0115;
            this.vy += (this.targetY - this.y) * 0.0115;

            this.vx *= 0.885;
            this.vy *= 0.885;

            this.x += this.vx;
            this.y += this.vy;

            if (!this.locked) {

                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;

                const slow = (this.vx * this.vx + this.vy * this.vy) < 0.55;

                if (slow && (dx * dx + dy * dy) < 9) {

                    this.locked = true;

                    // Snap exactly onto the pixel it belongs to
                    this.x = this.targetX;
                    this.y = this.targetY;

                    this.vx = 0;
                    this.vy = 0;

                }

            }

        }

        if (this.locked && this.lockT < 1) {

            this.lockT = Math.min(1, this.lockT + 0.055);

        }

    }

    draw() {

        // Particles fade out as the clean SVG fades in
        const a = this.alpha * (1 - engine.logoSettle);

        if (a <= 0.01) return;

        const dx = this.vx;
        const dy = this.vy;

        const speedSq = dx * dx + dy * dy;

        // SOLID WHITE in flight. On lock the particle flashes,
        // swells from a point to full size, and turns its colour.
        // Colour is per-particle, driven by its own lock, not by a
        // global fade -- so the wordmark fills in pixel by pixel.
        // Colour only once the ENTIRE wordmark is placed, so the
        // logo does not appear piecemeal. Individual locks still
        // snap into position, they just stay white until the last
        // one lands.
        const mix = engine.logoComplete
            ? engine.logoColour * engine.logoColour *
              (3 - 2 * engine.logoColour)
            : 0;

        const r = (255 + (this.r - 255) * mix) | 0;
        const g = (255 + (this.g - 255) * mix) | 0;
        const b = (255 + (this.b - 255) * mix) | 0;

        // Caller sets composite mode once for the whole swarm

        // Motion-blur streak, batched as a plain stroke
        if (speedSq > 5) {

            ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.80})`;
            ctx.lineWidth = this.size * 1.35;

            ctx.beginPath();
            ctx.moveTo(this.px, this.py);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();

        }

        // In flight it is a small point. On lock it swells out to
        // full size — "one pixel to ten" — with a flash of light.
        let sz;

        if (!this.locked) {

            sz = this.size * 0.28;

        } else {

            // Grow smoothly to full size, no overshoot
            const e = this.lockT * this.lockT * (3 - 2 * this.lockT);

            sz = this.size * (0.28 + (1 - 0.28) * e);

        }

        // A soft settle, not a burst. The previous version threw a
        // flash 4.8x the particle's size at 85% alpha, which read
        // as an explosion at every pixel. This is a brief, gentle
        // bloom just larger than the particle itself.
        if (this.locked && this.lockT < 0.4) {

            const f = 1 - this.lockT / 0.4;

            ctx.fillStyle = `rgba(255,255,255,${a * f * 0.22})`;

            const fr = this.size * (1.0 + f * 0.45);

            ctx.fillRect(this.x - fr, this.y - fr, fr * 2, fr * 2);

        }

        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;

        // fillRect is markedly cheaper than arc at this count
        ctx.fillRect(this.x - sz, this.y - sz, sz * 2, sz * 2);

    }



}


/* ===================================================
   SHOOTER -- tuning + helpers
=================================================== */

const SHOOTER_GRAVITY = 26;
const SHOOTER_SOFTEN = 9000;

// Tail length. There are TWO populations here and they want
// opposite treatments:
//
//   FALL  -- the comets raining in during the barrage. These are
//           dramatic, and read best with a real streak behind
//           them. They are the event.
//
//   ORBIT -- the matter circling the finished ring system. These
//           are ambience, not action. A long tail turns them into
//           a swarm of darts whipping round the logo, so they stay
//           close to points of light.
//
// Previously a single set of constants governed both, which meant
// tuning one always broke the other.

const FALL_TAIL_BASE = 12;
const FALL_TAIL_SCALE = 11;
const FALL_TAIL_MAX = 300;

const ORBIT_TAIL_BASE = 2.5;
const ORBIT_TAIL_SCALE = 1.6;
const ORBIT_TAIL_MAX = 26;

// Swept collision so fast bodies cannot tunnel through the core
function segmentHitsCore(ax, ay, bx, by, hitRadius) {

    const sx = bx - ax;
    const sy = by - ay;

    const lenSq = sx * sx + sy * sy;

    let t = 0;

    if (lenSq > 0) {
        t = ((centerX - ax) * sx + (centerY - ay) * sy) / lenSq;
        t = Math.max(0, Math.min(1, t));
    }

    const cx = ax + sx * t;
    const cy = ay + sy * t;

    return Math.hypot(centerX - cx, centerY - cy) <= hitRadius;

}


/* ===================================================
   SHOOTER

   Two movement modes, chosen at spawn and never
   switched mid-flight:

   FALL    straight radial free-fall into the core
   VORTEX  captured into a counter-rotating shell,
           spirals inward, feeds a ring

   Direction alternates by shell index so adjacent
   rings counter-rotate.
=================================================== */

class Shooter {

    constructor(mode, shellIndex, outer) {

        this.mode = mode || "FALL";
        this.shell = shellIndex || 0;

        // Orbits beyond the outermost ring, where it stays visible
        // instead of being painted over by the ring sprites
        this.outer = !!outer;

        const angle = Math.random() * Math.PI * 2;

        if (this.mode === "FALL") {

            // Close enough that the body actually arrives on screen.
            // Further out, the 1/(1+d^2) softening makes gravity
            // vanish and the comet crawls for 10+ seconds.
            const distance =
                Math.max(width, height) * (0.45 + Math.random() * 0.38);

            this.x = centerX + Math.cos(angle) * distance;
            this.y = centerY + Math.sin(angle) * distance;

            this.mass = 0.9 + Math.random() * 1.4;

            // Real inbound velocity, not a drift
            const seed = 7 + Math.random() * 4;

            this.vx = -Math.cos(angle) * seed;
            this.vy = -Math.sin(angle) * seed;

        } else {

            // Vortex bodies are described in polar terms
            this.angle = angle;

            this.radius =
                Math.max(width, height) * (0.7 + Math.random() * 0.9);

            // Match the direction of the shell this body is joining,
            // so the matter and the ring it condenses into turn the
            // same way rather than fighting each other.
            const spec = RING_SPIN[this.shell];

            this.spin = (spec !== undefined && spec < 0) ? -1 : 1;

            // Target radius is the shell this body belongs to.
            // Outer bodies settle beyond the rim so they remain
            // visible over the finished ring system.
            // Outer matter is caught by the core's gravity and
            // spirals inward — but it can never reach the rings.
            // It burns up just outside the rim and is recycled.
            this.targetRadius = this.outer
                ? ringRadius(11) * 1.28
                : ringRadius(this.shell);

            // Where it starts its fall, well outside the system
            if (this.outer) {

                this.radius = ringRadius(11) *
                              (1.45 + Math.random() * 1.95);

            }

            // Scale orbital speed off the shell's spec so matter
            // near the core races and matter at the rim drifts,
            // matching the rings they are feeding.
            const specAbs = Math.abs(
                RING_SPIN[this.shell] !== undefined ? RING_SPIN[this.shell] : 16
            );

            // Normalised 0..1 across the spec's range, then mapped
            // onto a sensible orbital band
            const norm = Math.min(1, specAbs / 240);

            if (this.outer) {

                // Distant stars: they orbit at the pace of the
                // outermost ring, so the whole system reads as one
                // slow body rather than debris whipping past.
                const rimDeg = Math.abs(RING_SPIN[11]);

                this.angularSpeed =
                    (rimDeg * DEG_PER_SEC) * (0.85 + Math.random() * 0.35) *
                    (RING_SPIN[11] < 0 ? -1 : 1);

            } else {

                this.angularSpeed =
                    (0.00055 + norm * 0.0022 + Math.random() * 0.0004) * this.spin;

            }

            // Distant stars keep their distance; only the shell
            // feeders spiral inward.
            this.inwardRate = this.outer
                ? 0.00004
                : 0.00055 + Math.random() * 0.0007;

            this.x = centerX + Math.cos(this.angle) * this.radius;
            this.y = centerY + Math.sin(this.angle) * this.radius;

            this.prevX = this.x;
            this.prevY = this.y;

        }

        this.brightness = this.outer
            ? 0.30 + Math.random() * 0.35
            : 0.55 + Math.random() * 0.45;
        this.size = this.outer
            ? 0.9 + Math.random() * 1.1
            : 1.9 + Math.random() * 2.7;

        this.dead = false;

    }

    update(dt) {

        if (this.mode === "FALL") {
            this.updateFall();
        } else {
            this.updateVortex(dt);
        }

    }

    // --- Straight fall -----------------------------

    updateFall() {

        const oldX = this.x;
        const oldY = this.y;

        const dx = centerX - this.x;
        const dy = centerY - this.y;

        const distance = Math.max(Math.hypot(dx, dy), 1);

        const nx = dx / distance;
        const ny = dy / distance;

        const pull =
            SHOOTER_GRAVITY * this.mass /
            (1 + (distance * distance) / SHOOTER_SOFTEN);

        this.vx += nx * pull;
        this.vy += ny * pull;

        this.x += this.vx;
        this.y += this.vy;

        const hitRadius = Math.max(engine.coreRadius + 6, 24);

        if (segmentHitsCore(oldX, oldY, this.x, this.y, hitRadius)) {
            this.absorb();
            return;
        }

        const far = Math.max(width, height) * 6;

        if (Math.hypot(this.x - centerX, this.y - centerY) > far) {
            this.dead = true;
        }

    }

    // --- Vortex spiral -----------------------------

    updateVortex(dt) {

        this.prevX = this.x;
        this.prevY = this.y;

        // Rotation accelerates as the body tightens in --
        // conservation of angular momentum, loosely
        const tightness =
            Math.max(0.35, this.targetRadius / Math.max(this.radius, 1));

        this.angle += this.angularSpeed * tightness * dt;

        // Ease toward the shell radius rather than the centre
        const gap = this.radius - this.targetRadius;

        this.radius -= gap * this.inwardRate * dt;

        this.x = centerX + Math.cos(this.angle) * this.radius;
        this.y = centerY + Math.sin(this.angle) * this.radius;

        // Once this shell's ring has locked, the swirl is replaced
        // by the SVG -- retire the body. But only WHILE the cascade
        // is still running: after it finishes, every new body would
        // die on arrival and the matter would stop turning entirely.
        // Distant stars simply orbit. They are not consumed and
        // never approach the rings, so nothing needs recycling.
        // Once every shell is home the inner feeders have no job.
        // Retire them so only the distant stars remain.
        if (!this.outer && engine.ringsLocked >= 12) {
            this.dead = true;
            return;
        }

        if (!this.outer &&
            engine.phase === "CASCADE" &&
            engine.ringsLocked < 12 &&
            engine.rings[this.shell] &&
            engine.rings[this.shell].locked) {

            this.dead = true;

        }

    }

    // --- Absorption --------------------------------

    absorb() {

        engine.absorbedEnergy++;

        // Visible mark at the point of contact, so every single
        // strike registers rather than only nudging the core.
        const ang = Math.atan2(this.y - centerY, this.x - centerX);

        const surface = Math.max(engine.coreRadius, 10);

        engine.impacts.push(new Impact(
            centerX + Math.cos(ang) * surface,
            centerY + Math.sin(ang) * surface,
            ang,
            Math.min(1.6, this.mass || 1)
        ));

        // Cap so a dense barrage cannot run away with the frame
        if (engine.impacts.length > 90) {
            engine.impacts.splice(0, engine.impacts.length - 90);
        }

        // Each impact grows the core, but only up to a ceiling.
        // The comets can build it most of the way; the SECOND bang
        // is what drives it out to full size.
        // Once the second bang has fired the core is already full;
        // late strikes must never shrink it back to the ceiling.
        if (!engine.coreExpanding) {

            const ceiling = engine.coreMaxRadius * CORE_PRE_BANG_CAP;

            engine.coreRadius = Math.max(
                engine.coreRadius,
                Math.min(
                    engine.coreRadius + (ceiling - engine.coreRadius) * 0.020 + 0.09,
                    ceiling
                )
            );

        }

        // Every single strike kicks the core. The pulse is
        // additive rather than assigned, so a dense barrage reads
        // as a continuously hammered core instead of one wave.
        engine.corePulseBoost = Math.min(90, engine.corePulseBoost + 22);

        engine.coreWave = Math.min(1.4, engine.coreWave + 0.55);
        engine.ringWave = Math.min(1.2, engine.ringWave + 0.30);

        // A shockwave off the surface for this specific hit
        engine.coreHits.push({
            angle: ang,
            life: 1,
            decay: 0.045 + Math.random() * 0.025,
            power: Math.min(1.5, this.mass || 1)
        });

        if (engine.coreHits.length > 70) {
            engine.coreHits.splice(0, engine.coreHits.length - 70);
        }

        this.dead = true;

    }

    // --- Rendering ---------------------------------

    draw() {

        let angle;
        let speed;

        if (this.mode === "FALL") {

            speed = Math.hypot(this.vx, this.vy);

            if (speed < 0.001) return;

            angle = Math.atan2(this.vy, this.vx);

        } else {

            const dx = this.x - this.prevX;
            const dy = this.y - this.prevY;

            speed = Math.hypot(dx, dy);

            if (speed < 0.001) return;

            angle = Math.atan2(dy, dx);

        }

        // Falling comets get a real streak; orbiting matter stays
        // close to a point of light. See the constants above.
        const falling = this.mode === "FALL";

        const tail = falling
            ? Math.min(
                  FALL_TAIL_BASE + speed * FALL_TAIL_SCALE,
                  FALL_TAIL_MAX
              )
            : Math.min(
                  ORBIT_TAIL_BASE + speed * ORBIT_TAIL_SCALE,
                  ORBIT_TAIL_MAX
              );

        const headR = this.size;

        // FAST PATH -- once the barrage is dense, three gradient
        // allocations per comet per frame is thousands of objects
        // a second and the framerate collapses. Solid fills read
        // almost identically at this size and speed.
        if (engine.shooters.length > 90) {

            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const tx = this.x - cos * tail;
            const ty = this.y - sin * tail;

            ctx.strokeStyle =
                `rgba(120,205,255,${0.30 * this.brightness})`;
            ctx.lineWidth = headR * 1.5;

            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();

            ctx.strokeStyle =
                `rgba(255,255,255,${0.75 * this.brightness})`;
            ctx.lineWidth = Math.max(0.7, headR * 0.6);

            ctx.beginPath();
            ctx.moveTo(this.x - cos * tail * 0.4,
                       this.y - sin * tail * 0.4);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();

            ctx.fillStyle = `rgba(255,255,255,${this.brightness})`;

            const d = headR * 1.6;
            ctx.fillRect(this.x - d / 2, this.y - d / 2, d, d);

            return;

        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);

        // Tapered comet tail
        const tailGrad = ctx.createLinearGradient(0, 0, -tail, 0);

        tailGrad.addColorStop(0.0, `rgba(255,255,255,${0.85 * this.brightness})`);
        tailGrad.addColorStop(0.15, `rgba(190,235,255,${0.55 * this.brightness})`);
        tailGrad.addColorStop(0.55, `rgba(69,184,255,${0.22 * this.brightness})`);
        tailGrad.addColorStop(1.0, "rgba(69,184,255,0)");

        ctx.fillStyle = tailGrad;

        ctx.beginPath();
        ctx.moveTo(0, -headR);
        ctx.lineTo(0, headR);
        ctx.lineTo(-tail, 0);
        ctx.closePath();
        ctx.fill();

        // Hot centreline
        const coreGrad = ctx.createLinearGradient(0, 0, -tail * 0.55, 0);

        coreGrad.addColorStop(0.0, `rgba(255,255,255,${0.9 * this.brightness})`);
        coreGrad.addColorStop(1.0, "rgba(220,245,255,0)");

        ctx.strokeStyle = coreGrad;
        ctx.lineWidth = Math.max(0.6, headR * 0.5);
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-tail * 0.55, 0);
        ctx.stroke();

        // Head
        const headGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, headR * 2.2);

        headGrad.addColorStop(0.0, "#ffffff");
        headGrad.addColorStop(0.4, `rgba(210,240,255,${0.7 * this.brightness})`);
        headGrad.addColorStop(1.0, "rgba(69,184,255,0)");

        ctx.fillStyle = headGrad;

        ctx.beginPath();
        ctx.arc(0, 0, headR * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

    }

}


/* ===================================================
   RING SYSTEM

   12 layers. Index 0 is the core disc, 1..11 are rings.
   Each is born spinning violently and decays to calm.
=================================================== */

// Screen radius of the finished system
function systemRadius() {

    // The badge is an OVERLAY, not a stacked element — it sits on
    // top of the ring system exactly as in the brand lockup, so the
    // finale needs no vertical room and the system must not resize.
    // Any shrink here makes the core visibly jump at the flash.
    const shrink = 1;


    // Width-limited
    const byWidth = width * 0.5 * 0.86;

    // Height-limited: rings sit above the logo, so the system
    // gets the upper portion of the frame only
    const byHeight = height * (1 - CONFIG.LOGO_HEADROOM) * 0.5 * 0.92;

    const fit = Math.min(byWidth, byHeight);

    const zoomed = Math.min(fit, Math.min(width, height) * CONFIG.SYSTEM_SCALE)
           * shrink * (width < 1024 ? 1.0 : CONFIG.HERO_ZOOM);

    // The "Powering What's Next" badge is part of the lockup and
    // scales with the core, but its artboard reaches further left of
    // the core centre than the rings do. On narrow screens that left
    // edge is what runs off frame first. Cap the whole system to what
    // lets the badge fit, so rings and badge shrink together at the
    // same rate instead of the badge being scaled independently.
    const badgeReach = (CONFIG.POWERING_VIEWBOX_W - CONFIG.RING_VIEWBOX)
                     + CONFIG.RING_ART_CX;

    const badgeCap = Math.max(0, width * 0.5 - 8)
                   * CONFIG.RING_VIEWBOX / (2 * badgeReach);

    // Vertical ceiling. Keeps the core inside the section instead of
    // overrunning it, so the frame can hug the artwork.
    const heightCap = height * CONFIG.CORE_HEIGHT_FILL * 0.5;

    return Math.min(zoomed, badgeCap, heightCap);

}


// Where shell n sits, in screen pixels
function ringRadius(n) {

    const outer = systemRadius();
    const inner = outer * CONFIG.CORE_ART_RATIO / 0.5 * 0.5;

    if (n <= 0) return inner;

    // Even spread from the core out to the rim
    return inner + (outer - inner) * (n / 11);

}


/* ===================================================
   CHARGE PULSE
   A ring of light thrown from the core that races
   outward and colorizes a shell when it arrives.
=================================================== */

class ChargePulse {

    constructor(targetIndex, targetRadius, travelMs, now) {

        this.index = targetIndex;
        this.targetRadius = targetRadius;

        this.born = now;
        this.travel = travelMs;

        // The pulse is PUSHED OUT of the core: it starts at the
        // core's own surface, not at the centre. Starting at zero
        // made it look like it materialised inside the core and
        // expanded through it rather than being expelled.
        this.startRadius = Math.max(engine.coreRadius, 8);

        this.radius = this.startRadius;
        this.done = false;

        // Was read in update() and draw() but never assigned, so
        // `radius > undefined` was always false — pulses never
        // retired and accumulated for the entire sequence. That is
        // both a leak and a large part of why the screen filled
        // with overlapping bands.
        this.escapeRadius = Math.hypot(width, height) * 0.62;

        this.delivered = false;

    }

    update(now) {

        const t = (now - this.born) / this.travel;

        if (t <= 1) {

            // Outbound to its shell, near-linear so it arrives at
            // full speed and SLAMS into the ring
            const eased = 1 - Math.pow(1 - t, 1.25);

            this.radius = this.startRadius +
                          (this.targetRadius - this.startRadius) * eased;

        } else {

            // Past the shell: the wave keeps travelling outward at
            // the speed it arrived with, like a sound wave that
            // does not stop at the first thing it passes.
            const over = (t - 1) * this.travel;

            const speed = (this.targetRadius - this.startRadius) / this.travel;

            this.radius = this.targetRadius + speed * over * 1.30;

        }

        // Charge the shell exactly once, as the front passes it
        if (!this.delivered && t >= 1) {
            this.delivered = true;
        }

        // Retire only once it is genuinely off screen
        if (this.radius > this.escapeRadius) this.done = true;

        return Math.min(1, t);

    }

    draw(now) {

        if (this.radius <= 0) return;

        const raw = (now - this.born) / this.travel;
        const t = Math.min(1, raw);

        // Outbound: blazing. Past the shell: fades as the wavefront
        // stretches over an ever larger circumference, the way a
        // sound wave loses intensity with distance.
        let a;

        // This is LIGHT, not sound. It does not attenuate as it
        // travels — it keeps its intensity all the way out of the
        // frame. Only the very last stretch eases off so it does
        // not pop out of existence at the edge.
        if (raw <= 1) {

            a = 1.0;

        } else {

            const escapeT = this.radius / this.escapeRadius;

            a = escapeT > 0.88
                ? Math.max(0, 1 - (escapeT - 0.88) / 0.12)
                : 1.0;

        }

        if (a <= 0.004) return;

        // Thickness grows as the wave stretches
        const stretch = raw <= 1
            ? 1
            : Math.min(2.6, this.radius / Math.max(this.targetRadius, 1));

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // A wavefront of LIGHT has no edges. The previous version
        // stroked five hard concentric arcs at fixed pixel widths
        // (up to 60px, full opacity), which reads as stacked rubber
        // bands -- flat, banded, and obviously drawn.
        //
        // This is now a single annular RADIAL GRADIENT: intensity
        // ramps up behind the front, peaks white at the front
        // itself, and falls away smoothly ahead of it. That soft
        // falloff is what makes it read as emitted light rather
        // than as an outline.

        const R = this.radius;

        // The luminous band trails BEHIND the front, because the
        // wave is compression moving outward -- the energy is in
        // its wake, not ahead of it.
        const behind = Math.min(R * 0.55, 92 * stretch);
        const ahead  = Math.min(R * 0.10, 15 * stretch);

        const inner = Math.max(0, R - behind);
        const outer = R + ahead;

        const grad = ctx.createRadialGradient(
            centerX, centerY, inner,
            centerX, centerY, outer
        );

        const p = inner / outer;          // where the band starts
        const f = R / outer;              // where the front sits

        // Deep tail -- faint, cool, wide
        grad.addColorStop(0.000, "rgba(40,120,255,0)");

        grad.addColorStop(
            Math.min(0.98, p + (f - p) * 0.35),
            `rgba(64,150,255,${0.10 * a})`
        );

        // Body of the wave brightening toward the front
        grad.addColorStop(
            Math.min(0.985, p + (f - p) * 0.72),
            `rgba(120,205,255,${0.34 * a})`
        );

        // The front itself -- hot white core of the pulse
        grad.addColorStop(
            Math.min(0.99, f),
            `rgba(255,255,255,${0.92 * a})`
        );

        // Falls off immediately ahead into nothing
        grad.addColorStop(1.000, "rgba(120,205,255,0)");

        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.arc(centerX, centerY, outer, 0, Math.PI * 2);

        // Punch out the middle so we fill only the annulus and do
        // not repaint the whole disc every frame.
        if (inner > 0) {
            ctx.arc(centerX, centerY, inner, 0, Math.PI * 2, true);
        }

        ctx.fill();

        // A thin, genuinely bright leading edge. Kept hairline --
        // this is the specular highlight ON the wavefront, not the
        // wave itself, so it must never read as a stroked circle.
        ctx.strokeStyle = `rgba(255,255,255,${0.85 * a})`;
        ctx.lineWidth = 2.0;

        ctx.beginPath();
        ctx.arc(centerX, centerY, R, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

    }

}


/* ===================================================
   RING ROTATION SPEC
   Per-ring direction and speed. Index 0 is the core,
   which the spec calls ring 1; index 11 is the rim.
   Negative is counterclockwise. Values are deg/sec.
=================================================== */

const RING_SPIN = [
    // ALTERNATE CONFIGURATION.
    // Direction now flips in PAIRS rather than every ring, so the
    // system reads as counter-rotating bands instead of a strobe.
    // Speed no longer falls monotonically outward: two outer rings
    // are deliberately fast, which gives the rim some life.
    // Every ring is at least 30% quicker than the previous set,
    // and the slowest here (18) beats the old slowest (2.07) by far.
    -288,   // 0  core        heartbeat, fastest thing in frame
    -152,   // 1              inner counter-drag, same way as core
     124,   // 2              first reversal
      88,   // 3              paired with 2
     -66,   // 4              reversal
     -47,   // 5              paired with 4
     140,   // 6              a fast band out in the middle
      31,   // 7              paired with 6
     -24,   // 8              reversal
     -95,   // 9              second fast band, near the rim
      18,   // 10             slowest ring, still 8.7x the old rim
     -58    // 11 rim         rim sweeps against everything
];

// deg/sec -> rad/ms
const DEG_PER_SEC = Math.PI / 180 / 1000;


/* ===================================================
   WHITE-WORLD RING SPEC

   The final white screen uses its OWN speed table, so
   the calm ending can be tuned without touching the
   dark-world choreography above.

   Put your original per-ring spec here. Values are
   deg/sec, negative = counterclockwise, same as
   RING_SPIN. Index 0 is the core, 11 is the rim.

   The system eases from RING_SPIN into these values as
   the world flips, so the change is felt as a settling
   rather than a switch.
=================================================== */

// Each ring runs at 60% of its dark-world speed once the world
// is white -- a flat 40% reduction across the system, so the
// relative choreography of RING_SPIN is preserved exactly and
// only the overall pace drops.
//
// Derived from RING_SPIN rather than typed out, so the two can
// never drift apart when the dark-world spec is retuned.
const WHITE_SLOWDOWN = 0.60;

// The rim is exempt from the full slowdown -- it keeps more of
// its pace so the outside of the finished mark still sweeps.
const WHITE_RIM_BOOST = 1.55;

const RING_SPIN_WHITE = RING_SPIN.map((v, i) =>
    i === RING_SPIN.length - 1
        ? v * WHITE_SLOWDOWN * WHITE_RIM_BOOST
        : v * WHITE_SLOWDOWN
);


/* ===================================================
   CALM FACTOR

   The white world is where the piece comes to rest, so
   everything that moves eases down as the flip happens.
   One function so the whole system decelerates together
   rather than each element being tuned separately.
=================================================== */

// How far the system has settled into its white-world
// behaviour. 0 = full dark-world motion, 1 = fully
// resolved into RING_SPIN_WHITE.
function calmBlend() {

    const v = Math.min(1, Math.max(0, engine.invert));

    // Eased so the change is felt as a settling rather than
    // a gear shift at the moment of the flash.
    return v * v * (3 - 2 * v);

}

class Ring {

    constructor(index) {

        this.index = index;

        // Direction and resting speed come from the spec table
        const spec = RING_SPIN[index] !== undefined ? RING_SPIN[index] : 16;

        this.spin = spec < 0 ? -1 : 1;

        this.rotation = Math.random() * Math.PI * 2;

        // Resting speed for this specific ring
        this.restSpeed = spec * DEG_PER_SEC;

        // Speed this ring settles to once the world is white
        const wspec = RING_SPIN_WHITE[index] !== undefined
            ? RING_SPIN_WHITE[index]
            : spec;

        this.whiteSpeed = wspec * DEG_PER_SEC;

        // Born spinning violently, in its own direction — the
        // ring arrives already in motion, as though it has been
        // pulled through from somewhere else, then brakes into
        // the speed the spec assigns it.
        //
        // The floor matters: scaling purely off restSpeed means a
        // slow ring (ring 10 rests at 18 deg/s) would arrive at
        // only 250 deg/s while the core arrives at 4000, and the
        // slow ones would look like they simply faded in. The
        // floor guarantees every shell arrives fast.
        const drama = CONJURE_DRAMA[index] !== undefined
            ? CONJURE_DRAMA[index]
            : 1;

        this.bornSpeed = (this.restSpeed * CONJURE_SPEED +
                          this.spin * CONJURE_FLOOR) * drama;

        this.speed = this.bornSpeed;

        this.locked = false;
        this.lockTime = 0;

        // True from the moment the core throws its charge pulse
        // until that pulse arrives and the ring locks
        this.charging = false;

        this.alpha = 0;
        this.burst = 0;

        // Arc swept in the previous frame (for conjuring blur)
        this.lastStep = 0;

    }

    lock(now) {

        this.locked = true;
        this.lockTime = now;

        // A soft bloom on the shell itself either way, but a much
        // gentler one when the pulses are hidden — with no wave
        // arriving, a hard flash has no visible cause.
        this.burst = RING_PULSES_VISIBLE ? 1 : 0.34;

        engine.ringsLocked++;

        // The shell detonation and whole-frame flash. These are
        // the "pulse every time a ring forms" — twelve impacts and
        // twelve novaFlashes over the cascade. Suppressed with the
        // pulse visuals so the rings simply resolve into place.
        if (RING_PULSES_VISIBLE) {

            engine.impacts.push(new Impact(
                centerX, centerY,
                Math.random() * Math.PI * 2, 1.4
            ));

            engine.novaFlash = Math.max(engine.novaFlash, 0.42);

        }

    }

    update(dt, now) {

        if (!this.locked) return;

        const age = now - this.lockTime;

        // Fade in. Ring 0 and 1 are the exception: they appear
        // instantly, hidden inside the detonation flash, so the
        // finished core never looks like it grew in.
        //
        // Without the arriving pulse to motivate it, a 900ms fade
        // makes each shell simply pop into being. A longer, eased
        // fade lets the ring resolve out of the dark instead.
        const fadeMs = RING_PULSES_VISIBLE ? 900 : 1500;

        const f = Math.min(1, age / fadeMs);

        this.alpha = this.index <= 1
            ? 1
            : (RING_PULSES_VISIBLE ? f : f * f * (3 - 2 * f));

        // The brake. Front-loaded hard: most of the speed is shed
        // in the first few hundred milliseconds, then it eases the
        // last of the way in. This is what makes the arrival read
        // as a ring being CAUGHT rather than gently spinning down.
        const settle = Math.min(1, age / CONJURE_BRAKE_MS);
        const eased = 1 - Math.pow(1 - settle, CONJURE_CURVE);

        this.speed = this.bornSpeed +
                     (this.restSpeed - this.bornSpeed) * eased;

        // As the world flips, ease from the dark-world speed into
        // this ring's OWN white-world speed. Blending per ring
        // (rather than scaling everything by one number) means the
        // final composition can have its own choreography -- a
        // quick rim over a calm interior, for instance.
        const k = calmBlend();

        const target = this.whiteSpeed !== undefined
            ? this.whiteSpeed
            : this.restSpeed;

        const live = this.speed + (target - this.speed) * k;

        // Arc swept this frame, used by the draw pass to smear the
        // sprite across it while the ring is still braking.
        this.lastStep = live * dt;

        this.rotation += this.lastStep;

        // Burst ripple decays. Shortened from 900ms -- a long decay
        // reads as a soft glow fading up and down, which is what
        // made the lock look artificial. A tighter window makes it
        // land like an impact and get out of the way.
        if (this.burst > 0) {
            this.burst = Math.max(0, this.burst - dt / 480);
        }

    }

    draw() {

        const sprite = ringSprites[this.index];

        if (!sprite || this.alpha <= 0) return;

        const outer = systemRadius();

        // Scale the 1254 viewBox so the art fills the system
        const scale = (outer * 2) / CONFIG.RING_VIEWBOX;

        // Art centre is offset inside the viewBox
        const offX = (CONFIG.RING_ART_CX - CONFIG.RING_VIEWBOX / 2) * scale;
        const offY = (CONFIG.RING_ART_CY - CONFIG.RING_VIEWBOX / 2) * scale;

        const size = CONFIG.RING_VIEWBOX * scale;

        ctx.save();

        // Rotate about the ART's centre, not the sprite's.
        //
        // Previously this translated to (centerX - offX) and then
        // rotated, which pivots around a point 6px away from where
        // the art actually is -- so the art traced a 6px circle as
        // the ring spun. Imperceptible at 1.8 deg/s, but obvious on
        // the core at 240 deg/s and ring 1 at 145 deg/s, which is
        // why exactly those two looked off-centre.
        //
        // Correct order: move to the true centre, rotate there,
        // THEN shift the sprite so its art lands on that point.
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);

        ctx.globalAlpha = this.alpha;

        // --- CONJURING MOTION BLUR -------------------------------
        //
        // While the ring is still braking it is drawn several times
        // across the arc it swept during this frame, at falling
        // opacity. Two reasons:
        //
        // 1. It SELLS the speed. A single crisp sprite at 4500
        //    deg/s looks like a static ring in a slightly wrong
        //    place each frame; smeared, it looks like it is
        //    tearing through.
        //
        // 2. It defeats aliasing. These rings carry repeating dash
        //    and dot patterns, so their rotational symmetry makes
        //    the effective wagon-wheel threshold far lower than
        //    180 deg/frame -- a 12-fold pattern reverses above just
        //    15 deg/frame. Smearing across the swept arc removes
        //    the strobing that causes it.
        //
        // Costs nothing once settled: blur is skipped entirely
        // below the threshold, which is almost the whole runtime.
        const sweep = Math.abs(this.lastStep || 0);

        // 0.105 rad = 6 deg/frame. The fastest ring at REST sweeps
        // 4.8 deg/frame, so this sits just above it: the blur runs
        // during the arrival and switches off completely once the
        // system has settled, instead of costing extra draws for
        // the remaining ~45 seconds.
        if (sweep > 0.105) {

            // More samples the faster it is going, capped for cost
            const steps = Math.min(9, 2 + Math.floor(sweep / 0.045));

            for (let b = 1; b <= steps; b++) {

                const back = (b / steps) * this.lastStep;

                // Trailing copies fade out behind the leading edge
                const ba = this.alpha * (1 - b / (steps + 1)) * 0.42;

                if (ba <= 0.004) continue;

                ctx.save();
                ctx.rotate(-back);
                ctx.globalAlpha = ba;

                ctx.drawImage(
                    sprite,
                    -size / 2 - offX,
                    -size / 2 - offY,
                    size,
                    size
                );

                ctx.restore();

            }

            ctx.globalAlpha = this.alpha;

        }

        // --- Base ring, always drawn at true size and alpha ------
        //
        // The old lock-in simply multiplied globalAlpha on this
        // single sprite under "lighter", which washes the whole
        // shell to a flat white slab -- no shape, no direction, no
        // falloff. That is what read as hokey.
        //
        // The shell is now drawn normally, and the flash is a
        // SEPARATE additive bloom layered over it, so the ring's
        // own artwork stays legible while the energy blooms.

        ctx.drawImage(
            sprite,
            -size / 2 - offX,
            -size / 2 - offY,
            size,
            size
        );

        // --- Lock-in bloom ---------------------------------------
        // Additive renders as nothing on white, so skip post-flip.
        if (this.burst > 0 && engine.invert < 0.5) {

            // Sharp attack, long tail — energy ARRIVES, then ebbs,
            // rather than fading linearly like a dimmer switch.
            const e = Math.pow(this.burst, 0.55);

            ctx.globalCompositeOperation = "lighter";

            // Two offset copies at slightly different scales make
            // the light look like it is radiating THROUGH the ring
            // instead of the ring simply turning white.
            const bloom = [
                [1.000, 0.55],
                [1.014, 0.30],
                [0.988, 0.22]
            ];

            for (let i = 0; i < bloom.length; i++) {

                const s = size * bloom[i][0];
                const a = this.alpha * e * bloom[i][1];

                if (a <= 0.004) continue;

                ctx.globalAlpha = a;

                ctx.drawImage(
                    sprite,
                    -s / 2 - offX * bloom[i][0],
                    -s / 2 - offY * bloom[i][0],
                    s,
                    s
                );

            }

        }

        ctx.restore();

    }

}


/* ===================================================
   IMPACT — a flash and splash where a comet strikes
=================================================== */

class Impact {

    constructor(x, y, angle, power) {

        this.x = x;
        this.y = y;

        this.angle = angle;
        this.power = power;

        this.life = 1;
        this.decay = 0.055 + Math.random() * 0.030;

        // Debris thrown back along the incoming path
        this.shards = [];

        const count = 3 + ((Math.random() * 4) | 0);

        for (let i = 0; i < count; i++) {

            const spread = (Math.random() - 0.5) * 1.9;
            const spd = 1.2 + Math.random() * 3.4;

            this.shards.push({
                x: 0,
                y: 0,
                vx: Math.cos(angle + Math.PI + spread) * spd,
                vy: Math.sin(angle + Math.PI + spread) * spd,
                len: 3 + Math.random() * 7
            });

        }

    }

    update() {

        this.life -= this.decay;

        for (const sh of this.shards) {

            sh.x += sh.vx;
            sh.y += sh.vy;

            sh.vx *= 0.90;
            sh.vy *= 0.90;

        }

    }

    get dead() {
        return this.life <= 0;
    }

    draw() {

        if (this.life <= 0) return;

        const t = this.life;
        const a = Math.pow(t, 0.7);

        // Hot flash at the point of contact
        const r = 5 + this.power * 9 * (1 - t) + 3;

        const g = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, r
        );

        g.addColorStop(0.00, `rgba(255,255,255,${a * 0.95})`);
        g.addColorStop(0.35, `rgba(200,238,255,${a * 0.45})`);
        g.addColorStop(1.00, "rgba(70,160,255,0)");

        ctx.fillStyle = g;

        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Splash ring expanding off the surface
        ctx.strokeStyle = `rgba(190,235,255,${a * 0.55})`;
        ctx.lineWidth = 1.4 * t + 0.4;

        ctx.beginPath();
        ctx.arc(this.x, this.y, r * 1.5 * (1.2 - t), 0, Math.PI * 2);
        ctx.stroke();

        // Debris
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.7})`;
        ctx.lineWidth = 1;

        ctx.beginPath();

        for (const sh of this.shards) {

            const sx = this.x + sh.x;
            const sy = this.y + sh.y;

            const bl = Math.hypot(sh.vx, sh.vy) * sh.len * 0.35;
            const ang = Math.atan2(sh.vy, sh.vx);

            ctx.moveTo(sx - Math.cos(ang) * bl, sy - Math.sin(ang) * bl);
            ctx.lineTo(sx, sy);

        }

        ctx.stroke();

    }

}


/* ===================================================
   SUPERNOVA SHOCKWAVE
=================================================== */

class NovaRing {

    constructor(delay, thickness, speed) {

        this.delay = delay;
        this.radius = 0;
        this.thickness = thickness;
        this.speed = speed;
        this.alpha = 1;
        this.dead = false;

    }

    update(dt) {

        if (this.delay > 0) {

            this.delay -= dt;

            // Nothing left over yet -- wait for the next frame
            if (this.delay > 0) return;

            // Spend only the part of this frame that falls after
            // the delay ended, so radius can never go negative
            dt = -this.delay;
            this.delay = 0;

        }

        this.radius += this.speed * dt;
        this.alpha -= dt / 2600;

        if (this.radius < 0) this.radius = 0;
        if (this.alpha <= 0) this.dead = true;


    }

    draw() {

        if (this.delay > 0 || this.alpha <= 0 || this.radius <= 0) return;


        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        ctx.strokeStyle = `rgba(150,225,255,${this.alpha})`;
        ctx.lineWidth = this.thickness;

        ctx.beginPath();
        ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Leading edge, brighter
        ctx.strokeStyle = `rgba(255,255,255,${this.alpha * 0.8})`;
        ctx.lineWidth = Math.max(1, this.thickness * 0.3);

        ctx.beginPath();
        ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

    }

}


/* ===================================================
   CORE RENDERING  -- plasma surface
=================================================== */

function drawCore(now) {

    // On white, additive glow renders as nothing. Draw the core as
    // a solid orb instead -- which is exactly how it reads in the
    // reference artwork anyway.
    if (engine.invert > 0.02) {

        const rr = Math.max(engine.coreRadius, 6);
        const v = Math.min(1, engine.invert);

        ctx.save();

        const g = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, rr
        );

        g.addColorStop(0.00, "#dff4ff");
        g.addColorStop(0.28, "#5ec8f5");
        g.addColorStop(0.72, "#0b3fa8");
        g.addColorStop(1.00, "#04123f");

        ctx.globalAlpha = v;
        ctx.fillStyle = g;

        ctx.beginPath();
        ctx.arc(centerX, centerY, rr, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Skip the dark-world glow entirely once fully flipped
        if (v >= 0.98) return;

    }


    // The pulse boost inflates the drawn core while comets are
    // striking it. That made the core SHRINK by ~11px the moment
    // the barrage stopped -- which is exactly when the explosion
    // fires, so it never looked full size. The boost is therefore
    // folded into coreRadius growth instead of added on top once
    // the core is complete.
    // Fade the boost out as the core approaches full size, rather
    // than cutting it off at the cap. A hard cutoff made the core
    // drop ~10px in a single frame right before the explosion.
    const fill = engine.coreMaxRadius > 0
        ? engine.coreRadius / engine.coreMaxRadius
        : 0;

    // Full effect below 70%, tapering to nothing at 100%
    const taper = fill < 0.70
        ? 1
        : Math.max(0, 1 - (fill - 0.70) / 0.30);

    const r = engine.coreRadius + engine.corePulseBoost * 0.12 * taper;

    if (r <= 0) return;

    const t = now * 0.001 + engine.corePlasmaSeed;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // Outer halo.
    //
    // This drew unconditionally at r*4 despite HALO_ENABLED being
    // false — a big soft blue disc sitting BEHIND the charge
    // pulses. The waves then travelled across it, which is what
    // made the middle of the frame look smeared and dirty during
    // the cascade. The pulses and the core read better against
    // clean black, so it is now actually gated by the flag.
    if (HALO_ENABLED) {

        const halo = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, r * 4
        );

        halo.addColorStop(0.0, "rgba(120,220,255,0.5)");
        halo.addColorStop(0.35, "rgba(60,150,240,0.18)");
        halo.addColorStop(1.0, "rgba(20,60,180,0)");

        ctx.fillStyle = halo;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r * 4, 0, Math.PI * 2);
        ctx.fill();

    }

    // Churning plasma cells
    const cells = 7;

    for (let i = 0; i < cells; i++) {

        const phase = t * (0.5 + i * 0.13) + i * 2.1;

        const drift = r * 0.42;

        const px = centerX + Math.cos(phase) * drift * Math.sin(phase * 0.7);
        const py = centerY + Math.sin(phase * 1.3) * drift * Math.cos(phase * 0.5);

        const cellR = r * (0.5 + 0.3 * Math.sin(phase * 1.7));

        const cell = ctx.createRadialGradient(px, py, 0, px, py, cellR);

        cell.addColorStop(0.0, "rgba(255,255,255,0.34)");
        cell.addColorStop(0.4, "rgba(120,230,255,0.16)");
        cell.addColorStop(1.0, "rgba(40,120,220,0)");

        ctx.fillStyle = cell;

        ctx.beginPath();
        ctx.arc(px, py, cellR, 0, Math.PI * 2);
        ctx.fill();

    }

    // Hot centre
    const centreGrad = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, r
    );

    centreGrad.addColorStop(0.0, "#ffffff");
    centreGrad.addColorStop(0.25, "rgba(220,250,255,0.9)");
    centreGrad.addColorStop(0.6, "rgba(90,200,255,0.45)");
    centreGrad.addColorStop(1.0, "rgba(30,90,200,0)");

    ctx.fillStyle = centreGrad;

    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.fill();

    // Impact wave.
    // coreWave now ACCUMULATES past 1 when strikes land in quick
    // succession, so (1 - coreWave) can go negative and the old
    // formula produced a negative radius. Clamp the driver, and
    // guard the radius itself.
    if (engine.coreWave > 0.01) {

        const w = Math.min(1, engine.coreWave);

        const waveR = Math.max(0, r * (1 + (1 - w) * 5));

        if (waveR > 0) {

            ctx.strokeStyle = `rgba(180,240,255,${Math.min(1, w) * 0.6})`;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.arc(centerX, centerY, waveR, 0, Math.PI * 2);
            ctx.stroke();

        }

    }

    // ==================================================
    // ANAMORPHIC LENS FLARE
    //
    // What sells a blown-out light source is not the orb -- it is
    // the optics AROUND it: a long horizontal streak, a starburst
    // of fine spikes, and a wide soft bloom. Intensity is driven
    // by how charged the core is, so it grows with the sequence
    // and spikes on every comet strike.
    // ==================================================

    // Additive light reads as nothing on white and muddies the
    // transition, so the flare fades out as the world flips.
    const flareFade = 1 - Math.min(1, engine.invert / 0.6);

    if (CONFIG.FLARE_ENABLED && flareFade > 0.01) {

        drawAnamorphic(
            centerX,
            centerY,
            r,
            now,
            Math.min(1.6, 0.55 + fill * 0.85 + engine.coreWave * 0.55)
                * flareFade
                * CONFIG.FLARE_STRENGTH
        );

    }

    ctx.restore();

}


/* ===================================================
   ANAMORPHIC FLARE
   Horizontal streak + starburst spikes + bloom.
=================================================== */

function drawAnamorphic(cx, cy, r, now, intensity) {

    if (intensity <= 0.01 || r <= 0) return;

    const t = now * 0.001;

    // Subtle breathing so the flare never looks like a static
    // decal pasted over the core
    const breathe = 0.92 + Math.sin(t * 1.7) * 0.05
                         + Math.sin(t * 0.9) * 0.03;

    const I = intensity * breathe;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // --- Bloom halo --------------------------------------------
    // Deliberately TIGHT. An earlier version used 9x the core
    // radius, which covered most of the frame — laid over the
    // starfield, dust and rings it lifted the entire background
    // into a blue haze and every additive layer above it stacked
    // on that raised floor. The bloom belongs close to the source.
    const bloomR = r * 3.2;

    const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);

    bloom.addColorStop(0.00, `rgba(190,235,255,${0.20 * I})`);
    bloom.addColorStop(0.22, `rgba(95,195,255,${0.10 * I})`);
    bloom.addColorStop(0.55, `rgba(45,130,240,${0.03 * I})`);
    bloom.addColorStop(1.00, "rgba(10,40,140,0)");

    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx, cy, bloomR, 0, Math.PI * 2);
    ctx.fill();

    // --- Horizontal anamorphic streak --------------------------
    // The signature element. Drawn as three stacked bars of
    // decreasing height and increasing brightness so it has a
    // soft body with a hot filament through the middle, instead
    // of being one flat rectangle.
    // Span pulled well in. At 9.5x this crossed the entire ring
    // system and read as a bar laid over the artwork rather than
    // light coming off the core.
    const span = r * 4.6 * (0.85 + I * 0.25);

    const bars = [
        [span * 1.00, r * 0.46, 0.10, "120,205,255"],
        [span * 0.78, r * 0.20, 0.18, "180,230,255"],
        [span * 0.55, r * 0.08, 0.34, "235,250,255"]
    ];

    for (let i = 0; i < bars.length; i++) {

        const [w, h, a, col] = bars[i];

        const g = ctx.createLinearGradient(cx - w, 0, cx + w, 0);

        g.addColorStop(0.00, `rgba(${col},0)`);
        g.addColorStop(0.26, `rgba(${col},${a * I * 0.35})`);
        g.addColorStop(0.50, `rgba(${col},${a * I})`);
        g.addColorStop(0.74, `rgba(${col},${a * I * 0.35})`);
        g.addColorStop(1.00, `rgba(${col},0)`);

        ctx.fillStyle = g;
        ctx.fillRect(cx - w, cy - h / 2, w * 2, h);

    }

    // Hot white filament dead centre
    const fil = ctx.createLinearGradient(cx - span * 0.62, 0, cx + span * 0.62, 0);
    fil.addColorStop(0.00, "rgba(255,255,255,0)");
    fil.addColorStop(0.50, `rgba(255,255,255,${Math.min(1, 0.85 * I)})`);
    fil.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.fillStyle = fil;
    ctx.fillRect(cx - span * 0.62, cy - r * 0.035, span * 1.24, r * 0.07);

    // --- Starburst spikes --------------------------------------
    // Fine rays at irregular angles and lengths. Irregularity is
    // what stops it reading as a mechanical asterisk — real optics
    // never produce evenly spaced identical spikes.
    const SPIKES = 28;

    ctx.lineCap = "round";

    for (let i = 0; i < SPIKES; i++) {

        // Deterministic pseudo-random per spike, so they stay put
        // frame to frame rather than shimmering randomly
        const seed = Math.sin(i * 12.9898) * 43758.5453;
        const jit  = seed - Math.floor(seed);

        const ang = (i / SPIKES) * Math.PI * 2 + jit * 0.22;

        // Slow independent flicker per spike
        const flick = 0.72 + 0.28 * Math.sin(t * (1.1 + jit * 2.2) + i);

        // Vertical-ish spikes are shortened; the horizontal axis
        // already belongs to the anamorphic streak
        const axis = 0.45 + 0.55 * Math.abs(Math.cos(ang));

        const len = r * (1.5 + jit * 2.3) * axis * flick * (0.7 + I * 0.5);

        if (len <= r) continue;

        const ex = cx + Math.cos(ang) * len;
        const ey = cy + Math.sin(ang) * len;

        const g = ctx.createLinearGradient(cx, cy, ex, ey);

        g.addColorStop(0.00, `rgba(255,255,255,${0.42 * I * flick})`);
        g.addColorStop(0.18, `rgba(200,235,255,${0.22 * I * flick})`);
        g.addColorStop(0.55, `rgba(120,195,255,${0.07 * I * flick})`);
        g.addColorStop(1.00, "rgba(60,150,255,0)");

        ctx.strokeStyle = g;
        ctx.lineWidth = Math.max(0.6, r * 0.030 * (0.45 + jit));

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

    }

    // --- Core overexposure -------------------------------------
    // A tight white blowout at the very centre. This is what makes
    // the middle read as clipped-to-white rather than pale blue.
    const hot = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.5);

    hot.addColorStop(0.00, `rgba(255,255,255,${Math.min(1, 0.95 * I)})`);
    hot.addColorStop(0.35, `rgba(225,245,255,${0.45 * I})`);
    hot.addColorStop(1.00, "rgba(120,200,255,0)");

    ctx.fillStyle = hot;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

}


/* ===================================================
   SPAWNING
=================================================== */

function spawnShooter() {
    engine.shooters.push(new Shooter("FALL"));
}

function spawnVortexBody() {

    // Hard ceiling on the standing swirl. Bodies survive after the
    // cascade now, so without this the population grows unbounded
    // and the framerate goes with it.
    // Sparse. This is a scattering of distant stars orbiting the
    // whole system, not a dense stream of debris.
    //
    // Count only the distant stars against this cap. Inner shell
    // feeders are transient and would otherwise fill every slot
    // during the cascade, leaving no stars at all afterwards.
    let stars = 0;

    for (const sh of engine.shooters) {
        if (sh.outer) stars++;
    }

    if (stars >= 26) return;

    // Prefer shells that have NOT locked yet. Late in the cascade
    // most shells are done, so aiming at random ones meant almost
    // every new body died on arrival and the swirl emptied out
    // exactly as the wordmark was landing.
    const open = [];

    for (let i = 1; i <= 11; i++) {
        if (engine.rings[i] && !engine.rings[i].locked) open.push(i);
    }

    let shell;

    if (open.length) {

        // Bias toward the inner unlocked shells so they still
        // fill and lock in order
        const pick = Math.floor(Math.pow(Math.random(), 1.5) * open.length);

        shell = open[Math.min(pick, open.length - 1)];

    } else {

        // Everything is home. The rings are opaque sprites drawn
        // over the swirl, so matter orbiting INSIDE them is almost
        // invisible — which is why the spin appeared to stop.
        // Send it to the rim and beyond instead.
        engine.shooters.push(new Shooter("VORTEX", 11, true));

        return;

    }

    engine.shooters.push(new Shooter("VORTEX", Math.min(shell, 11)));

}

function spawnDust(count) {

    for (let i = 0; i < count; i++) {
        engine.dust.push(new Dust());
    }

}

function ignite() {

    if (engine.ignited) return;

    engine.ignited = true;

    engine.novaFlash = 1;

    // A spark, not a disc. Everything after this is built by
    // the comets striking it.
    engine.coreRadius = 4;

    // The blast throws matter outward, which immediately falls
    // back in — comets are inbound on the same frame as the flash
    for (let i = 0; i < 10; i++) {
        spawnShooter();
    }

    // No shockwave rings — they read as fake. Pure light instead.

    // Same flare + streak vocabulary as the logo detonation
    burst(centerX, centerY, Math.max(width, height) * 0.70, 280, width * 0.82, 1500);


}


function burst(x, y, reach, streakCount, flareSpan, flareLife) {


    engine.flares.push(new Flare(x, y, flareSpan, flareLife));

    for (let i = 0; i < streakCount; i++) {
        engine.streaks.push(new Streak(x, y, reach));
    }

}


function detonateLogo(now) {


    if (engine.logoDetonated || !engine.logoReady) return;

    engine.logoDetonated = true;

    // The barrage is over. Anything still inbound is consumed
    // by the blast rather than flying through the logo.
    engine.shooters = [];

    // NOTE: the logo particles are NOT spawned here. The blast
    // gets the frame to itself first, then the particles form
    // once the light has thrown. See spawnLogoWave().
    engine.particles = [];


    // The core is ALREADY full — the comets built it. The blast
    // does not grow it; it just detonates around a finished core.
    engine.coreExpanding = true;
    engine.coreRadius = engine.coreMaxRadius;

    // Ring 01 IS the big blue orb. Locking it here means the
    // finished core is present the instant the blast fires,
    // instead of fading in seven seconds later during RING_ZERO
    // and looking like the core randomly grew.
    for (let i = 0; i <= 1; i++) {

        if (engine.rings[i] && !engine.rings[i].locked) {
            engine.rings[i].lock(now);
        }

    }

    engine.novaFlash = 1;
    engine.corePulseBoost += 40;
    engine.coreWave = 1;
    engine.ringWave = 1;

    burst(centerX, centerY, Math.max(width, height) * 0.75, 460, width * 0.85, 1500);

    // Secondary waves -- the blast keeps throwing light
    setTimeout(() => {
        burst(centerX, centerY, Math.max(width, height) * 0.55, 220, width * 0.60, 1000);
    }, 130);

    setTimeout(() => {
        burst(centerX, centerY, Math.max(width, height) * 0.40, 140, width * 0.42, 800);
    }, 300);

    // Standing swarm that lives around the finished mark.
    // Disabled — see MOTES_ENABLED.
    engine.motes = [];

    if (MOTES_ENABLED) {

        for (let i = 0; i < 520; i++) {
            engine.motes.push(new Mote());
        }

    }

}


// The mark is not thrown all at once. It builds in waves, one
// per rotation of the swirl, so you watch the wordmark accumulate
// rather than appear. ASSEMBLY_WAVES controls how many passes.
// How far the comets alone can build the core, as a fraction of
// its final size. The second detonation completes it.
// The comets build the core ALL THE WAY. By the time the second
// explosion fires, the blue core is already at its finished size --
// the blast does not grow it, it simply happens around it.
const CORE_PRE_BANG_CAP = 1.0;

// Backlight halo behind the wordmark. Disabled for now.
const HALO_ENABLED = false;

// How long the core gathers energy before the reveal blast
// How long the finished ring system holds, completely still,
// after the last ring locks and before the core begins to
// wind up for the detonation. The blast should feel like a
// separate event, not the tail of the cascade.
const POST_CASCADE_HOLD = 700;   // WEB CUT (master 2000)

const CHARGE_MS = 1600;

// How long the mark holds before the finale begins
const FINALE_HOLD_MS = 700;    // WEB CUT (master 2600)

// The wind-up for the final detonation
const FINALE_CHARGE_MS = 900;  // WEB CUT (master 1900)

// How long the world takes to drift from black to white.
// Was effectively 900ms and locked to the flash, which read as a
// hard cut. Long enough here that the change is felt rather than
// seen happening.
const INVERT_MS = 1400;        // WEB CUT (master 3400)

// Peak opacity of the finale veil. Below 1 so the flash never
// fully blows out the frame -- the composition stays visible
// through it, which is what keeps the ending calm.
const FLASH_PEAK = 0.72;


/* ===================================================
   RING LOCK PULSES

   Each shell is locked by a wave of light thrown from
   the core. RING_PULSES_VISIBLE controls whether that
   wave is DRAWN, and whether the core kicks as it is
   thrown.

   false -- the rings simply take their colour in
           sequence, with no wave and no core flash.
           Much calmer; the cascade reads as the system
           quietly resolving rather than as twelve
           separate detonations.

   The pulse objects still exist either way, because
   their arrival is what times each ring's lock. Only
   the visuals are suppressed.
=================================================== */

const RING_PULSES_VISIBLE = false;


/* ===================================================
   RING CONJURING

   Each shell arrives spinning violently -- as though it
   were pulled through from somewhere else -- and brakes
   hard into its predetermined speed.

   The old values (3.2x over a 6s cubic decay) spread
   the change so thin that a ring shed only a third of
   its speed in the first full second, which read as
   "slightly fast at first" rather than as an arrival.
=================================================== */

// How much faster than its resting speed a ring is born
const CONJURE_SPEED = 14.0;

// Floor, so even the slowest rings arrive with real
// violence rather than scaling down to nothing.
// Raised: at 0.0090 the slow shells (7, 8, 10) arrived
// at only 13-16 deg/frame while the core hit 76, so they
// drifted into place while everything else whipped.
const CONJURE_FLOOR = 0.0290;

// Per-ring arrival drama. Some shells are deliberately
// wilder than others so the cascade does not read as
// twelve identical events. Multiplies that ring's birth
// speed only -- resting speed is untouched.
const CONJURE_DRAMA = [
    1.00,   // 0  core    already the fastest thing in frame
    0.85,   // 1          restrained, it sits under the core
    1.35,   // 2          first big whip
    0.95,   // 3
    1.55,   // 4          wild
    1.10,   // 5
    1.30,   // 6
    1.70,   // 7          was one of the slowest -- now a standout
    1.45,   // 8          likewise
    1.15,   // 9
    1.80,   // 10         slowest at rest, most violent arrival
    1.50    // 11 rim     the rim should announce itself
];

// How long the brake takes. Short -- the drama is in the
// deceleration being FELT, not in it lasting.
const CONJURE_BRAKE_MS = 1500;

// Curve of the brake. Higher = more of the slowdown
// happens in the first few frames.
const CONJURE_CURVE = 5.5;


/* ===================================================
   FINALE TRANSITION STYLE

   "FLASH"  -- the existing one. A bright veil marks the
              moment, and the world drifts to white
              underneath it.

   "DAWN"   -- no flash at all. The core simply swells
              and its own light floods outward until it
              has filled the frame, and the world is
              white. Slower, quieter, and the mark never
              disappears behind a white-out. Choose this
              if the ending should feel inevitable
              rather than announced.
=================================================== */

const TRANSITION_STYLE = "DAWN";

// DAWN takes longer, because nothing is hiding the change
const DAWN_MS = 1800;          // WEB CUT (master 5200)

const ASSEMBLY_WAVES = 4;

// Roughly one orbit of the swirl at the wordmark radius
const ASSEMBLY_ROTATION = 480;

function spawnLogoWave() {

    // Disabled -- the wordmark is a ring now, not a particle cloud.
    return;

    /* eslint-disable no-unreachable */
    if (!engine.logoReady) return;
    if (engine.waveIndex >= ASSEMBLY_WAVES) return;

    const total = engine.logoPixels.length;

    // Shuffle once so each wave is scattered across the whole
    // wordmark instead of filling it left to right
    if (!engine.pixelOrder) {

        engine.pixelOrder = engine.logoPixels.slice();

        for (let i = engine.pixelOrder.length - 1; i > 0; i--) {

            const j = (Math.random() * (i + 1)) | 0;

            const t = engine.pixelOrder[i];
            engine.pixelOrder[i] = engine.pixelOrder[j];
            engine.pixelOrder[j] = t;

        }

    }

    const per = Math.ceil(total / ASSEMBLY_WAVES);

    const start = engine.waveIndex * per;
    const end = Math.min(total, start + per);

    for (let i = start; i < end; i++) {
        engine.particles.push(new Particle(engine.pixelOrder[i]));
    }

    engine.waveIndex++;

    if (engine.waveIndex >= ASSEMBLY_WAVES) {
        engine.particlesSpawned = true;
    }

}



/* ===================================================
   TIMELINE DRIVER
=================================================== */

let torrentAccumulator = 0;
let fallAccumulator = 0;

function updateTimeline(dt, now) {

    const e = engine.elapsed;

    // --- ACT 0  PRELUDE ----------------------------

    if (e < T.IGNITION) {

        engine.phase = "PRELUDE";

        engine.coreRadius = 0;

        return;

    }

    // --- ACT 1  IGNITION ---------------------------

    if (e < T.FIRST_FALL) {

        engine.phase = "IGNITION";

        ignite();

        // The core is NOT grown on a timer here. It is born as a
        // spark and every comet strike builds it from there, so
        // its growth always reads as a consequence of impacts.

        return;

    }


    // --- ACT 2  FIRST FALL -------------------------
    // One comet. Then two. The core notices.

    if (e < T.TORRENT) {

        engine.phase = "FIRST_FALL";

        fallAccumulator += dt;

        // One comet, then two, then a handful -- but arriving
        // quickly enough that the core is never idle
        const p = (e - T.FIRST_FALL) / (T.TORRENT - T.FIRST_FALL);
        const gap = 120 - p * 84;

        if (fallAccumulator > gap) {

            fallAccumulator = 0;

            // Occasional pairs so it doesn't feel metronomic
            spawnShooter();

            if (p > 0.45 && Math.random() < 0.5) {
                spawnShooter();
            }

        }

        return;

    }

    // --- ACT 3  TORRENT ----------------------------
    // Pure bombardment. No orbiting yet — nothing has told
    // this matter to swirl. It just falls, and the core grows.

    if (e < T.CORE_FULL) {

        engine.phase = "TORRENT";

        const progress = (e - T.TORRENT) / (T.CORE_FULL - T.TORRENT);

        // WEB CUT: torrent window is ~4.7x shorter than the master.
        // Impact growth converges at 0.020/hit (~148 hits to fill) and
        // can no longer finish in time, which would leave a stunted
        // core with no visible cause. Floor tracks the act; impacts
        // still visibly kick the core above it.
        if (!engine.coreExpanding) {
            const floor = engine.coreMaxRadius * CORE_PRE_BANG_CAP *
                          Math.pow(Math.min(1, progress), 0.85);
            if (engine.coreRadius < floor) engine.coreRadius = floor;
        }

        // Exponential ramp: a trickle, then a stream, then a wall.
        // 1 -> 2 -> 5 -> 10 -> hundreds, as you described.
        // Two distinct surges. The first builds the core to
        // roughly two thirds, eases off so the growth is legible,
        // then a second heavier wave finishes the job.
        let intensity;

        if (progress < 0.30) {

            // First surge
            intensity = Math.pow(progress / 0.30, 1.8);

        } else if (progress < 0.42) {

            // Lull — the core sits and glows, growth visible
            const t = (progress - 0.30) / 0.12;
            intensity = 1 - t * 0.70;

        } else if (progress < 0.86) {

            // Second surge, heavier and longer -- this is what
            // drives the core the rest of the way to full size
            const t = (progress - 0.42) / 0.44;
            intensity = 0.30 + Math.pow(t, 1.3) * 0.70;

        } else {

            // Wind down so the last comets land before the bang
            const t = (progress - 0.86) / 0.14;
            intensity = 1 - Math.pow(t, 2.2) * 0.99;

        }

        const interval = Math.max(3.5, 480 - intensity * 476.5);

        torrentAccumulator += dt;

        let guard = 0;

        while (torrentAccumulator > interval && guard < 40) {

            torrentAccumulator -= interval;
            guard++;

            // Everything is an impactor during the barrage
            spawnShooter();

        }

        return;

    }

    // --- ACT 3b  CORE FULL -------------------------
    // No new comets. The last ones land, the core sits at
    // full size, and the frame holds its breath.

    if (e < T.REVELATION) {

        engine.phase = "CORE_FULL";

        // Settle onto the pre-bang ceiling and wait. The core is
        // NOT full yet — the second detonation finishes it.
        if (!engine.coreExpanding) {

            const ceiling = engine.coreMaxRadius * CORE_PRE_BANG_CAP;

            engine.coreRadius += (ceiling - engine.coreRadius) * 0.08;

        }


        return;

    }

    // --- ACT 4  REVELATION -------------------------
    // The logo detonates. Everything after this is a consequence.

    if (e < T.VORTEX) {

        engine.phase = "REVELATION";

        // Blast only. The mark is NOT formed here — the logo is
        // the final payoff, assembled from the swirling matter
        // once every ring is home.
        detonateLogo(now);

        return;

    }

    // --- ACT 4b  GRAVITY ---------------------------
    // The explosion gave the system mass. Now matter orbits —
    // but only once the mark has fully fallen into place, so the
    // two events never overlap.

    if (e < T.RING_ZERO) {

        engine.phase = "VORTEX";

        const progress = (e - T.VORTEX) / (T.RING_ZERO - T.VORTEX);

        torrentAccumulator += dt;

        // A LOT of matter -- the rings are going to be made of this,
        // so the shells need to look genuinely populated first.
        const interval = Math.max(5, 34 - progress * 29);  // WEB CUT

        let guard = 0;

        while (torrentAccumulator > interval && guard < 24) {

            torrentAccumulator -= interval;
            guard++;

            spawnVortexBody();

        }

        return;

    }

    // --- ACT 4c  RING ZERO -------------------------
    // The comets built this disc. It now takes on its colour and
    // holds alone for a beat before the shells follow.

    if (e < T.CASCADE) {

        engine.phase = "RING_ZERO";

        // Ring 0 already locked at the detonation. This act is
        // now purely the held beat before the shells follow.

        // Matter keeps swirling through the held beat
        torrentAccumulator += dt;

        let zguard = 0;

        while (torrentAccumulator > 26 && zguard < 10) {

            torrentAccumulator -= 52;
            zguard++;

            spawnVortexBody();

        }

        return;

    }

    // --- ACT 5  CASCADE ----------------------------

    if (e < T.ASSEMBLY) {

        engine.phase = "CASCADE";

        // Keep matter flowing so each ring visibly condenses
        // out of an occupied shell rather than appearing in a void
        torrentAccumulator += dt;

        let vguard = 0;

        while (torrentAccumulator > 24 && vguard < 10) {

            torrentAccumulator -= 48;
            vguard++;

            spawnVortexBody();

        }

        // Ring 0 is the solid blue disc at the centre — the
        // energy core itself. It locks FIRST, then the shells
        // spread outward from it.
        const due = Math.floor((e - T.CASCADE) / T.RING_STEP);

        // Rings 0 and 1 both locked at the detonation — ring 1 sits
        // so close to the core that its arrival read as the core
        // growing. The cascade therefore starts at ring 2.
        for (let i = 2; i <= Math.min(due + 2, 11); i++) {

            const ring = engine.rings[i];

            // Each shell is charged by a pulse of light thrown from
            // the core. The ring colorizes when the pulse ARRIVES,
            // so the energy visibly causes the lock.
            if (!ring.locked && !ring.charging) {

                ring.charging = true;

                // Farther shells take longer, but not linearly --
                // the pulse accelerates as it goes
                // Far quicker: the pulse should crack outward,
                // not glide. Roughly a third of the old flight time.
                const travel = 105 + Math.pow(i / 11, 0.75) * 165;

                engine.pulses.push(
                    new ChargePulse(i, ringRadius(i), travel, now)
                );

                // The core kick that accompanied every ejection.
                // Suppressed with the pulse visuals -- without it
                // the core would still thump twelve times while
                // nothing visible left it, which reads as an
                // unexplained flicker.
                if (RING_PULSES_VISIBLE) {

                    engine.corePulseBoost = Math.min(
                        110, engine.corePulseBoost + 58
                    );

                    engine.coreWave = Math.min(1.6, engine.coreWave + 1.2);

                    engine.novaFlash = Math.max(engine.novaFlash, 0.30);

                    engine.coreLaunch = 1;

                }

            }

        }

        // Every ring is home. The core now starts drawing energy
        // in, builds to a detonation, and the wordmark is revealed
        // by the flash itself -- nothing fades, nothing assembles.
        // The detonation must not tread on the cascade. This fired
        // as soon as the LAST RING WAS DUE, which is before that
        // ring has finished braking into place -- so the blast
        // overlapped the final arrival.
        //
        // It now waits for the twelfth ring to actually lock, and
        // then holds a further POST_CASCADE_HOLD so the finished
        // system is seen at rest before anything happens to it.
        if (!engine.charging && !engine.logoLocked && due + 2 >= 12) {

            if (engine.ringsLocked >= 12) {

                if (!engine.cascadeDoneAt) {
                    engine.cascadeDoneAt = now;
                }

                if (now - engine.cascadeDoneAt >= POST_CASCADE_HOLD) {

                    engine.charging = true;
                    engine.chargeStart = now;

                }

            }

        }

        return;

    }

    // --- ACT 6  ASSEMBLY ---------------------------
    // Every ring is home. The swirling matter now condenses onto
    // the mark. No new burst — the swirl simply resolves.

    if (e < T.STILLNESS) {

        engine.phase = "ASSEMBLY";

        // No particle assembly. The wordmark locked in as the 13th
        // ring during the cascade; this act simply lets the matter
        // keep spinning while it fades up and takes colour.

        // The swirl keeps feeding, thinner than before
        torrentAccumulator += dt;

        let aguard = 0;

        while (torrentAccumulator > 48 && aguard < 8) {

            torrentAccumulator -= 48;
            aguard++;

            spawnVortexBody();

        }

        return;

    }

    // --- ACT 7  STILLNESS --------------------------

    engine.phase = "STILLNESS";

    // The mark has assembled out of the swirl. It now solidifies
    // and takes on its full colour.
    engine.logoResolve = Math.min(
        1,
        engine.logoResolve + dt / 1800
    );

    // The backlight is the very last thing, once the mark is solid
    if (engine.logoResolve > 0.9) {

        engine.logoBacklight = Math.min(
            1,
            engine.logoBacklight + dt / 2200
        );

    }


    // Core disc locks last
    // Safety net only -- ring 0 normally locks first in the cascade
    if (!engine.rings[0].locked) {
        engine.rings[0].lock(now);
    }

    // No more comets. The system is finished and at rest --
    // a slow orbital drift only.
    torrentAccumulator += dt;

    if (torrentAccumulator > 120 && engine.shooters.length < 150) {

        torrentAccumulator = 0;
        spawnVortexBody();

    }

}


/* ===================================================
   UPDATE
=================================================== */

function update(dt, now) {

    engine.elapsed += dt;

    // The composition is now LOCKED through the finale. The badge
    // overlays the rings rather than stacking beneath them, so
    // nothing needs to move aside -- the core and mark hold the
    // exact position and size they had on the black screen.
    centerY = height * (0.5 - CONFIG.LOGO_HEADROOM * 0.42);

    updateTimeline(dt, now);

    // Decays
    engine.corePulseBoost *= 0.94;
    engine.coreWave *= 0.965;

    engine.ringWave *= 0.965;
    engine.novaFlash *= 0.92;

    // Starfield
    for (const star of engine.starfield) {
        star.update(dt);
    }

    // Dust
    for (const d of engine.dust) {
        d.update();
    }

    // Nova rings
    for (const nr of engine.novaRings) {
        nr.update(dt);
    }

    compactInPlace(engine.novaRings, ALIVE.notDead);

    // Impacts
    for (const im of engine.impacts) {
        im.update();
    }

    compactInPlace(engine.impacts, ALIVE.notDead);

    // Core shockwaves, one per strike
    for (const h of engine.coreHits) {
        h.life -= h.decay;
    }

    compactInPlace(engine.coreHits, ALIVE.hasLife);

    // Prelude sparks. The hero star does not vanish at ignition --
    // it holds through the first comet strikes and hands over to
    // the blue core as the impacts build it up.
    if (engine.sparks.length) {

        for (const sp of engine.sparks) {
            sp.update(dt, engine.elapsed);
        }

        // Companions clear at ignition; the star lingers
        if (engine.ignited && engine.phase !== "IGNITION") {

            compactInPlace(engine.sparks, ALIVE.isHero);

        }

        // Once the core has grown into a real disc, the star is
        // redundant -- release it
        if (engine.coreRadius > engine.coreMaxRadius * 0.42) {
            engine.sparks = [];
        }

    }

    // Logo swarm
    if (engine.logoDetonated) {

        for (const m of engine.motes) {
            m.update();
        }

    }

    // Flares
    for (const f of engine.flares) {

        f.update(dt);
    }

    compactInPlace(engine.flares, ALIVE.notDead);

    // Streaks
    for (const st of engine.streaks) {
        st.update();
    }

    compactInPlace(engine.streaks, ALIVE.notDead);


    // Shooters
    for (const s of engine.shooters) {
        s.update(dt);
    }

    compactInPlace(engine.shooters, ALIVE.notDead);

    // Particles
    // Once logoSettle hits 1 the swarm is fully transparent, so
    // updating and drawing it is pure waste. Release it.
    if (engine.logoDetonated && engine.particles.length) {

        if (engine.logoSettle >= 1 && engine.logoColour >= 1) {

            engine.particles = [];

        } else {

            for (const p of engine.particles) {
                p.update();
            }

        }

        // Every particle placed? Only then does the mark take colour.
        if (!engine.logoComplete && engine.particlesSpawned &&
            engine.particles.length) {

            let allLocked = true;

            for (const p of engine.particles) {
                if (!p.locked) { allLocked = false; break; }
            }

            if (allLocked) engine.logoComplete = true;

        }

        // Once complete, the whole wordmark turns colour together
        if (engine.logoComplete && engine.logoColour < 1) {
            engine.logoColour = Math.min(1, engine.logoColour + dt / 900);
        }

        // Once the swarm has arrived, dissolve into the clean SVG.
        // Only meaningful once the mark has resolved — before that
        // the pixels are deliberately hovering off their marks.
        let settled = 0;

        for (const p of engine.particles) {
            if (Math.hypot(p.targetX - p.x, p.targetY - p.y) < 3) settled++;
        }

        // Guard: during the gap between the blast and the mark
        // forming, the array is legitimately empty. Treating that
        // as "fully settled" would fade the SVG in early.
        const ratio = engine.particles.length
            ? settled / engine.particles.length
            : (engine.particlesSpawned ? 1 : 0);

        // The clean SVG only fades in once the particles have
        // already taken their colour, so there is a single clean
        // transition rather than white -> tint -> SVG.
        if (engine.logoColour >= 1) {
            engine.logoSettle = Math.min(1, engine.logoSettle + dt / 300);
        }

    }


    // Charge pulses racing out to their shells
    for (const pulse of engine.pulses) {

        pulse.update(now);

        // The shell colorizes as the wavefront passes it, not
        // when the wave finally leaves the frame
        if (pulse.delivered) {

            const ring = engine.rings[pulse.index];

            if (ring && !ring.locked) {
                ring.lock(now);
            }

        }

    }

    compactInPlace(engine.pulses, ALIVE.notDone);

    // Rings
    for (const ring of engine.rings) {
        ring.update(dt, now);
    }

    // Energy gathering in the core before the reveal
    if (engine.charging && !engine.logoLocked) {

        const age = now - engine.chargeStart;

        engine.charge = Math.min(1, age / CHARGE_MS);

        // The core tightens and brightens as it winds up
        engine.corePulseBoost = Math.max(
            engine.corePulseBoost,
            Math.pow(engine.charge, 2.5) * 46
        );

        // Detonate
        if (engine.charge >= 1) {

            engine.logoLocked = true;
            engine.logoLockTime = now;

            // The mark must NOT be visible at the instant the
            // blast fires. It was being set to full alpha on the
            // same frame as revealFlash, and because the wordmark
            // is drawn UNDERNEATH the flash overlay, it showed for
            // several frames before the white had spread far
            // enough to cover it -- so the logo appeared just
            // BEFORE the explosion instead of out of it.
            //
            // It now starts hidden and is revealed by the flash as
            // that flash decays. See the logoAlpha ramp below.
            engine.logoAlpha = 0;
            engine.logoColour = 1;
            engine.logoBurst = 0;

            engine.charging = false;

            // ==============================================
            // ATOMIC DETONATION
            //
            // Sequenced like a bomb, not a single pop:
            //
            //   t+0     blinding flash from the core
            //   t+0..   shock rings tear outward, staggered so
            //           the wavefront reads as a ripple rather
            //           than one expanding circle
            //   t+~600  the white peaks and burns off
            //   t+~700  the mark emerges from inside it
            //
            // The NovaRing class already existed but was never
            // spawned anywhere -- this is what it was built for.
            // ==============================================

            engine.revealFlash = 1;
            engine.novaFlash = 1;

            engine.coreWave = 1.6;
            engine.ringWave = 1;
            engine.corePulseBoost = 130;

            // The shockwave: several rings launched from the core
            // at staggered delays, thicknesses and speeds. The
            // stagger is what makes it ripple -- a single ring is
            // just a circle getting bigger.
            const reach = Math.hypot(width, height);

            engine.novaRings.push(new NovaRing(0,    46, reach / 1150));
            engine.novaRings.push(new NovaRing(90,   30, reach / 1400));
            engine.novaRings.push(new NovaRing(200,  20, reach / 1750));
            engine.novaRings.push(new NovaRing(340,  13, reach / 2200));
            engine.novaRings.push(new NovaRing(520,   8, reach / 2800));

            burst(centerX, centerY,
                  Math.max(width, height) * 0.85,
                  520, width * 0.95, 1700);

        }

    }

    // Core launch flare decay -- the recoil of expelling a pulse
    if (engine.coreLaunch > 0) {
        engine.coreLaunch = Math.max(0, engine.coreLaunch - dt / 320);
    }

    // --- THE FINALE -------------------------------
    // The mark has landed. The core gathers one more charge and
    // detonates into white.
    if (engine.logoLocked && !engine.finaleCharging && !engine.inverted) {

        const since = now - engine.logoLockTime;

        if (since > FINALE_HOLD_MS) {
            engine.finaleCharging = true;
            engine.finaleChargeStart = now;
        }

    }

    if (engine.finaleCharging && !engine.inverted) {

        const age = now - engine.finaleChargeStart;

        engine.finaleCharge = Math.min(1, age / FINALE_CHARGE_MS);

        // The core winds up harder than it ever has
        engine.corePulseBoost = Math.max(
            engine.corePulseBoost,
            Math.pow(engine.finaleCharge, 2.2) * 70
        );

        if (engine.finaleCharge >= 1) {

            engine.inverted = true;
            // Signal the dawn finale so the header can cross-fade with it.
            try { onInvert && onInvert(); } catch (_) {}
            engine.finaleCharging = false;

            if (TRANSITION_STYLE === "DAWN") {

                // No flash, no burst. The core has been winding up
                // through FINALE_CHARGE_MS; here it simply keeps
                // swelling and its light takes the frame. The
                // change is carried entirely by engine.invert.
                engine.finaleFlash = 0;

                engine.coreWave = 0.5;
                engine.corePulseBoost = 40;

            } else {

                engine.finaleFlash = 1;

                engine.coreWave = 1.6;
                engine.corePulseBoost = 110;

                burst(centerX, centerY,
                      Math.max(width, height) * 1.0,
                      680, width * 1.05, 2000);

            }

        }

    }

    // The flash decays, and the world flips from black to white
    if (engine.finaleFlash > 0) {

        engine.finaleFlash = Math.max(0, engine.finaleFlash - dt / 2000);

    }

    // The inversion is now DECOUPLED from the flash.
    //
    // Previously invert only advanced while finaleFlash was alive
    // and ramped over 900ms, so the entire change of state was
    // crammed into the flash and read as a hard cut. Now the flash
    // marks the moment, and the world drifts to white over a much
    // longer window underneath it — the flash covers the start of
    // the change, not all of it.
    if (engine.inverted && engine.invert < 1) {

        const span = TRANSITION_STYLE === "DAWN" ? DAWN_MS : INVERT_MS;

        engine.invert = Math.min(1, engine.invert + dt / span);

    }

    // Reveal flash decay -- slow enough to genuinely white out
    if (engine.revealFlash > 0) {
        // Slower decay: the wave needs time to rush out, pass
        // through the viewer, and clear.
        engine.revealFlash = Math.max(0, engine.revealFlash - dt / 1500);
    }

    // The wordmark is REVEALED BY the flash, not shown alongside
    // it. While the flash is at full strength the mark stays
    // hidden; as the white burns off, the logo emerges from
    // inside it. This is what makes the explosion feel like the
    // cause of the reveal rather than something that happens to
    // coincide with it.
    if (engine.logoLocked) {

        // revealFlash runs 1 -> 0. The mark comes up over the
        // BACK half of that decay, so nothing shows until the
        // blast has genuinely peaked and started to clear.
        const f = engine.revealFlash;

        const emerge = f > 0.55
            ? 0
            : Math.min(1, (0.55 - f) / 0.40);

        // Ease so it swells out of the white rather than wiping in
        engine.logoAlpha = emerge * emerge * (3 - 2 * emerge);

        engine.logoColour = engine.logoAlpha;

    }

}


/* ===================================================
   RENDER
=================================================== */

function render(now) {

    // Backdrop. The finale flips the world from black to white,
    // which is the whole point of the piece: void to light.
    if (engine.invert > 0) {

        const v = Math.min(1, engine.invert);

        // Perceptual, not linear. A straight 255*v is already mid
        // grey at the halfway point, so the screen visibly lurches
        // toward white early and the back half of the transition
        // does almost nothing. Gamma holds the dark much longer
        // and then arrives at white gently, which is what makes
        // the change feel like a dawn rather than a light switch.
        //
        // A faint blue is carried through the middle of the ramp
        // so it passes through the brand's own colour on the way
        // up instead of through neutral grey.
        const g = Math.pow(v, 2.2);

        // Peaks mid-transition, gone by the time it reaches white
        const tint = Math.sin(Math.PI * v) * 0.06;

        const rr = Math.round(255 * Math.min(1, g * (1 - tint * 0.9)));
        const gg = Math.round(255 * Math.min(1, g * (1 - tint * 0.4)));
        const bb = Math.round(255 * Math.min(1, g * (1 + tint * 0.5)));

        ctx.fillStyle = `rgb(${rr},${gg},${bb})`;

    } else {

        ctx.fillStyle = "#000000";

    }

    ctx.fillRect(0, 0, width, height);

    // The starfield belongs to the dark. It fades out as the
    // world turns white.
    if (engine.invert < 0.98) {

        ctx.save();
        ctx.globalAlpha = 1 - engine.invert;

        for (const star of engine.starfield) {
            star.draw();
        }

        ctx.restore();

    }

    for (const d of engine.dust) {
        d.draw();
    }

    // Shooters sit behind the rings.
    // One composite state for the whole swarm -- the fast path
    // relies on the caller having set this.
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    for (const s of engine.shooters) {
        if (!s.outer) s.draw();
    }

    ctx.restore();

    // Core
    drawCore(now);

    // Shockwave arcs bulging off the core, one per strike
    if (engine.coreHits.length) {

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        const base = Math.max(engine.coreRadius, 6);

        for (const h of engine.coreHits) {

            const t = h.life;
            const a = Math.pow(t, 0.8);

            const r = base + (1 - t) * 34 * h.power;

            const spread = 0.5 + (1 - t) * 0.7;

            ctx.strokeStyle = `rgba(210,240,255,${a * 0.65})`;
            ctx.lineWidth = 2.6 * t + 0.5;

            ctx.beginPath();
            ctx.arc(centerX, centerY, r,
                    h.angle - spread, h.angle + spread);
            ctx.stroke();

        }

        ctx.restore();

    }

    // Impact flashes sit on the core surface
    if (engine.impacts.length) {

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";

        for (const im of engine.impacts) {
            im.draw();
        }

        ctx.restore();

    }

    // Rings, outermost first so inner layers sit on top
    for (let i = engine.rings.length - 1; i >= 0; i--) {
        engine.rings[i].draw();
    }

    // The core's recoil as it expels a pulse -- a hot ring right
    // on its surface that flares and dies in a third of a second
    if (engine.coreLaunch > 0.001) {

        const cl = engine.coreLaunch;
        const cr = Math.max(engine.coreRadius, 8);

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // Bright rim on the core's edge
        ctx.strokeStyle = `rgba(255,255,255,${cl * 0.85})`;
        ctx.lineWidth = 2 + cl * 5;

        ctx.beginPath();
        ctx.arc(centerX, centerY, cr * (1 + (1 - cl) * 0.22), 0, Math.PI * 2);
        ctx.stroke();

        // Outward bloom off the surface
        const lg = ctx.createRadialGradient(
            centerX, centerY, cr * 0.6,
            centerX, centerY, cr * 2.6
        );

        lg.addColorStop(0.00, `rgba(220,245,255,${cl * 0.55})`);
        lg.addColorStop(0.45, `rgba(110,195,255,${cl * 0.28})`);
        lg.addColorStop(1.00, "rgba(40,120,220,0)");

        ctx.fillStyle = lg;

        ctx.beginPath();
        ctx.arc(centerX, centerY, cr * 2.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

    }

    // The Powering What's Next badge, revealed by the final flash.
    // It sits below the NexCore mark, sized against the ring system.
    if (engine.invert > 0.001 && poweringReady) {

        // Placement is now EXACT, derived from the SVG itself
        // rather than measured off a screenshot.
        //
        // NexCorePowering.svg has viewBox 1438.62 x 1254. Its
        // height is identical to CONFIG.RING_VIEWBOX (1254) - it
        // is the ring artboard extended 184.62 units to the LEFT
        // to make room for the badge, with the remainder of the
        // box left empty for the energy core.
        //
        // So the whole viewBox is drawn at ring scale with the
        // ring art centre landing on the core, and the badge falls
        // exactly where the brand lockup puts it. No hand-tuned
        // offsets, and it tracks the rings at any viewport size.

        const outer = systemRadius();

        // Same viewBox -> screen scale the rings use. The badge is
        // part of the lockup, so it must never scale independently
        // of the core — it tracks pScale and nothing else.
        const pScale = (outer * 2) / CONFIG.RING_VIEWBOX;

        // Horizontal overhang of the badge artboard past the rings
        const overhang = CONFIG.POWERING_VIEWBOX_W - CONFIG.RING_VIEWBOX;

        // Where the ring art centre sits inside the badge viewBox
        const anchorX = overhang + CONFIG.RING_ART_CX;
        const anchorY = CONFIG.RING_ART_CY;

        const bw = CONFIG.POWERING_VIEWBOX_W * pScale;
        const bh = CONFIG.POWERING_VIEWBOX_H * pScale;

        // Shift so the anchor lands precisely on the core
        const bx = centerX - anchorX * pScale;

        // Keep the banner locked to its natural position relative to the core.

        const by = centerY - anchorY * pScale;

        ctx.save();
        ctx.globalAlpha = Math.min(1, engine.invert * 1.2);

        ctx.drawImage(powering, bx, by, bw, bh);

        ctx.restore();

    }

    // Charge pulses travel over the rings so the wavefront is
    // visible crossing the shells it has not reached yet
    if (engine.pulses.length && RING_PULSES_VISIBLE) {

        for (const pulse of engine.pulses) {
            pulse.draw(now);
        }

    }

    // The orbiting matter belongs to the dark world; it fades out
    // with the flip rather than sitting invisibly on white.
    // Matter orbiting beyond the rim, drawn OVER the finished ring
    // system so the spin stays visible for as long as the page is
    // open. Inside the rings it was hidden by the opaque sprites.
    if (engine.invert < 0.98) {

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 1 - engine.invert;
        ctx.lineCap = "round";

        for (const s of engine.shooters) {
            if (s.outer) s.draw();
        }

        ctx.restore();

    }

    // Shockwaves
    for (const nr of engine.novaRings) {
        nr.draw();
    }

    // Prelude sparks -- the star holds into the comet phase
    if (engine.sparks.length) {

        for (const sp of engine.sparks) {
            sp.draw();
        }

    }

    // The wordmark, drawn as the 13th ring: it flashes in, fades
    // up over 900ms, and resolves from white-hot to full colour.
    if (CONFIG.SHOW_LOGO && engine.logoLocked && engine.logoReady) {

        const L = logoLayout();

        ctx.save();

        // Lock-in flash, same treatment the rings get
        if (engine.logoBurst > 0) {

            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = engine.logoAlpha * (1 + engine.logoBurst * 1.4);

        } else {

            ctx.globalAlpha = engine.logoAlpha;

        }

        ctx.drawImage(logo, L.x, L.y, L.w, L.h);

        ctx.restore();

        // A white-hot pass over the top that burns off as the
        // mark takes its colour
        if (engine.logoColour < 1) {

            const hot = 1 - engine.logoColour;

            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = engine.logoAlpha * hot * 0.85;

            ctx.drawImage(logo, L.x, L.y, L.w, L.h);

            ctx.restore();

        }

    }

    // Detonation streaks and flares sit above everything
    if (engine.streaks.length) {

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";

        for (const st of engine.streaks) {
            st.draw();
        }

        ctx.restore();

    }


    for (const f of engine.flares) {
        f.draw();
    }


    // THE REVEAL BLAST.
    //
    // Previously this was a static bloom centred on the core -- you
    // watched it happen from a safe distance. Now it is a wavefront
    // rushing AT the viewer: a shock ring that expands past the
    // frame edge while the light behind it floods forward, ending
    // in a total white-out. It should feel like being hit by it.
    if (engine.revealFlash > 0.001) {

        // 1 at detonation, falling to 0
        const f = engine.revealFlash;

        // Time since the blast, normalised
        const u = 1 - f;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // --- THE INITIAL FLASH -----------------------------------
        //
        // An atomic detonation is a blinding point of light BEFORE
        // it is a shockwave. This fires in the first ~180ms and is
        // gone almost immediately — a hard white core with a wide
        // falloff, centred exactly on the energy core so the blast
        // unmistakably comes from it.
        if (u < 0.14) {

            // Sharp attack, immediate decay
            const fl = Math.pow(1 - u / 0.14, 0.65);

            const flashR = Math.max(width, height) * (0.10 + u * 5.5);

            const fg = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, flashR
            );

            fg.addColorStop(0.00, `rgba(255,255,255,${fl})`);
            fg.addColorStop(0.18, `rgba(245,252,255,${fl * 0.85})`);
            fg.addColorStop(0.50, `rgba(170,220,255,${fl * 0.35})`);
            fg.addColorStop(1.00, "rgba(60,150,255,0)");

            ctx.fillStyle = fg;
            ctx.fillRect(0, 0, width, height);

        }

        // The shock ring, accelerating outward past the frame
        const reach = Math.hypot(width, height) * 0.62;

        const frontR = reach * Math.pow(u, 0.55) * 1.9;

        if (frontR > 2 && u < 0.92) {

            const edge = 1 - u * 0.35;

            // Wide compression band behind the front
            ctx.strokeStyle = `rgba(120,205,255,${edge * 0.55})`;
            ctx.lineWidth = 40 + u * 190;

            ctx.beginPath();
            ctx.arc(centerX, centerY, frontR * 0.86, 0, Math.PI * 2);
            ctx.stroke();

            // The front itself
            ctx.strokeStyle = `rgba(235,250,255,${edge})`;
            ctx.lineWidth = 14 + u * 60;

            ctx.beginPath();
            ctx.arc(centerX, centerY, frontR, 0, Math.PI * 2);
            ctx.stroke();

            // Hard leading edge
            ctx.strokeStyle = `rgba(255,255,255,${edge})`;
            ctx.lineWidth = 4;

            ctx.beginPath();
            ctx.arc(centerX, centerY, frontR, 0, Math.PI * 2);
            ctx.stroke();

        }

        // Light flooding forward from behind the front -- the
        // gradient's hot centre pushes outward as the wave passes,
        // so the frame fills from the middle rather than glowing
        const bloomR = Math.max(width, height) * (0.35 + u * 1.5);

        const rv = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, bloomR
        );

        // Hot core widens as the wave comes at you
        const hot = Math.min(0.85, 0.10 + u * 1.4);

        rv.addColorStop(0.00, `rgba(255,255,255,${f})`);
        rv.addColorStop(hot, `rgba(225,246,255,${f * 0.95})`);
        rv.addColorStop(Math.min(0.99, hot + 0.25),
                        `rgba(120,200,255,${f * 0.5})`);
        rv.addColorStop(1.00, "rgba(30,110,220,0)");

        ctx.fillStyle = rv;
        ctx.fillRect(0, 0, width, height);

        ctx.restore();

        // Total white-out at the peak, as the wave passes THROUGH
        // the viewer. Peaks slightly after the detonation so the
        // shock ring is seen arriving first.
        const impact = Math.max(0, 1 - Math.abs(u - 0.30) / 0.30);

        if (impact > 0) {

            ctx.save();
            ctx.fillStyle =
                `rgba(255,255,255,${Math.pow(impact, 1.4) * 0.96})`;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();

        }

    }

    // THE DAWN -- the quiet alternative to the finale flash.
    //
    // Instead of a wave washing the frame white, the core's own
    // light simply grows until it has filled the screen. Drawn as
    // a single soft radial bloom anchored on the core, expanding
    // with engine.invert. Nothing is ever fully hidden.
    if (TRANSITION_STYLE === "DAWN" && engine.invert > 0.001
        && engine.invert < 0.999) {

        const v = engine.invert;

        // Reaches past the far corner by the end
        const reach = Math.hypot(width, height) * 0.75;

        const rr = Math.max(1, reach * Math.pow(v, 0.75));

        // Brightest mid-transition, then hands over to the
        // backdrop itself, which is arriving at white anyway
        const strength = Math.sin(Math.PI * Math.min(1, v * 0.92)) * 0.85;

        if (strength > 0.004) {

            ctx.save();
            ctx.globalCompositeOperation = "lighter";

            const g = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, rr
            );

            g.addColorStop(0.00, `rgba(255,255,255,${strength})`);
            g.addColorStop(0.30, `rgba(226,244,255,${strength * 0.55})`);
            g.addColorStop(0.65, `rgba(150,205,255,${strength * 0.20})`);
            g.addColorStop(1.00, "rgba(90,160,255,0)");

            ctx.fillStyle = g;

            ctx.beginPath();
            ctx.arc(centerX, centerY, rr, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

        }

    }

    // THE FINALE FLASH -- the wave that flips the world.
    // Bigger and longer than the logo reveal, because it has to
    // cover a total change of state.
    if (engine.finaleFlash > 0.001) {

        const f = engine.finaleFlash;
        const u = 1 - f;

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        const reach = Math.hypot(width, height) * 0.62;
        const frontR = reach * Math.pow(u, 0.5) * 2.2;

        if (frontR > 2 && u < 0.95) {

            const edge = 1 - u * 0.25;

            ctx.strokeStyle = `rgba(150,215,255,${edge * 0.6})`;
            ctx.lineWidth = 60 + u * 260;

            ctx.beginPath();
            ctx.arc(centerX, centerY, frontR * 0.84, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = `rgba(245,252,255,${edge})`;
            ctx.lineWidth = 20 + u * 80;

            ctx.beginPath();
            ctx.arc(centerX, centerY, frontR, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = `rgba(255,255,255,${edge})`;
            ctx.lineWidth = 5;

            ctx.beginPath();
            ctx.arc(centerX, centerY, frontR, 0, Math.PI * 2);
            ctx.stroke();

        }

        ctx.restore();

        // Veil, not a white-out.
        //
        // This used to reach full opacity and blow the frame to
        // solid white, because the inversion had to be hidden
        // underneath it. The inversion is now gradual and no
        // longer needs hiding, so the flash can stay translucent
        // and let the composition read through it. Softer, wider,
        // and it never fully hides the mark.
        const impact = Math.max(0, 1 - Math.abs(u - 0.30) / 0.42);

        if (impact > 0) {

            ctx.save();
            ctx.fillStyle =
                `rgba(255,255,255,${Math.pow(impact, 1.5) * FLASH_PEAK})`;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();

        }

    }

    // Full-frame flash
    if (engine.novaFlash > 0.01) {

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // Hot centre falling off into blue, not a hard sphere
        const bloom = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, Math.max(width, height) * 0.75
        );

        const f = engine.novaFlash;

        bloom.addColorStop(0.00, `rgba(255,255,255,${f * 1.00})`);
        bloom.addColorStop(0.14, `rgba(200,238,255,${f * 0.78})`);
        bloom.addColorStop(0.38, `rgba(70,160,255,${f * 0.30})`);
        bloom.addColorStop(1.00, "rgba(20,60,140,0)");

        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, width, height);

        // Even wash so the whole frame lifts
        ctx.fillStyle = `rgba(210,242,255,${f * 0.30})`;
        ctx.fillRect(0, 0, width, height);

        ctx.restore();


    }

}


/* ===================================================
   LOOP
=================================================== */

function loop(now) {

    let dt = now - engine.lastFrame;

    engine.lastFrame = now;

    // Clamp so a backgrounded tab doesn't fast-forward
    if (dt > 60) dt = 60;

    update(dt, now);
    render(now);

    requestAnimationFrame(loop);

}


/* ===================================================
   IGNITION
=================================================== */

function startEngine() {

    if (engine.started) return;

    engine.started = true;

    if (assetsFailed > 0) {
        console.warn(assetsFailed + " asset(s) failed — check paths in CONFIG");
    }

    // Starfield
    const starCount = Math.round((width * height) / 5200);

    for (let i = 0; i < starCount; i++) {
        engine.starfield.push(new Star());
    }

    // Dust
    spawnDust(120);

    // Ring slots
    for (let i = 0; i < 12; i++) {
        engine.rings.push(new Ring(i));
    }

    // The core's growth target IS ring 0
    engine.coreMaxRadius = ringRadius(0);

    engineReady = true;

    // A single bright star holds in the void before the burst.
    // A handful of faint companions keep it from looking like a
    // stray pixel, but the hero point carries the moment.
    engine.sparks.push(new Spark(0, true));

    for (let i = 0; i < 14; i++) {
        engine.sparks.push(new Spark(Math.random() * T.IGNITION * 0.45, false));
    }

    engine.lastFrame = performance.now();

    requestAnimationFrame(loop);

}

loadRings();
loadLogo();
loadPowering();


/* ===================================================
   RECORDER  -- press R to capture a .webm
=================================================== */

if (CONFIG.ENABLE_RECORDER) {

    let recorder = null;
    let chunks = [];

    _on(window, "keydown", (event) => {

        if (event.key !== "r" && event.key !== "R") return;

        if (recorder && recorder.state === "recording") {

            recorder.stop();
            return;

        }

        const stream = canvas.captureStream(60);

        chunks = [];

        recorder = new MediaRecorder(stream, {
            mimeType: "video/webm;codecs=vp9",
            videoBitsPerSecond: 12000000
        });

        recorder.ondataavailable = e => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {

            const blob = new Blob(chunks, { type: "video/webm" });

            const a = document.createElement("a");

            a.href = URL.createObjectURL(blob);
            a.download = "nexcore-genesis.webm";
            a.click();

            console.log("Recording saved");

        };

        recorder.start();

        console.log("Recording — press R again to stop");

    });

}

  return () => {
    _dead = true;
    for (const id of _rafIds) window.cancelAnimationFrame(id);
    for (const off of _offs) off();
  };
}
