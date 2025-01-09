function openModal() {
    document.getElementById("myModal").style.display = "block";
  }

  function closeModal() {
    document.getElementById("myModal").style.display = "none";
  }

  function alignLeft() {
    document.getElementById("editor").style.textAlign = "left";
  }

  function alignCenter() {
    document.getElementById("editor").style.textAlign = "center";
  }

  function alignRight() {
    document.getElementById("editor").style.textAlign = "right";
  }

  function justifyText() {
    document.getElementById("editor").style.textAlign = "justify";
  }

  function addBookmark() {
    // Implement bookmark functionality 
    alert("Bookmark added");
  }

  function addHyperlink() {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const url = prompt("Enter URL:");
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.textContent = selectedText;
      document.execCommand('insertHTML', false, anchor.outerHTML);
    }
  }

  function saveChanges() {
    // Implement save logic 
    alert("Changes saved");
  }