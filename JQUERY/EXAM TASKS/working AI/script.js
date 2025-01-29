let
transactions = {
  fromCompanyTransaction: [],
  toCompanyTransaction: [],
}
let draggedTransactions = {}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwt_token")
  if (!token) {
    window.location.href = "index.html"
  }
  initializeApp()
})

function initializeApp() {
  setupEventListeners()
  loadTransactions()
  initializeToastr()
}

function setupEventListeners() {
  document.getElementById("logoutBtn").addEventListener("click", logout)
  document.getElementById("reconcileBtn").addEventListener("click", reconcileTransactions)
  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.id.replace("Tab", "")))
  })
}

function logout() {
  localStorage.removeItem("jwt_token")
  window.location.href = "login.html"
}

function initializeToastr() {
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: 3000,
  }
}

async function loadTransactions() {
  const storedTransactions = localStorage.getItem("transactions")
  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions)
    renderTransactions("unreconciled")
  } else {
    await fetchTransactionsFromAPI()
  }
}

async function fetchTransactionsFromAPI() {
  const token = localStorage.getItem("jwt_token")
  const url = "http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction?page=1"

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch transactions")
    }

    const data = await response.json()
    transactions = data

    // Set default values for isExcluded and isReconciled
    transactions.fromCompanyTransaction = transactions.fromCompanyTransaction.map((t) => ({
      ...t,
      isExcluded: false,
      isReconciled: false,
    }))
    transactions.toCompanyTransaction = transactions.toCompanyTransaction.map((t) => ({
      ...t,
      isExcluded: false,
      isReconciled: false,
    }))

    localStorage.setItem("transactions", JSON.stringify(transactions))
    renderTransactions("unreconciled")
  } catch (error) {
    console.error("Error:", error)
    toastr.error("Error loading transactions")
  }
}

function renderTransactions(tabName) {
  const company1List = document.getElementById("company1List")
  const company2List = document.getElementById("company2List")
  const reconciledTransactions = document.getElementById("reconciledTransactions")
  const excludedTransactions = document.getElementById("excludedTransactions")

  company1List.innerHTML = ""
  company2List.innerHTML = ""
  reconciledTransactions.innerHTML = ""
  excludedTransactions.innerHTML = ""

  const filterTransactions = (transaction) => {
    switch (tabName) {
      case "unreconciled":
        return !transaction.isReconciled && !transaction.isExcluded
      case "reconciled":
        return transaction.isReconciled && !transaction.isExcluded
      case "excluded":
        return true // Show all transactions in the excluded tab
    }
  }

  const company1Transactions = transactions.fromCompanyTransaction.filter(filterTransactions)
  const company2Transactions = transactions.toCompanyTransaction.filter(filterTransactions)

  if (tabName === "unreconciled") {
    renderTransactionList(company1Transactions, company1List, "Company 1")
    renderTransactionList(company2Transactions, company2List, "Company 2", true)
  } else if (tabName === "reconciled") {
    renderReconciledTransactions(reconciledTransactions)
  } else {
    renderExcludedTransactions(excludedTransactions)
  }
}

