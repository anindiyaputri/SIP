let dataBuku = JSON.parse(localStorage.getItem('sip_buku')) || [
    { kode: 'BK-001', judul: 'Algoritma & Pemrograman', pengarang: 'Rian Kurniadi, S.T.', kategori: 'Komputer & Teknologi', stok: 5, tersedia: 5 },
    { kode: 'BK-002', judul: 'Fisika Quantum Dasar', pengarang: 'Dr. Supriyadi', kategori: 'Sains & Matematika', stok: 3, tersedia: 2 },
    { kode: 'BK-003', judul: 'Laskar Pelangi', pengarang: 'Andrea Hirata', kategori: 'Fiksi & Novel', stok: 4, tersedia: 4 }
];

let dataAnggota = JSON.parse(localStorage.getItem('sip_anggota')) || [
    { id: 'AGT-001', nama: 'Muhammad Farhan', tipe: 'Siswa - Kelas XII', kontak: '081234567890', status: 'Aktif' },
    { id: 'AGT-002', nama: 'Siti Aminah, S.Pd.', tipe: 'Guru / Staf', kontak: '085712345678', status: 'Aktif' }
];

let dataSirkulasi = JSON.parse(localStorage.getItem('sip_sirkulasi')) || [
    { id: 'TRX-001', idAnggota: 'AGT-001', namaAnggota: 'Muhammad Farhan', kodeBuku: 'BK-002', judulBuku: 'Fisika Quantum Dasar', tglPinjam: '2026-05-15', tglKembali: '2026-05-22', status: 'Dipinjam' }
];

let logs = JSON.parse(localStorage.getItem('sip_logs')) || [];

let currentRole = 'admin';

function syncStorage() {
    localStorage.setItem('sip_buku', JSON.stringify(dataBuku));
    localStorage.setItem('sip_anggota', JSON.stringify(dataAnggota));
    localStorage.setItem('sip_sirkulasi', JSON.stringify(dataSirkulasi));
    localStorage.setItem('sip_logs', JSON.stringify(logs));
    updateStats();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    document.getElementById('menu-' + tabId).classList.add('active');
    
    // Close sidebar on mobile after tab switch
    if(window.innerWidth <= 767) {
        closeSidebar();
    }

    if(tabId === 'buku') renderBuku();
    if(tabId === 'anggota') renderAnggota();
    if(tabId === 'sirkulasi') renderSirkulasi();
    if(tabId === 'cari') renderCariSiswa();
    if(tabId === 'statusSiswa') renderStatusSiswa();
}

/* Responsive sidebar toggle helpers */
function toggleSidebar() {
    const sb = document.querySelector('.sidebar');
    if(!sb) return;
    sb.classList.toggle('show-mobile');
}

function closeSidebar() {
    const sb = document.querySelector('.sidebar');
    if(!sb) return;
    sb.classList.remove('show-mobile');
}

