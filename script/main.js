// ====== PENGATURAN ======
const WA_NUMBER = '6281234567890'; // ganti dengan nomor WhatsApp Nangkringin (format 62..., tanpa + / 0 di depan)
const PER_PAGE = 6;
const UNS = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`;

// ====== DATA MENU (ganti nama, harga, gambar sesuai menu asli) ======
const MENU = {
    Makanan: [
        { name: 'Nasi Goreng', price: 20000, img: UNS('1512058564366-18510be2db19') },
        { name: 'Burger Beef', price: 28000, img: UNS('1568901346375-23c9450c58cd') },
        { name: 'Pizza Mini', price: 30000, img: UNS('1565299624946-b28f40a0ae38') },
        { name: 'Salad Bowl', price: 25000, img: UNS('1546069901-ba9599a7e63c') },
        { name: 'Mie Goreng', price: 18000, img: '' },
        { name: 'Ayam Geprek', price: 22000, img: '' },
        { name: 'Kentang Goreng', price: 15000, img: '' },
        { name: 'Sosis Bakar', price: 16000, img: '' },
        { name: 'Roti Bakar', price: 14000, img: '' },
        { name: 'Chicken Katsu', price: 24000, img: '' }
    ],
    Minuman: [
        { name: 'Kopi Susu Nangkring', price: 18000, img: UNS('1461023058943-07fcbe16d735') },
        { name: 'Americano', price: 15000, img: UNS('1509042239860-f550ce710b93') },
        { name: 'Es Kopi Aren', price: 20000, img: UNS('1517701550927-30cf4ba1dba5') },
        { name: 'Teh Tarik', price: 14000, img: UNS('1556679343-c7306c1976bc') },
        { name: 'Jus Jeruk', price: 15000, img: UNS('1600271886742-f049cd451bba') },
        { name: 'Matcha Latte', price: 22000, img: '' },
        { name: 'Coklat Panas', price: 18000, img: '' },
        { name: 'Lemon Tea', price: 12000, img: '' },
        { name: 'Cappuccino', price: 20000, img: '' }
    ],
    Dessert: [
        { name: 'Choco Lava Cake', price: 22000, img: UNS('1578985545062-69928b1d9587') },
        { name: 'Pancake Madu', price: 20000, img: UNS('1567620905732-2d1ec7ab7445') },
        { name: 'Donat Glaze', price: 12000, img: UNS('1551024601-bec78aea704b') },
        { name: 'Es Krim Vanilla', price: 15000, img: UNS('1563805042-7684c019e1cb') },
        { name: 'Pisang Coklat', price: 14000, img: '' },
        { name: 'Puding Karamel', price: 13000, img: '' },
        { name: 'Waffle', price: 19000, img: '' },
        { name: 'Cheesecake', price: 24000, img: '' }
    ]
};

// ====== REKOMENDASI (campuran makanan, minuman, dessert; ambil dari data di atas) ======
const pick = (cat, name) => MENU[cat].find(i => i.name === name);
MENU.Rekomendasi = [
    pick('Makanan', 'Nasi Goreng'),
    pick('Makanan', 'Burger Beef'),
    pick('Minuman', 'Kopi Susu Nangkring'),
    pick('Minuman', 'Es Kopi Aren'),
    pick('Dessert', 'Choco Lava Cake'),
    pick('Dessert', 'Pancake Madu')
];

// ====== STATE ======
const state = { cat: 'Makanan', page: 1 };
const $ = (s) => document.querySelector(s);
const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');
const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const placeholder = (name) => `https://placehold.co/600x400/EFE8DC/5C4033?text=${encodeURIComponent(name)}`;

// ====== RENDER MENU ======
function renderCategories() {
    $('#catButtons').innerHTML = Object.keys(MENU).map(c => {
        const active = c === state.cat;
        return `<button role="tab" aria-selected="${active}" data-cat="${c}"
            class="px-3 sm:px-6 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${active ? 'bg-[#FDFBF7] text-[#5C4033] shadow' : 'text-white hover:bg-white/15'}">${c}</button>`;
    }).join('');
}

