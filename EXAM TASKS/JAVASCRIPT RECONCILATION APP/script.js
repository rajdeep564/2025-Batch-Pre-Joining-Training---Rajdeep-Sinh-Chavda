let transactions = {
  fromCompanyTransaction: [],
  toCompanyTransaction: [],
};
let draggedTransactions = {};



document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    window.location.href = "index.html";
  }
  initializeApp();
})

function initializeApp() {
  setupEventListeners();
  loadTransactions();
  initializeToastr();
}

function setupEventListeners() {
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("reconcileBtn").addEventListener("click", reconcileTransactions);
  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.id.replace("Tab", "")));
  });
}

function logout() {
  // localStorage.removeItem("jwt_token");
  localStorage.clear();
  window.location.href = "index.html";
}

function initializeToastr() {
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: 3000,
  };
}

async function loadTransactions() {
  const storedTransactions = localStorage.getItem("transactions");
  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
    renderTransactions("unreconciled");
  } else {
    await fetchTransactionsFromAPI();
  }
}

async function fetchTransactionsFromAPI() {
  const token = localStorage.getItem("jwt_token");
  const url = "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction?page=1";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const data = await response.json();
    transactions = data;

    // Set default values for isExcluded and isReconciled
    transactions.fromCompanyTransaction = transactions.fromCompanyTransaction.map((t) => ({
      ...t,
      isExcluded: false,
      isReconciled: false,
    }));
    transactions.toCompanyTransaction = transactions.toCompanyTransaction.map((t) => ({
      ...t,
      isExcluded: false,
      isReconciled: false,
    }));

    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions("unreconciled");
  } catch (error) {
    console.error("Error:", error);
    toastr.error("Error loading transactions");
  }
}

function renderTransactions(tabName) {
  const company1List = document.getElementById("company1List");
  const company2List = document.getElementById("company2List");
  const reconciledTransactions = document.getElementById("reconciledTransactions");
  const excludedTransactions = document.getElementById("excludedTransactions");

  company1List.innerHTML = "";
  company2List.innerHTML = "";
  reconciledTransactions.innerHTML = "";
  excludedTransactions.innerHTML = "";

  const filterTransactions = (transaction) => {
    switch (tabName) {
      case "unreconciled":
        return !transaction.isReconciled && !transaction.isExcluded;
      case "reconciled":
        return transaction.isReconciled && !transaction.isExcluded;
      case "excluded":
        return true; //show all
    }
  }

  const company1Transactions = transactions.fromCompanyTransaction.filter(filterTransactions);
  const company2Transactions = transactions.toCompanyTransaction.filter(filterTransactions);

  if (tabName === "unreconciled") {
    renderTransactionList(company1Transactions, company1List, "Company 1");
    renderTransactionList(company2Transactions, company2List, "Company 2", true);
    const reconcileBtn = document.getElementById('reconcileBtn');
    reconcileBtn.style.display = 'flex';
  } else if (tabName === "reconciled") {
    const reconcileBtn = document.getElementById('reconcileBtn');
    reconcileBtn.style.display = 'none';

    renderReconciledTransactions(reconciledTransactions);
  } else {
    renderExcludedTransactions(excludedTransactions);
    const reconcileBtn = document.getElementById('reconcileBtn');
    reconcileBtn.style.display = 'none';
  }
}

