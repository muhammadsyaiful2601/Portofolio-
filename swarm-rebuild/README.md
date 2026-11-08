# Swarm Rebuild

Efek visual "rekonstruksi halaman" (DOM snapshot & animated reconstructed draw) untuk halaman
portofolio. Vanilla JS (ES6 module) + HTML5 Canvas 2D. **Tanpa dependensi eksternal.**

## File

| File               | Fungsi                                                         |
| ------------------ | -------------------------------------------------------------- |
| `swarm-rebuild.js` | Core engine & logika animasi canvas (import modul ini)          |
| `swarm-rebuild.css`| Styling overlay canvas, floating control bar, & demo            |
| `index.html`       | Demo sederhana + tombol trigger                                 |

## Cara pakai

```html
<link rel="stylesheet" href="./swarm-rebuild.css" />
<button id="rebuild">Swarm Rebuild</button>

<script type="module">
  import { triggerSwarmRebuild, cancelSwarmRebuild } from './swarm-rebuild.js';

  document.getElementById('rebuild').addEventListener('click', () => {
    triggerSwarmRebuild(document.querySelector('#target'), {
      speed: 1,            // 1 | 2 | 4 (bisa diubah live via control bar)
      hideSelector: null,  // opsional: selector elemen yang di-hide (default: semua anak <body>)
      onComplete: () => {},
      onCancel: () => {},
    });
  });
</script>
```

- `target` — elemen yang "direkonstruksi" (posisi & ukuran dibaca via `getBoundingClientRect`; teks
  diambil dari `h1/h2/h3` & `p` pertama di dalamnya, gambar dari `img` pertama bila ada).
- Keyboard: `Esc` atau `Ctrl/Cmd + Shift + R` membatalkan animasi.
- Setelah selesai/dibatalkan, canvas, listener, dan elemen control bar dihapus otomatis.

## Fase animasi

1. **Blankout** — halaman disembunyikan (`visibility: hidden`, tanpa reflow), overlay gelap muncul.
2. **Swarm** — 8 kursor berlabel menyebar dari tengah viewport ke sekeliling target.
3. **Rebuild** — Kursor A menggambar wireframe (pen-tool), Kursor B mengetik teks + caret, Kursor C
   mengisi background + memasukkan gambar/visual.
4. **Handoff** — canvas & overlay memudar, UI asli tampil kembali (crossfade).

Kontrol mengambang (pojok kanan bawah): pemilih kecepatan `1x / 2x / 4x` dan `Skip / Cancel`.
