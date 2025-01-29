


let excludeSelectedTransactions = [];

function logout(){
    window.location.href = "index.html"; 
    localStorage.clear(); // Clears all localStorage data

}


let currentPage = 1;
     document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        window.location.href = "index.html"; // Redirect to login page
    }
    });

    window.addEventListener('storage', (event) => {
    if (event.key === 'jwt_token' && !event.newValue) {
        window.location.href = "index.html"; // Redirect to login page
    }
});


function switchTab(tabName) {
    const tabs = ['unreconciled', 'reconciled', 'exclude'];

    // Hide all tab content
    tabs.forEach(tab => {
        const tabContent = document.getElementById(`${tab}TabContent`);
        if (tabContent) {
            tabContent.style.display = 'none';
        }
    });

    // Show the selected tab content
    const selectedTabContent = document.getElementById(`${tabName}TabContent`);
    if (selectedTabContent) {
        selectedTabContent.style.display = 'block';
    }

    // Update active tab link
    tabs.forEach(tab => {
        const tabLink = document.getElementById(`${tab}Tab`);
        if (tabLink) {
            tabLink.classList.remove('active');
        }
    });
    const selectedTabLink = document.getElementById(`${tabName}Tab`);
    if (selectedTabLink) {
        selectedTabLink.classList.add('active');
    }

    // Log to see if the correct tabName is being passed
    console.log(`Switching to tab: ${tabName}`);

    // Load the appropriate transactions for the selected tab
    if (tabName === 'reconciled') {
        loadReconciledTransactions();
    } 
    else if (tabName === 'exclude') {
    // Log to confirm if we're entering the exclude block
    console.log('Entering exclude tab');

    // Ensure you have the necessary data, for example from local storage
    const storedData = JSON.parse(localStorage.getItem('transactionsData')) || { fromCompanyTransaction: [], toCompanyTransaction: [] };
    console.log('Stored Data:', storedData);

    const company1List = document.getElementById('company1List');
    const company2List = document.getElementById('company2List');

    company1List.innerHTML = '';
    company2List.innerHTML = '';

    // Log to see if filtering transactions works
    console.log('All fromCompanyTransaction:', storedData.fromCompanyTransaction);
    console.log('All toCompanyTransaction:', storedData.toCompanyTransaction);

    // Pass all transactions (without filtering by isExcluded) to showExcludedPageList
    showExcludedPageList(storedData.fromCompanyTransaction, 'Company 1', company1List);
    showExcludedPageList(storedData.toCompanyTransaction, 'Company 2', company2List);
}


    else {
        loadTransactions();
    }
}



function loadUnreconciledTransactions() {
    const company1List = document.getElementById('company1List');
    const company2List = document.getElementById('company2List');

    // Simulate the fetching of unreconciled transactions from localStorage or API
    const storedData = localStorage.getItem('transactionsData');
    if (storedData) {
        const data = JSON.parse(storedData);
        renderTransactionList(data.fromCompanyTransaction.filter(transaction => !transaction.isReconciled), 'Company 1', company1List);
        renderTransactionList(data.toCompanyTransaction.filter(transaction => !transaction.isReconciled), 'Company 2', company2List, true);
    }
}

// Function to load Reconciled Transactions
function loadReconciledTransactions() {
    const company1List = document.getElementById('company1List');
    const company2List = document.getElementById('company2List');

    company1List.innerHTML = '';
    company2List.innerHTML = '';

    // Simulate the fetching of reconciled transactions from localStorage or API
    const storedData = localStorage.getItem('transactionsData');
    if (storedData) {
        const data = JSON.parse(storedData);

        // Filter reconciled transactions, excluding those with isExcluded true
        const reconciledCompany1 = data.fromCompanyTransaction.filter(transaction => transaction.isReconciled && !transaction.isExcluded);
        const reconciledCompany2 = data.toCompanyTransaction.filter(transaction => transaction.isReconciled && !transaction.isExcluded);

        // If no reconciled transactions are available
        if (reconciledCompany1.length === 0 && reconciledCompany2.length === 0) {
            company1List.innerHTML = 'NO DATA';
            company2List.innerHTML = 'NO DATA';
        } else {
            // Display the reconciled transactions for each company
            showTransactionList(reconciledCompany1, 'Company 1', company1List);
            showTransactionList(reconciledCompany2, 'Company 2', company2List, true);
        }
    }
}


