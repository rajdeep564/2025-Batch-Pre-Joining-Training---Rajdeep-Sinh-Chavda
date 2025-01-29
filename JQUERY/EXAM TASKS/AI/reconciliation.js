// Configure toastr notifications
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: 3000
};

// Global variables
let selectedCompany1Transaction = null;
let draggedCompany2Transactions = [];

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeEventListeners();
    fetchTransactions('unreconciled');
});

// Initialize event listeners
function initializeEventListeners() {
    // Tab event listeners
    document.getElementById('unreconciledTab').addEventListener('click', () => handleTabClick('unreconciled'));
    document.getElementById('reconciledTab').addEventListener('click', () => handleTabClick('reconciled'));
    document.getElementById('excludedTab').addEventListener('click', () => handleTabClick('excluded'));
    
    // Logout button
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
    
    // Reconcile button
    document.getElementById('reconcileButton').addEventListener('click', handleReconcile);
    
    // Drop zone events
    const dropZone = document.getElementById('centreDropZone');
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('dragenter', handleDragEnter);
}

// Authentication check
function checkAuth() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = 'index.html';
        return false;
    }
    return token;
}

// Handle tab clicks
async function handleTabClick(type) {
    // Update active tab
    document.querySelectorAll('.nav-link').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${type}Tab`).classList.add('active');
    
    // Fetch transactions for selected tab
    await fetchTransactions(type);
}

// Fetch transactions
async function fetchTransactions(type = 'unreconciled') {
    const token = checkAuth();
    try {
        const response = await fetch(`http://trainingsampleapi.satva.solutions/api/transaction/${type}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        
        const data = await response.json();
        renderTransactions(data);
    } catch (error) {
        toastr.error('Error fetching transactions');
        console.error('Error:', error);
    }
}

// Render all transactions
function renderTransactions(data) {
    const { fromCompanyTransaction, toCompanyTransaction } = data;
    
    // Filter transactions
    const filteredCompany1 = fromCompanyTransaction.filter(t => !t.isReconciled && !t.isExcluded);
    const filteredCompany2 = toCompanyTransaction.filter(t => !t.isReconciled && !t.isExcluded);
    
    // Clear and render both lists
    renderCompany1List(filteredCompany1);
    renderCompany2List(filteredCompany2);
    
    // Reset drop zone
    resetDropZone();
}

// Render Company 1 transactions
function renderCompany1List(transactions) {
    const company1List = document.getElementById('company1List');
    company1List.innerHTML = '<h5 class="mb-3">Company 1 Transactions</h5>';
    
    if (transactions.length === 0) {
        company1List.innerHTML += `
            <div class="empty-state">
                <p>No transactions available</p>
            </div>
        `;
        return;
    }
    
    transactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction, false);
        company1List.appendChild(transactionElement);
    });
}

// Render Company 2 transactions
function renderCompany2List(transactions) {
    const company2List = document.getElementById('company2List');
    company2List.innerHTML = '<h5 class="mb-3">Company 2 Transactions</h5>';
    
    if (transactions.length === 0) {
        company2List.innerHTML += `
            <div class="empty-state">
                <p>No transactions available</p>
            </div>
        `;
        return;
    }
    
    transactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction, true);
        company2List.appendChild(transactionElement);
    });
}

