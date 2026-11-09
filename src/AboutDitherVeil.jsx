import DitherVeil from './DitherVeil/DitherVeil.jsx';
import fotoAtas from '../assets/foto di bagian siapa saya/foto di atas.png';
import fotoCursor from '../assets/foto di bagian siapa saya/foto ketika cursor.png';

// Foto interaktif "Siapa Saya?": foto utama dicetak dither (gaya cetak),
// di bawah cursor tampak foto penyamaran full-color hanya di area kursor
export default function AboutDitherVeil() {
  return (
    <DitherVeil
      src={fotoAtas}
      revealSrc={fotoCursor}
      pattern="floyd"
      pixelSize={1}
      palette="rgb"
      levels={16}
      inkColor="#141414"
      paperColor="#FFFEF0"
      revealRadius={150}
      softness={0.6}
      linger={1}
      brightness={0.1}
      contrast={1}
      clickBurst
    />
  );
}
