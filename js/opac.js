function renderCariBuku() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const container = document.getElementById('katalog-buku-container');

    const filtered = dataBuku.filter(
        b => b.judul.toLowerCase().includes(query) ||
        b.pengarang.toLowerCase().includes(query)
    );

    container.innerHTML = filtered.map(b => `
        <div class="bg-white p-5 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between">
            <div>
                <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                    ${b.kategori}
                </span>

                <h4 class="text-lg font-bold text-gray-900 mt-3">
                    ${b.judul}
                </h4>

                <p class="text-sm text-gray-600 mt-1">
                    <span class="text-gray-400">Penulis:</span>
                    ${b.pengarang}
                </p>
            </div>
        </div>
    `).join('');
}