function renderTransactionList(transactions, container, company, isDraggable = false) {
  transactions
    .filter((transaction) => {
      // Filter transactions where isExcluded is false or undefined
      return transaction.isExcluded === false || transaction.isExcluded === undefined;
    })
    .forEach((transaction) => {
      const transactionItem = document.createElement("div");
      transactionItem.className = "transaction-item";
      transactionItem.dataset.id = transaction.transactionId;
      transactionItem.innerHTML = `
        <div>
            <strong>${transaction.transactionType}</strong>: $${transaction.amount}
            <br>
            Date: ${transaction.date} | ID: ${transaction.transactionId}
        </div>
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="toggleDetails(${transaction.transactionId})">
            Toggle Details
        </button>
        <div id="details-${transaction.transactionId}" class="transaction-details"></div>
      `;

      if (company === "Company 1") {
        const dropZone = document.createElement("div");
        dropZone.className = "drop-zone";
        dropZone.dataset.id = transaction.transactionId;
        dropZone.innerHTML = "<p>Drop matching transactions here</p>";
        dropZone.addEventListener("dragover", allowDrop);
        dropZone.addEventListener("drop", drop);
        transactionItem.appendChild(dropZone);
      }

      if (isDraggable && !transaction.isReconciled) {
        transactionItem.draggable = true;
        transactionItem.addEventListener("dragstart", drag);
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
  const allTransactions = [...transactions.fromCompanyTransaction, ...transactions.toCompanyTransaction]

  console.log(allTransactions);
// Create the parent container with class "row"
const rowContainer = document.createElement("div");
rowContainer.className = "row";

// Loop through allTransactions and create each transaction item inside col-6
allTransactions.forEach((transaction) => {
  const transactionItem = document.createElement("div");
  transactionItem.className = "col-6"; // Ensure each item takes half the width

  transactionItem.innerHTML = `
    <div class="row mb-3">
        <div class="col-12">
            <input type="checkbox" id="exclude-${transaction.transactionId}" 
                   ${transaction.isExcluded ? "checked" : ""} 
                   onchange="toggleExclude(${transaction.transactionId})">
            <label for="exclude-${transaction.transactionId}">
                <strong>${transaction.transactionType}</strong>: $${transaction.amount}
                <br>
                Date: ${transaction.date} | ID: ${transaction.transactionId}
                <br>
                Company: ${transaction.companyId === "company1" ? "Company 1" : "Company 2"}
            </label>
        </div>
    </div>
  `;

  // Append the transactionItem to the row container
  rowContainer.appendChild(transactionItem);
});

// Finally, append the rowContainer to your container (parent element)
container.appendChild(rowContainer);

  
}

function toggleExclude(transactionId) {
  const updateTransaction = (t) => {
    if (t.transactionId === transactionId) {
      t.isExcluded = !t.isExcluded
      return true
    }
    return false
  }

  if (!transactions.fromCompanyTransaction.some(updateTransaction)) {
    transactions.toCompanyTransaction.some(updateTransaction)
  }

  localStorage.setItem("transactions", JSON.stringify(transactions))
  renderTransactions("excluded")
  toastr.success(`Transaction ${transactionId} ${transactions.isExcluded ? "excluded" : "included"}`)
}

function toggleDetails(transactionId) {
  const detailsElement = document.getElementById(`details-${transactionId}`)
  if (detailsElement.style.display === "none" || detailsElement.style.display === "") {
    const transaction = [...transactions.fromCompanyTransaction, ...transactions.toCompanyTransaction].find(
      (t) => t.transactionId === transactionId,
    )

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
            `
      detailsElement.style.display = "block"
    }
  } else {
    detailsElement.style.display = "none"
  }
}

function allowDrop(ev) {
  ev.preventDefault()
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.dataset.id)
}

function drop(ev) {
  ev.preventDefault()
  const draggedId = ev.dataTransfer.getData("text")
  const dropZoneId = ev.target.closest(".drop-zone").dataset.id

  if (draggedId && dropZoneId) {
    const draggedTransaction = transactions.toCompanyTransaction.find((t) => t.transactionId == draggedId)
    const dropZoneTransaction = transactions.fromCompanyTransaction.find((t) => t.transactionId == dropZoneId)

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
        draggedTransactions[dropZoneId] = []
      }
      draggedTransactions[dropZoneId].push(draggedTransaction)
      updateDropZone(dropZoneId)
      updateReconcileButtonState()
    }
  }
}

function updateDropZone(transactionId) {
  const dropZone = document.querySelector(`.drop-zone[data-id="${transactionId}"]`)
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
  }
}

function removeDraggedTransaction(dropZoneId, transactionId) {
  draggedTransactions[dropZoneId] = draggedTransactions[dropZoneId].filter((t) => t.transactionId != transactionId)
  updateDropZone(dropZoneId)
  updateReconcileButtonState()
}

function updateReconcileButtonState() {
  const reconcileBtn = document.getElementById("reconcileBtn")
  reconcileBtn.disabled = Object.keys(draggedTransactions).length === 0
}

function reconcileTransactions() {
  for (const [company1Id, company2Transactions] of Object.entries(draggedTransactions)) {
    const company1Transaction = transactions.fromCompanyTransaction.find((t) => t.transactionId == company1Id)
    const totalAmount = company2Transactions.reduce((sum, t) => sum + t.amount, 0)

    if (company1Transaction.amount === totalAmount) {
      company1Transaction.isReconciled = true
      company2Transactions.forEach((t) => {
        t.isReconciled = true
        t.reconciledWith = company1Transaction.transactionId
      })
    } else {
      toastr.error("Amounts do not match for some transactions. Please check and try again.")
      return
    }
  }

  localStorage.setItem("transactions", JSON.stringify(transactions))
  draggedTransactions = {}
  renderTransactions("unreconciled")
  toastr.success("Transactions reconciled successfully")
}

function undoReconcile(transactionId) {
  const company1Transaction = transactions.fromCompanyTransaction.find((t) => t.transactionId == transactionId)
  if (company1Transaction) {
    company1Transaction.isReconciled = false
    transactions.toCompanyTransaction.forEach((t) => {
      if (t.reconciledWith === transactionId) {
        t.isReconciled = false
        t.reconciledWith = null
      }
    })
    localStorage.setItem("transactions", JSON.stringify(transactions))
    renderTransactions("reconciled")
    toastr.success("Reconciliation undone successfully")
  }
}

function switchTab(tabName) {
  renderTransactions(tabName)
}

// toastr.options = {
//   "closeButton": false,
//   "debug": false,
//   "newestOnTop": false,
//   "progressBar": false,
//   "positionClass": "toast-top-right",
//   "preventDuplicates": false,
//   "onclick": null,
//   "showDuration": "300",
//   "hideDuration": "1000",
//   "timeOut": "5000",
//   "extendedTimeOut": "1000",
//   "showEasing": "swing",
//   "hideEasing": "linear",
//   "showMethod": "fadeIn",
//   "hideMethod": "fadeOut"
// }