// Function to load Excluded Transactions
function loadExcludedTransactions() {
    const company1List = document.getElementById('company1List');
    const company2List = document.getElementById('company2List');

    // Simulate the fetching of excluded transactions (if needed)
    // You can filter out excluded transactions if you have this data in localStorage
    const storedData = localStorage.getItem('transactionsData');
    if (storedData) {
        const data = JSON.parse(storedData);
        renderTransactionList(data.fromCompanyTransaction.filter(transaction => transaction.isExcluded), 'Company 1', company1List);
        renderTransactionList(data.toCompanyTransaction.filter(transaction => transaction.isExcluded), 'Company 2', company2List, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to each tab
    document.getElementById('unreconciledTab').addEventListener('click', () => switchTab('unreconciled'));
    document.getElementById('reconciledTab').addEventListener('click', () => switchTab('reconciled'));
    document.getElementById('excludeTab').addEventListener('click', () => switchTab('exclude'));

    // Initially render the unreconciled transactions (default tab)
    switchTab('unreconciled');
});






   
const token = localStorage.getItem('jwt_token');

    // Fetch transactions for the current page
    async function fetchTransactions(page) {
        const url = `http://trainingsampleapi.satva.solutions/api/Reconciliation/GetTransaction?page=${page}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();
            console.log('Fetched Data:', data); // Log the complete structure of the data

            // Store the fetched data in localStorage
            localStorage.setItem('transactionsData', JSON.stringify(data));

            // Make sure the data has both fromCompanyTransaction and toCompanyTransaction
            const fromCompanyTransaction = data.fromCompanyTransaction || [];
            const toCompanyTransaction = data.toCompanyTransaction || [];
            return { fromCompanyTransaction, toCompanyTransaction }; // Return both arrays
        } catch (error) {
            console.error(error);
            return { fromCompanyTransaction: [], toCompanyTransaction: [] }; // Return empty arrays in case of error
        }
    }




    // Render transactions in the UI for both Company 1 and Company 2
    let selectedCompany1Transaction = null;
let draggedCompany2Transactions = [];

let fromCompanyTransaction = []; // Define these at a higher scope
let toCompanyTransaction = [];


// Function to render transactions
function renderTransactions(data) {
    const company1List = document.getElementById('company1List');
    const company2List = document.getElementById('company2List');
    const centreDropZone = document.getElementById('centreDropZone');
    const reconcileButton = document.getElementById('reconcileButton');

    if (!company1List || !company2List || !centreDropZone || !reconcileButton) {
        console.error('Required elements not found');
        return;
    }

    console.log('Rendering Transactions:', data);

    company1List.innerHTML = '';
    company2List.innerHTML = '';

    const { fromCompanyTransaction, toCompanyTransaction } = data;

    // Filter transactions to show only those that are not reconciled, not excluded, and do not have the isReconciled property
    const filterUnreconciledTransactions = (transactions) => {
        return transactions.filter(transaction => !transaction.isReconciled && !transaction.isExcluded);
    };

    // Function to render transaction list for each company
    // Handle drop event in the center zone
    const handleDrop = (event) => {
        event.preventDefault();

        // Get the dragged transaction data
        const transactionData = JSON.parse(event.dataTransfer.getData('text/plain'));

        // Check if this transaction is already in the dropped transactions array
        const alreadyDropped = draggedCompany2Transactions.some(
            (item) => item.transactionId === transactionData.transactionId
        );

        if (alreadyDropped) {
            alert('This transaction has already been added!');
            return; // Stop further execution
        }

        // Log the dropped transaction data
        console.log('Dropped Transaction Data:', transactionData);

        // Ensure the amount exists in the transactionData
        if (!transactionData.amount) {
            console.error('Amount is missing in the dropped transaction:', transactionData);
            return;
        }

        // Find the selected Company 1 transaction
        const selectedTransactionDiv = document.querySelector('.transaction-item.selected');
        if (!selectedTransactionDiv) {
            console.error('No transaction selected from Company 1');
            return;
        }

        const selectedTransactionId = selectedTransactionDiv.dataset.transactionId;

        // Find the corresponding div in the center drop zone
        const company1TransactionDiv = document.querySelector(
            `.company1-matched-transaction[data-transaction-id="${selectedTransactionId}"]`
        );
        if (!company1TransactionDiv) {
            console.error('No corresponding div found in the center for selected Company 1 transaction');
            return;
        }

        // Add the dragged transaction to the dragged transactions array
        draggedCompany2Transactions.push(transactionData);

        // Create the dropped transaction element for Company 2
        const droppedTransaction = document.createElement('div');
        droppedTransaction.className = 'dropped-transaction';
        droppedTransaction.textContent = `${transactionData.transactionType} - $${transactionData.amount}`;
        droppedTransaction.style.backgroundColor = '#e9ecef';
        droppedTransaction.style.padding = '10px';
        droppedTransaction.style.marginBottom = '5px';
        droppedTransaction.style.borderRadius = '4px';
        droppedTransaction.style.border = '1px solid #ccc';

        // Set the data-amount attribute correctly
        droppedTransaction.dataset.amount = transactionData.amount;
        droppedTransaction.dataset.transactionId = transactionData.transactionId;

        // Log the data-amount attribute to confirm it's set
        console.log('Set data-amount for dropped transaction:', droppedTransaction.dataset.amount);

        // Add the dropped transaction inside the Company 1 matched div
        company1TransactionDiv.appendChild(droppedTransaction);

        // Store the dropped transaction amount in the element to be used later
        droppedTransaction.transactionData = transactionData;

        // Create and add the minus button
        const minusButton = document.createElement('button');
        minusButton.className = 'minus-btn';
        minusButton.textContent = '-';
        minusButton.style.marginLeft = '10px';
        minusButton.addEventListener('click', () => {
            // Remove the transaction from the center
            droppedTransaction.remove();

            // Remove the dragged transaction from the array
            const index = draggedCompany2Transactions.findIndex(
                (item) => item.transactionId === transactionData.transactionId
            );
            if (index !== -1) {
                draggedCompany2Transactions.splice(index, 1);
            }

            updateReconcileButtonState(); // Update reconcile button state
        });

        // Append the minus button to the dropped transaction
        droppedTransaction.appendChild(minusButton);

        // Adjust the height of the Company 1 matched div (this simulates adding transactions)
        company1TransactionDiv.style.height = `${company1TransactionDiv.offsetHeight + 60}px`;

        updateReconcileButtonState(); // Update reconcile button state
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    centreDropZone.addEventListener('dragover', handleDragOver);
    centreDropZone.addEventListener('drop', handleDrop);

    // Fetch and render only unreconciled and unexcluded transactions
    const unreconciledCompany1 = filterUnreconciledTransactions(fromCompanyTransaction);
    const unreconciledCompany2 = filterUnreconciledTransactions(toCompanyTransaction);

    renderTransactionList(unreconciledCompany1, 'Company 1', company1List);
    renderTransactionList(unreconciledCompany2, 'Company 2', company2List, true);

    // Save the updated transactions to local storage
    // localStorage.setItem('fromCompanyTransaction', JSON.stringify(fromCompanyTransaction));
    // localStorage.setItem('toCompanyTransaction', JSON.stringify(toCompanyTransaction));
}


//render transaction list

const renderTransactionList = (transactions, company, listElement, isDraggable = false) => {

    const reconcileButton = document.getElementById('reconcileButton');
        reconcileButton.style.display = 'block';
    const centreDropZone = document.getElementById('centreDropZone');
        centreDropZone.style.display = 'block';
        transactions.forEach(transaction => {
            // console.log(transaction);
            if (!transaction.transactionId || !transaction.transactionType || !transaction.amount || !transaction.lines) {
                console.error('Transaction is missing expected fields:', transaction);
                return;
            }

            

            

            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.dataset.transactionId = transaction.transactionId;

            if (company === 'Company 1') {
                transactionItem.style.backgroundColor = '#f1f1f1'; // Light gray for Company 1
            }

            // Add a click event to select the transaction from Company 1
            if (company === 'Company 1') {
    transactionItem.addEventListener('click', () => {
        // Deselect previously selected transaction
        const selectedItems = document.querySelectorAll('.transaction-item.selected');
        selectedItems.forEach(item => {
            item.classList.remove('selected');
            item.style.border = 'none'; // Remove green border
        });

        // Add green border to selected transaction
        transactionItem.classList.add('selected');
        transactionItem.style.border = '2px solid green'; // Green border for selected transaction

        // Update the selected transaction
        selectedCompany1Transaction = transaction;

        // Check if the transaction already has a div in the centre drop zone
        let company1TransactionDiv = document.querySelector(`.company1-matched-transaction[data-transaction-id="${transaction.transactionId}"]`);
        if (!company1TransactionDiv) {
            company1TransactionDiv = document.createElement('div');
            company1TransactionDiv.className = 'company1-matched-transaction';
            company1TransactionDiv.dataset.transactionId = transaction.transactionId;
            company1TransactionDiv.style.backgroundColor = '#f8f9fa';
            company1TransactionDiv.style.padding = '10px';
            company1TransactionDiv.style.marginTop = '15px';
            company1TransactionDiv.style.border = '1px solid #ccc';
            company1TransactionDiv.style.position = 'relative'; // Ensure relative positioning for the button

            // Label for selected transaction
            const label = document.createElement('span');
            label.className = 'company1-label';
            label.textContent = `Company 1 Transaction ID: ${transaction.transactionId}`;
            company1TransactionDiv.appendChild(label);

            // "Clear Selection" button
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Clear';
            clearButton.className = 'clear-selection-btn';
            clearButton.style.marginLeft = '15px';
            clearButton.style.padding = '5px 10px';
            clearButton.style.backgroundColor = '#dc3545';
            clearButton.style.color = 'white';
            clearButton.style.border = 'none';
            clearButton.style.borderRadius = '4px';
            clearButton.style.cursor = 'pointer';

            // Event listener for clear button
            clearButton.addEventListener('click', () => {
                // Remove the selected transaction div from the center drop zone
                company1TransactionDiv.remove();

                // Deselect transaction from Company 1 list
                transactionItem.classList.remove('selected');
                transactionItem.style.border = 'none';

                // Clear the selected transaction variable
                selectedCompany1Transaction = null;
            });

            company1TransactionDiv.appendChild(clearButton);

            // Append to centre drop zone
            centreDropZone.appendChild(company1TransactionDiv);
            
            // Hide heading
            const headingofcentrediv = document.getElementById('drophead');
            headingofcentrediv.style.display = 'none';
        }

        updateReconcileButtonState();
    });
}


            // Handle draggable transactions for Company 2
            if (isDraggable) {
                transactionItem.draggable = true;
                transactionItem.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify(transaction));
                });
            }

            const leftWrapper = document.createElement('div');
            leftWrapper.className = 'left-wrapper';
            leftWrapper.style.display = 'flex';
            leftWrapper.style.justifyContent = 'space-between';
            leftWrapper.style.alignItems = 'center';
            leftWrapper.style.width = '100%';

            const transactionText = document.createElement('div');
            transactionText.innerHTML = ` 
                <strong>${transaction.transactionType}</strong>: ${transaction.date} - $${transaction.amount} - tId : ${transaction.transactionId}
            `;
            leftWrapper.appendChild(transactionText);

            const uniqueExpandId = `transaction-details-${company.replace(/\s+/g, '')}-${transaction.transactionId}`;

            const expandButton = document.createElement('button');
            expandButton.className = 'btn btn-primary';
            expandButton.textContent = 'Expand';
            expandButton.setAttribute('data-bs-target', `#${uniqueExpandId}`); // Use unique ID
            expandButton.setAttribute('data-bs-toggle', 'collapse');
            leftWrapper.appendChild(expandButton);

            const expandedDetails = document.createElement('div');
            expandedDetails.className = 'collapse';
            expandedDetails.id = uniqueExpandId; // Assign unique ID

            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'table-wrapper';
            tableWrapper.style.display = 'flex';
            tableWrapper.style.justifyContent = 'flex-end';

            const table = document.createElement('table');
            table.className = 'transaction-table table table-bordered';
            const tableHeader = `
                <thead>
                    <tr><th>Line ID</th><th>Account</th><th>Debit</th><th>Credit</th></tr>
                </thead>
            `;
            table.innerHTML = tableHeader;

            transaction.lines.forEach(line => {
                const row = table.insertRow();
                row.insertCell(0).innerText = line.lineId;
                row.insertCell(1).innerText = line.account;

                if (line.isCredit) {
                    row.insertCell(2).innerText = '';
                    row.insertCell(3).innerText = `$${line.amount}`;
                } else {
                    row.insertCell(2).innerText = `$${line.amount}`;
                    row.insertCell(3).innerText = '';
                }
            });

            tableWrapper.appendChild(table);
            expandedDetails.appendChild(tableWrapper);

            transactionItem.appendChild(leftWrapper);
            transactionItem.appendChild(expandedDetails);

            listElement.appendChild(transactionItem);
        });
    };



    // show transavtction list 

    const showTransactionList= (transactions, company, listElement, isDraggable = false) => {
        const centreDropZone = document.getElementById('centreDropZone');
        centreDropZone.style.display = 'none';
        
        const reconcileButton = document.getElementById('reconcileButton');
        reconcileButton.style.display = 'none';
        transactions.forEach(transaction => {
            console.log(transaction);
            if (!transaction.transactionId || !transaction.transactionType || !transaction.amount || !transaction.lines) {
                console.error('Transaction is missing expected fields:', transaction);
                return;
            }

            

            

            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.dataset.transactionId = transaction.transactionId;

            const leftWrapper = document.createElement('div');
            leftWrapper.className = 'left-wrapper';
            leftWrapper.style.display = 'flex';
            leftWrapper.style.justifyContent = 'space-between';
            leftWrapper.style.alignItems = 'center';
            leftWrapper.style.width = '100%';

            const transactionText = document.createElement('div');
            transactionText.innerHTML = ` 
                <strong>${transaction.transactionType}</strong>: ${transaction.date} - $${transaction.amount} - tId : ${transaction.transactionId}
            `;
            leftWrapper.appendChild(transactionText);

            const uniqueExpandId = `transaction-details-${company.replace(/\s+/g, '')}-${transaction.transactionId}`;

            const expandButton = document.createElement('button');
            expandButton.className = 'btn btn-primary';
            expandButton.textContent = 'Expand';
            expandButton.setAttribute('data-bs-target', `#${uniqueExpandId}`); // Use unique ID
            expandButton.setAttribute('data-bs-toggle', 'collapse');
            leftWrapper.appendChild(expandButton);

            const expandedDetails = document.createElement('div');
            expandedDetails.className = 'collapse';
            expandedDetails.id = uniqueExpandId; // Assign unique ID

            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'table-wrapper';
            tableWrapper.style.display = 'flex';
            tableWrapper.style.justifyContent = 'flex-end';

            const table = document.createElement('table');
            table.className = 'transaction-table table table-bordered';
            const tableHeader = `
                <thead>
                    <tr><th>Line ID</th><th>Account</th><th>Debit</th><th>Credit</th></tr>
                </thead>
            `;
            table.innerHTML = tableHeader;

            transaction.lines.forEach(line => {
                const row = table.insertRow();
                row.insertCell(0).innerText = line.lineId;
                row.insertCell(1).innerText = line.account;

                if (line.isCredit) {
                    row.insertCell(2).innerText = '';
                    row.insertCell(3).innerText = `$${line.amount}`;
                } else {
                    row.insertCell(2).innerText = `$${line.amount}`;
                    row.insertCell(3).innerText = '';
                }
            });

            tableWrapper.appendChild(table);
            expandedDetails.appendChild(tableWrapper);

            transactionItem.appendChild(leftWrapper);
            transactionItem.appendChild(expandedDetails);

            listElement.appendChild(transactionItem);
        });
    };

    // Global array to track selected transactions for exclusion


