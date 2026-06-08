function toggleRole() {
    const badge = document.getElementById('user-role-badge');
    const adminMenus = document.querySelectorAll('.admin-menu');

    if (currentRole === "admin") {
        currentRole = "siswa";
        badge.className = "bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-semibold";
        badge.innerHTML = `<i class="fa-solid fa-graduation-cap mr-1"></i> Mode Siswa (Akses Terbatas)`;

        adminMenus.forEach(menu => menu.classList.add('hidden'));

        switchTab('cari-buku');
        renderCariBuku();

    } else {
        currentRole = "admin";
        badge.className = "bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold";
        badge.innerHTML = `<i class="fa-solid fa-user-shield mr-1"></i> Mode Petugas (Admin)`;

        adminMenus.forEach(menu => menu.classList.remove('hidden'));

        switchTab('dashboard');
    }
}