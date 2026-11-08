'use client';

import { useEffect, useRef, useState } from 'react';

import './HoloCard.css';

const PRESETS = ['bursts', 'stars', 'shards', 'cosmos', 'rainbow', 'swirl', 'glitter', 'gold'];
const PERSPECTIVE = 1100;
const CARD_RATIO = 63 / 88;

/* Shader fragment: disusun dari segmen-segmen yang dirakit kembali.
   Uniform:
     uArt       — texture artwork kartu (flipY sudah di-handle saat upload)
     uSize      — ukuran drawing buffer dalam px
     uAspect    — height / width kartu
     uTilt      — tilt halus -1..1 (x, y)
     uLight     — posisi sumber cahaya 0..1 (mengikuti tilt + idle drift)
     uDistance  — 1 saat hover penuh / 0 saat idle (mengangkat intensitas cahaya)
     uPreset    — indeks preset foil (lihat PRESETS)
     uIntensity — kekuatan foil (0..1)
     uScale     — skala pola foil
     uEdge      — kekuatan edge sparkle (0..1)
     uFrame     — tebal bingkai foil (0..0.2 dari sisi terpendek)
     uRadius    — radius sudut kartu dalam px
     uGlare     — kekuatan diagonal glare (0..1)
     uFoil      — warna foil dasar (linear RGB, sudah dipangkat 2.2)
     uReady     — fade-in effect (0..1)
     uTime      — waktu animasi (detik, untuk shimmer idle)
*/
const FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D uArt;
uniform vec2 uSize;
uniform float uAspect;
uniform vec2 uTilt;
uniform vec2 uLight;
uniform float uDistance;
uniform int uPreset;
uniform float uIntensity;
uniform float uScale;
uniform float uEdge;
uniform float uFrame;
uniform float uRadius;
uniform float uGlare;
uniform vec3 uFoil;
uniform float uReady;
uniform float uTime;

out vec4 outColor;

const float TAU = 6.28318530718;

struct Foil {
  float mask;
  float angle;
  float jitter;
  vec2 facet;
};

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

vec2 hash2(vec2 p) {
  return vec2(hash(p), hash(p + 17.31));
}

vec3 hue(float t) {
  t = abs(fract(t * 0.5) * 2.0 - 1.0);
  vec3 c = mix(vec3(0.1, 0.25, 1.0), vec3(0.0, 0.85, 1.0), smoothstep(0.0, 0.25, t));
  c = mix(c, vec3(0.25, 1.0, 0.2), smoothstep(0.25, 0.45, t));
  c = mix(c, vec3(1.0, 0.92, 0.05), smoothstep(0.45, 0.65, t));
  c = mix(c, vec3(1.0, 0.45, 0.05), smoothstep(0.65, 0.85, t));
  return mix(c, vec3(0.95, 0.12, 0.3), smoothstep(0.85, 1.0, t));
}

Foil bursts(vec2 p) {
  vec2 q = mat2(0.7071068, 0.7071068, -0.7071068, 0.7071068) * (p - vec2(0.5, 0.5 * uAspect)) / (0.283 / uScale);
  vec2 d = fract(q) - 0.5;
  float u = length(d) / 0.49;
  float angle = atan(d.y, d.x);
  if (u < 0.12) {
    float ring = min(floor(u / 0.045 + 0.5), 2.0);
    float count = max(1.0, ring * 6.0);
    float spot = (floor(angle / TAU * count) + 0.5) / count * TAU;
    vec2 dot = vec2(cos(spot), sin(spot)) * ring * 0.045;
    float m = smoothstep(0.024, 0.012, length(d / 0.49 - dot));
    return Foil(m, angle, 0.5, vec2(0.0));
  }
  bool inner = u < 0.66;
  float slot = angle / TAU * (inner ? 56.0 : 72.0);
  bool shifted = mod(floor(slot), 2.0) > 0.5;
  vec2 band = inner ? (shifted ? vec2(0.45, 0.61) : vec2(0.33, 0.49)) : (shifted ? vec2(0.84, 0.99) : vec2(0.7, 0.85));
  float across = abs(u - (band.x + band.y) * 0.5) / ((band.y - band.x) * 0.5);
  float along = abs(fract(slot) - 0.5) * 2.0;
  float width = inner ? 0.72 : 0.6;
  float m = smoothstep(1.0, 0.78, across) * smoothstep(width, width - 0.2, along);
  return Foil(m, angle, 0.5, vec2(0.0));
}

