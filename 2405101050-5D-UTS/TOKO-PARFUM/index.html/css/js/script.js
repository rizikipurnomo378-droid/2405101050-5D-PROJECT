// ===== Konfigurasi, helper & state =====
const K = 'aromacraft_v1';

const rp = n => 'Rp' + Number(n).toLocaleString('id-ID');

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
}[c]));

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const DAY = 864e5;

const fmt = t => new Date(t).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});
const $ = id => document.getElementById(id);

const val = id => ($(id)?.value || '').trim();
const SZ = [30, 50, 100];
const COUR = [['JNE Fragile', 18000, '2–3 hari'], ['J&T Express', 15000, '2–4 hari'], ['SiCepat BEST', 16000, '2–3 hari']];
const PACK = [['Bubble wrap + dus tebal', 5000], ['Kayu pelindung (ekstra aman)', 15000]];
const CPRICE = {
    30: 220000,
    50: 330000,
    100: 520000
};
const NT = {
    t: ['Bergamot', 'Lemon', 'Jeruk Bali', 'Pir', 'Kardamom'],
    m: ['Mawar', 'Jasmine', 'Cedar', 'Neroli', 'Peony'],
    b: ['Oud', 'Amber', 'White Musk', 'Vanilla', 'Sandalwood']
};

// ===== Data awal & penyimpanan (localStorage) =====

function seed() {
    const now = Date.now();
    const P = [
        [
            'Nocturne Oud', 'Woody', 'Pria', 'EDP', 'Bergamot, Kardamom', 'Cedar, Violet Leaf', 'Oud, Amber', 189000,
            [12, 8, 3]
        ],
        [
            'Velvet Peony', 'Floral', 'Wanita', 'EDP', 'Pir, Lychee', 'Peony, Mawar', 'Musk, Vanilla', 175000,
            [15, 10, 6]
        ],
        [
            'Citrus Aurora', 'Citrus', 'Unisex', 'EDT', 'Jeruk Bali, Lemon', 'Neroli, Jahe', 'White Musk, Cedar', 149000,
            [20, 14, 9]
        ],
        [
            'Sandal Reverie', 'Woody', 'Unisex', 'Parfum', 'Pink Pepper', 'Sandalwood, Iris', 'Tonka, Ambroxan', 229000,
            [7, 5, 2]
        ],
        [
            'Jasmine Hour', 'Floral', 'Wanita', 'EDT', 'Mandarin', 'Jasmine, Melati', 'Cashmere Wood', 159000,
            [11, 9, 4]
        ],
        [
            'Yuzu Breeze', 'Citrus', 'Pria', 'EDT', 'Yuzu, Mint', 'Teh Hijau', 'Vetiver', 139000,
            [18, 12, 8]
        ],
        [
            'Teak and Tobacco', 'Woody', 'Pria', 'Parfum', 'Rum, Kayu Manis', 'Daun Tembakau', 'Teak, Kulit', 249000,
            [6, 4, 1]
        ],
        [
            'Rose Atelier', 'Floral', 'Unisex', 'EDP', 'Raspberry', 'Mawar Damask', 'Patchouli', 185000,
            [9, 7, 5]
        ]
    ].map((a, i) => ({
        id: 'p' + (i + 1),
        name: a[0],
        fam: a[1],
        gen: a[2],
        conc: a[3],
        t: a[4],
        m: a[5],
        b: a[6],
        price: {
            30: a[7],
            50: Math.round(a[7] * 1.55 / 1000) * 1000,
            100: Math.round(a[7] * 2.5 / 1000) * 1000
        },
        stock: {
            30: a[8][0],
            50: a[8][1],
            100: a[8][2]
        },
        active: true,
        desc: 'Racikan ' + a[3] + ' dengan karakter ' + a[1].toLowerCase() + ', cocok untuk ' + a[2].toLowerCase() + '. Dikemas aman untuk pengiriman cairan.'
    }));
    const users = [{
            id: 'u0',
            name: 'Oner',
            email: 'admin@gmail.com',
            phone: '081200000000',
            pw: 'admin123',
            role: 'admin',
            active: true,
            addrs: [],
            main: '',
            cart: []
        }, {
            id: 'u1',
            name: 'Rizky Ramadhan',
            email: 'rizki@gmail.com',
            phone: '081377778888',
            pw: 'rizki123',
            role: 'user',
            active: true,
            addrs: [{
                    id: 'a1',
                    label: 'Rumah',
                    text: 'Jl. Melati No. 5, Madiun, Jawa Timur 63111'
                }],
            main: 'a1',
            cart: []
        }];
    const orders = [
        [0, 'p1', 50, 1],
        [1, 'p2', 30, 2],
        [2, 'p3', 100, 1],
        [4, 'p6', 50, 1],
        [6, 'p4', 30, 2]
    ].map(([d, pid, s, q], i) => {
        const p = P.find(x => x.id == pid);
        const sub = p.price[s] * q;
        return {
            id: 's' + i,
            uid: 'u1',
            items: [{
                    pid,
                    name: p.name,
                    size: s,
                    qty: q,
                    price: p.price[s],
                    label: ''
                }],
            sub,
            ship: 15000,
            pack: 5000,
            total: sub + 20000,
            courier: 'J&T Express',
            addr: users[1].addrs[0].text,
            status: 'Selesai',
            method: 'QRIS',
            proof: 'bukti.jpg',
            created: now - d * DAY - 36e5,
            exp: now - d * DAY,
            paidAt: now - d * DAY - 30 * 6e4,
            resi: 'JT00' + i + '123456',
            note: ''
        };
    });
    return {
        fams: ['Woody', 'Floral', 'Citrus', 'Custom Blend'],
        P,
        users,
        orders,
        hist: [],
        sess: null
    };
}
let DB = (() => {
    try {
        const s = localStorage.getItem(K);
        if (s)
            return JSON.parse(s);
    }
    catch (e) {
    }
    return seed();
})();

function save() {
    try {
        localStorage.setItem(K, JSON.stringify(DB));
    }
    catch (e) {
    }
}

const me = () => DB.users.find(u => u.id === DB.sess);

const prod = id => DB.P.find(p => p.id === id);

const totStock = p => SZ.reduce((a, s) => a + (p.stock[s] || 0), 0);

const minP = p => Math.min(...SZ.map(s => p.price[s]));
const S = {
    q: '',
    fam: '',
    gen: '',
    sort: '',
    st: '',
    E: null,
    from: '',
    to: '',
    grp: 'd',
    csv: ''
};
let tt;

function toast(m) {
    const t = $('toast');
    t.textContent = m;
    t.classList.add('on');
    clearTimeout(tt);
    tt = setTimeout(() => t.classList.remove('on'), 2600);
}

const go = h => {
    if (location.hash === '#' + h)
        route();
    else
        location.hash = h;
};

const st = s => `<span class="st ${esc(s)}">${esc(s)}</span>`;
const PAIDS = ['Diproses', 'Dikemas', 'Dikirim', 'Selesai'];

function expire() {
    let c = 0;
    DB.orders.forEach(o => {
        if (o.status === 'Menunggu Pembayaran' && Date.now() > o.exp) {
            o.status = 'Kedaluwarsa';
            c++;
        }
    });
    if (c)
        save();
}

// ===== Autentikasi & profil =====

function daftar() {
    const n = val('rn');
    const e = val('re').toLowerCase();
    const h = val('rh');
    const p = $('rp').value;
    let m = '';
    if (n.length < 3)
        m = 'Nama minimal 3 karakter.';
    else if (!/^\S+@\S+\.\S+$/.test(e))
        m = 'Format email tidak valid.';
    else if (!/^08\d{8,11}$/.test(h))
        m = 'Nomor WhatsApp harus diawali 08 dan 10–13 digit.';
    else if (p.length < 6)
        m = 'Kata sandi minimal 6 karakter.';
    else if (DB.users.some(u => u.email === e))
        m = 'Email sudah terdaftar.';
    if (m) {
        $('er').textContent = m;
        return;
    }
    const u = {
        id: uid(),
        name: n,
        email: e,
        phone: h,
        pw: p,
        role: 'user',
        active: true,
        addrs: [],
        main: '',
        cart: []
    };
    DB.users.push(u);
    DB.sess = u.id;
    save();
    toast('Akun berhasil dibuat');
    go('katalog');
}

function masuk() {
    const u = DB.users.find(x => x.email === val('le').toLowerCase() && x.pw === $('lp').value);
    if (!u) {
        $('er').textContent = 'Email atau kata sandi salah.';
        return;
    }
    if (!u.active) {
        $('er').textContent = 'Akun dinonaktifkan. Hubungi admin.';
        return;
    }
    DB.sess = u.id;
    save();
    toast('Selamat datang, ' + u.name);
    go(u.role === 'admin' ? 'admin' : 'akun');
}

function lupa() {
    const u = DB.users.find(x => x.email === val('le').toLowerCase());
    toast(u ? 'Tautan reset dikirim ke ' + u.email + ' (simulasi)' : 'Isi email yang terdaftar dulu');
}

function keluar() {
    DB.sess = null;
    save();
    toast('Anda sudah keluar');
}

