function renderAnggota() {
    const tbody = document.getElementById('table-anggota-body');

    tbody.innerHTML = dataAnggota.map(a => `
        <tr>
            <td class="p-4 font-mono text-xs">${a.nis}</td>
            <td class="p-4 font-bold text-gray-900">${a.nama}</td>
            <td class="p-4">${a.kelas}</td>
            <td class="p-4">${a.telp}</td>
            <td class="p-4 text-center">
                <button onclick="deleteAnggota(${a.id})"
                class="text-rose-600 hover:text-rose-900 text-xs font-semibold cursor-pointer">
                <i class="fa-solid fa-trash"></i> Hapus
                </button>
            </td>
        </tr>
    `).join('');
}

function saveAnggota(e) {
    e.preventDefault();

    const newAnggota = {
        id: dataAnggota.length ? dataAnggota[dataAnggota.length - 1].id + 1 : 1,
        nis: document.getElementById('anggota-nis').value,
        nama: document.getElementById('anggota-nama').value,
        kelas: document.getElementById('anggota-kelas').value,
        telp: document.getElementById('anggota-telp').value
    };

    dataAnggota.push(newAnggota);

    syncStorage();
    renderAnggota();
    closeModal('modal-anggota');

    document.getElementById('form-anggota').reset();
}