function toggleRole() {
    const badge = document.getElementById('roleBadge');
    const menuStatus = document.getElementById('menu-statusSiswa');
    const menuUtama = document.getElementById('menuUtamaTitle');
    
    if (currentRole === 'admin') {
        currentRole = 'siswa';
        badge.className = "badge-siswa";
        badge.innerHTML = '<i class="fa-solid fa-graduation-cap"></i> Mode Siswa';
        
        document.getElementById('menu-dashboard').classList.add('hidden');
        document.getElementById('menu-buku').classList.add('hidden');
        document.getElementById('menu-anggota').classList.add('hidden');
        document.getElementById('menu-sirkulasi').classList.add('hidden');
        document.getElementById('menu-laporan').classList.add('hidden');
        menuStatus.classList.remove('hidden');
        if(menuUtama) menuUtama.classList.add('hidden');
        switchTab('cari');
    } else {
        currentRole = 'admin';
        badge.className = "badge-admin";
        badge.innerHTML = '<i class="fa-solid fa-user-shield"></i> Mode Petugas (Admin)';
        
        document.getElementById('menu-dashboard').classList.remove('hidden');
        document.getElementById('menu-buku').classList.remove('hidden');
        document.getElementById('menu-anggota').classList.remove('hidden');
        document.getElementById('menu-sirkulasi').classList.remove('hidden');
        document.getElementById('menu-laporan').classList.remove('hidden');
        menuStatus.classList.add('hidden');
        if(menuUtama) menuUtama.classList.remove('hidden');
        switchTab('dashboard');
    }
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    if(id === 'modalSirkulasi') populateSirkulasiDropdowns();
}
function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function updateStats() {
    const statBuku = document.getElementById('statTotalBuku');
    const statAnggota = document.getElementById('statTotalAnggota');
    const statPinjam = document.getElementById('statTotalPinjam');
    
    if(statBuku) statBuku.innerText = dataBuku.length;
    if(statAnggota) statAnggota.innerText = dataAnggota.length;
    if(statPinjam) statPinjam.innerText = dataSirkulasi.filter(s => s.status === 'Dipinjam').length;
    
    const logContainer = document.getElementById('logContainer');
    if (logContainer) {
        logContainer.innerHTML = '';
        logs.slice().reverse().forEach(log => {
            logContainer.innerHTML += `
                <div class="log-item">
                    <div class="log-item-left">
                        <span class="log-dot"></span>
                        <span>${log.teks}</span>
                    </div>
                    <span class="log-time">${log.waktu}</span>
                </div>
            `;
        });
    }
}

function addLog(msg) {
    const sekarang = new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
    logs.push({ teks: msg, waktu: sekarang });
    if(logs.length > 20) logs.shift();
    syncStorage();
}

function renderBuku() {
    const tbody = document.getElementById('tableBukuBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if(dataBuku.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 24px; color: #9ca3af;">Belum ada koleksi buku.</td></tr>`;
        return;
    }
    dataBuku.forEach(b => {
        tbody.innerHTML += `
            <tr>
                <td class="font-mono-bold">${b.kode}</td>
                <td style="font-weight: 500; color: #111827;">${b.judul}</td>
                <td>${b.pengarang}</td>
                <td><span class="badge-category">${b.kategori}</span></td>
                <td class="text-center" style="font-weight: 700;">${b.stok} <span style="font-size: 0.75rem; color: #9ca3af; font-weight: 400;">(${b.tersedia})</span></td>
                <td class="text-center">
                    <button onclick="deleteBuku('${b.kode}')" class="btn-delete-action"><i class="fa-solid fa-trash"></i> Hapus</button>
                </td>
            </tr>
        `;
    });
}

function saveBuku(event) {
    event.preventDefault();
    const judul = document.getElementById('bukuJudul').value;
    const pengarang = document.getElementById('bukuPengarang').value;
    const kategori = document.getElementById('bukuKategori').value;
    const stokVal = parseInt(document.getElementById('bukuStok').value);
    
    if(!judul || !pengarang || !kategori || isNaN(stokVal)) {
        alert("Semua data buku harus diisi!");
        return;
    }

    const kodeBaru = 'BK-' + String(dataBuku.length + 1).padStart(3, '0');
    
    dataBuku.push({
        kode: kodeBaru,
        judul: judul,
        pengarang: pengarang,
        kategori: kategori,
        stok: stokVal,
        tersedia: stokVal
    });
    
    addLog(`Buku baru "${judul}" ditambahkan.`);
    alert(`Berhasil Menambahkan! Buku "${judul}" telah tersimpan di database dengan Kode: ${kodeBaru}`);
    document.getElementById('formBuku').reset();
    closeModal('modalBuku');
    renderBuku();
}

function deleteBuku(kode) {
    const idx = dataBuku.findIndex(b => b.kode === kode);
    if(idx !== -1) {
        addLog(`Buku "${dataBuku[idx].judul}" dihapus dari database.`);
        dataBuku.splice(idx, 1);
        renderBuku();
    }
}

