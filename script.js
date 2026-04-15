let html5QrCode;
let cameraDevices = [];
let currentCameraIndex = 0;
let scanning = false;

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

function startCamera(index = 0) {
    const resultContainer = document.getElementById("result");
    const flipBtn = document.getElementById("flipBtn");

    if (!cameraDevices.length) {
        return;
    }

    currentCameraIndex = index;
    const cameraId = cameraDevices[currentCameraIndex].id;

    html5QrCode.start(
        cameraId,
        {
            fps: 10,
            qrbox: 250
        },
        qrCodeMessage => {
            scanning = false;
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

            if (flipBtn) {
                flipBtn.disabled = true;
            }
        },
        errorMessage => {
            // ignorar errores
        }
    ).catch(err => {
        console.error(err);
        scanning = false;
        if (flipBtn) {
            flipBtn.disabled = cameraDevices.length < 2;
        }
    });

    scanning = true;
    if (flipBtn) {
        flipBtn.disabled = cameraDevices.length < 2;
    }
}

function startScanner() {
    const resultContainer = document.getElementById("result");
    const flipBtn = document.getElementById("flipBtn");

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            cameraDevices = devices;
            currentCameraIndex = 0;
            resultContainer.innerText = "Cámara iniciada. Escanea un código QR.";
            startCamera(currentCameraIndex);
        } else {
            alert("No se encontraron cámaras disponibles.");
        }
    }).catch(err => {
        console.log(err);
        alert("Error al acceder a la cámara.");
    });
}

function switchCamera() {
    if (!scanning || cameraDevices.length < 2 || !html5QrCode) {
        return;
    }

    html5QrCode.stop().then(() => {
        currentCameraIndex = (currentCameraIndex + 1) % cameraDevices.length;
        startCamera(currentCameraIndex);
    }).catch(err => {
        console.error(err);
    });
}

// Event listeners
document.getElementById("generateBtn").addEventListener("click", generateQR);
document.getElementById("scanBtn").addEventListener("click", startScanner);
document.getElementById("flipBtn").addEventListener("click", switchCamera);
