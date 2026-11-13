/**
 * drive-assets.js — Sumber aset gambar yang di-host di Google Drive
 * (folder root "Portofolio", sharing: siapa saja yang punya link — viewer).
 *
 * Tiap file di Drive punya fileId stabil. URL `/img/<id>=s<N>` di-proxy oleh
 * hosting ke `lh3.googleusercontent.com/d/<id>=s<N>` (Vercel rewrite / Vite proxy),
 * jadi browser selalu memuat gambar dari origin yang sama — tanpa hotlink.
 * Suffix `=s<N>` membatasi ukuran terpanjang & mengompres otomatis.
 * JANGAN mengganti fileId secara manual kecuali file di Drive memang diganti.
 */
const driveImg = (id, size = 1200) => `/img/${id}=s${size}`;

/** Sertifikat (folder "sertifikat") — tampil sebagai TearTicket + lightbox */
export const SERTIFIKAT = {
  awsFoundations: driveImg('1eWwUAhXmJKdSqhFeU7mpLHhW_wl8oGZP', 1400),
  awsArchitecting: driveImg('1LwF9h8F1uVHp2X0zCDq4W4i6DiMK1wSU', 1400),
  huawei: driveImg('1dsFmVok9xBx9WbcOI0PCiCKfTiwh2APT', 1400),
  panitia: driveImg('1FDzfjGREU9R02jCLPNIZ_6s6Me750OiU', 1400),
  overviewOfAi: driveImg('1vVRgRClXBuZ5918KXxmbjTfCAVNY6aCh', 1400),
};

/** Badge (folder "badge") — tampil sebagai FlipCard */
export const BADGE = {
  awsFoundations: driveImg('1wsFljzRxRWZnQfkqEB_DIuckJXXGIwI0', 800),
  awsArchitecting: driveImg('1tFaDPwcrg3g8E4uAqoPP3Sg182UoNibx', 800),
};

/** Proyek (folder "proyek") — halaman folder, modal detail, poster video */
export const PROJECT_IMAGES = {
  event: driveImg('1hkxf3KAJgaWDzLf2aNWQqduIU4GUfW26', 1600),
  webgis: driveImg('19oQhW22gr1uwlp2fWvU6hnAto1Z2bcnr', 1600),
  jadwal: driveImg('1Qtvl_sXmxhK8VeUmjDoly3UaEVjvOK8R', 1600),
  peminjaman: driveImg('1KkyvxwNLIqCANI3bYc6wM0iUmY6Ui818', 1600),
  spp: driveImg('1ht_2MK7I5uIheApzi2sTxJcfXJig3Byf', 1600),
};

/**
 * Galeri (folder "galeri") — urutan sama seperti sebelumnya.
 * `name` mempertahankan "WhatsApp Image …" asli agar caption tanggal &
 * rarity (hash nama file) di PhotoGallery tetap identik.
 */
