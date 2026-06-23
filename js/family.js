document.addEventListener('DOMContentLoaded', () => {
    const dataIbuStr = localStorage.getItem('ibu_hamil');
    if (!dataIbuStr) {
        window.location.href = 'register.html';
        return;
    }

    const dataIbu = JSON.parse(dataIbuStr);

    document.getElementById('familyForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const getRadioValue = (name) => {
            const el = document.querySelector(`input[name="${name}"]:checked`);
            return el ? el.value : "";
        };

        const supportData = {
            id_ibu: dataIbu.id,
            minggu_ke: 1,
            ttd: getRadioValue('kel_ttd'),
            kontrol: getRadioValue('kel_kontrol'),
            pekerjaan_rumah: getRadioValue('kel_rumah'),
            dukungan_emosi: getRadioValue('kel_emosi'),
            pola_makan: getRadioValue('kel_makan'),
            bebas_konflik: getRadioValue('kel_konflik')
        };

        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Menyimpan...';
        submitBtn.disabled = true;

        const result = await ApiService.sendData('family_support', supportData);

       if (result && result.status === 'success') {
            localStorage.setItem('family_support_temp', JSON.stringify(supportData));
            
            localStorage.removeItem('ai_analysis_saved');
            localStorage.removeItem('cached_ai_summary');
            localStorage.removeItem('cached_ai_recom');
            
            window.location.href = 'result.html';
        } else {
            alert("Terjadi kesalahan saat menyimpan data keluarga.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
});