// Function to show excluded page list with checkboxes
// Function to show excluded page list with checkboxes
const showExcludedPageList = (transactions, company, listElement) => {
    const centreDropZone = document.getElementById('centreDropZone');
    centreDropZone.style.display = 'none';
    
    const reconcileButton = document.getElementById('reconcileButton');
    reconcileButton.style.display = 'none';

    // Loop through each transaction and create its checkbox
    transactions.forEach(transaction => {
        // Ensure the transaction object has an 'isExcluded' property
        if (transaction.isExcluded === undefined) {
            transaction.isExcluded = false; // Initialize if not defined
        }
        console.log(transaction);

        // Create transaction item element
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        transactionItem.dataset.transactionId = transaction.transactionId;

        // Create left wrapper for the transaction
        const leftWrapper = document.createElement('div');
        leftWrapper.className = 'left-wrapper';
        leftWrapper.style.display = 'flex';
        leftWrapper.style.justifyContent = 'space-between';
        leftWrapper.style.alignItems = 'center';
        leftWrapper.style.width = '100%';

        // Transaction text
        const transactionText = document.createElement('div');
        transactionText.innerHTML = `
            <strong>${transaction.transactionType}</strong>: ${transaction.date} - $${transaction.amount} - tId : ${transaction.transactionId}
        `;
        leftWrapper.appendChild(transactionText);

        // Create the exclusion checkbox for the transaction
        const excludeCheckbox = document.createElement('input');
        excludeCheckbox.type = 'checkbox';
        excludeCheckbox.dataset.transactionId = transaction.transactionId;
        excludeCheckbox.checked = transaction.isExcluded; // Set checkbox based on isExcluded property
        leftWrapper.appendChild(excludeCheckbox);

        // Add event listener to checkbox
        excludeCheckbox.addEventListener('change', (e) => {
            const transactionId = e.target.dataset.transactionId;
            const isChecked = e.target.checked;

            // Find the transaction by its ID and update 'isExcluded'
            const transactionToUpdate = transactions.find(t => t.transactionId === transactionId);

            if (transactionToUpdate) {
                transactionToUpdate.isExcluded = isChecked;

                // Save the updated transactions to local storage
                const storedData = JSON.parse(localStorage.getItem('transactionsData')) || { fromCompanyTransaction: [], toCompanyTransaction: [] };
                storedData.fromCompanyTransaction = transactions.filter(t => t.isExcluded);
                storedData.toCompanyTransaction = transactions.filter(t => t.isExcluded);
                localStorage.setItem('transactionsData', JSON.stringify(storedData));
            }
        });

        // Add the expand button for showing details
        const uniqueExpandId = `transaction-details-${company.replace(/\s+/g, '')}-${transaction.transactionId}`;
        const expandButton = document.createElement('button');
        expandButton.className = 'btn btn-primary';
        expandButton.textContent = 'Expand';
        expandButton.setAttribute('data-bs-target', `#${uniqueExpandId}`);
        expandButton.setAttribute('data-bs-toggle', 'collapse');
        leftWrapper.appendChild(expandButton);

        // Transaction details (expandable section)
        const expandedDetails = document.createElement('div');
        expandedDetails.className = 'collapse';
        expandedDetails.id = uniqueExpandId;

        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-wrapper';
        tableWrapper.style.display = 'flex';
        tableWrapper.style.justifyContent = 'flex-end';

        const table = document.createElement('table');
        table.className = 'transaction-table table table-bordered';
        const tableHeader = `
            <thead>
                <tr><th>Line ID</th><th>Account</th><th>Debit</th><th>Credit</th></tr>
            </thead>
        `;
        table.innerHTML = tableHeader;

        transaction.lines.forEach(line => {
            const row = table.insertRow();
            row.insertCell(0).innerText = line.lineId;
            row.insertCell(1).innerText = line.account;

            if (line.isCredit) {
                row.insertCell(2).innerText = '';
                row.insertCell(3).innerText = `$${line.amount}`;
            } else {
                row.insertCell(2).innerText = `$${line.amount}`;
                row.insertCell(3).innerText = '';
            }
        });

        tableWrapper.appendChild(table);
        expandedDetails.appendChild(tableWrapper);

        transactionItem.appendChild(leftWrapper);
        transactionItem.appendChild(expandedDetails);

        listElement.appendChild(transactionItem);
    });
};