function renderTransactionList(transactions, container, company, isDraggable = false) {
  transactions
    // .filter(transaction => !transaction.isExcluded) // Filter out excluded transactions
    .forEach(transaction => {
      const transactionItem = document.createElement("div");
      transactionItem.className = "transaction-item d-flex  gap-2"; // Parent container
      transactionItem.classList.add('flex-row1');
      transactionItem.dataset.id = transaction.transactionId;

      // Wrapper for transaction details
      const detailsWrapper = document.createElement("div");
      detailsWrapper.className = "transaction-details-wrapper p-3 border rounded shadow-sm";
    
      detailsWrapper.innerHTML = `
        <div class="transaction-info">
            <strong class="transaction-type">${transaction.transactionType}</strong>: 
            <span class="transaction-amount">$${transaction.amount}</span>
            <br>
            <span class="transaction-date">Date: ${transaction.date}</span> | 
            <span class="transaction-id">ID: ${transaction.transactionId}</span>
        </div>
        <button class="btn btn-sm btn-outline-primary mt-2 toggle-btn"
                onclick="toggleDetails('${company}-${transaction.transactionId}')">
            Toggle Details
        </button>
        <div id="details-${company}-${transaction.transactionId}" class="transaction-details mt-2"></div>
      `;

      transactionItem.appendChild(detailsWrapper);

      // Make item draggable
      if (isDraggable && !transaction.isReconciled) {
        transactionItem.draggable = true;
        transactionItem.addEventListener("dragstart", drag);
      }

      // Drop zone (only for Company 1)
      if (company === "Company 1") {
        const dropZone = document.createElement("div");
        dropZone.className = "drop-zone p-3 border-dashed rounded text-center mt-2";
        dropZone.dataset.id = transaction.transactionId; // FIX: Ensuring dataset ID is correctly set
        dropZone.innerHTML = "<p class='m-0'>Drop matching transactions here</p>";

        // Ensure event listeners are properly added
        dropZone.addEventListener("dragover", allowDrop);
        dropZone.addEventListener("drop", drop);

        transactionItem.appendChild(dropZone);
      }

      if (company === "Company 2") {
        
      }

      container.appendChild(transactionItem);
    });
}

function renderReconciledTransactions(container) {
  const reconciledPairs = transactions.fromCompanyTransaction
    .filter((t) => t.isReconciled && (t.isExcluded === false || t.isExcluded === undefined))
    .map((t) => {
      const matchingTransactions = transactions.toCompanyTransaction
        .filter(
          (mt) =>
            mt.isReconciled &&
            (mt.isExcluded === false || mt.isExcluded === undefined) &&
            mt.reconciledWith === t.transactionId,
        );
      return { from: t, to: matchingTransactions };
    });

  reconciledPairs.forEach((pair) => {
    const pairElement = document.createElement("div");
    pairElement.className = "reconciled-pair";
    pairElement.innerHTML = `
      <h5>Reconciled Pair</h5>
      <div>
          <strong>Company 1:</strong> ${pair.from.transactionType} - $${pair.from.amount}
      </div>
      <div>
          <strong>Company 2:</strong>
          ${pair.to
            .map(
              (t) => `
              <div>${t.transactionType} - $${t.amount}</div>
          `,
            )
            .join("")}
      </div>
      <button class="btn btn-sm btn-warning mt-2" onclick="undoReconcile(${pair.from.transactionId})">
          Undo Reconcile
      </button>
    `;
    container.appendChild(pairElement);
  });
}

