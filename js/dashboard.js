function updateDashboardStats() {
    document.getElementById('stat-buku').innerText =
        dataBuku.reduce((acc, b) => acc + parseInt(b.stok), 0);

    document.getElementById('stat-anggota').innerText =
        dataAnggota.length;

    document.getElementById('stat-pinjam').innerText =
        dataPeminjaman.filter(p => p.status === 'Dipinjam').length;
}