// Add an event listener for the Exclude button to apply changes
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the parent element (for example, the document body or a container div)
    document.body.addEventListener('change', (event) => {
        // Check if the clicked element is a checkbox
        if (event.target && event.target.type === 'checkbox') {
            const checkbox = event.target;
            const transactionId = checkbox.dataset.transactionId;
            const isChecked = checkbox.checked;

            console.log(`Processing checkbox for transactionId: ${transactionId}, checked: ${isChecked}`);

            // Fetch the data from localStorage
            let storedData = JSON.parse(localStorage.getItem('transactionsData')) || { fromCompanyTransaction: [], toCompanyTransaction: [] };
            const { fromCompanyTransaction, toCompanyTransaction } = storedData;

            // Convert transactionId to number if necessary
            const transactionIdNum = Number(transactionId);

            let transactionUpdated = false; // Flag to track if transaction is found and updated

            // Check in fromCompanyTransaction array
            const fromTransaction = fromCompanyTransaction.find(t => t.transactionId === transactionIdNum);
            if (fromTransaction) {
                fromTransaction.isExcluded = isChecked;
                transactionUpdated = true;
                console.log(`Updated isExcluded for transactionId ${transactionIdNum} in fromCompanyTransaction.`);
            }

            // If not found, check in toCompanyTransaction array
            if (transactionUpdated) {
                const toTransaction = toCompanyTransaction.find(t => t.transactionId === transactionIdNum);
                if (toTransaction) {
                    toTransaction.isExcluded = isChecked;
                    transactionUpdated = true;
                    console.log(`Updated isExcluded for transactionId ${transactionIdNum} in toCompanyTransaction.`);
                }
            }

            // If no transaction is found in both arrays
            if (!transactionUpdated) {
                console.log(`Transaction with transactionId ${transactionIdNum} not found.`);
            }

            // Log the data before saving to ensure changes were made
            console.log('Data before saving to localStorage:', storedData);

            // After processing, save the updated storedData back to localStorage
            try {
                localStorage.setItem('transactionsData', JSON.stringify(storedData));
                console.log('Successfully saved to localStorage');
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }

            // Show Bootstrap toast based on the checkbox action
            const toastContainer = document.getElementById('toastContainer'); // Assuming you have a container for your toasts in HTML

            // Create a new toast element
            const toast = document.createElement('div');
            toast.classList.add('toast', 'fade', 'show');
            toast.style.minWidth = '200px';
            toast.style.position = 'absolute';
            toast.style.bottom = '10px';
            toast.style.right = '10px';

            toast.innerHTML = `
                <div class="toast-body">
                    ${isChecked ? `Transaction ${transactionId} marked as excluded.` : `Transaction ${transactionId} is no longer excluded.`}
                </div>
            `;

            // Append toast to the container
            toastContainer.appendChild(toast);

            // Automatically remove the toast after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 500); // Remove the toast element after fade-out
            }, 700); // Remove after 3 seconds

            // Log to confirm the change is reflected in localStorage
            const updatedStoredData = JSON.parse(localStorage.getItem('transactionsData'));
            console.log('Updated Stored Data from localStorage:', updatedStoredData);
        }
    });
});






    // Save updated data back to local storage


    // FOR EXCLUDED PAGE