Foil stars(vec2 p) {
  Foil best = Foil(0.0, 0.0, 0.0, vec2(0.0));
  vec2 g = p / (0.08 / uScale);
  vec2 base = floor(g);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 id = base + vec2(float(i), float(j));
      float pick = hash(id + 1.3);
      vec2 d = g - (id + 0.5 + (hash2(id) - 0.5) * 0.55);
      float m = smoothstep(0.07, 0.035, length(d));
      if (pick < 0.62) {
        float size = mix(0.16, 0.5, pow(hash(id + 9.0), 1.8));
        float sector = TAU / (pick < 0.3 ? 4.0 : 5.0);
        float k = abs(fract((atan(d.y, d.x) + hash(id + 4.0) * TAU) / sector) - 0.5) * 2.0;
        float edge = size * mix(1.0, 0.36, pow(k, 0.6));
        m = smoothstep(edge, edge * 0.8, length(d));
      }
      if (m > best.mask) best = Foil(m, hash(id + 6.0) * TAU, hash(id + 8.0), (hash2(id + 2.0) - 0.5) * 0.6);
    }
  }
  return best;
}

Foil shards(vec2 p) {
  vec2 g = p * 19.0 * uScale;
  vec2 base = floor(g);
  float best = 9.0;
  float second = 9.0;
  vec2 id = base;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 cell = base + vec2(float(i), float(j));
      float d = length(cell + 0.08 + hash2(cell) * 0.84 - g);
      if (d < best) {
        second = best;
        best = d;
        id = cell;
      } else if (d < second) {
        second = d;
      }
    }
  }
  float crack = smoothstep(0.015, 0.07, second - best);
  float shine = 0.25 + 0.75 * pow(hash(id + 7.7), 2.0);
  return Foil((0.2 + 0.8 * crack) * shine, hash(id + 3.17) * TAU, hash(id + 11.73), (hash2(id + 5.0) - 0.5) * 0.5);
}

Foil cosmos(vec2 p) {
  Foil best = Foil(0.0, 0.0, 0.0, vec2(0.0));
  vec2 g = p / (0.16 / uScale);
  vec2 base = floor(g);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 id = base + vec2(float(i), float(j));
      vec2 d = g - (id + 0.5 + (hash2(id) - 0.5) * 0.7);
      float size = mix(0.16, 0.52, hash(id + 2.0));
      float r = length(d);
      float m = max(smoothstep(0.05, 0.0, abs(r - size)), smoothstep(size, size - 0.04, r) * 0.22);
      if (m > best.mask) best = Foil(m, hash(id + 6.0) * TAU + atan(d.y, d.x) * 0.5, hash(id + 1.0), (hash2(id + 4.0) - 0.5) * 0.5);
    }
  }
  vec2 fine = p / (0.035 / uScale);
  vec2 cell = floor(fine);
  float dots = smoothstep(0.2, 0.1, length(fine - cell - 0.5 - (hash2(cell + 9.0) - 0.5) * 0.6)) * step(0.55, hash(cell + 2.0));
  if (dots > best.mask) best = Foil(dots, hash(cell) * TAU, hash(cell + 3.0), (hash2(cell + 7.0) - 0.5) * 0.6);
  return best;
}

Foil rainbow(vec2 p) {
  return Foil(0.86 + 0.14 * hash(floor(p * 700.0 * uScale)), 0.2, 0.5, vec2(0.0));
}

Foil swirl(vec2 p) {
  vec2 d = p - vec2(0.5, 0.42 * uAspect);
  float angle = atan(d.y, d.x);
  float rays = 0.55 + 0.45 * smoothstep(0.3, 0.7, abs(fract(angle / TAU * 60.0 * uScale) - 0.5) * 2.0);
  return Foil(rays, angle, length(d), vec2(0.0));
}

Foil glitter(vec2 p) {
  vec2 g = p * 72.0 * uScale;
  vec2 cell = floor(g);
  float size = mix(0.18, 0.4, hash(cell + 3.0));
  float m = smoothstep(size, size * 0.55, length(fract(g) - 0.5 - (hash2(cell) - 0.5) * 0.5)) * step(0.25, hash(cell + 5.0));
  return Foil(m, hash(cell + 7.0) * TAU, hash(cell + 9.0), (hash2(cell + 11.0) - 0.5) * 0.9);
}