function simpanProfil() {
    const n = val('pn');
    const h = val('ph');
    if (n.length < 3 || !/^08\d{8,11}$/.test(h)) {
        $('er').textContent = 'Nama minimal 3 karakter dan nomor harus valid.';
        return;
    }
    Object.assign(me(), {
        name: n,
        phone: h
    });
    save();
    toast('Profil disimpan');
    route();
}

function tambahAlamat() {
    const l = val('al');
    const t = val('at');
    if (!l || t.length < 10) {
        $('er3').textContent = 'Isi label dan alamat lengkap (min. 10 karakter).';
        return;
    }
    const u = me();
    const a = {
        id: uid(),
        label: l,
        text: t
    };
    u.addrs.push(a);
    if (!u.main)
        u.main = a.id;
    save();
    route();
}

function utamaAlamat(id) {
    me().main = id;
    save();
    route();
}

function hapusAlamat(id) {
    const u = me();
    u.addrs = u.addrs.filter(a => a.id !== id);
    if (u.main === id)
        u.main = u.addrs[0]?.id || '';
    save();
    route();
}

function gantiPw() {
    const u = me();
    if ($('po').value !== u.pw) {
        $('er2').textContent = 'Kata sandi lama salah.';
        return;
    }
    if ($('pb').value.length < 6) {
        $('er2').textContent = 'Kata sandi baru minimal 6 karakter.';
        return;
    }
    u.pw = $('pb').value;
    save();
    toast('Kata sandi diganti');
    route();
}

// ===== Keranjang & pesanan =====

function needUser() {
    const u = me();
    if (!u) {
        toast('Masuk dulu untuk berbelanja');
        go('login');
        return null;
    }
    if (u.role === 'admin') {
        toast('Akun admin tidak dapat berbelanja');
        return null;
    }
    return u;
}

function addCart(pid) {
    const u = needUser();
    if (!u)
        return;
    const p = prod(pid);
    const s = +document.querySelector('input[name=sz]:checked')?.value;
    const q = Math.max(1, +val('qt') || 1);
    const lb = val('lb').slice(0, 20);
    const ex = u.cart.find(c => c.pid === pid && c.size === s && c.label === lb);
    const have = (ex?.qty || 0) + q;
    if (have > p.stock[s]) {
        $('er').textContent = 'Stok ukuran ' + s + 'ml tinggal ' + p.stock[s] + '.';
        return;
    }
    if (ex)
        ex.qty = have;
    else
        u.cart.push({
            pid,
            name: p.name,
            size: s,
            qty: q,
            price: p.price[s],
            label: lb
        });
    save();
    toast('Masuk keranjang');
    go('keranjang');
}

function addCustom() {
    const u = needUser();
    if (!u)
        return;
    const t = $('ct').value;
    const m = $('cm').value;
    const b = $('cb').value;
    const s = +$('cs').value;
    u.cart.push({
        pid: 'custom',
        name: 'Racikan Kustom (' + t + ' / ' + m + ' / ' + b + ')',
        size: s,
        qty: 1,
        price: CPRICE[s],
        label: val('cl').slice(0, 20)
    });
    save();
    toast('Racikan masuk keranjang');
    go('keranjang');
}

function qty(i, d) {
    const c = me().cart[i];
    const p = prod(c.pid);
    const n = c.qty + d;
    if (n < 1)
        return;
    if (p && n > p.stock[c.size]) {
        toast('Stok tidak cukup');
        return;
    }
    c.qty = n;
    save();
    route();
}

function hapusCart(i) {
    me().cart.splice(i, 1);
    save();
    route();
}

const calc = (items, ci, pi) => {
    const sub = items.reduce((a, c) => a + c.price * c.qty, 0);
    return {
        sub,
        ship: COUR[ci][1],
        pack: PACK[pi][1],
        total: sub + COUR[ci][1] + PACK[pi][1]
    };
};

function buat() {
    const u = me();
    const a = u.addrs.find(x => x.id === val('ad'));
    const ci = +document.querySelector('input[name=ek]:checked')?.value;
    const pi = +document.querySelector('input[name=pk]:checked')?.value;
    if (!a) {
        $('er').textContent = 'Pilih alamat pengiriman.';
        return;
    }
    for (const c of u.cart) {
        const p = prod(c.pid);
        if (p && c.qty > p.stock[c.size]) {
            $('er').textContent = c.name + ' ' + c.size + 'ml stok tidak cukup.';
            return;
        }
    }
    const k = calc(u.cart, ci, pi);
    const o = {
        id: 'o' + uid(),
        uid: u.id,
        items: u.cart.map(c => ({ ...c })),
        ...k,
        courier: COUR[ci][0],
        addr: a.text,
        status: 'Menunggu Pembayaran',
        method: '',
        proof: '',
        created: Date.now(),
        exp: Date.now() + 36e5,
        paidAt: null,
        resi: '',
        note: ''
    };
    DB.orders.unshift(o);
    u.cart = [];
    save();
    go('bayar' + o.id);
}

function bayar(id) {
    const o = DB.orders.find(x => x.id === id);
    const f = $('pf').files[0];
    const m = document.querySelector('input[name=mt]:checked');
    if (!m) {
        $('er').textContent = 'Pilih metode pembayaran.';
        return;
    }
    if (!f) {
        $('er').textContent = 'Unggah bukti bayar terlebih dulu.';
        return;
    }
    Object.assign(o, {
        method: m.value,
        proof: f.name,
        status: 'Menunggu Verifikasi',
        note: ''
    });
    save();
    toast('Bukti bayar terkirim');
    go('transaksi' + id);
}

function batal(id) {
    const o = DB.orders.find(x => x.id === id);
    if (o.status !== 'Menunggu Pembayaran')
        return;
    o.status = 'Dibatalkan';
    save();
    toast('Pesanan dibatalkan');
    go('transaksi' + id);
}

function diterima(id) {
    DB.orders.find(x => x.id === id).status = 'Selesai';
    save();
    toast('Terima kasih! Pesanan selesai');
    route();
}

function reorder(id) {
    const u = me();
    const o = DB.orders.find(x => x.id === id);
    let n = 0;
    o.items.forEach(i => {
        const p = prod(i.pid);
        if (i.pid === 'custom' || (p && p.active && p.stock[i.size] >= i.qty)) {
            u.cart.push({
                ...i,
                price: p ? p.price[i.size] : i.price
            });
            n++;
        }
    });
    save();
    toast(n ? n + ' item masuk keranjang' : 'Item tidak tersedia / stok habis');
    if (n)
        go('keranjang');
}

// ===== Aksi admin =====

function terima(id) {
    const o = DB.orders.find(x => x.id === id);
    for (const i of o.items) {
        const p = prod(i.pid);
        if (p && i.qty > p.stock[i.size]) {
            toast('Stok ' + i.name + ' ' + i.size + 'ml tidak cukup');
            return;
        }
    }
    o.items.forEach(i => {
        const p = prod(i.pid);
        if (p) {
            p.stock[i.size] -= i.qty;
            DB.hist.unshift({
                t: Date.now(),
                pid: p.id,
                size: i.size,
                d: -i.qty,
                n: 'Pesanan ' + o.id
            });
        }
    });
    o.status = 'Diproses';
    o.paidAt = Date.now();
    save();
    toast('Pembayaran diterima, stok dikurangi');
    route();
}

function tolak(id) {
    const o = DB.orders.find(x => x.id === id);
    o.status = 'Ditolak';
    o.note = val('r' + id) || 'Bukti bayar tidak valid.';
    save();
    toast('Pembayaran ditolak');
    route();
}

function kemas(id) {
    DB.orders.find(x => x.id === id).status = 'Dikemas';
    save();
    route();
}

function kirim(id) {
    const r = val('k' + id);
    if (!r) {
        toast('Isi nomor resi dulu');
        return;
    }
    const o = DB.orders.find(x => x.id === id);
    o.resi = r;
    o.status = 'Dikirim';
    save();
    toast('Resi tersimpan, status Dikirim');
    route();
}

// Foto produk dari form admin: undefined = tidak berubah, '' = dihapus, selain itu = data gambar baru
let fotoBaru;

function pilihFoto(input) {
    const f = input.files[0];
    if (!f)
        return;
    resizeImage(f, data => {
        if (!data) {
            $('er').textContent = 'Gambar tidak bisa dibaca.';
            return;
        }
        fotoBaru = data;
        $('aprev').innerHTML = `<img class="art-img" src="${data}" alt="" style="width:90px;height:90px;border-radius:10px">`;
    }, 600);
}

function hapusFoto() {
    fotoBaru = '';
    $('aprev').innerHTML = '';
    $('aimg').value = '';
}

function simpanProduk() {
    const e = S.E;
    const d = {
        name: val('an'),
        fam: $('af').value,
        gen: $('ag').value,
        conc: $('ac').value,
        t: val('at1'),
        m: val('am'),
        b: val('ab'),
        desc: val('ad'),
        price: {},
    };
    SZ.forEach(s => d.price[s] = +val('ap' + s));
    if (fotoBaru !== undefined)
        d.img = fotoBaru;
    fotoBaru = undefined;
    if (!d.name || SZ.some(s => !(d.price[s] > 0))) {
        $('er').textContent = 'Nama dan harga semua ukuran wajib diisi.';
        return;
    }
    if (e && e !== 'new')
        Object.assign(prod(e), d);
    else
        DB.P.push({
            id: 'p' + uid(),
            active: true,
            stock: {
                30: 0,
                50: 0,
                100: 0
            },
            ...d
        });
    S.E = null;
    save();
    toast('Produk disimpan');
    route();
}