// Create transaction element
function createTransactionElement(transaction, isDraggable) {
    const div = document.createElement('div');
    div.className = `transaction-item ${isDraggable ? 'draggable' : ''}`;
    div.dataset.transactionId = transaction.transactionId;
    
    if (isDraggable) {
        div.draggable = true;
        div.addEventListener('dragstart', (e) => handleDragStart(e, transaction));
    } else {
        div.addEventListener('click', () => handleCompany1Selection(transaction, div));
    }
    
    div.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <strong>${transaction.transactionType}</strong>
                <div class="text-muted small">${transaction.date}</div>
                <div class="mt-1">$${transaction.amount}</div>
            </div>
            <button class="btn btn-sm btn-outline-primary" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#details-${transaction.transactionId}">
                Details
            </button>
        </div>
        <div class="collapse" id="details-${transaction.transactionId}">
            <div class="table-responsive mt-2">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Line ID</th>
                            <th>Account</th>
                            <th>Debit</th>
                            <th>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transaction.lines.map(line => `
                            <tr>
                                <td>${line.lineId}</td>
                                <td>${line.account}</td>
                                <td>${!line.isCredit ? `$${line.amount}` : ''}</td>
                                <td>${line.isCredit ? `$${line.amount}` : ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return div;
}

// Handle Company 1 transaction selection
function handleCompany1Selection(transaction, element) {
    // Deselect previous selection
    document.querySelectorAll('.transaction-item.selected').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Select new transaction
    element.classList.add('selected');
    selectedCompany1Transaction = transaction;
    
    // Create or update matching area
    createMatchingArea(transaction);
    updateReconcileButtonState();
}

// Create matching area
function createMatchingArea(transaction) {
    const dropZone = document.getElementById('centreDropZone');
    dropZone.innerHTML = `
        <h5 class="mb-3">Matching Area</h5>
        <div class="selected-transaction mb-3">
            <strong>Selected Transaction:</strong>
            <div class="transaction-item mt-2">
                <div>${transaction.transactionType} - $${transaction.amount}</div>
                <div class="text-muted small">ID: ${transaction.transactionId}</div>
            </div>
        </div>
        <div class="matched-transactions" data-transaction-id="${transaction.transactionId}">
            <h6 class="mb-2">Matched Transactions</h6>
            <div class="matched-items"></div>
        </div>
    `;
}

// Handle drag start
function handleDragStart(e, transaction) {
    e.dataTransfer.setData('text/plain', JSON.stringify(transaction));
    e.target.classList.add('dragging');
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
}

// Handle drag enter
function handleDragEnter(e) {
    e.preventDefault();
    if (!e.target.classList.contains('drop-zone')) {
        const dropZone = document.getElementById('centreDropZone');
        dropZone.classList.add('drag-over');
    }
}

// Handle drag leave
function handleDragLeave(e) {
    e.preventDefault();
    if (!e.target.classList.contains('drop-zone')) {
        const dropZone = document.getElementById('centreDropZone');
        dropZone.classList.remove('drag-over');
    }
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    document.getElementById('centreDropZone').classList.remove('drag-over');
    
    if (!selectedCompany1Transaction) {
        toastr.warning('Please select a transaction from Company 1 first');
        return;
    }
    
    const transactionData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Check if already matched
    if (draggedCompany2Transactions.some(t => t.transactionId === transactionData.transactionId)) {
        toastr.warning('This transaction is already matched');
        return;
    }
    
    // Add to matched transactions
    draggedCompany2Transactions.push(transactionData);
    addMatchedTransaction(transactionData);
    updateReconcileButtonState();
}

// Add matched transaction to the matching area
function addMatchedTransaction(transaction) {
    const matchedItems = document.querySelector('.matched-items');
    const matchedTransaction = document.createElement('div');
    matchedTransaction.className = 'matched-transaction';
    matchedTransaction.dataset.transactionId = transaction.transactionId;
    
    matchedTransaction.innerHTML = `
        <div>
            <div>${transaction.transactionType} - $${transaction.amount}</div>
            <div class="text-muted small">ID: ${transaction.transactionId}</div>
        </div>
        <button class="btn btn-sm btn-danger btn-remove" onclick="removeMatchedTransaction('${transaction.transactionId}')">
            ×
        </button>
    `;
    
    matchedItems.appendChild(matchedTransaction);
}

// Remove matched transaction
function removeMatchedTransaction(transactionId) {
    draggedCompany2Transactions = draggedCompany2Transactions.filter(t => t.transactionId !== transactionId);
    document.querySelector(`.matched-transaction[data-transaction-id="${transactionId}"]`).remove();
    updateReconcileButtonState();
}

// Reset drop zone
function resetDropZone() {
    const dropZone = document.getElementById('centreDropZone');
    dropZone.innerHTML = `
        <h5 class="mb-3">Matching Area</h5>
        <div id="drophead" class="empty-state">
            <p>Select a transaction from Company 1 and drag matching transactions here</p>
        </div>
    `;
    selectedCompany1Transaction = null;
    draggedCompany2Transactions = [];
    updateReconcileButtonState();
}

// Update reconcile button state
function updateReconcileButtonState() {
    const reconcileButton = document.getElementById('reconcileButton');
    reconcileButton.disabled = !selectedCompany1Transaction || draggedCompany2Transactions.length === 0;
}

// Handle reconcile
async function handleReconcile() {
    const token = checkAuth();
    
    try {
        const response = await fetch('http://trainingsampleapi.satva.solutions/api/transaction/reconcile', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromTransactionId: selectedCompany1Transaction.transactionId,
                toTransactionIds: draggedCompany2Transactions.map(t => t.transactionId)
            })
        });
        
        if (!response.ok) {
            throw new Error('Reconciliation failed');
        }
        
        toastr.success('Transactions reconciled successfully');
        fetchTransactions('unreconciled');
    } catch (error) {
        toastr.error('Error reconciling transactions');
        console.error('Error:', error);
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('jwt_token');
    window.location.href = 'index.html';
}