function renderExcludedTransactions(container) {
 // spread and modify
  const fromCompanyTransactions = transactions.fromCompanyTransaction.map(t => ({
    ...t,
    companyId: 'company1'  // Explicitly set company ID 
  }));
  
  const toCompanyTransactions = transactions.toCompanyTransaction.map(t => ({
    ...t,
    companyId: 'company2'  // Explicitly set company ID 
  }));

  // Now combine the tagged transactions
  const allTransactions = [...fromCompanyTransactions, ...toCompanyTransactions];

 
  const rowContainer = document.createElement("div");
  rowContainer.className = "row";


  allTransactions.forEach((transaction) => {
    const transactionItem = document.createElement("div");
    transactionItem.className = "col-6";

    transactionItem.innerHTML = `
  <div class="row mb-4"> 
    <div class="col-12">
      <div class="d-flex align-items-center p-3 border rounded bg-light"> <!-- Added a container with padding and subtle background -->
        
        
        <div class="me-4"> 
          <input type="checkbox" 
                 id="exclude-${transaction.transactionId}"
                 class="form-check-input" 
                 style="width: 1.5em; height: 1.5em; cursor: pointer;" 
                 ${transaction.isExcluded ? "checked" : ""}
                 onchange =" toggleExclude(${transaction.transactionId})">
        </div>

        
        <label for="exclude-${transaction.transactionId}" 
               class="mb-0" 
               style="cursor: pointer"> 
          
          
          <div class="d-flex align-items-center mb-2">
            <span class="text-primary fw-bold me-2" style="min-width: 120px;">
              ${transaction.transactionType}
            </span>
            <span class="fw-bold text-success">
              $${transaction.amount}
            </span>
          </div>

          
          <div class="text-muted mb-1">
            <span class="fw-bold me-2">Date:</span>${transaction.date} 
            <span class="mx-2">|</span> 
            <span class="fw-bold me-2">ID:</span>${transaction.transactionId}
          </div>

          
          <div>
            <span class="fw-bold me-2">Company:</span>
            <span class="badge bg-secondary">
              ${transaction.companyId === "company1" ? "Company 1" : "Company 2"}
            </span>
          </div>

        </label>
      </div>
    </div>
  </div>
`;

    rowContainer.appendChild(transactionItem);
  });

  container.appendChild(rowContainer);
}

function toggleExclude(transactionId) {
  let transaction = transactions.fromCompanyTransaction.find(
      t => t.transactionId === transactionId
  );
  console.log("Found in Company 1?", transaction ? "Yes" : "No");

  if (!transaction) {
      transaction = transactions.toCompanyTransaction.find(
          t => t.transactionId === transactionId
      );
      console.log("Found in Company 2?", transaction ? "Yes" : "No");
  }

  if (transaction) {
      console.log("Previous status:", transaction.isExcluded);
      transaction.isExcluded = !transaction.isExcluded;
      console.log("New status:", transaction.isExcluded);
      
      localStorage.setItem("transactions", JSON.stringify(transactions));
      renderTransactions("excluded");
      toastr.success(
          `Transaction ${transactionId} ${transaction.isExcluded ? "excluded" : "included"}`
      );
  }
}

