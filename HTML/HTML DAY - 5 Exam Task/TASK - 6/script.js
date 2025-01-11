function handleFileUpload() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const message = document.getElementById("uploadMessage");

    if (file) {
        if (file.name.endsWith(".xlsx")) {
            message.textContent = "File uploaded successfully!";
            message.style.color = "green";
        } else {
            message.textContent = "Please upload an Excel file only (.xlsx)";
            message.style.color = "red";
        }
    } else {
        message.textContent = "No file selected.";
        message.style.color = "orange";
    }
}