function togProduk(id) {
    const p = prod(id);
    p.active = !p.active;
    save();
    route();
}

function hapusProduk(id) {
    if (DB.orders.some(o => o.items.some(i => i.pid === id))) {
        toast('Produk punya transaksi, nonaktifkan saja');
        return;
    }
    DB.P = DB.P.filter(p => p.id !== id);
    save();
    route();
}

function tambahFam() {
    const n = val('fn');
    if (!n || DB.fams.includes(n))
        return;
    DB.fams.push(n);
    save();
    route();
}

function hapusFam(f) {
    if (DB.P.some(p => p.fam === f)) {
        toast('Kategori masih dipakai produk');
        return;
    }
    DB.fams = DB.fams.filter(x => x !== f);
    save();
    route();
}

function tambahStok(pid, s) {
    const n = +val('s' + pid + s);
    if (!(n > 0)) {
        toast('Isi jumlah tambahan');
        return;
    }
    prod(pid).stock[s] += n;
    DB.hist.unshift({
        t: Date.now(),
        pid,
        size: s,
        d: n,
        n: 'Penambahan stok'
    });
    save();
    toast('Stok ditambah');
    route();
}

function togUser(id) {
    const u = DB.users.find(x => x.id === id);
    u.active = !u.active;
    save();
    route();
}

// ===== Tampilan (views) =====