export const GALLERY = [
  { name: 'WhatsApp Image 2026-08-06 at 12.29.51.jpeg', id: '1_sjbQAgmGBgEcDyv7ZZXfIqz9xTfOb2l' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.52 (1).jpeg', id: '1w6EoIwHFvXZtY-VA8GyIh8zQ3a8N87nB' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.52.jpeg', id: '1rX0Gg7NvNmE5eGsOtFUFpXR1KY8KIGnV' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.53 (1).jpeg', id: '1aeHVcv2-GYcqeo-J4bqky797qtmRmKxd' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.53.jpeg', id: '1WYA1qlSSxWeuYeDNvWk5_VhI6CWXDpG0' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.54 (1).jpeg', id: '1FZEWFLt57NyUfg9crmfVT8gEEQQsn7gQ' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.54 (2).jpeg', id: '1HvgXGXRYf-f-23sV2Q2cO74rJAGqr536' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.54.jpeg', id: '1NTixXu_drAnQ19Dppu_2m9f_DoSTVrYC' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.55 (1).jpeg', id: '1XV9MuN2W7wT3Z-cWJEHuMAG30_ZBNcRy' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.55.jpeg', id: '1mbjiZDbZD_PfCblPXNpMjzlhkMhQwm60' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.56 (1).jpeg', id: '1U4PScbEZ0GeTvlfb-74jtHJCicd5Svn-' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.56 (2).jpeg', id: '15r3uUBsbFVNNeVHXyoeSWrfQXdRffWto' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.56.jpeg', id: '1jTzeI3BabJxmWvYXFuUzzY9uDMgFeY1e' },
  { name: 'WhatsApp Image 2026-08-06 at 12.29.57.jpeg', id: '1FBx6H0jYMBnoyGyc8WV28J9nZutJgbw-' },
  { name: 'WhatsApp Image 2026-08-29 at 19.41.45 (1).jpeg', id: '1jdyCSPXJyVUcCaWjHX6Xf-i20RTut0-Y' },
  { name: 'WhatsApp Image 2026-08-29 at 19.41.45.jpeg', id: '1m3r7920njt6jy66PbccTlxHcdc9Twetq' },
  { name: 'WhatsApp Image 2026-08-29 at 19.41.46 (1).jpeg', id: '1J4pkR2xVsamkwEm0t-Z846FB7z6ImKmi' },
  { name: 'WhatsApp Image 2026-08-29 at 19.41.46 (2).jpeg', id: '1NtxJZawIgQIE-n2EA6PlwOxoQRVxHLu_' },
  { name: 'WhatsApp Image 2026-08-29 at 19.41.46.jpeg', id: '1UAxyB8FtqYSBQv0eD_LP-kBwU7byQO87' },
  { name: 'WhatsApp Image 2026-08-29 at 19.41.47.jpeg', id: '1QSJlDe6x3Zp2xc05VhxCq1_pRIj3NudI' },
  { name: 'WhatsApp Image 2026-08-29 at 19.41.57.jpeg', id: '1j6UiSvXf-rYDD97qii0ZBXdk2mseGQcj' },
  { name: 'WhatsApp Image 2026-08-29 at 19.42.57.jpeg', id: '1sYBSDhPi4ctan71TAZv14X60pud5jgCi' },
  { name: 'WhatsApp Image 2026-08-29 at 19.42.59.jpeg', id: '14dLL-6ty7ces2kRcsnDmQJJDKUKc65XX' },
  { name: 'WhatsApp Image 2026-08-29 at 19.43.00.jpeg', id: '1kd8uShaadEBtLhROMq-cIxmiv6ZCa1Lr' },
  { name: 'WhatsApp Image 2026-08-29 at 19.43.01 (1).jpeg', id: '1OkZWqoyUaesLFuhw6ZpTm46gfjYEMYsN' },
  { name: 'WhatsApp Image 2026-08-29 at 19.43.01.jpeg', id: '1UZUCtd2YoNXjSZIiZNf91jqRfLtypBQz' },
  { name: 'WhatsApp Image 2026-08-29 at 19.43.02 (1).jpeg', id: '1OzCvL-qVgks8BI1uhz4TfkBLnwqNq4P7' },
  { name: 'WhatsApp Image 2026-08-29 at 19.43.02 (2).jpeg', id: '1oHltBiElnrl1I_mrzwZ4WxGJnzkvdMnb' },
  { name: 'WhatsApp Image 2026-08-29 at 19.43.02.jpeg', id: '1vAcfd9qc7vBoGA9m10liBHXcYB2IPbZ3' },
  { name: 'WhatsApp Image 2026-08-29 at 19.43.03 (1).jpeg', id: '1hRQOBJezKLUiKd_7ePZMlXmIE5qcmGZz' },
  { name: 'WhatsApp Image 2026-08-29 at 19.43.03.jpeg', id: '1JQIgyLIwsLZwWmiy31YrrqMqfFDSrEvr' },
  { name: 'WhatsApp Image 2026-08-29 at 19.43.04.jpeg', id: '14o-TKuBNYkhPcNBpZlxA_W-By-5xk3b5' },
].map(({ name, id }) => ({ name, src: driveImg(id, 1200) }));

/** Semua URL aset Drive — dipakai preloader background saat loading awal */
export const DRIVE_PRELOAD_URLS = [
  ...Object.values(SERTIFIKAT),
  ...Object.values(BADGE),
  ...Object.values(PROJECT_IMAGES),
  ...GALLERY.map((g) => g.src),
];

/**
 * Unduh aset Drive di background dengan antrean terbatas (maks 4 request
 * bersamaan) — permintaan beruntun terlalu banyak membuat Google membatasi
 * (throttling), sehingga sebagian gambar gagal. Antrean membuat semua
 * gambar tetap terunduh tanpa dibakar kapasitasnya sekaligus.
 * Otomatis mengisi HTTP cache browser, jadi <img> tampil instan setelahnya.
 */
export function preloadDriveAssets() {
  const queue = [...DRIVE_PRELOAD_URLS];
  const MAX_CONCURRENT = 4;
  let started = 0;
  const next = () => {
    const url = queue.shift();
    if (!url) return;
    started += 1;
    const img = new Image();
    img.decoding = 'async';
    img.onload = img.onerror = next;
    img.src = url;
  };
  const start = () => {
    for (let i = 0; i < MAX_CONCURRENT; i += 1) next();
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(start, { timeout: 1500 });
  } else {
    setTimeout(start, 300);
  }
}