function toggleDetails(uniqueId) {
  const detailsElement = document.getElementById(`details-${uniqueId}`);
  console.log("Unique ID:", uniqueId);
  if (!detailsElement) return;

  if (detailsElement.style.display === "none" || detailsElement.style.display === "") {
    // Extract company and transactionId from the uniqueId
    const [company, transactionIdStr] = uniqueId.split("-");
    const transactionId = Number(transactionIdStr); // Convert to number

    // Find the transaction from the correct company
    const transaction =
      company === "Company1"
        ? transactions.fromCompanyTransaction.find((t) => t.transactionId === transactionId)
        : transactions.toCompanyTransaction.find((t) => t.transactionId === transactionId);

    console.log("Extracted Transaction ID:", transactionId);
    console.log("Found Transaction:", transaction);

    if (transaction) {
      detailsElement.innerHTML = `
        <table class="transaction-table">
            <thead>
                <tr>
                    <th>Line ID</th>
                    <th>Account</th>
                    <th>Amount</th>
                    <th>Is Credit</th>
                </tr>
            </thead>
            <tbody>
                ${transaction.lines
                  .map(
                    (line) => `
                    <tr>
                        <td>${line.lineId}</td>
                        <td>${line.account}</td>
                        <td>$${line.amount}</td>
                        <td>${line.isCredit ? "Yes" : "No"}</td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
      `;
      detailsElement.style.display = "block";
    }
  } else {
    detailsElement.style.display = "none";
  }
}


function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.dataset.id);
}

function drop(ev) {
  ev.preventDefault();
  const draggedId = ev.dataTransfer.getData("text");
  const dropZoneId = ev.target.closest(".drop-zone").dataset.id;

  if (draggedId && dropZoneId) {
    const draggedTransaction = transactions.toCompanyTransaction.find((t) => t.transactionId == draggedId);
    const dropZoneTransaction = transactions.fromCompanyTransaction.find((t) => t.transactionId == dropZoneId);

    if (draggedTransaction && dropZoneTransaction) {
      if (
        draggedTransactions[dropZoneId] &&
        draggedTransactions[dropZoneId].some((t) => t.transactionId == draggedId)
      ) {
        Swal.fire({
          title: "Warning",
          text: "This transaction has already been dragged.",
          icon: "warning",
          confirmButtonText: "OK",
        })
        return
      }

      if (!draggedTransactions[dropZoneId]) {
        draggedTransactions[dropZoneId] = [];
      }
      draggedTransactions[dropZoneId].push(draggedTransaction)
      updateDropZone(dropZoneId);
      updateReconcileButtonState();
    }
  }
}

function updateDropZone(transactionId) {
  const dropZone = document.querySelector(`.drop-zone[data-id="${transactionId}"]`);
  if (dropZone) {
    dropZone.innerHTML = `
            <p>Dragged Transactions:</p>
            ${draggedTransactions[transactionId]
              .map(
                (t) => `
                <div class="dragged-transaction">
                    ${t.transactionType}: $${t.amount}
                    <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeDraggedTransaction(${transactionId}, ${t.transactionId})">
                        Remove
                    </button>
                </div>
            `,
              )
              .join("")}
        `
        // console.log(draggedTransactions); // yeh objects of array isme trId matlab argument me dropzoneId jayegi to us key pe pura array hoga 
  }
}

function removeDraggedTransaction(dropZoneId, transactionId) {
  draggedTransactions[dropZoneId] = draggedTransactions[dropZoneId].filter((t) => t.transactionId != transactionId);
  updateDropZone(dropZoneId);
  updateReconcileButtonState();
}

function updateReconcileButtonState() {
  const reconcileBtn = document.getElementById("reconcileBtn");
  reconcileBtn.disabled = Object.keys(draggedTransactions).length === 0;
}

function reconcileTransactions() {
    // console.log(draggedTransactions);
    for (const [company1Id, company2Transactions] of Object.entries(draggedTransactions)) {
      console.log("Processing Company 1 Transaction ID:", company1Id);
      console.log("Dragged Transactions:", draggedTransactions);
      console.log("Company 2 Transactions for this Company 1 ID:", company2Transactions);
  
      const company1Transaction = transactions.fromCompanyTransaction.find((t) => t.transactionId == company1Id);
      console.log("Matching Company 1 Transaction:", company1Transaction);
  
      const totalAmount = company2Transactions.reduce((sum, t) => sum + t.amount, 0);
      console.log("Total Amount from Company 2 Transactions:", totalAmount);
  
      if (company1Transaction.amount === totalAmount) {
          console.log("Amounts match! Marking transactions as reconciled.");
  
          company1Transaction.isReconciled = true;
          console.log("Updated Company 1 Transaction:", company1Transaction);
  
          company2Transactions.forEach((t) => {
              t.isReconciled = true;
              t.reconciledWith = company1Transaction.transactionId;
              console.log("Updated Company 2 Transaction:", t);
          });
      } else {
          console.error("Amounts do not match for Company 1 ID:", company1Id);
          toastr.error("Amounts do not match for some transactions. Please check and try again.");
          return;
      }
  }
  

  localStorage.setItem("transactions", JSON.stringify(transactions));
  draggedTransactions = {};
  renderTransactions("unreconciled");
  toastr.success("Transactions reconciled successfully");
}

function undoReconcile(transactionId) {
  const company1Transaction = transactions.fromCompanyTransaction.find((t) => t.transactionId == transactionId);
  if (company1Transaction) {
    company1Transaction.isReconciled = false;
    transactions.toCompanyTransaction.forEach((t) => {
      if (t.reconciledWith === transactionId) {
        t.isReconciled = false;
        t.reconciledWith = null;
      }
    })
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions("reconciled");
    toastr.success("Reconciliation undone successfully");
  }
}

function switchTab(tabName) {
  renderTransactions(tabName);
}

