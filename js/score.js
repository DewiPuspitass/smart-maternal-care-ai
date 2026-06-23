document.addEventListener('DOMContentLoaded', () => {
    const dataHarianStr = localStorage.getItem('daily_tracker_temp');
    const dataKeluargaStr = localStorage.getItem('family_support_temp');

    if (!dataHarianStr || !dataKeluargaStr) {
        alert("Data tidak lengkap untuk perhitungan skor.");
        return;
    }

    const daily = JSON.parse(dataHarianStr);
    const family = JSON.parse(dataKeluargaStr);

    const hitungFisik = () => {
        let poin = 0;
        const maxPoin = 600;
        
        if (daily.ttd === "Ya") poin += 100;
        if (daily.protein === "Ya") poin += 100;
        if (daily.sayur === "Ya") poin += 100;
        if (daily.air === "Ya") poin += 100;
        if (daily.aktivitas === "Ya") poin += 100;
        if (daily.tidur >= 7) poin += 100; else if (daily.tidur >= 5) poin += 50;

        return (poin / maxPoin) * 100;
    };

    const hitungMental = () => {
        let poin = 0;
        const maxPoin = 500;

        if (daily.mood === "Baik") poin += 100;
        else if (daily.mood === "Sedang") poin += 50;

        poin += ((5 - daily.stres) / 4) * 100;
        poin += ((5 - daily.cemas) / 4) * 100;

        if (daily.kesepian === "Tidak") poin += 100;
        if (daily.teman === "Ya") poin += 100;

        return (poin / maxPoin) * 100;
    };

    const hitungKeluarga = () => {
        let poin = 0;
        const maxPoin = 600;

        if (family.ttd === "Ya") poin += 100;
        if (family.kontrol === "Ya") poin += 100;
        if (family.pekerjaan_rumah === "Ya") poin += 100;
        if (family.dukungan_emosi === "Ya") poin += 100;
        if (family.pola_makan === "Ya") poin += 100;
        if (family.bebas_konflik === "Ya") poin += 100;

        return (poin / maxPoin) * 100;
    };

    const scoreFisik = Math.round(hitungFisik());
    const scoreMental = Math.round(hitungMental());
    const scoreKeluarga = Math.round(hitungKeluarga());

    const totalScore = Math.round(
        (scoreFisik * 0.40) + 
        (scoreMental * 0.35) + 
        (scoreKeluarga * 0.25)
    );

    let kategori = "";
    let riskColor = "";
    let badgeBg = "";

    if (totalScore >= 81) {
        kategori = "Risiko Rendah";
        riskColor = "#10b981";
        badgeBg = "#d1fae5";
    } else if (totalScore >= 61) {
        kategori = "Risiko Sedang";
        riskColor = "#f59e0b";
        badgeBg = "#fef3c7";
    } else if (totalScore >= 41) {
        kategori = "Risiko Tinggi";
        riskColor = "#ef4444";
        badgeBg = "#fee2e2";
    } else {
        kategori = "Risiko Sangat Tinggi";
        riskColor = "#b91c1c";
        badgeBg = "#fecaca";
    }

    if (daily.pendarahan === "Ya" || daily.bengkak === "Ya") {
        kategori = "DARURAT MEDIS";
        riskColor = "#991b1b";
        badgeBg = "#fecaca";
    }

    document.getElementById('totalScoreText').innerText = totalScore;
    document.getElementById('scoreFisikText').innerText = scoreFisik;
    document.getElementById('scoreMentalText').innerText = scoreMental;
    document.getElementById('scoreKeluargaText').innerText = scoreKeluarga;
    
    const badgeEl = document.getElementById('riskBadge');
    badgeEl.innerText = kategori;
    badgeEl.style.backgroundColor = badgeBg;
    badgeEl.style.color = riskColor;
    document.getElementById('mainScoreCard').style.borderTopColor = riskColor;

    const finalDataForAI = {
        score_fisik: scoreFisik,
        score_mental: scoreMental,
        score_keluarga: scoreKeluarga,
        kategori: kategori,
        gejala_kritis: (daily.pendarahan === "Ya" || daily.bengkak === "Ya") ? "Ya" : "Tidak" 
    };

    console.log("Data siap dikirim ke AI:", finalDataForAI);
   
    prosesAnalisisAI(finalDataForAI);
});