function renderGrid() {
    const items = MENU[state.cat];
    const start = (state.page - 1) * PER_PAGE;
    $('#menuGrid').innerHTML = items.slice(start, start + PER_PAGE).map((it, i) => `
        <article class="card-in bg-[#FDFBF7] rounded-2xl p-4 shadow-xl flex flex-col justify-between" style="animation-delay:${i * 40}ms">
            <div>
                <div class="w-full h-48 rounded-xl overflow-hidden mb-4 shadow-inner bg-[#EFE8DC]">
                    <img src="${it.img || placeholder(it.name)}" alt="${it.name}" loading="lazy" class="w-full h-full object-cover"
                        onerror="this.onerror=null;this.src='${placeholder(it.name)}'">
                </div>
                <h3 class="font-bold text-lg text-neutral-800">${it.name}</h3>
            </div>
            <div class="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
                <span class="font-extrabold text-[#5C4033]">${rupiah(it.price)}</span>
                <a href="${waLink(`Halo Nangkringin, saya mau pesan ${it.name} (${rupiah(it.price)}).`)}" target="_blank" rel="noopener"
                    class="bg-[#5C4033] hover:bg-[#4A3319] text-white text-xs font-bold px-4 py-2 rounded-full transition">Pesan</a>
            </div>
        </article>`).join('');
}

function renderPagination() {
    const total = Math.ceil(MENU[state.cat].length / PER_PAGE);
    const box = $('#pagination');
    if (total <= 1) { box.innerHTML = ''; return; }
    const base = 'w-10 h-10 rounded-full text-sm font-bold transition flex items-center justify-center';
    let html = `<button data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="Halaman sebelumnya"
        class="${base} bg-[#5C4033] text-white hover:bg-[#4A3319] disabled:opacity-40 disabled:cursor-not-allowed"><i class="fa-solid fa-chevron-left"></i></button>`;
    for (let p = 1; p <= total; p++) {
        html += `<button data-page="${p}" ${p === state.page ? 'aria-current="page"' : ''}
            class="${base} ${p === state.page ? 'bg-[#FDFBF7] text-[#5C4033] shadow' : 'bg-white/20 text-white hover:bg-white/35'}">${p}</button>`;
    }
    html += `<button data-page="${state.page + 1}" ${state.page === total ? 'disabled' : ''} aria-label="Halaman berikutnya"
        class="${base} bg-[#5C4033] text-white hover:bg-[#4A3319] disabled:opacity-40 disabled:cursor-not-allowed"><i class="fa-solid fa-chevron-right"></i></button>`;
    box.innerHTML = html;
}

function render() { renderCategories(); renderGrid(); renderPagination(); }

function setCategory(cat) { state.cat = cat; state.page = 1; render(); }

// Ganti kategori
$('#catButtons').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (b) setCategory(b.dataset.cat);
});

// Ganti halaman
$('#pagination').addEventListener('click', e => {
    const b = e.target.closest('[data-page]');
    if (!b || b.disabled) return;
    state.page = +b.dataset.page;
    renderGrid(); renderPagination();
    $('#menu').scrollIntoView({ behavior: 'smooth' });
});

// Klik ikon kategori -> pilih kategori + scroll ke menu
document.querySelectorAll('[data-goto-cat]').forEach(b => b.addEventListener('click', () => {
    setCategory(b.dataset.gotoCat);
    $('#menu').scrollIntoView({ behavior: 'smooth' });
}));

// Semua tombol "Pesan Sekarang" -> WhatsApp
document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = waLink('Halo Nangkringin, saya mau pesan.');
    a.target = '_blank'; a.rel = 'noopener';
});

// ====== NAVBAR: efek scroll + link aktif ======
const navbar = $('#navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

const links = document.querySelectorAll('.nav-link');
const setActive = (id) => links.forEach(l => l.classList.toggle('active', l.dataset.target === id));
const observer = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id); });
}, { rootMargin: '-45% 0px -50% 0px' });
['beranda', 'info', 'menu'].forEach(id => observer.observe(document.getElementById(id)));

render();