Foil gold(vec2 p) {
  Foil flake = glitter(p * 0.8);
  if (flake.mask > 0.5) return flake;
  float etch = 0.55 + 0.45 * smoothstep(0.2, 0.8, abs(fract((p.x * 0.6 + p.y) * 140.0 * uScale) - 0.5) * 2.0);
  return Foil(etch, 0.9, 0.4, vec2(0.0));
}

vec3 sparkles(vec2 p, vec3 halfway, vec2 sweep, float awake) {
  vec2 g = p * 62.0;
  vec2 cell = floor(g);
  vec2 d = fract(g) - 0.5 - (hash2(cell) - 0.5) * 0.36;
  float spin = hash(cell + 3.0) * TAU;
  d = mat2(cos(spin), -sin(spin), sin(spin), cos(spin)) * d;
  vec2 a = abs(d);
  float hexagon = max(a.x * 0.866 + a.y * 0.5, a.y);
  float size = mix(0.22, 0.38, hash(cell + 2.0));
  float piece = smoothstep(size, size - 0.07, hexagon) * step(0.42, hash(cell + 4.0));
  vec3 facet = normalize(vec3((hash2(cell + 6.0) - 0.5) * 0.9, 1.0));
  float flash = pow(max(dot(facet, halfway), 0.0), 6.0);
  vec3 tint = hue(dot(sweep, vec2(cos(spin), sin(spin))) * 1.2 + dot(sweep, vec2(0.8, 0.6)) * 0.8 + hash(cell + 8.0) * 0.5);
  vec3 color = piece * tint * (0.3 + 1.6 * flash) * awake;
  vec2 fine = p * 210.0;
  vec2 speckCell = floor(fine);
  float speck = smoothstep(0.24, 0.0, length(fract(fine) - 0.5 - (hash2(speckCell) - 0.5) * 0.5)) * step(0.72, hash(speckCell + 1.0));
  float speckFlash = pow(max(dot(normalize(vec3((hash2(speckCell + 2.0) - 0.5) * 0.9, 1.0)), halfway), 0.0), 10.0);
  return color + vec3(1.2) * speck * speckFlash * (1.0 - piece);
}