// ===== Ilustrasi botol (SVG) =====
// Warna dari nama aroma (family), bentuk botol dari id produk.
const hue = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
const BOTTLES = ['bottle-round', 'bottle-tall', 'bottle-flat'];
// Foto bawaan: images/<id>.jpg. Foto dari admin (p.img) didahulukan; p.img = '' berarti sengaja tanpa foto.
const DEFAULT_IMG = Object.fromEntries(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'].map(id => [id, `images/${id}.jpg`]));
const fotoOf = p => p.img === undefined ? DEFAULT_IMG[p.id] : p.img;
const artSvg = p => `<svg class="art" style="--h:${hue(p.fam)}" viewBox="0 0 120 120" role="img" aria-label="Botol ${esc(p.name)}"><use href="#${BOTTLES[hue(p.id) % 3]}"/></svg>`;
// Jika file foto tidak ditemukan, otomatis diganti ilustrasi botol
const imgGagal = (el, id) => { const p = prod(id); if (p) el.outerHTML = artSvg(p); };
const art = p => fotoOf(p)
    ? `<img class="art-img" src="${esc(fotoOf(p))}" alt="${esc(p.name)}" loading="lazy" onerror="imgGagal(this,'${esc(p.id)}')">`
    : artSvg(p);
const WALL = '<svg class="wall" viewBox="0 0 800 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#wall"/></svg>';

const card = p => `<a class="card prod" href="#produk${p.id}"><div class="vial">${art(p)}</div><span><span class="chip">${esc(p.fam)}</span><span class="chip">${esc(p.gen)}</span></span><b>${esc(p.name)}</b><small>${esc(p.conc)} · ${esc(p.t.split(',')[0])}, ${esc(p.m.split(',')[0])}</small><div class="pr"><span>mulai ${rp(minP(p))}</span><em class="${totStock(p) ? 'ok' : 'no'}">${totStock(p) ? 'Tersedia' : 'Habis'}</em></div></a>`;
const V = {};

V.beranda = () => {
    const best = DB.P.filter(p => p.active).map(p => ({
        p,
        n: DB.orders.filter(o => PAIDS.includes(o.status)).reduce((a, o) => a + o.items.filter(i => i.pid === p.id).reduce((x, i) => x + i.qty, 0), 0)
    })).sort((a, b) => b.n - a.n).slice(0, 4).map(x => x.p);
    return `<div class="hero">${WALL}
<div>
<h1>Temukan aroma yang terasa seperti Anda.</h1><p>Parfum original dengan notes transparan, atau racik sendiri aroma kustom lengkap dengan nama di botol. Dikemas aman untuk cairan.</p>
<div class="row"><a class="btn a" href="#kuis">Ikuti Fragrance Quiz</a><a class="btn g" href="#katalog">Lihat katalog</a>
</div>
</div>
<div class="bottle" aria-hidden="true">
</div>
</div>
 
<h2>Best seller</h2>
<div class="grid">${best.map(card).join('')}</div>
 <h2>Kategori favorit</h2><div class="grid">${DB.fams.map(f => `<a class="card prod" href="#katalog" onclick="S.fam='${esc(f)}'"><b>${esc(f)}</b><small>${f === 'Custom Blend' ? 'Racik aromamu sendiri' : DB.P.filter(p => p.fam === f && p.active).length + ' parfum'}</small></a>`).join('')}</div>
 
<div class="card" style="margin-top:22px;background:var(--soft)">
<h3>Bingung memilih?</h3>
<p class="mut">Jawab 3 pertanyaan singkat, kami carikan parfum yang paling cocok.</p><a class="btn" href="#kuis">Mulai quiz</a>
</div>
 
<div class="grid" style="margin-top:16px">
<div class="card"><b>Deskripsi transparan</b><br><span class="mut">Konsentrasi EDP/EDT/Parfum dan notes lengkap, dengan garansi keaslian.</span>
</div>
<div class="card"><b>Pengiriman aman</b><br><span class="mut">Pilih ekspedisi dan proteksi kemasan, lalu lacak dengan nomor resi.</span>
</div>
<div class="card"><b>Re-order instan</b><br><span class="mut">Aroma favorit bisa dipesan ulang dari riwayat transaksi.</span>
</div>
</div>`;
};

V.katalog = () => {
    const q = S.q.toLowerCase();
    let L = DB.P.filter(p => p.active && (!S.fam || p.fam === S.fam) && (!S.gen || p.gen === S.gen) && (!q || [p.name, p.t, p.m, p.b, p.fam].join(' ').toLowerCase().includes(q)));
    if (S.sort)
        L.sort((a, b) => (minP(a) - minP(b)) * (S.sort === 'asc' ? 1 : -1));
    return `<h1 style="font-size:40px">Katalog parfum</h1>
<div class="row" style="margin-bottom:14px"><input style="max-width:260px" placeholder="Cari nama, notes, atau kategori" value="${esc(S.q)}" oninput="S.q=this.value;clearTimeout(window.dt);window.dt=setTimeout(()=>{route();const i=document.querySelector('main input');i.focus();i.setSelectionRange(99,99)},250)" aria-label="Cari">
 <select style="max-width:170px" onchange="S.fam=this.value;route()" aria-label="Aroma">
<option value="">Semua aroma</option>${DB.fams.map(f => `<option ${S.fam === f ? 'selected' : ''}>${esc(f)}</option>`).join('')}</select>
 <select style="max-width:150px" onchange="S.gen=this.value;route()" aria-label="Gender">
<option value="">Semua gender</option>${['Pria', 'Wanita', 'Unisex'].map(f => `<option ${S.gen === f ? 'selected' : ''}>${f}</option>`).join('')}</select>
 <select style="max-width:170px" onchange="S.sort=this.value;route()" aria-label="Urutkan">
<option value="">Urutkan harga</option>
<option value="asc" ${S.sort === 'asc' ? 'selected' : ''}>Termurah</option><option value="desc" ${S.sort === 'desc' ? 'selected' : ''}>Termahal</option></select></div>
 ${S.fam === 'Custom Blend' ? '<div class="card" style="margin-bottom:14px"><b>Custom Blend:</b> pilih sendiri top, middle, dan base notes. <a class="btn s" href="#racik">Mulai racik</a></div>' : ''}
 ${L.length ? `<div class="grid">${L.map(card).join('')}</div>` : '<div class="card">Tidak ada parfum yang cocok. Coba kata kunci lain atau reset filter.</div>'}`;
};

V.produk = id => {
    const p = prod(id);
    if (!p || !p.active)
        return '<div class="card">Produk tidak ditemukan.</div>';
    const u = me();
    const first = SZ.find(s => p.stock[s] > 0);
    return `<div class="cols"><div class="card"><div class="vial" style="height:170px">${art(p)}</div><span class="chip">${esc(p.fam)}</span><span class="chip">${esc(p.gen)}</span><span class="chip">${esc(p.conc)}</span><h1 style="font-size:40px;margin:8px 0">${esc(p.name)}</h1><p>${esc(p.desc)}</p><h3>Pyramid notes</h3><div class="pyr"><div><small>Top notes</small>${esc(p.t)}</div><div><small>Middle notes</small>${esc(p.m)}</div><div><small>Base notes</small>${esc(p.b)}</div></div></div>
 <div class="card"><h3>Pilih ukuran</h3>${SZ.map(s => `<label class="opt"><input type="radio" name="sz" value="${s}" ${s === first ? 'checked' : ''} ${p.stock[s] ? '' : 'disabled'}><span><b>${s} ml</b> · ${rp(p.price[s])}<br><small class="${p.stock[s] ? 'ok' : 'no'}">${p.stock[s] ? 'Stok ' + p.stock[s] : 'Habis'}</small></span></label>`).join('')}
 
<label for="qt">Jumlah</label><input id="qt" type="number" min="1" value="1" style="max-width:100px">
<label for="lb">Nama di label botol (opsional, maks. 20 karakter)</label><input id="lb" maxlength="20" placeholder="Contoh: Untuk Ibu">
<div class="err" id="er">
</div>
 ${u && u.role === 'admin' ? '<p class="mut">Akun admin tidak dapat berbelanja.</p>' : `<button class="btn" ${first ? '' : 'disabled'} onclick="addCart('${p.id}')">Add to Cart</button>${u ? '' : '<p class="mut">Anda perlu <a href="#login" style="color:var(--pri)">masuk</a> untuk berbelanja.</p>'}`}</div></div>`;
};

V.racik = () => {
    const o = k => NT[k].map(x => `<option>${x}</option>`).join('');
    return `<h1 style="font-size:40px">Racik aromamu</h1>
<div class="card" style="max-width:520px">
<label for="ct">Top note</label><select id="ct">${o('t')}</select><label for="cm">Middle note</label><select id="cm">${o('m')}</select><label for="cb">Base note</label><select id="cb">${o('b')}</select><label for="cs">Ukuran botol</label><select id="cs">${SZ.map(s => `<option value="${s}">${s} ml – ${rp(CPRICE[s])}</option>`).join('')}</select>
<label for="cl">Nama di label (maks. 20 karakter)</label><input id="cl" maxlength="20">
<p class="mut">Racikan dibuat sesuai pesanan, jadi tidak memakai stok katalog.</p><button class="btn" style="margin-top:6px" onclick="addCustom()">Tambah racikan ke keranjang</button>
</div>`;
};

V.kuis = () => `<h1 style="font-size:40px">Fragrance Quiz</h1>
<div class="card" style="max-width:520px">
<label for="q1">Suasana favorit</label><select id="q1">
<option value="Citrus">Pantai dan udara segar</option>
<option value="Woody">Hutan dan kayu hangat</option>
<option value="Floral">Taman bunga</option>
</select>
<label for="q2">Parfum untuk</label><select id="q2">
<option value="">Siapa saja</option>
<option>Pria</option>
<option>Wanita</option>
<option>Unisex</option>
</select>
<label for="q3">Intensitas</label><select id="q3">
<option value="EDT">Ringan untuk harian</option>
<option value="EDP">Pekat dan tahan lama</option>
</select><button class="btn" style="margin-top:12px" onclick="hasilKuis()">Lihat rekomendasi</button>
</div>
<div id="hk">
</div>`;
window.hasilKuis = () => {
    const a = $('q1').value;
    const g = $('q2').value;
    const c = $('q3').value;
    const L = DB.P.filter(p => p.active && totStock(p)).map(p => ({
        p,
        s: (p.fam === a) * 3 + (g && (p.gen === g || p.gen === 'Unisex')) * 2 + (c === 'EDT' ? p.conc === 'EDT' : p.conc !== 'EDT') * 1
    })).sort((x, y) => y.s - x.s).slice(0, 3);
    $('hk').innerHTML = '<h2>Cocok untuk Anda</h2><div class="grid">' + L.map(x => card(x.p)).join('') + '</div>';
};

V.keranjang = () => {
    const u = me();
    if (!u)
        return V.login();
    const sub = u.cart.reduce((a, c) => a + c.price * c.qty, 0);
    return `<h1 style="font-size:40px">Keranjang</h1>${u.cart.length ? `<div class="card tw"><table><tr><th>Item</th><th>Harga</th><th>Jumlah</th><th></th></tr>${u.cart.map((c, i) => `<tr><td>${esc(c.name)}<br><small class="mut">${c.size} ml${c.label ? ' · label: ' + esc(c.label) : ''}</small></td><td>${rp(c.price)}</td><td class="row"><button class="btn g s" onclick="qty(${i},-1)" aria-label="Kurangi">−</button>${c.qty}<button class="btn g s" onclick="qty(${i},1)" aria-label="Tambah">+</button></td><td><button class="btn d s" onclick="hapusCart(${i})">Hapus</button></td></tr>`).join('')}</table></div><p class="tot">Subtotal ${rp(sub)}</p><a class="btn" href="#checkout">Lanjut checkout</a>` : '<div class="card">Keranjang masih kosong. <a href="#katalog" style="color:var(--pri)">Pilih parfum</a> atau <a href="#racik" style="color:var(--pri)">racik sendiri</a>.</div>'}`;
};

V.checkout = () => {
    const u = me();
    if (!u)
        return V.login();
    if (!u.cart.length)
        return V.keranjang();
    return `<h1 style="font-size:40px">Checkout</h1>
<div class="cols">
<div class="card">
<label for="ad">Alamat pengiriman</label>${u.addrs.length ? `<select id="ad" onchange="hit()">${u.addrs.map(a => `<option value="${a.id}" ${u.main === a.id ? 'selected' : ''}>${esc(a.label)} – ${esc(a.text)}</option>`).join('')}</select>` : '<p class="no">Belum ada alamat. <a href="#profil" style="color:var(--pri)">Tambah alamat di profil</a>.</p><input type="hidden" id="ad">'}<h3 style="margin-top:14px">Ekspedisi</h3>${COUR.map((c, i) => `<label class="opt"><input type="radio" name="ek" value="${i}" ${i ? '' : 'checked'} onchange="hit()"><span><b>${c[0]}</b> · ${rp(c[1])}<br><small class="mut">Estimasi ${c[2]}</small></span></label>`).join('')}<h3 style="margin-top:14px">Proteksi kemasan</h3>${PACK.map((c, i) => `<label class="opt"><input type="radio" name="pk" value="${i}" ${i ? '' : 'checked'} onchange="hit()"><span><b>${c[0]}</b> · ${rp(c[1])}</span></label>`).join('')}</div>
 
<div class="card">
<h3>Ringkasan biaya</h3>
<div id="rb">
</div>
<div class="err" id="er">
</div><button class="btn" onclick="buat()">Buat pesanan</button>
</div>
</div>`;
};
window.hit = () => {
    const u = me();
    const k = calc(u.cart, +document.querySelector('input[name=ek]:checked').value, +document.querySelector('input[name=pk]:checked').value);
    $('rb').innerHTML = `<table style="min-width:0">${u.cart.map(c => `<tr><td>${esc(c.name)} ${c.size}ml ×${c.qty}</td><td>${rp(c.price * c.qty)}</td></tr>`).join('')}<tr><td>Ongkir</td><td>${rp(k.ship)}</td></tr><tr><td>Kemasan</td><td>${rp(k.pack)}</td></tr><tr><td><b>Total</b></td><td class="tot">${rp(k.total)}</td></tr></table>`;
};

const itemsT = o => `<table style="min-width:0">${o.items.map(i => `<tr><td>${esc(i.name)} ${i.size}ml ×${i.qty}${i.label ? '<br><small class="mut">Label: ' + esc(i.label) + '</small>' : ''}</td><td>${rp(i.price * i.qty)}</td></tr>`).join('')}<tr><td>Ongkir (${esc(o.courier)})</td><td>${rp(o.ship)}</td></tr><tr><td>Kemasan</td><td>${rp(o.pack)}</td></tr><tr><td><b>Total</b></td><td><b>${rp(o.total)}</b></td></tr></table>`;

V.bayar = id => {
    const o = DB.orders.find(x => x.id === id);
    const u = me();
    if (!o || !u || o.uid !== u.id)
        return '<div class="card">Pesanan tidak ditemukan.</div>';
    if (!['Menunggu Pembayaran', 'Ditolak'].includes(o.status))
        return V.transaksi(id);
    return `<h1 style="font-size:40px">Konfirmasi dan pembayaran</h1>
<div class="cols">
<div class="card">
<h3>Rincian pesanan</h3>${itemsT(o)}<p class="mut">Dikirim ke: ${esc(o.addr)}<br>Bayar sebelum <b>${fmt(o.exp)}</b>.</p>${o.status === 'Ditolak' ? `<p class="no"><b>Pembayaran ditolak:</b> ${esc(o.note)} Unggah bukti yang benar.</p>` : ''}</div>
 <div class="card"><h3>Instruksi pembayaran</h3>${[['Transfer BCA', '1234567890 a.n. AromaCraft'], ['QRIS', 'Scan QRIS AromaCraft di aplikasi bank atau e-wallet']].map(m => `<label class="opt"><input type="radio" name="mt" value="${m[0]}"><span><b>${m[0]}</b><br><small class="mut">${m[1]}</small></span></label>`).join('')}<label for="pf">Bukti bayar (gambar)</label><input id="pf" type="file" accept="image/*">
<div class="err" id="er">
</div>
<div class="row"><button class="btn" onclick="bayar('${o.id}')">Kirim bukti bayar</button><button class="btn g" onclick="batal('${o.id}')">Batalkan pesanan</button></div></div></div>`;
};

V.riwayat = () => {
    const u = me();
    if (!u)
        return V.login();
    const L = DB.orders.filter(o => o.uid === u.id && (!S.st || o.status === S.st));
    return `<h1 style="font-size:40px">Riwayat transaksi</h1><select style="max-width:240px;margin-bottom:14px" onchange="S.st=this.value;route()" aria-label="Filter status">
<option value="">Semua status</option>${['Menunggu Pembayaran', 'Menunggu Verifikasi', 'Diproses', 'Dikemas', 'Dikirim', 'Selesai', 'Ditolak', 'Dibatalkan', 'Kedaluwarsa'].map(s => `<option ${S.st === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
 ${L.length ? `<div class="card tw">
<table>
<tr><th>Tanggal</th><th>Item</th><th>Total</th><th>Status</th><th></th></tr>${L.map(o => `<tr><td>${fmt(o.created)}</td><td>${o.items.map(i => esc(i.name)).join(', ')}</td><td>${rp(o.total)}</td><td>${st(o.status)}</td><td class="row"><a class="btn g s" href="#transaksi${o.id}">Detail</a><button class="btn g s" onclick="reorder('${o.id}')">Pesan lagi</button></td></tr>`).join('')}</table></div>` : '<div class="card">Belum ada transaksi. <a href="#katalog" style="color:var(--pri)">Jelajahi katalog</a>.</div>'}`;
};

V.transaksi = id => {
    const o = DB.orders.find(x => x.id === id);
    const u = me();
    if (!o || !u || (o.uid !== u.id && u.role !== 'admin'))
        return '<div class="card">Transaksi tidak ditemukan.</div>';
    return `<h1 style="font-size:40px">Detail transaksi</h1><div class="cols"><div class="card"><p>${st(o.status)} <span class="mut">${fmt(o.created)}</span></p>${itemsT(o)}<p class="mut">Alamat: ${esc(o.addr)}<br>Pembayaran: ${o.method ? esc(o.method) + ' – ' + esc(o.proof) : 'Belum dibayar'}</p>${o.status === 'Menunggu Pembayaran' ? `<div class="row"><a class="btn" href="#bayar${o.id}">Bayar sekarang</a><button class="btn g" onclick="batal('${o.id}')">Batalkan</button></div>` : ''}</div>
 <div class="card"><h3>Pelacakan</h3>${['Menunggu Verifikasi', 'Diproses', 'Dikemas', 'Dikirim', 'Selesai'].map((s, i, a) => {
        const cur = a.indexOf(o.status);
        const done = PAIDS.includes(o.status) || o.status === 'Menunggu Verifikasi' ? i <= cur : false;
        return `<div style="padding:4px 0;color:${done ? 'var(--ok)' : 'var(--mut)'}">${done ? '✓' : '○'} ${s}</div>`;
    }).join('')}${o.resi ? `<p>Nomor resi (${esc(o.courier)}): <b>${esc(o.resi)}</b></p>` : ''}${o.note ? `<p class="mut">Catatan: ${esc(o.note)}</p>` : ''}<div class="row">${o.status === 'Dikirim' && o.uid === u.id ? `<button class="btn" onclick="diterima('${o.id}')">Pesanan diterima</button>` : ''}${o.uid === u.id ? `<button class="btn g" onclick="reorder('${o.id}')">Pesan lagi</button>` : ''}</div></div></div>`;
};

V.profil = () => {
    const u = me();
    if (!u)
        return V.login();
    return `<h1 style="font-size:40px">Profil</h1>
<div class="cols">
<div class="card">
<h3>Data diri</h3>
<label for="pn">Nama</label><input id="pn" value="${esc(u.name)}"><label for="ph">Nomor WhatsApp</label><input id="ph" value="${esc(u.phone)}"><label>Email</label><input value="${esc(u.email)}" disabled>
<div class="err" id="er">
</div><button class="btn" onclick="simpanProfil()">Simpan profil</button>
<h3 style="margin-top:20px">Ganti kata sandi</h3>
<label for="po">Kata sandi lama</label><input id="po" type="password">
<label for="pb">Kata sandi baru</label><input id="pb" type="password">
<div class="err" id="er2">
</div><button class="btn" onclick="gantiPw()">Ganti kata sandi</button>
</div>
 
<div class="card">
<h3>Alamat pengiriman</h3>${u.addrs.map(a => `<div class="opt" style="justify-content:space-between"><span><b>${esc(a.label)}</b> ${u.main === a.id ? '<span class="chip">Utama</span>' : ''}<br><small class="mut">${esc(a.text)}</small></span><span class="row">${u.main === a.id ? '' : `<button class="btn g s" onclick="utamaAlamat('${a.id}')">Jadikan utama</button>`}<button class="btn d s" onclick="hapusAlamat('${a.id}')">Hapus</button></span></div>`).join('') || '<p class="mut">Belum ada alamat.</p>'}<label for="al">Label</label><input id="al" placeholder="Rumah, Kantor">
<label for="at">Alamat lengkap</label><textarea id="at" rows="3"></textarea>
<div class="err" id="er3">
</div><button class="btn" onclick="tambahAlamat()">Tambah alamat</button>
</div>
</div>`;
};

V.login = () => `<div class="card" style="max-width:420px;margin:auto">
<h3>Masuk</h3>
<label for="le">Email</label><input id="le" type="email">
<label for="lp">Kata sandi</label><input id="lp" type="password" onkeydown="if(event.key==='Enter')masuk()">
<div class="err" id="er">
</div>
<div class="row"><button class="btn" onclick="masuk()">Masuk</button><button class="btn g" onclick="lupa()">Lupa password</button>
</div>
<p class="mut">Belum punya akun? <a href="#daftar" style="color:var(--pri)">Daftar</a><br><small>Demo: admin@aromacraft.id / admin123, rizky@mail.com / rizky123</small></p>
</div>`;

V.daftar = () => `<div class="card" style="max-width:420px;margin:auto">
<h3>Buat akun</h3>
<label for="rn">Nama lengkap</label><input id="rn">
<label for="re">Email</label><input id="re" type="email">
<label for="rh">Nomor WhatsApp</label><input id="rh" inputmode="numeric" placeholder="081234567890">
<label for="rp">Kata sandi</label><input id="rp" type="password">
<div class="err" id="er">
</div><button class="btn" onclick="daftar()">Daftar</button>
<p class="mut">Sudah punya akun? <a href="#login" style="color:var(--pri)">Masuk</a></p>
</div>`;

// ===== Tampilan admin =====
const AT = [
    ['admin', 'Dashboard'],
    ['aproduk', 'Produk'],
    ['astok', 'Stok'],
    ['atransaksi', 'Transaksi'],
    ['apengguna', 'Pengguna'],
    ['alaporan', 'Laporan']
];
const AI = {
    admin: '📊',
    aproduk: '🌸',
    astok: '🧪',
    atransaksi: '🧾',
    apengguna: '👥',
    alaporan: '📈'
};

const AW = (k, h) => `<div class="shell"><nav class="side adm" aria-label="Menu admin"><div class="ttl">Panel admin</div>${AT.map(t => `<a href="#${t[0]}" class="${t[0] === k ? 'on' : ''}">${AI[t[0]]} ${t[1]}</a>`).join('')}</nav><section>${h}</section></div>`;

const paid = () => DB.orders.filter(o => PAIDS.includes(o.status) && o.paidAt);

const pn = (id, s) => (prod(id)?.name || 'Racikan') + ' ' + s + 'ml';

V.admin = () => {
    const now = new Date();
    const d0 = new Date().setHours(0, 0, 0, 0);
    const m0 = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const pm0 = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const P = paid();
    const sum = a => a.reduce((x, o) => x + o.total, 0);
    const inR = (a, b) => P.filter(o => o.paidAt >= a && o.paidAt < b);
    const today = sum(inR(d0, d0 + DAY));
    const yest = sum(inR(d0 - DAY, d0));
    const mon = sum(inR(m0, Infinity));
    const pmon = sum(inR(pm0, m0));
    const dl = (a, b) => b ? Math.round((a - b) / b * 100) : (a ? 100 : 0);
    const tag = (v, t) => `<em class="dl ${v >= 0 ? 'ok' : 'no'}">${v >= 0 ? '▲' : '▼'} ${Math.abs(v)}% ${t}</em>`;
    const todo = DB.orders.filter(o => o.status === 'Menunggu Verifikasi').length;
    const proc = DB.orders.filter(o => ['Diproses', 'Dikemas'].includes(o.status)).length;
    const low = [];
    DB.P.filter(p => p.active).forEach(p => SZ.forEach(s => {
        if (p.stock[s] <= 5)
            low.push([p.name, s, p.stock[s]]);
    }));
    const days = [...Array(7)].map((_, i) => {
        const a = d0 - (6 - i) * DAY;
        return {
            l: new Date(a).toLocaleDateString('id-ID', { weekday: 'short' }),
            v: sum(inR(a, a + DAY))
        };
    });
    const mx = Math.max(1, ...days.map(d => d.v));
    const W = 560;
    const H = 170;
    const X = i => 30 + i * (W - 60) / 6;
    const Y = v => H - 24 - (v / mx) * (H - 50);
    const ln = days.map((d, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(d.v).toFixed(1)).join(' ');
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik omzet 7 hari terakhir" style="width:100%;height:auto"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pri)" stop-opacity=".35"/><stop offset="1" stop-color="var(--pri)" stop-opacity="0"/></linearGradient></defs><path d="${ln} L${X(6)} ${H - 24} L${X(0)} ${H - 24}Z" fill="url(#ga)"/><path d="${ln}" fill="none" stroke="var(--pri)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${days.map((d, i) => `<circle cx="${X(i)}" cy="${Y(d.v)}" r="4.5" fill="var(--card)" stroke="var(--pri)" stroke-width="2.5"><title>${d.l}: ${rp(d.v)}</title></circle><text x="${X(i)}" y="${H - 6}" text-anchor="middle" font-size="12" fill="var(--mut)">${d.l}</text>`).join('')}</svg>`;
    const G = [
        ['Menunggu', ['Menunggu Pembayaran', 'Menunggu Verifikasi'], '#e6a23c'],
        ['Diproses', ['Diproses', 'Dikemas'], '#4c6fff'],
        ['Dikirim', ['Dikirim'], '#b86be0'],
        ['Selesai', ['Selesai'], '#17b26a'],
        ['Batal', ['Ditolak', 'Dibatalkan', 'Kedaluwarsa'], '#e0566e']
    ].map(g => ({
        n: g[0],
        c: g[2],
        v: DB.orders.filter(o => g[1].includes(o.status)).length
    }));
    const tot = G.reduce((a, g) => a + g.v, 0) || 1;
    let acc = 0;
    const cg = G.map(g => {
        const a = acc / tot * 100;
        acc += g.v;
        return g.c + ' ' + a + '% ' + acc / tot * 100 + '%';
    }).join(',');
    const by = {};
    P.forEach(o => o.items.forEach(i => by[i.name] = (by[i.name] || 0) + i.qty));
    const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const tm = top[0] ? top[0][1] : 1;
    const un = id => DB.users.find(u => u.id === id)?.name || '-';
    return AW('admin', `<div class="dh">${WALL}<div><small>${now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })}</small><h2>Halo, ${esc(me().name.split(' ')[0])} 👋</h2><p>${todo ? `Ada <b>${todo} pembayaran</b> menunggu verifikasi.` : 'Tidak ada pembayaran yang menunggu verifikasi.'} ${proc ? proc + ' pesanan siap dikemas atau dikirim.' : ''}</p>
</div>
<div class="row"><a class="btn a" href="#atransaksi">Proses pesanan</a><a class="btn" style="background:#ffffff26" href="#astok">Cek stok</a>
</div>
</div>
 
<div class="kpi">
<div class="card k"><span class="ic" style="--c:#17b26a">💰</span><span>Penjualan hari ini</span><b>${rp(today)}</b>${tag(dl(today, yest), 'vs kemarin')}</div>
<div class="card k"><span class="ic" style="--c:#4c6fff">📈</span><span>Penjualan bulan ini</span><b>${rp(mon)}</b>${tag(dl(mon, pmon), 'vs bulan lalu')}</div>
<div class="card k"><span class="ic" style="--c:#e6a23c">📦</span><span>Perlu ditangani</span><b>${todo + proc}</b><em class="mut">${todo} verifikasi · ${proc} kirim</em>
</div>
<div class="card k"><span class="ic" style="--c:#e0566e">⚠️</span><span>Stok menipis</span><b>${low.length}</b><em class="mut">varian ≤ 5 botol</em>
</div>
</div>
 
<div class="dg">
<div class="card">
<h3>Omzet 7 hari terakhir</h3>${svg}</div>
<div class="card">
<h3>Status pesanan</h3>
<div class="row" style="flex-wrap:nowrap">
<div class="donut" style="background:conic-gradient(${cg})" role="img" aria-label="Diagram status pesanan"><span><b>${DB.orders.length}</b><small>pesanan</small></span></div><div class="lg">${G.map(g => `<div><i style="background:${g.c}"></i>${g.n} <b>${g.v}</b></div>`).join('')}</div></div></div></div>
 <div class="dg2"><div class="card"><h3>Parfum terlaris</h3>${top.map(([n, v]) => `<div class="bi"><span>${esc(n)}</span><b>${v}</b><div class="bar"><i style="width:${Math.round(v / tm * 100)}%"></i></div></div>`).join('') || '<p class="mut">Belum ada penjualan.</p>'}</div><div class="card"><h3>Alert stok</h3>${low.map(l => `<div class="bi"><span>${esc(l[0])} ${l[1]}ml</span><b class="${l[2] ? '' : 'no'}">${l[2]}</b><div class="bar"><i style="width:${Math.max(4, l[2] / 5 * 100)}%;background:var(--bad)"></i></div></div>`).join('') || '<p class="mut">Semua stok aman.</p>'}</div>
</div>
 
<div class="card tw" style="margin-top:14px">
<div class="row" style="justify-content:space-between">
<h3>Pesanan terbaru</h3><a class="btn g s" href="#atransaksi">Lihat semua</a>
</div>
<table>
<tr><th>Pelanggan</th><th>Item</th><th>Total</th><th>Status</th></tr>${DB.orders.slice(0, 5).map(o => `<tr><td>${esc(un(o.uid))}<br><small class="mut">${fmt(o.created)}</small></td><td>${o.items.map(i => esc(i.name)).join(', ')}</td><td>${rp(o.total)}</td><td>${st(o.status)}</td></tr>`).join('') || '<tr><td colspan="4">Belum ada pesanan.</td></tr>'}</table></div>`);
};

V.aproduk = () => {
    fotoBaru = undefined;
    const e = S.E;
    const p = e && e !== 'new' ? prod(e) : {
        name: '',
        fam: DB.fams[0],
        gen: 'Unisex',
        conc: 'EDP',
        t: '',
        m: '',
        b: '',
        desc: '',
        price: {
            30: '',
            50: '',
            100: ''
        }
    };
    const sel = (id, a, v) => `<select id="${id}">${a.map(x => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
    return AW('aproduk', `${e ? `<div class="card" style="margin-bottom:14px"><h3>${e === 'new' ? 'Tambah parfum' : 'Ubah parfum'}</h3><div class="cols"><div><label for="an">Nama</label><input id="an" value="${esc(p.name)}"><label for="af">Aroma family</label>${sel('af', DB.fams, p.fam)}<label for="ag">Gender</label>${sel('ag', ['Pria', 'Wanita', 'Unisex'], p.gen)}<label for="ac">Konsentrasi</label>${sel('ac', ['EDT', 'EDP', 'Parfum'], p.conc)}</div><div><label for="at1">Top notes</label><input id="at1" value="${esc(p.t)}"><label for="am">Middle notes</label><input id="am" value="${esc(p.m)}"><label for="ab">Base notes</label><input id="ab" value="${esc(p.b)}"><div class="row">${SZ.map(s => `<div style="flex:1"><label for="ap${s}">Harga ${s}ml</label><input id="ap${s}" type="number" value="${p.price[s]}"></div>`).join('')}</div></div></div><label for="ad">Deskripsi</label><textarea id="ad" rows="2">${esc(p.desc)}</textarea>
<label for="aimg">Foto produk (opsional)</label>
<div class="row"><input type="file" id="aimg" accept="image/*" onchange="pilihFoto(this)" style="max-width:260px"><button class="btn g s" type="button" onclick="hapusFoto()">Hapus foto</button></div>
<div id="aprev" style="margin-top:8px">${fotoOf(p) ? `<img class="art-img" src="${esc(fotoOf(p))}" alt="" style="width:90px;height:90px;border-radius:10px">` : ''}</div>
<div class="err" id="er">
</div>
<div class="row"><button class="btn" onclick="simpanProduk()">Simpan</button><button class="btn g" onclick="S.E=null;route()">Batal</button>
</div>
</div>` : `<button class="btn" onclick="S.E='new';route()" style="margin-bottom:14px">Tambah parfum</button>`}
 
<div class="card tw">
<table>
<tr><th>Parfum</th><th>Kategori</th><th>Harga 30/50/100</th><th>Status</th><th></th></tr>${DB.P.map(p => `<tr><td>${esc(p.name)}<br><small class="mut">${esc(p.conc)} · ${esc(p.gen)}</small></td><td>${esc(p.fam)}</td><td>${SZ.map(s => rp(p.price[s])).join('<br>')}</td><td>${p.active ? '<em class="ok">Aktif</em>' : '<em class="no">Nonaktif</em>'}</td><td class="row"><button class="btn g s" onclick="S.E='${p.id}';route()">Ubah</button><button class="btn g s" onclick="togProduk('${p.id}')">${p.active ? 'Nonaktifkan' : 'Aktifkan'}</button><button class="btn d s" onclick="hapusProduk('${p.id}')">Hapus</button></td></tr>`).join('')}</table></div>
 <h2>Kategori aroma</h2><div class="card"><div style="margin-bottom:12px">${DB.fams.map(f => `<span class="chip">${esc(f)} <a href="#aproduk" onclick="hapusFam('${esc(f)}')" aria-label="Hapus ${esc(f)}">✕</a></span>`).join('')}</div>
<div class="row"><input id="fn" placeholder="Kategori baru" style="max-width:240px"><button class="btn" onclick="tambahFam()">Tambah kategori</button>
</div>
</div>`);
};

V.astok = () => AW('astok', `<div class="card tw"><table><tr><th>Parfum</th>${SZ.map(s => `<th>${s} ml</th>`).join('')}</tr>${DB.P.map(p => `<tr><td>${esc(p.name)}</td>${SZ.map(s => `<td><b class="${p.stock[s] <= 5 ? 'no' : 'ok'}">${p.stock[s]}</b><div class="row" style="margin-top:4px;flex-wrap:nowrap"><input id="s${p.id}${s}" type="number" min="1" style="width:70px;padding:4px 8px" aria-label="Tambah stok ${esc(p.name)} ${s}ml"><button class="btn g s" onclick="tambahStok('${p.id}',${s})">+</button></div></td>`).join('')}</tr>`).join('')}</table>
</div>
<h2>Histori stok</h2>
<div class="card tw">
<table>
<tr><th>Waktu</th><th>Item</th><th>Perubahan</th><th>Keterangan</th></tr>${DB.hist.slice(0, 20).map(h => `<tr><td>${fmt(h.t)}</td><td>${esc(pn(h.pid, h.size))}</td><td><b class="${h.d < 0 ? 'no' : 'ok'}">${h.d > 0 ? '+' : ''}${h.d}</b></td><td>${esc(h.n)}</td></tr>`).join('') || '<tr><td colspan="4">Belum ada perubahan stok.</td></tr>'}</table></div>`);

V.atransaksi = () => {
    const L = DB.orders.filter(o => !S.st || o.status === S.st);
    const un = id => DB.users.find(u => u.id === id)?.name || '-';
    return AW('atransaksi', `<select style="max-width:240px;margin-bottom:14px" onchange="S.st=this.value;route()" aria-label="Filter status">
<option value="">Semua status</option>${['Menunggu Verifikasi', 'Diproses', 'Dikemas', 'Dikirim', 'Selesai', 'Menunggu Pembayaran', 'Ditolak', 'Dibatalkan', 'Kedaluwarsa'].map(s => `<option ${S.st === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
<div class="card tw">
<table>
<tr><th>Pesanan</th><th>Bayar</th><th>Status</th><th>Tindakan</th></tr>${L.map(o => `<tr><td>${o.items.map(i => esc(i.name) + ' ' + i.size + 'ml ×' + i.qty).join('<br>')}<br><small class="mut">${esc(un(o.uid))} · ${rp(o.total)} · ${esc(o.courier)}<br>${esc(o.addr)}</small></td><td>${o.method ? esc(o.method) + '<br><small class="mut">' + esc(o.proof) + '</small>' : '-'}</td><td>${st(o.status)}${o.resi ? `<br><small class="mut">Resi ${esc(o.resi)}</small>` : ''}${o.note ? `<br><small class="mut">${esc(o.note)}</small>` : ''}</td><td>${o.status === 'Menunggu Verifikasi' ? `<div class="row"><button class="btn s" onclick="terima('${o.id}')">Terima</button><input id="r${o.id}" placeholder="Alasan tolak" style="width:130px"><button class="btn d s" onclick="tolak('${o.id}')">Tolak</button></div>` : o.status === 'Diproses' ? `<button class="btn s" onclick="kemas('${o.id}')">Tandai dikemas</button>` : o.status === 'Dikemas' ? `<div class="row"><input id="k${o.id}" placeholder="Nomor resi" style="width:150px"><button class="btn s" onclick="kirim('${o.id}')">Kirim</button></div>` : '-'}</td></tr>`).join('') || '<tr><td colspan="4">Belum ada transaksi.</td></tr>'}</table></div>`);
};

V.apengguna = () => AW('apengguna', `<div class="card tw">
<table>
<tr><th>Pelanggan</th><th>Kontak</th><th>Alamat utama</th><th>Pesanan</th><th>Status</th><th></th></tr>${DB.users.filter(u => u.role !== 'admin').map(u => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}<br><small class="mut">${esc(u.phone)}</small></td><td><small>${esc(u.addrs.find(a => a.id === u.main)?.text || '-')}</small></td><td>${DB.orders.filter(o => o.uid === u.id).length}</td><td>${u.active ? '<em class="ok">Aktif</em>' : '<em class="no">Nonaktif</em>'}</td><td><button class="btn g s" onclick="togUser('${u.id}')">${u.active ? 'Nonaktifkan' : 'Aktifkan'}</button></td></tr>`).join('')}</table></div>`);

V.alaporan = () => {
    const d = t => new Date(t).toISOString().slice(0, 10);
    S.from = S.from || d(Date.now() - 30 * DAY);
    S.to = S.to || d(Date.now());
    const a = new Date(S.from).setHours(0, 0, 0, 0);
    const b = new Date(S.to).setHours(23, 59, 59, 999);
    const L = paid().filter(o => o.paidAt >= a && o.paidAt <= b);
    const g = {};
    const by = {};
    L.forEach(o => {
        const k = d(o.paidAt).slice(0, S.grp === 'm' ? 7 : 10);
        g[k] = g[k] || {
            n: 0,
            t: 0
        };
        g[k].n++;
        g[k].t += o.total;
        o.items.forEach(i => {
            by[i.name] = (by[i.name] || 0) + i.qty;
        });
    });
    const top = Object.entries(by).sort((x, y) => y[1] - x[1]);
    const ks = Object.keys(g).sort();
    S.csv = 'Periode,Pesanan,Omzet\n' + ks.map(k => k + ',' + g[k].n + ',' + g[k].t).join('\n');
    return AW('alaporan', `<div class="row" style="margin-bottom:14px">
<label style="margin:0">Dari <input type="date" id="df" value="${S.from}"></label><label style="margin:0">Sampai <input type="date" id="dt" value="${S.to}"></label><label style="margin:0">Per <select id="gp"><option value="d" ${S.grp === 'd' ? 'selected' : ''}>Hari</option><option value="m" ${S.grp === 'm' ? 'selected' : ''}>Bulan</option>
</select></label><button class="btn" onclick="S.from=val('df');S.to=val('dt');S.grp=$('gp').value;route()">Terapkan</button><button class="btn g" onclick="salin()">Salin CSV</button><button class="btn g" onclick="window.print()">Cetak</button>
</div>
 
<div class="stat">
<div class="card"><b>${rp(L.reduce((x, o) => x + o.total, 0))}</b><span>Total omzet</span></div><div class="card"><b>${L.length}</b><span>Pesanan berbayar</span></div><div class="card"><b style="font-size:22px">${esc(top[0] ? top[0][0] : '-')}</b><span>Parfum terlaris</span></div></div>
 <h2>Omzet per ${S.grp === 'm' ? 'bulan' : 'hari'}</h2><div class="card tw"><table><tr><th>Periode</th><th>Pesanan</th><th>Omzet</th></tr>${ks.map(k => `<tr><td>${k}</td><td>${g[k].n}</td><td>${rp(g[k].t)}</td></tr>`).join('') || '<tr><td colspan="3">Tidak ada penjualan pada periode ini.</td></tr>'}</table>
</div>
 
<h2>Parfum terlaris</h2>
<div class="card tw">
<table>
<tr><th>Parfum</th><th>Terjual</th></tr>${top.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${v}</td></tr>`).join('') || '<tr><td colspan="2">Kosong.</td></tr>'}</table></div>`);
};
window.salin = () => {
    const f = () => {
        const t = document.createElement('textarea');
        t.value = S.csv;
        document.body.appendChild(t);
        t.select();
        try {
            document.execCommand('copy');
            toast('CSV disalin');
        }
        catch (e) {
            toast('Gagal menyalin');
        }
        t.remove();
    };
    try {
        navigator.clipboard.writeText(S.csv).then(() => toast('CSV disalin'), f);
    }
    catch (e) {
        f();
    }
};
const CT = [['akun', 'Ringkasan', '🏠'], ['riwayat', 'Pesanan saya', '📦'], ['keranjang', 'Keranjang', '🛒'], ['profil', 'Profil &amp; alamat', '👤']];

const CW = (k, h) => `<div class="shell"><nav class="side" aria-label="Menu akun"><div class="ttl">Akun saya</div>${CT.map(t => `<a href="#${t[0]}" class="${t[0] === k ? 'on' : ''}">${t[2]} ${t[1]}</a>`).join('')}</nav><section>${h}</section></div>`;

V.akun = () => {
    const u = me();
    const mine = DB.orders.filter(o => o.uid === u.id);
    const act = mine.filter(o => ['Menunggu Verifikasi', 'Diproses', 'Dikemas', 'Dikirim'].includes(o.status));
    const unp = mine.filter(o => o.status === 'Menunggu Pembayaran');
    const spent = mine.filter(o => PAIDS.includes(o.status)).reduce((a, o) => a + o.total, 0);
    const last = mine[0];
    const buy = new Set(mine.flatMap(o => o.items.map(i => i.pid)));
    const lp = last && prod(last.items[0].pid);
    const rec = DB.P.filter(p => p.active && totStock(p) && !buy.has(p.id) && (!lp || p.fam === lp.fam || p.gen === lp.gen)).slice(0, 3);
    const steps = ['Menunggu Verifikasi', 'Diproses', 'Dikemas', 'Dikirim', 'Selesai'];
    return CW('akun', `<div class="dh">${WALL}<div><small>Dasbor pelanggan</small><h2>Halo, ${esc(u.name.split(' ')[0])} 🌸</h2><p>${unp.length ? `Ada <b>${unp.length} pesanan</b> yang belum dibayar.` : act.length ? `${act.length} pesanan sedang dalam proses.` : 'Belum ada pesanan aktif. Yuk temukan aroma barumu.'}</p>
</div>
<div class="row"><a class="btn a" href="#katalog">Belanja</a><a class="btn" style="background:#ffffff26" href="#kuis">Fragrance Quiz</a>
</div>
</div>
 ${unp.map(o => `<div class="card row" style="border-color:var(--acc);margin-bottom:12px;justify-content:space-between">⏳ <span style="flex:1">Bayar ${rp(o.total)} sebelum ${fmt(o.exp)}</span><a class="btn s" href="#bayar${o.id}">Bayar sekarang</a></div>`).join('')}
 
<div class="kpi">
<div class="card k"><span class="ic" style="--c:#4c6fff">📦</span><span>Pesanan aktif</span><b>${act.length}</b>
</div>
<div class="card k"><span class="ic" style="--c:#b86be0">🧾</span><span>Total pesanan</span><b>${mine.length}</b>
</div>
<div class="card k"><span class="ic" style="--c:#17b26a">💸</span><span>Total belanja</span><b>${rp(spent)}</b>
</div>
<div class="card k"><span class="ic" style="--c:#e6a23c">🛒</span><span>Di keranjang</span><b>${u.cart.length}</b>
</div>
</div>
 
<div class="card">
<div class="row" style="justify-content:space-between">
<h3>Pesanan terakhir</h3>${last ? `<a class="btn g s" href="#transaksi${last.id}">Detail</a>` : ''}</div>${last ? `<p>${last.items.map(i => esc(i.name) + ' ' + i.size + 'ml ×' + i.qty).join(', ')} · <b>${rp(last.total)}</b> ${st(last.status)}</p><div class="trk">${steps.map((s, i) => {
        const c = steps.indexOf(last.status);
        return `<div class="${c >= i ? 'on' : ''}"><i></i><small>${s.replace('Menunggu ', '')}</small></div>`;
    }).join('')}</div>${last.resi ? `<p class="mut">Resi ${esc(last.courier)}: <b>${esc(last.resi)}</b></p>` : ''}` : '<p class="mut">Belum ada transaksi.</p>'}</div>
 <h2>Rekomendasi untukmu</h2>${rec.length ? `<div class="grid">${rec.map(card).join('')}</div>` : '<div class="card">Jelajahi <a href="#katalog" style="color:var(--pri)">katalog</a> untuk rekomendasi.</div>'}`);
};
['riwayat', 'profil', 'keranjang'].forEach(k => {
    const f = V[k];
    V[k] = a => {
        const h = f(a);
        return me() ? CW(k, h) : h;
    };
});

// ===== Router =====

function route() {
    expire();
    const h = location.hash.slice(1) || 'beranda';
    const u = me();
    const m = h.match(/^(produk|bayar|transaksi)(.+)$/);
    const name = m ? m[1] : h;
    const id = m ? m[2] : null;
    const isA = ['admin', 'aproduk', 'astok', 'atransaksi', 'apengguna', 'alaporan'].includes(name);
    let page = V[name] ? name : 'beranda';
    if ((['akun', 'bayar', 'riwayat', 'transaksi', 'profil', 'keranjang', 'checkout'].includes(name) || isA) && !u)
        page = 'login';
    else if (isA && u.role !== 'admin') {
        page = 'beranda';
        toast('Halaman khusus admin');
    }
    else if (u && (page === 'login' || page === 'daftar'))
        page = 'beranda';
    if (name === 'akun' && u && u.role === 'admin')
        page = 'admin';
    const cn = u && u.cart ? u.cart.length : 0;
    document.body.dataset.role = u ? u.role : '';
    $('nav').innerHTML = u && u.role === 'admin' ? `<a class="brand" href="#admin">Aroma<i>Craft</i> <small class="mut" style="font:500 13px sans-serif">Admin</small></a><a class="l" href="#katalog">Lihat toko</a><span class="mut">${esc(u.name)}</span><a class="btn s" href="#beranda" onclick="keluar()">Keluar</a>` : `<a class="brand" href="#beranda">Aroma<i>Craft</i></a><a class="l ${name === 'katalog' ? 'on' : ''}" href="#katalog">Katalog</a><a class="l" href="#racik">Racik</a><a class="l" href="#kuis">Quiz</a>${u ? `<a class="l" href="#keranjang">Keranjang${cn ? ' (' + cn + ')' : ''}</a><a class="l ${['akun', 'riwayat', 'profil'].includes(name) ? 'on' : ''}" href="#akun">Dasbor</a><a class="l" href="#beranda" onclick="keluar()">Keluar</a>` : `<a class="l" href="#login">Masuk</a><a class="btn s" href="#daftar">Daftar</a>`}`;
    $('app').innerHTML = V[page](id);
    if (page === 'checkout')
        hit();
    window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();

// ===== Wallpaper (dapat diganti) =====
// Pilihan disimpan di localStorage: { id: 'emas' } atau { img: 'data:image/jpeg;base64,...' }
const WP_KEY = 'aromacraft_wp';
const WALLPAPERS = [
    { id: 'ungu', name: 'Ungu', css: 'linear-gradient(120deg, #3b1450, #7a2f8f 60%, #c0602f)', def: true },
    { id: 'emas', name: 'Emas', css: 'linear-gradient(120deg, #4a2a05, #b9791f 55%, #f1c660)' },
    { id: 'samudra', name: 'Samudra', css: 'linear-gradient(120deg, #06233f, #0f5e8c 55%, #37b6c9)' },
    { id: 'mawar', name: 'Mawar', css: 'linear-gradient(120deg, #4a0f2c, #b8386b 55%, #f4a3b8)' },
    { id: 'hutan', name: 'Hutan', css: 'linear-gradient(120deg, #0e2f22, #1f7a52 55%, #a7d86b)' },
    { id: 'malam', name: 'Malam', css: 'linear-gradient(120deg, #0b0b1f, #2a2466 55%, #7a4fc8)' }
];

function loadWp() {
    try {
        return JSON.parse(localStorage.getItem(WP_KEY)) || {};
    }
    catch (e) {
        return {};
    }
}

function saveWp(w) {
    try {
        localStorage.setItem(WP_KEY, JSON.stringify(w));
        return true;
    }
    catch (e) {
        return false;
    }
}

function applyWp(w) {
    const root = document.documentElement.style;
    root.removeProperty('--wp-banner');
    root.removeProperty('--wp-img');
    delete document.body.dataset.wp;
    if (w.img) {
        document.body.dataset.wp = 'custom';
        root.setProperty('--wp-img', `url("${w.img}")`);
    }
    else {
        const p = WALLPAPERS.find(x => x.id === w.id);
        if (p && !p.def)
            root.setProperty('--wp-banner', p.css);
    }
    document.querySelectorAll('#wp-sw button').forEach(b => b.classList.toggle('on', !w.img && b.dataset.id === (w.id || 'ungu')));
}

// Kecilkan gambar (default maks 1600px) agar muat di localStorage
function resizeImage(file, done, max = 1600) {
    const fr = new FileReader();
    fr.onload = () => {
        const im = new Image();
        im.onload = () => {
            const k = Math.min(1, max / Math.max(im.width, im.height));
            const cv = document.createElement('canvas');
            cv.width = Math.round(im.width * k);
            cv.height = Math.round(im.height * k);
            cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
            done(cv.toDataURL('image/jpeg', 0.8));
        };
        im.onerror = () => done(null);
        im.src = fr.result;
    };
    fr.readAsDataURL(file);
}

function initWallpaper() {
    const panel = $('wp-panel');
    const btn = $('wp-btn');
    const msg = $('wp-msg');
    const defaultMsg = msg.textContent;
    $('wp-sw').innerHTML = WALLPAPERS.map(p => `<button type="button" data-id="${p.id}" style="background:${p.css}" aria-label="Wallpaper ${p.name}">${p.name}</button>`).join('');
    $('wp-sw').onclick = e => {
        const b = e.target.closest('button');
        if (!b)
            return;
        const w = { id: b.dataset.id };
        applyWp(w);
        saveWp(w);
        msg.textContent = defaultMsg;
    };
    $('wp-file').onchange = e => {
        const f = e.target.files[0];
        if (!f)
            return;
        resizeImage(f, data => {
            if (!data) {
                msg.textContent = 'Gambar tidak bisa dibaca.';
                return;
            }
            applyWp({ img: data });
            msg.textContent = saveWp({ img: data }) ? 'Wallpaper diganti.' : 'Dipakai sementara (gambar terlalu besar untuk disimpan).';
        });
        e.target.value = '';
    };
    $('wp-reset').onclick = () => {
        applyWp({});
        saveWp({});
        msg.textContent = defaultMsg;
    };
    btn.onclick = () => {
        panel.hidden = !panel.hidden;
        btn.setAttribute('aria-expanded', String(!panel.hidden));
    };
    document.addEventListener('click', e => {
        if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) {
            panel.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
        }
    });
    applyWp(loadWp());
}

initWallpaper();
