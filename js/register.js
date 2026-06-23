document.addEventListener('DOMContentLoaded', () => {
    const dataIbuTerdaftar = localStorage.getItem('ibu_hamil');
    if (dataIbuTerdaftar) {
        console.log("Ibu sudah terdaftar. Mengalihkan langsung ke Daily Tracker...");
        window.location.href = 'daily.html'; 
        return;
    }

    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const dataIbu = {
            id: 'IBU-' + Date.now(),
            nama: document.getElementById('nama').value.trim(),
            nik: document.getElementById('nik').value.trim(),
            usia: parseInt(document.getElementById('usia').value),
            usia_kehamilan: parseInt(document.getElementById('usiaKehamilan').value),
            tanggal_daftar: new Date().toISOString()
        };

        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Menyimpan...';
        submitBtn.disabled = true;

        try {
            const result = await ApiService.sendData('register', dataIbu);

            if (result && result.status === 'success') {
                if (result.id_ibu) {
                    dataIbu.id = result.id_ibu; 
                }
                
                localStorage.setItem('ibu_hamil', JSON.stringify(dataIbu));
                
                window.location.href = 'daily.html';
            } else {
                throw new Error("Respons server gagal.");
            }
        } catch (error) {
            console.error("Error Registrasi:", error);
            alert("Gagal menyimpan ke server. Silakan coba lagi.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
});