function renderAnggota() {
    const tbody = document.getElementById('tableAnggotaBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if(dataAnggota.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 24px; color: #9ca3af;">Belum ada anggota terdaftar.</td></tr>`;
        return;
    }
    dataAnggota.forEach(a => {
        tbody.innerHTML += `
            <tr>
                <td class="font-mono-bold">${a.id}</td>
                <td style="font-weight: 500; color: #111827;">${a.nama}</td>
                <td>${a.tipe}</td>
                <td style="color: #6b7280;">${a.kontak}</td>
                <td class="text-center"><span class="badge-active">${a.status}</span></td>
                <td class="text-center">
                    <button onclick="deleteAnggota('${a.id}')" class="btn-delete-action"><i class="fa-solid fa-user-minus"></i> Hapus</button>
                </td>
            </tr>
        `;
    });
}

function saveAnggota(event) {
    event.preventDefault();
    const nama = document.getElementById('anggotaNama').value;
    const tipe = document.getElementById('anggotaTipe').value;
    const kontak = document.getElementById('anggotaKontak').value;

    if(!nama || !tipe || !kontak) {
        alert("Semua data anggota harus diisi!");
        return;
    }

    const idBaru = 'AGT-' + String(dataAnggota.length + 1).padStart(3, '0');
    
    dataAnggota.push({
        id: idBaru,
        nama: nama,
        tipe: tipe,
        kontak: kontak,
        status: 'Aktif'
    });

    addLog(`Anggota baru "${nama}" terdaftar.`);
    alert(`Berhasil Terdaftar! Anggota bernama "${nama}" telah disimpan dengan ID: ${idBaru}`);
    document.getElementById('formAnggota').reset();
    closeModal('modalAnggota');
    renderAnggota();
}

function deleteAnggota(id) {
    const idx = dataAnggota.findIndex(a => a.id === id);
    if(idx !== -1) {
        addLog(`Keanggotaan "${dataAnggota[idx].nama}" dihapus.`);
        dataAnggota.splice(idx, 1);
        renderAnggota();
    }
}

function populateSirkulasiDropdowns() {
    const selectAgt = document.getElementById('sirkulasiAnggota');
    const selectBk = document.getElementById('sirkulasiBuku');
    
    if(!selectAgt || !selectBk) return;
    selectAgt.innerHTML = '';
    selectBk.innerHTML = '';

    dataAnggota.forEach(a => selectAgt.innerHTML += `<option value="${a.id}">${a.nama} (${a.tipe})</option>`);
    dataBuku.forEach(b => {
        if(b.tersedia > 0) {
            selectBk.innerHTML += `<option value="${b.kode}">${b.judul} [Stok: ${b.tersedia}]</option>`;
        }
    });
}

function renderSirkulasi() {
    const tbody = document.getElementById('tableSirkulasiBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if(dataSirkulasi.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 24px; color: #9ca3af;">Tidak ada transaksi sirkulasi aktif.</td></tr>`;
        return;
    }
    dataSirkulasi.forEach(s => {
        const badgeStyle = s.status === 'Dipinjam' ? 'badge-status-amber' : 'badge-status-gray';
        tbody.innerHTML += `
            <tr>
                <td style="font-family: monospace; font-size: 0.75rem; color: #6b7280;">${s.id}</td>
                <td style="font-weight: 500; color: #111827;">${s.namaAnggota}</td>
                <td style="color: #374151;">${s.judulBuku}</td>
                <td style="font-family: monospace; font-size: 0.75rem;">${s.tglPinjam}</td>
                <td style="font-family: monospace; font-size: 0.75rem; color: #dc2626; font-weight: 700;">${s.tglKembali}</td>
                <td class="text-center"><span class="${badgeStyle}">${s.status}</span></td>
                <td class="text-center">
                    ${s.status === 'Dipinjam' ? `<button onclick="kembalikanBuku('${s.id}')" class="btn-return-action">Kembalikan</button>` : '<span style="color: #9ca3af; font-size: 0.75rem;">Selesai</span>'}
                </td>
            </tr>
        `;
    });
}

