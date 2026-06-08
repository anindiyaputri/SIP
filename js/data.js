let dataBuku = JSON.parse(localStorage.getItem('lib_buku')) || [
    { id: 1, judul: "Informatika untuk SMA Kelas X", pengarang: "Kurniawan, M.T.", penerbit: "Erlangga", kategori: "Pendidikan", stok: 5 },
    { id: 2, judul: "Algoritma & Pemrograman Dasar", pengarang: "Anindiya Putri", penerbit: "PTI Press", kategori: "Komputer", stok: 2 },
    { id: 3, judul: "Laskar Pelangi", pengarang: "Andrea Hirata", penerbit: "Bentang Pustaka", kategori: "Novel", stok: 4 }
];

let dataAnggota = JSON.parse(localStorage.getItem('lib_anggota')) || [
    { id: 1, nis: "2413025001", nama: "Ahmad Rizky", kelas: "XI IPA 2", telp: "08123456789" },
    { id: 2, nis: "2413025002", nama: "Siti Aminah", kelas: "X IPS 1", telp: "08776543210" }
];

let dataPeminjaman = JSON.parse(localStorage.getItem('lib_peminjaman')) || [
    { id: 1, anggotaId: 1, bukuId: 1, tanggal: "2026-05-28", status: "Dipinjam" }
];

let currentRole = "admin";