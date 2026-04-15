function generateQR() {
    const text = document.getElementById("text").value;
    const qrContainer = document.getElementById("qrcode");

    qrContainer.innerHTML = "";

    if (!text) {
        alert("Escribe algo primero");
        return;
    }

    const qr = new QRCode(qrContainer, {
        text: text,
        width: 200,
        height: 200
    });
}

function startScanner() {
    const resultContainer = document.getElementById("result");

    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            const cameraId = devices[0].id;

            html5QrCode.start(
                cameraId,
                {
                    fps: 10,
                    qrbox: 250
                },
                qrCodeMessage => {
                    resultContainer.innerText = "Resultado: " + qrCodeMessage;
                    html5QrCode.stop();
                },
                errorMessage => {
                    // ignorar errores
                }
            );
        }
    }).catch(err => {
        console.log(err);
    });
}

// Event listeners
document.getElementById("generateBtn").addEventListener("click", generateQR);
document.getElementById("scanBtn").addEventListener("click", startScanner);
