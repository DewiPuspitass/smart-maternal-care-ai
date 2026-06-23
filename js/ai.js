async function prosesAnalisisAI(finalDataForAI) {
    const summaryContainer = document.getElementById('aiSummaryContent');
    const recomContainer = document.getElementById('aiRecomContent');

    const isSaved = localStorage.getItem('ai_analysis_saved');
    if (isSaved === 'true') {
        console.log("Data sudah pernah disimpan. Memuat dari cache...");
        
        const cachedSummary = localStorage.getItem('cached_ai_summary');
        const cachedRecom = localStorage.getItem('cached_ai_recom');

        if (cachedSummary && cachedRecom) {
            summaryContainer.innerHTML = cachedSummary;
            recomContainer.innerHTML = cachedRecom;
            return;
        }
    }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'generate_ai',
                data: finalDataForAI
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            const aiData = result.ai_response;

            const summaryHtml = `<p style="line-height: 1.6; color: var(--text-main);">${aiData.summary}</p>`;
            const recomHtml = `<div style="line-height: 1.6; color: var(--text-main); margin-left: 1rem;">${aiData.rekomendasi}</div>`;

            summaryContainer.innerHTML = summaryHtml;
            recomContainer.innerHTML = recomHtml;

            const dataIbu = JSON.parse(localStorage.getItem('ibu_hamil'));
            const payloadAnalysis = {
                tanggal: new Date().toISOString().split('T')[0],
                id_ibu: dataIbu.id,
                score_fisik: finalDataForAI.score_fisik,
                score_mental: finalDataForAI.score_mental,
                score_keluarga: finalDataForAI.score_keluarga,
                total_score: document.getElementById('totalScoreText').innerText,
                kategori: finalDataForAI.kategori,
                summary_ai: aiData.summary,
                rekomendasi_ai: aiData.rekomendasi
            };

            await ApiService.sendData('save_analysis', payloadAnalysis);

            localStorage.setItem('ai_analysis_saved', 'true');
            localStorage.setItem('cached_ai_summary', summaryHtml);
            localStorage.setItem('cached_ai_recom', recomHtml);

        } else {
            throw new Error(result.message || "Gagal mendapatkan respons AI");
        }

    } catch (error) {
        console.error("AI Error:", error);
        summaryContainer.innerHTML = `<p style="color: red;">Error Backend: ${error.message}</p>`;
        recomContainer.innerHTML = `<p style="color: red;">Gagal memuat rekomendasi.</p>`;
    }
}