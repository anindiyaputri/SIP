function renderBuku() {
    const tbody = document.getElementById('table-buku-body');

    tbody.innerHTML = dataBuku.map(buku => `
        <tr>
            <td class="p-4 font-mono text-xs">BK-${String(buku.id).padStart(3, '0')}</td>
            <td class="p-4 font-bold text-gray-900">
                ${buku.judul}
                <span class="block text-xs font-normal text-gray-400">${buku.kategori}</span>
            </td>
            <td class="p-4">${buku.pengarang}</td>
            <td class="p-4">${buku.penerbit}</td>
            <td class="p-4 text-center font-bold">${buku.stok}</td>
            <td class="p-4 text-center">
                <button onclick="deleteBuku(${buku.id})"
                class="text-rose-600 hover:text-rose-900 text-xs font-semibold cursor-pointer">
                <i class="fa-solid fa-trash"></i> Hapus
                </button>
            </td>
        </tr>
    `).join('');
}

function saveBuku(e) {
    e.preventDefault();

    const newBuku = {
        id: dataBuku.length ? dataBuku[dataBuku.length - 1].id + 1 : 1,
        judul: document.getElementById('buku-judul').value,
        pengarang: document.getElementById('buku-pengarang').value,
        penerbit: document.getElementById('buku-penerbit').value,
        kategori: document.getElementById('buku-kategori').value,
        stok: parseInt(document.getElementById('buku-stok').value)
    };

    dataBuku.push(newBuku);

    syncStorage();
    renderBuku();
    closeModal('modal-buku');

    document.getElementById('form-buku').reset();
}

function deleteBuku(id) {
    if(confirm("Hapus data master buku ini?")) {
        dataBuku = dataBuku.filter(b => b.id !== id);
        syncStorage();
        renderBuku();
    }
}