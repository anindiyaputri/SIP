function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('bg-gray-800', 'text-white', 'font-medium');
        el.classList.add('hover:bg-gray-800', 'hover:text-white');
    });

    if(tabName === 'buku') renderBuku();
    if(tabName === 'anggota') renderAnggota();
    if(tabName === 'peminjaman') renderPeminjaman();
    if(tabName === 'cari-buku') renderCariBuku();
}