function syncStorage() {
    localStorage.setItem('lib_buku', JSON.stringify(dataBuku));
    localStorage.setItem('lib_anggota', JSON.stringify(dataAnggota));
    localStorage.setItem('lib_peminjaman', JSON.stringify(dataPeminjaman));
    updateDashboardStats();
}