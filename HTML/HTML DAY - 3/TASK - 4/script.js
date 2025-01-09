function checkIfImage() {
    const fileInput = document.getElementById('fileInput');
    console.log(fileInput.files);

    const file = fileInput.files[0];
    console.log(file);
    const type = document.getElementById('type');
    const uploadButton = document.getElementById('uploadButton');

    if (file) {
      uploadButton.disabled = false;

      if (file.type.startsWith('image')) {
        type.textContent = "The file is an image.";
      } else {
        type.textContent = "The file is NOT an image.";
      }
    } else {
      type.textContent = "";
      uploadButton.disabled = true;
    }
  }

  function displayFileType() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const result = document.getElementById('result');

    if (file) {
      console.log(file.type)
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();

      result.textContent = `File type: .${fileExtension}`;
    } else {
      result.textContent = "No file selected.";
    }
  }