function saveSirkulasi(event) {
    event.preventDefault();
    const idAgt = document.getElementById('sirkulasiAnggota').value;
    const kdBk = document.getElementById('sirkulasiBuku').value;
    
    if(!idAgt || !kdBk) {
        alert("Pilih anggota dan buku terlebih dahulu!");
        return;
    }

    const sukses = prosesPeminjamanSistem(idAgt, kdBk);
    if(sukses) {
        const agt = dataAnggota.find(a => a.id === idAgt);
        const bk = dataBuku.find(b => b.kode === kdBk);
        alert(`Berhasil Memproses! Transaksi peminjaman buku "${bk.judul}" untuk anggota "${agt.nama}" telah berhasil disimpan.`);
    }
    closeModal('modalSirkulasi');
    renderSirkulasi();
}

function prosesPeminjamanSistem(idAgt, kdBk) {
    const agt = dataAnggota.find(a => a.id === idAgt);
    if(!agt) {
        alert("Proses Ditolak: Validasi Anggota Gagal. ID tidak terdaftar!");
        return false;
    }

    const bk = dataBuku.find(b => b.kode === kdBk);
    if(!bk || bk.tersedia <= 0) {
        alert("Proses Ditolak: Validasi Ketersediaan Buku Gagal. Stok Habis!");
        return false;
    }

    const tgl = new Date();
    const tglPinjamStr = tgl.toISOString().split('T')[0];
    tgl.setDate(tgl.getDate() + 7);
    const tglKembaliStr = tgl.toISOString().split('T')[0];

    const idTrx = 'TRX-' + String(dataSirkulasi.length + 1).padStart(3, '0');

    dataSirkulasi.push({
        id: idTrx,
        idAnggota: idAgt,
        namaAnggota: agt.nama,
        kodeBuku: kdBk,
        judulBuku: bk.judul,
        tglPinjam: tglPinjamStr,
        tglKembali: tglKembaliStr,
        status: 'Dipinjam'
    });

    bk.tersedia -= 1;
    addLog(`Sistem memproses peminjaman: ${agt.nama} meminjam "${bk.judul}".`);
    return true;
}

function kembalikanBuku(idTrx) {
    const trx = dataSirkulasi.find(s => s.id === idTrx);
    if(trx) {
        trx.status = 'Dikembalikan';
        const bk = dataBuku.find(b => b.kode === trx.kodeBuku);
        if(bk) bk.tersedia += 1;

        addLog(`Buku "${trx.judulBuku}" telah dikembalikan oleh ${trx.namaAnggota}.`);
        renderSirkulasi();
    }
}

function siswaPinjamBukuMandiri(kodeBuku) {
    if(dataAnggota.length === 0) {
        alert("Belum ada data anggota siswa di database.");
        return;
    }
    const siswaAktif = dataAnggota[0];
    const bk = dataBuku.find(b => b.kode === kodeBuku);

    if (confirm(`Apakah Anda (Siswa) ingin mengajukan pinjam buku "${bk.judul}"?`)) {
        const sukses = prosesPeminjamanSistem(siswaAktif.id, kodeBuku);
        if(sukses) {
            alert(`Berhasil Mengajukan! Silakan ambil fisik buku di perpustakaan dengan ID: ${siswaAktif.id}`);
            renderCariSiswa();
        }
    }
}

