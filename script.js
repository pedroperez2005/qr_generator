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

function isValidUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
        return false;
    }
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
                    html5QrCode.stop();

                    if (isValidUrl(qrCodeMessage)) {
                        const url = new URL(qrCodeMessage);
                        resultContainer.innerText = `URL detectada: ${url.href}`;

                        const openSite = confirm(
                            `Se ha detectado un sitio web:\n${url.href}\n\n¿Deseas abrirlo en una nueva pestaña?`
                        );

                        if (openSite) {
                            window.open(url.href, "_blank");
                        }
                    } else {
                        resultContainer.innerText = "Resultado: " + qrCodeMessage;
                        alert("Código QR detectado:\n" + qrCodeMessage);
                    }
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
