function submit1(buttonName) {
    const firstname = document.getElementById("firstname").value;
    
    if (firstname) {
      const tableBody = document.getElementById("tableBody");
      const newRow = tableBody.insertRow();
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      
      cell1.textContent = firstname;
      cell2.textContent = buttonName;
      
      document.getElementById("firstname").value = '';
    } else {
      alert("Please enter a name.");
    }
  }

  function submit2(buttonName) {
    const firstname = document.getElementById("firstname").value;
    
    if (firstname) {
      const tableBody = document.getElementById("tableBody");
      const newRow = tableBody.insertRow();
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      
      cell1.textContent = firstname;
      cell2.textContent = buttonName;
      
      document.getElementById("firstname").value = '';
    } else {
      alert("Please enter a name.");
    }
  }