function renderCariSiswa() {
    const inputCari = document.getElementById('inputCariSiswa');
    if(!inputCari) return;
    const query = inputCari.value.toLowerCase();
    const container = document.getElementById('gridCariSiswa');
    if(!container) return;
    container.innerHTML = '';

    const filtered = dataBuku.filter(b => 
        b.judul.toLowerCase().includes(query) || 
        b.pengarang.toLowerCase().includes(query) || 
        b.kategori.toLowerCase().includes(query)
    );

    if(filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #9ca3af; font-size: 0.875rem;">Buku tidak ditemukan.</div>`;
        return;
    }

    filtered.forEach(b => {
        const isAvail = b.tersedia > 0;
        const badgeColorStyle = isAvail ? 'color: #065f46; background-color: #d1fae5;' : 'color: #991b1b; background-color: #fee2e2;';
        const statusText = isAvail ? `Tersedia: ${b.tersedia} Unit` : 'Sedang Dipinjam Habis';
        
        const btnPinjam = isAvail 
            ? `<button onclick="siswaPinjamBukuMandiri('${b.kode}')" class="btn-submit-pinjam"><i class="fa-solid fa-hand-holding-hand"></i> Ajukan Pinjam Buku</button>`
            : `<button disabled class="btn-disabled-stok"><i class="fa-solid fa-ban"></i> Stok Kosong</button>`;

        container.innerHTML += `
            <div class="card-book-siswa">
                <div>
                    <span class="badge-book-tag">${b.kategori}</span>
                    <h3 class="book-title-siswa">${b.judul}</h3>
                    <p class="book-author-siswa"><i class="fa-solid fa-pen-nib" style="font-size: 10px;"></i> ${b.pengarang}</p>
                </div>
                <div class="card-book-footer">
                    <div class="book-meta-row">
                        <span style="font-family: monospace; font-size: 10px; color: #9ca3af;">${b.kode}</span>
                        <span style="font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.625rem; border-radius: 0.375rem; ${badgeColorStyle}">${statusText}</span>
                    </div>
                    ${btnPinjam}
                </div>
            </div>
        `;
    });
}

