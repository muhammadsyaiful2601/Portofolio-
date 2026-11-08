import './Budget.css';
import eventImg from '../../assets/website/Event Kampus.jpg';
import webgisImg from '../../assets/website/WebGis.jpg';
import jadwalImg from '../../assets/website/Jadwal Kampus.jpg';
import peminjamanImg from '../../assets/website/peminjaman.png';
import sppImg from '../../assets/website/spp.png';

const budgetCards = [
  {
    id: 'event',
    title: 'Event Kampus',
    image: eventImg,
    accent: '#d4af37',
    amount: 'Rp 15.000.000',
    desc: 'Pengelolaan acara kampus skala besar',
  },
  {
    id: 'webgis',
    title: 'WebGIS',
    image: webgisImg,
    accent: '#4ECDC4',
    amount: 'Rp 25.000.000',
    desc: 'Sistem informasi geografis berbasis web',
  },
  {
    id: 'jadwal',
    title: 'Jadwal Kampus',
    image: jadwalImg,
    accent: '#FF6B6B',
    amount: 'Rp 12.000.000',
    desc: 'Sistem pengelolaan jadwal perkuliahan',
  },
  {
    id: 'peminjaman',
    title: 'Sistem Peminjaman',
    image: peminjamanImg,
    accent: '#95E1D3',
    amount: 'Rp 18.000.000',
    desc: 'Sistem peminjaman ruangan dan barang kampus',
  },
  {
    id: 'spp',
    title: 'Pencatatan SPP',
    image: sppImg,
    accent: '#FFE66D',
    amount: 'Rp 10.000.000',
    desc: 'Sistem pencatatan SPP siswa kampus',
  },
];

export default function Budget() {
  return (
    <div className="budget-grid">
      {budgetCards.map((card) => (
        <article key={card.id} className="budget-card">
          <div className="budget-card-image">
            <img src={card.image} alt={card.title} loading="lazy" />
          </div>
          <div className="budget-card-info">
            <h3>{card.title}</h3>
            <p className="budget-amount" style={{ background: card.accent }}>
              {card.amount}
            </p>
            <p className="budget-desc">{card.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
