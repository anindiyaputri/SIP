function openModal(id) {
    document.getElementById(id).classList.remove('hidden');

    if(id === 'modal-peminjaman') {
        populateSelectOptions();
    }
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}