function renderStatusSiswa() {
    const tbody = document.getElementById('tableStatusSiswaBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    const siswaId = dataAnggota[0] ? dataAnggota[0].id : 'AGT-001';
    const historiSiswa = dataSirkulasi.filter(s => s.idAnggota === siswaId);

    if(historiSiswa.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 24px; color: #9ca3af;">Anda belum memiliki riwayat peminjaman buku.</td></tr>`;
        return;
    }

    historiSiswa.forEach(s => {
        const badgeClass = s.status === 'Dipinjam' ? 'badge-status-amber' : 'badge-status-gray';
        tbody.innerHTML += `
            <tr>
                <td style="font-family: monospace; font-size: 0.75rem; color: #6b7280;">${s.id}</td>
                <td style="font-weight: 700; color: #111827;">${s.judulBuku}</td>
                <td style="font-family: monospace; font-size: 0.75rem;">${s.tglPinjam}</td>
                <td style="font-family: monospace; font-size: 0.75rem; color: #dc2626; font-weight: 700;">${s.tglKembali}</td>
                <td class="text-center"><span class="${badgeClass}">${s.status}</span></td>
            </tr>
        `;
    });
}

function handleReport(jenisLaporan) {
    const action = document.getElementById(`action-${jenisLaporan}`).value;
    const format = document.getElementById(`format-${jenisLaporan}`).value;
    if (format === 'excel') {
        downloadReportExcel(jenisLaporan);
        return;
    }
    if (format === 'pdf') {
        printReport(jenisLaporan, action);
        return;
    }
}

function printReport(jenisLaporan, action) {
    const container = document.getElementById('printTargetContainer');
    if(!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 900; text-transform: uppercase;">LAPORAN RESMI PERPUSTAKAAN SEKOLAH</h2>
            <p style="font-size: 0.875rem; color: #374151;">Jenis Dokumen: Laporan Data ${jenisLaporan} | Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}</p>
            <p style="font-size: 0.75rem; color: #6b7280; font-family: monospace; margin-top: 0.25rem;">Penanggung Jawab Sistem: Rian Kurniadi, S.T.</p>
        </div>
    `;

    if(jenisLaporan === 'Buku') {
        let htmlTable = `<table>
            <thead><tr>
                <th>Kode Buku</th><th>Judul</th><th>Pengarang</th><th>Stok (Tersedia)</th>
            </tr></thead><tbody>`;
        dataBuku.forEach(b => {
            htmlTable += `<tr>
                <td style="font-family: monospace;">${b.kode}</td><td style="font-weight: bold;">${b.judul}</td>
                <td>${b.pengarang}</td><td style="text-align: center;">${b.stok} (${b.tersedia})</td>
            </tr>`;
        });
        htmlTable += `</tbody></table>`;
        container.innerHTML += htmlTable;
    } else if(jenisLaporan === 'Anggota') {
        let htmlTable = `<table>
            <thead><tr>
                <th>ID Anggota</th><th>Nama</th><th>Tipe</th><th>Kontak</th>
            </tr></thead><tbody>`;
        dataAnggota.forEach(a => {
            htmlTable += `<tr>
                <td style="font-family: monospace;">${a.id}</td><td style="font-weight: bold;">${a.nama}</td>
                <td>${a.tipe}</td><td>${a.kontak}</td>
            </tr>`;
        });
        htmlTable += `</tbody></table>`;
        container.innerHTML += htmlTable;
    } else if(jenisLaporan === 'Sirkulasi') {
        let htmlTable = `<table>
            <thead><tr>
                <th>ID Transaksi</th><th>Peminjam</th><th>Buku</th><th>Pinjam</th><th>Batas</th><th>Status</th>
            </tr></thead><tbody>`;
        dataSirkulasi.forEach(s => {
            htmlTable += `<tr>
                <td style="font-family: monospace;">${s.id}</td><td>${s.namaAnggota}</td>
                <td style="font-weight: bold;">${s.judulBuku}</td><td style="text-align: center;">${s.tglPinjam}</td>
                <td style="text-align: center;">${s.tglKembali}</td><td style="text-align: center;">${s.status}</td>
            </tr>`;
        });
        htmlTable += `</tbody></table>`;
        container.innerHTML += htmlTable;
    }

    window.print();
    setTimeout(() => { container.classList.add('hidden'); }, 500);
}

function downloadReportExcel(jenisLaporan) {
    let html = `<html><head><meta charset="UTF-8"></head><body><table border="1" cellspacing="0" cellpadding="5">`;
    if(jenisLaporan === 'Buku') {
        html += `<tr><th>Kode Buku</th><th>Judul</th><th>Pengarang</th><th>Stok</th><th>Tersedia</th></tr>`;
        dataBuku.forEach(b => {
            html += `<tr><td>${b.kode}</td><td>${b.judul}</td><td>${b.pengarang}</td><td>${b.stok}</td><td>${b.tersedia}</td></tr>`;
        });
    } else if(jenisLaporan === 'Anggota') {
        html += `<tr><th>ID Anggota</th><th>Nama</th><th>Tipe</th><th>Kontak</th></tr>`;
        dataAnggota.forEach(a => {
            html += `<tr><td>${a.id}</td><td>${a.nama}</td><td>${a.tipe}</td><td>${a.kontak}</td></tr>`;
        });
    } else if(jenisLaporan === 'Sirkulasi') {
        html += `<tr><th>ID Transaksi</th><th>Peminjam</th><th>Buku</th><th>Pinjam</th><th>Batas</th><th>Status</th></tr>`;
        dataSirkulasi.forEach(s => {
            html += `<tr><td>${s.id}</td><td>${s.namaAnggota}</td><td>${s.judulBuku}</td><td>${s.tglPinjam}</td><td>${s.tglKembali}</td><td>${s.status}</td></tr>`;
        });
    }
    html += `</table></body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const fileName = `laporan_${jenisLaporan.toLowerCase()}_${new Date().toISOString().slice(0,10)}.xls`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

window.onload = function() {
    updateStats();
};