const selectTransactionFromCompany1 = (transactionElement) => {
    const previouslySelected = document.querySelector('.selected-transaction');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected-transaction'); // Remove the class from previously selected
    }

    // Add the selected-transaction class to the newly selected transaction
    transactionElement.classList.add('selected-transaction');
};


// Reconcile button click handler
const reconcileClicked = () => {
    const company1List = document.getElementById('company1List');
    const centreDropZone = document.getElementById('centreDropZone');

    const selectedCompany1Transaction = document.querySelector('.selected');
    const matchedCompany1TransactionId = selectedCompany1Transaction ? selectedCompany1Transaction.dataset.transactionId : null;

    // Check if a transaction from Company 1 is selected
    if (!matchedCompany1TransactionId) {
        alert('Please select a transaction from Company 1 first.');
        return;
    }

    // Check if there are any dropped transactions for Company 2 in the centre
    const droppedTransactions = centreDropZone.querySelectorAll('.dropped-transaction');
    if (droppedTransactions.length === 0) {
        alert('Please drag and drop transactions from Company 2.');
        return;
    }

    // Calculate the total amount of the dropped transactions from Company 2
    let totalCompany2Amount = 0;
    droppedTransactions.forEach(transaction => {
        // Log the full transaction data to ensure we have access to all properties
        console.log('Dropped Transaction Data:', transaction.transactionData);

        // Access the amount from transactionData (not dataset)
        const transactionAmount = parseFloat(transaction.transactionData.amount);  // Ensure it's a number
        totalCompany2Amount += transactionAmount;
        console.log('Total Company 2 Amount:', totalCompany2Amount);
    });

    console.log('Matched Transaction ID:', matchedCompany1TransactionId);
    console.log('Company 1 Transactions:', fromCompanyTransaction);

    // Get the selected Company 1 transaction
    const selectedTransaction = fromCompanyTransaction.find(transaction => transaction.transactionId === parseInt(matchedCompany1TransactionId));
    console.log(selectedTransaction);

    // Check if the amounts match between Company 1 and the dropped Company 2 transactions
    if (selectedTransaction.amount !== totalCompany2Amount) {
        alert('The amounts do not match. Cannot reconcile.');
        return;
    }

    // Mark the selected Company 1 transaction as reconciled
    selectedTransaction.isReconciled = true;

    // Update the Company 2 transactions as reconciled
    droppedTransactions.forEach(transaction => {
        const transactionId = parseInt(transaction.transactionData.transactionId);  // Access transactionData
        const company2Transaction = toCompanyTransaction.find(t => t.transactionId === transactionId);
        if (company2Transaction) {
            company2Transaction.isReconciled = true; // Mark the Company 2 transaction as reconciled
        }
    });

    // Store the updated transactions in localStorage (for both companies)
    const data = {
        fromCompanyTransaction, // Updated Company 1 transactions
        toCompanyTransaction,   // Updated Company 2 transactions
    };

    localStorage.setItem('transactionsData', JSON.stringify(data)); // Update the stored data

    // Disable the reconcile button after clicking
    document.getElementById('reconcileButton').disabled = true;

    // Clear the center zone or perform any other actions like resetting the lists or UI
    resetCentreDropZone();
    renderTransactions(data);
    
    alert('Transactions reconciled successfully!');
};