Foil selectFoil(vec2 p) {
  if (uPreset == 0) return bursts(p);
  if (uPreset == 1) return stars(p);
  if (uPreset == 2) return shards(p);
  if (uPreset == 3) return cosmos(p);
  if (uPreset == 4) return rainbow(p);
  if (uPreset == 5) return swirl(p);
  if (uPreset == 6) return glitter(p);
  return gold(p);
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / uSize;
  vec2 p = uv * vec2(1.0, uAspect);

  // Potong sudut membulat di luar kartu
  vec2 centered = px - uSize * 0.5;
  if (sdRoundBox(centered, uSize * 0.5, uRadius) > 0.5) discard;

  vec3 art = texture(uArt, uv).rgb;

  // Arah cahaya mengikuti tilt kartu (+ sedikit drift idle bila tidak di-hover)
  vec2 idleDrift = vec2(cos(uTime * 0.5), sin(uTime * 0.37)) * 0.18 * (1.0 - uDistance);
  vec2 lightPos = clamp(uLight + idleDrift, 0.0, 1.0);
  vec3 L = normalize(vec3((lightPos - 0.5) * 2.2, 1.35));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);

  // Pola foil + respons sudut terhadap tilt
  Foil f = selectFoil(p);
  float tiltAngle = atan(uTilt.y, uTilt.x);
  float viewSweep = 0.5 + 0.5 * cos(f.angle - tiltAngle + f.jitter * TAU + dot(uTilt, vec2(2.1, 1.7)));
  float shimmer = pow(viewSweep, 2.2);
  vec3 foilHue = mix(uFoil, hue(f.jitter * 0.83 + viewSweep * 0.9 + uTime * 0.03), 0.72);
  float foilMask = clamp(f.mask, 0.0, 1.0) * uIntensity * uReady;

  // Base shading: kartu sedikit lebih gelap di sudut jauh dari cahaya
  float shade = 0.78 + 0.34 * clamp(dot(normalize(vec3(uTilt, 1.4)), L) * 0.5 + 0.5, 0.0, 1.0);
  vec3 color = art * shade;

  // Lapisan foil: metallic sweep + specular tajam
  color *= 1.0 - foilMask * 0.42;                       // foil menahan diffuse
  color += foilHue * foilMask * (0.28 + 1.15 * shimmer); // body foil
  color += vec3(1.0) * foilMask * pow(shimmer, 6.0) * 0.85; // hot spot specular

  // Sparkle facets (edge + scatter), hidup saat kartu "awake" — lebih kuat di area foil, subtil di area gelap
  vec2 sweep = uTilt * 1.4 + lightPos - 0.5;
  color += sparkles(uv * vec2(1.0, uAspect), H, sweep, uEdge * uReady) * mix(0.18, 1.0, clamp(foilMask * 0.85 + shimmer * 0.55, 0.0, 1.0));

  // Bingkai foil tipis di tepi kartu
  if (uFrame > 0.001) {
    vec2 b = uSize * 0.5;
    float edgeDist = abs(sdRoundBox(centered, b, uRadius));
    float frameW = uFrame * min(uSize.x, uSize.y);
    float frameMask = smoothstep(frameW, frameW * 0.45, edgeDist);
    float frameSheen = 0.55 + 0.45 * cos((uv.x + uv.y * 0.6) * 9.0 + tiltAngle * 1.6 + uTime * 0.22);
    vec3 frameCol = mix(uFoil, hue(frameSheen + 0.18), 0.55);
    color += frameCol * frameMask * frameSheen * uIntensity * uReady * 0.85;
  }

  // Diagonal glare sweep (lebar lembut + inti tajam), merespons tilt & jarak
  float sweepAxis = uv.x * 0.82 + uv.y * 0.55;
  float sweepPos = 0.12 + lightPos.x * 0.75 + lightPos.y * 0.18;
  float band = 1.0 - abs(sweepAxis - sweepPos);
  float glareWide = smoothstep(0.55, 0.98, band) * uGlare * (0.35 + 0.65 * uDistance);
  float glareCore = smoothstep(0.9, 0.995, band) * uGlare * (0.3 + 0.7 * uDistance);
  color += vec3(1.0) * glareWide * 0.34 + vec3(1.0) * glareCore * 0.5;

  // Vignette halus di sudut
  vec2 corner = (uv - 0.5) * vec2(1.0, uAspect);
  color *= 1.0 - 0.28 * smoothstep(0.55, 1.05, length(corner));

  // Alpha penuh (kartu solid), fade-in ditangani efek via uReady + CSS opacity canvas
  outColor = vec4(color, 1.0);
}
`;

const VERTEX = '#version 300 es\nin vec2 position;\nvoid main() {\n  gl_Position = vec4(position, 0.0, 1.0);\n}\n';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const parseColor = value => {
  const fallback = [0.78, 0.8, 0.84];
  if (typeof document === 'undefined') return fallback;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return fallback;
  ctx.fillStyle = '#000000';
  ctx.fillStyle = value;
  const resolved = ctx.fillStyle;
  if (!resolved.startsWith('#') || resolved.length !== 7) return fallback;
  return [1, 3, 5].map(i => Math.pow(parseInt(resolved.slice(i, i + 2), 16) / 255, 2.2));
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  const info = gl.getShaderInfoLog(shader);
  console.warn(`[HoloCard] ${type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment'} shader gagal dikompilasi:`, info);
  gl.deleteShader(shader);
  return null;
};

const linkProgram = (gl, vertexSource, fragmentSource) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.warn('[HoloCard] Program gagal di-link:', gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
};

