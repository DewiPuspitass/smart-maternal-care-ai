const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3illrx_sjV-qgT9sfSTQwqIEr5rYrjkxM03_B0hl4gPaO16Ch1RjdeZldUaudqO3f/exec';
const ApiService = {
    sendData: async function(actionName, dataPayload) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify({
                    action: actionName,
                    data: dataPayload
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                console.log(`Data ${actionName} berhasil dikirim!`); 
                
                return result;
            } else {
                console.error("Error dari server:", result.message);
                return false;
            }
        } catch (error) {
            console.error("Network Error:", error);
            return false;
        }
    }
};