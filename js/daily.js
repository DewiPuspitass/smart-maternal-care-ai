document.addEventListener('DOMContentLoaded', () => {
    const dataIbuStr = localStorage.getItem('ibu_hamil');
    if (!dataIbuStr) {
        alert("Silakan registrasi terlebih dahulu.");
        window.location.href = 'register.html';
        return;
    }

    const dataIbu = JSON.parse(dataIbuStr);
    
    const namaPanggilan = dataIbu.nama.split(' ')[0];
    document.getElementById('displayNama').innerText = namaPanggilan;

    const tglDaftar = new Date(dataIbu.tanggal_daftar);
    const tglSekarang = new Date();
    const selisihWaktu = Math.abs(tglSekarang - tglDaftar);
    let hariKe = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));
    if (hariKe === 0) hariKe = 1; 

    document.getElementById('displayHari').innerText = `Hari ke ${hariKe} dari 90`;

    const persentase = (hariKe / 90) * 100;
    const progressBar = document.getElementById('progressBar');
    setTimeout(() => {
        progressBar.style.width = `${Math.min(persentase, 100)}%`;
    }, 300);

    document.getElementById('dailyForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const getRadioValue = (name) => {
            const el = document.querySelector(`input[name="${name}"]:checked`);
            return el ? el.value : "";
        };

        const dataHarian = {
            id_ibu: dataIbu.id,
            tanggal: new Date().toISOString().split('T')[0],
            bb: parseFloat(document.getElementById('bb').value),
            ttd: getRadioValue('ttd'),
            protein: getRadioValue('protein'),
            sayur: getRadioValue('sayur'),
            air: getRadioValue('air'),
            aktivitas: getRadioValue('aktivitas'),
            tidur: parseFloat(document.getElementById('tidur').value),
            mood: getRadioValue('mood'),
            stres: parseInt(document.getElementById('stres').value),
            cemas: parseInt(document.getElementById('cemas').value),
            kesepian: getRadioValue('kesepian'),
            teman: getRadioValue('teman'),
            mual: document.getElementById('gejala_mual').checked ? "Ya" : "Tidak",
            pusing: document.getElementById('gejala_pusing').checked ? "Ya" : "Tidak",
            bengkak: document.getElementById('gejala_bengkak').checked ? "Ya" : "Tidak",
            perdarahan: document.getElementById('gejala_perdarahan').checked ? "Ya" : "Tidak",
            keluhan_lain: document.getElementById('keluhan_lain').value.trim()
        };

        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Menyimpan Data Harian...';
        submitBtn.disabled = true;

        const result = await ApiService.sendData('daily_tracker', dataHarian);

        if (result && result.status === 'success') {
            localStorage.setItem('daily_tracker_temp', JSON.stringify(dataHarian));
            
            window.location.href = 'family.html';
        } else {
            alert("Gagal menyimpan ke server. Silakan cek koneksi Anda.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
});