export default function HoloCard({
  image,
  backImage,
  backContent = null,
  alt = '',
  preset = 'bursts',
  intensity = 0.85,
  scale = 1,
  edgeSparkle = 0.8,
  frame = 4,
  glare = 0.5,
  foilColor = '#e2e6ec',
  width = 320,
  radius = 14,
  tiltMax = 14,
  hoverScale = 1.04,
  idle = true,
  shadow = true,
  className = '',
  style
}) {
  const rootRef = useRef(null);
  const rotorRef = useRef(null);
  const shadowRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, inside: false });
  const wakeRef = useRef(null);
  const loadRef = useRef(null);
  const flipRef = useRef(false);
  const [ratio, setRatio] = useState(CARD_RATIO);
  const [ready, setReady] = useState(false);
  const [flipped, setFlipped] = useState(false);
  // Kartu bisa dibalik bila ada backImage (gambar) atau backContent (node — mis. teks)
  const flippable = Boolean(backImage) || Boolean(backContent);

  settingsRef.current = {
    preset: Math.max(0, PRESETS.indexOf(preset)),
    intensity: clamp(intensity, 0, 1),
    scale: clamp(scale, 0.25, 4),
    edgeSparkle: clamp(edgeSparkle, 0, 1),
    frame: clamp(frame, 0, 20) / 100,
    glare: clamp(glare, 0, 1),
    foil: parseColor(foilColor),
    radius: Math.max(0, radius),
    tiltMax: clamp(tiltMax, 0, 45),
    hoverScale: clamp(hoverScale, 0.8, 1.3),
    idle
  };
  flipRef.current = flippable && flipped;

  // Bangun state WebGL + loop render; cleanup total saat unmount
  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return undefined;

    const gl =
      canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance'
      }) || null;

    if (!gl) {
      console.warn('[HoloCard] WebGL2 tidak tersedia — kartu tampil tanpa efek foil.');
      return undefined;
    }

    let program = linkProgram(gl, VERTEX, FRAGMENT);
    if (!program) return undefined;

    // Quad fullscreen (triangle strip)
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uniform = name => gl.getUniformLocation(program, name);
    const u = {
      uArt: uniform('uArt'),
      uSize: uniform('uSize'),
      uAspect: uniform('uAspect'),
      uTilt: uniform('uTilt'),
      uLight: uniform('uLight'),
      uDistance: uniform('uDistance'),
      uPreset: uniform('uPreset'),
      uIntensity: uniform('uIntensity'),
      uScale: uniform('uScale'),
      uEdge: uniform('uEdge'),
      uFrame: uniform('uFrame'),
      uRadius: uniform('uRadius'),
      uGlare: uniform('uGlare'),
      uFoil: uniform('uFoil'),
      uReady: uniform('uReady'),
      uTime: uniform('uTime')
    };
    gl.useProgram(program);
    gl.uniform1i(u.uArt, 0);

    // Texture artwork (dipakai ulang setiap image berubah)
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // 1x1 placeholder supaya tidak sample tekstur incomplete sebelum image dimuat
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([24, 30, 46, 255]));

    let textureReady = false;
    let readyFade = 0;
    let rafId = null;
    let running = true;
    let disposed = false;

    const uploadTexture = source => {
      if (disposed || !source) return;
      try {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.generateMipmap(gl.TEXTURE_2D);
        textureReady = true;
        setReady(true);
      } catch (error) {
        console.warn('[HoloCard] Gagal mengupload tekstur (CORS?). Kartu tampil tanpa efek foil.', error);
      }
    };
    loadRef.current = src => {
      if (!src) return;
      const probe = new Image();
      probe.crossOrigin = 'anonymous';
      probe.onload = () => uploadTexture(probe);
      probe.onerror = () => console.warn('[HoloCard] Gambar gagal dimuat:', src);
      probe.src = src;
    };

    // Sizing HiDPI mengikuti ukuran CSS elemen root
    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    observer?.observe(root);
    window.addEventListener('resize', resize, { passive: true });

    // State animasi (smoothed)
    const anim = {
      tiltX: 0,
      tiltY: 0,
      hover: 0,
      flip: 0,
      idlePhase: Math.random() * Math.PI * 2
    };

    // Offset idle sinusoidal bila tidak ada pointer di atas kartu
    const idleOffset = time => {
      if (!settingsRef.current?.idle) return { x: 0, y: 0 };
      return {
        x: Math.cos(time * 0.55 + anim.idlePhase) * 0.35,
        y: Math.sin(time * 0.42 + anim.idlePhase * 1.7) * 0.3
      };
    };

    const render = () => {
      if (disposed) return;
      rafId = window.requestAnimationFrame(render);

      resize();
      const settings = settingsRef.current;
      if (!settings) return;

      const pointer = pointerRef.current;
      const time = performance.now() / 1000;
      const idleDrift = pointer.inside ? { x: 0, y: 0 } : idleOffset(time);

      const targetTiltX = pointer.inside ? (pointer.x - 0.5) * 2 : idleDrift.x;
      const targetTiltY = pointer.inside ? (pointer.y - 0.5) * 2 : idleDrift.y;
      const targetHover = pointer.inside ? 1 : 0;
      const targetFlip = flipRef.current ? 180 : 0;

      // Lerp halus menuju target (damping frame-rate independent-ish)
      anim.tiltX += (targetTiltX - anim.tiltX) * 0.12;
      anim.tiltY += (targetTiltY - anim.tiltY) * 0.12;
      anim.hover += (targetHover - anim.hover) * 0.1;
      anim.flip += (targetFlip - anim.flip) * 0.09;
      if (textureReady && readyFade < 1) readyFade = Math.min(1, readyFade + 0.022);

      const tiltXDeg = -anim.tiltY * settings.tiltMax; // rotateX mengikuti y pointer
      const tiltYDeg = anim.tiltX * settings.tiltMax;  // rotateY mengikuti x pointer
      const scaleNow = 1 + (settings.hoverScale - 1) * anim.hover;

      // Terapkan transform 3D ke rotor & shadow
      if (rotorRef.current) {
        rotorRef.current.style.transform = `rotateY(${(anim.flip + tiltYDeg).toFixed(3)}deg) rotateX(${tiltXDeg.toFixed(3)}deg) scale(${scaleNow.toFixed(4)})`;
      }
      if (shadowRef.current) {
        const shadowX = -anim.tiltX * 22;
        const shadowScale = 1 - anim.hover * 0.06;
        shadowRef.current.style.transform = `translate3d(${shadowX.toFixed(2)}px, 6px, 0) scale(${shadowScale.toFixed(4)})`;
      }

      // Gambar frame WebGL
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      const w = canvas.width;
      const h = canvas.height;
      gl.uniform2f(u.uSize, w, h);
      gl.uniform1f(u.uAspect, h / Math.max(1, w));
      gl.uniform2f(u.uTilt, anim.tiltX, anim.tiltY);
      gl.uniform2f(u.uLight, 0.5 + anim.tiltX * 0.42, 0.5 - anim.tiltY * 0.42);
      gl.uniform1f(u.uDistance, anim.hover);
      gl.uniform1i(u.uPreset, settings.preset);
      gl.uniform1f(u.uIntensity, settings.intensity);
      gl.uniform1f(u.uScale, settings.scale);
      gl.uniform1f(u.uEdge, settings.edgeSparkle);
      gl.uniform1f(u.uFrame, settings.frame);
      gl.uniform1f(u.uRadius, (settings.radius / Math.max(1, root.getBoundingClientRect().width)) * w);
      gl.uniform1f(u.uGlare, settings.glare);
      gl.uniform3f(u.uFoil, settings.foil[0], settings.foil[1], settings.foil[2]);
      gl.uniform1f(u.uReady, textureReady ? readyFade : 0);
      gl.uniform1f(u.uTime, time);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    rafId = window.requestAnimationFrame(render);

    wakeRef.current = () => {
      if (!running) return;
      // rAF sudah berjalan kontinu; hook dipertahankan untuk kompatibilitas dengan pemanggil wake()
    };

    // Hilangkan event contextlost: tandai tidak ready agar <img> tetap tampil
    const onContextLost = event => {
      event.preventDefault();
      setReady(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      disposed = true;
      running = false;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      loadRef.current = null;
      wakeRef.current = null;
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      program = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  useEffect(() => {
    loadRef.current?.(image);
  }, [image]);

  const handlePointerMove = event => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    pointerRef.current = {
      x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
      y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
      inside: true
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current.inside = false;
  };

  const toggleFlip = () => {
    if (!flippable) return;
    setFlipped(value => !value);
  };

  const handleKeyDown = event => {
    if (!flippable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFlip();
    }
  };

  const rootStyle = {
    '--hc-w': `${width}px`,
    '--hc-ratio': String(ratio),
    '--hc-radius': `${radius}px`,
    perspective: `${PERSPECTIVE}px`,
    ...style
  };

  const rootClassName = ['holo-card', className].filter(Boolean).join(' ');

  return (
    <div
      ref={rootRef}
      className={rootClassName}
      style={rootStyle}
      {...(flippable ? { 'data-flippable': 'true', 'data-flipped': flipped ? 'true' : 'false', role: 'button', tabIndex: 0, 'aria-label': `${alt || 'Kartu'} — tekan untuk membalik` } : {})}
      {...(ready ? { 'data-ready': 'true' } : {})}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
    >
      {shadow ? <div ref={shadowRef} className="holo-card__shadow" aria-hidden="true" /> : null}
      <div ref={rotorRef} className="holo-card__rotor">
        <div className="holo-card__face holo-card__face--front">
          {image ? (
            <img
              src={image}
              alt={alt}
              draggable={false}
              onLoad={event => {
                const el = event.currentTarget;
                if (el.naturalWidth > 0 && el.naturalHeight > 0) {
                  // CSS aspect-ratio = width / height
                  setRatio(el.naturalWidth / el.naturalHeight);
                }
              }}
            />
          ) : null}
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
        {flippable ? (
          <div className="holo-card__face holo-card__face--back">
            {backImage ? (
              <img src={backImage} alt={`${alt || 'Kartu'} (belakang)`} draggable={false} />
            ) : (
              <div className="holo-card__back-content">{backContent}</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