// Function to reset the center drop zone (if needed)
const resetCentreDropZone = () => {
    const centreDropZone = document.getElementById('centreDropZone');
    centreDropZone.innerHTML = ''; // Clear the drop zone
};

// Reconcile button logic to enable/disable based on amounts
const checkReconcileButton = () => {
    const selectedCompany1Transaction = document.querySelector('.selected-transaction');
    const matchedCompany1TransactionId = selectedCompany1Transaction ? selectedCompany1Transaction.dataset.transactionId : null;

    if (!matchedCompany1TransactionId) {
        document.getElementById('reconcileButton').disabled = true;
        return;
    }

    // Check if there are any dropped transactions for Company 2 in the centre
    const droppedTransactions = document.getElementById('centreDropZone').querySelectorAll('.dropped-transaction');
    if (droppedTransactions.length === 0) {
        document.getElementById('reconcileButton').disabled = true;
        return;
    }

    // Calculate the total amount of the dropped transactions from Company 2
    let totalCompany2Amount = 0;
    droppedTransactions.forEach(transaction => {
        const transactionAmount = parseFloat(transaction.dataset.amount);
        totalCompany2Amount += transactionAmount;
    });

    // Get the selected Company 1 transaction
    const selectedTransaction = fromCompanyTransaction.find(transaction => transaction.transactionId === parseInt(matchedCompany1TransactionId));

    // Enable the reconcile button only if amounts match
    if (selectedTransaction.amount === totalCompany2Amount) {
        document.getElementById('reconcileButton').disabled = false;
    } else {
        document.getElementById('reconcileButton').disabled = true;
    }
};

