// Handles QR upload, camera, and approval
// Uses fetch to communicate with Flask backend

document.getElementById("qr-input").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    document.getElementById("qr-img").src = evt.target.result;
    document.getElementById("qr-img").style.display = "block";
    analyzeQR(file);
  };
  reader.readAsDataURL(file);
});

document.getElementById("camera-btn").addEventListener("click", function () {
  if (!("mediaDevices" in navigator)) {
    alert("Camera not supported");
    return;
  }
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      const video = document.createElement("video");
      video.setAttribute("playsinline", "");
      video.srcObject = stream;
      video.play();
      document.body.appendChild(video);
      // For demo: capture after 2s
      setTimeout(() => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          analyzeQR(blob);
          stream.getTracks().forEach((track) => track.stop());
          video.remove();
        }, "image/png");
      }, 2000);
    })
    .catch(() => alert("Unable to access camera"));
});

function analyzeQR(fileOrBlob) {
  const formData = new FormData();
  formData.append("qr_image", fileOrBlob);
  fetch("/analyze_qr", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("qr-result").style.display = "flex";
        document.getElementById("qr-data").textContent = data.qr_data;
        document.getElementById("approve-btn").onclick = function () {
          approveQR(data.qr_data);
        };
      } else {
        alert("QR not detected");
      }
    });
}

function approveQR(qrData) {
  fetch("/approve_qr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qr_data: qrData }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("QR data saved to Firebase!");
      } else {
        alert("Failed to save data");
      }
    });
}