document.getElementById('reconcileButton').addEventListener('click', reconcileClicked);




// Function to update the reconcile button state
function updateReconcileButtonState() {
    const reconcileButton = document.getElementById('reconcileButton');

    if (!selectedCompany1Transaction || draggedCompany2Transactions.length === 0) {
        reconcileButton.disabled = true;
        return;
    }

    // Calculate the total amount of the dragged transactions from Company 2
    const totalDraggedAmount = draggedCompany2Transactions.reduce((total, transaction) => total + transaction.amount, 0);

    // Check if the total dragged amount matches the selected Company 1 transaction's amount
    if (selectedCompany1Transaction.amount === totalDraggedAmount) {
        reconcileButton.disabled = false;
    } else {
        reconcileButton.disabled = true;
    }
}

    // Load transactions for the current page
    async function loadTransactions() {
    document.getElementById('loading').style.display = 'block';

    // Check if the data is already stored in localStorage
    const storedData = localStorage.getItem('transactionsData');

    // let fromCompanyTransaction = [];
    // let toCompanyTransaction = [];

    if (storedData) {
        // Parse the data from localStorage if it exists
        const data = JSON.parse(storedData);
        fromCompanyTransaction = data.fromCompanyTransaction || [];
        toCompanyTransaction = data.toCompanyTransaction || [];
    } else {
        // If no data in localStorage, fetch from the API
        const result = await fetchTransactions(currentPage);
        fromCompanyTransaction = result.fromCompanyTransaction;
        toCompanyTransaction = result.toCompanyTransaction;
    }

    // Render the transactions from either localStorage or API
    renderTransactions({ fromCompanyTransaction, toCompanyTransaction });

    document.getElementById('loading').style.display = 'none';
    currentPage++;
}



    // Handle scroll to load more transactions (infinite scroll)
    // window.addEventListener('scroll', () => {
    //     if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    //         loadTransactions();
    //     }
    // });

    // Start loading transactions when the page loads
    // document.addEventListener('DOMContentLoaded', () => {
    //     loadTransactions();
    // });

    // Function to handle drag events
    function drag(event) {
        event.dataTransfer.setData("text", event.target.id);
    }

    // Allow drop on the center drop zone
    function allowDrop(event) {
        event.preventDefault();
    }

    // Handle drop event to expand transactions in the table
    function drop(event) {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        var droppedTransaction = document.getElementById(data);

        // Create a new table row for the dropped transaction
        var transactionDetails = {
            account: "Accounts Payable",
            amount: droppedTransaction.innerText.includes('100') ? 100 : 200,
            isCredit: true,
            lineId: 1
        };

        // Add the dropped transaction to the expanded area
        expandTransaction(transactionDetails);
    }

    // Expand the transaction into a table in the expanded area
    function expandTransaction(transaction) {
        var expandedArea = document.getElementById("expandedTransaction");

        // Create the table if not created yet
        if (!expandedArea.querySelector(".transaction-table")) {
            var table = document.createElement("table");
            table.className = "transaction-table";
            var tableHeader = `<thead><tr><th>Account</th><th>Amount</th><th>Is Credit</th></tr></thead>`;
            table.innerHTML = tableHeader;
            expandedArea.appendChild(table);
        }

        // Append new row to the table
        var table = expandedArea.querySelector(".transaction-table");
        var row = table.insertRow();
        row.insertCell(0).innerText = transaction.account;
        row.insertCell(1).innerText = transaction.amount;
        row.insertCell(2).innerText = transaction.isCredit ? 'Yes' : 'No';
    }


    // switch tabs loading logic 

    






