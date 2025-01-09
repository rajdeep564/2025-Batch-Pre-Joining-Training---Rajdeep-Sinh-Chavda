let invoices = [];
let editIndex = -1;
let currentPage = 1;
let rowsPerPage = 5;

document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const number = document.getElementById("number").value;
    const customer = document.getElementById("customer").value;
    const date = document.getElementById("date").value;
    const dueDate = document.getElementById("dueDate").value;
    const paymentStatus = document.getElementById("paymentStatus").value;
    const invoice = { number, customer, date, dueDate, paymentStatus };
    if (editIndex === -1) {
        invoices.push(invoice);
    } else {
        invoices[editIndex] = invoice;
        editIndex = -1;
    }
    document.querySelector("form").reset();
    closePopup();
    renderTable();
});

function renderTable() {
    const tbody = document.querySelector("#invoiceTable tbody");
    tbody.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageInvoices = invoices.slice(start, end);
    pageInvoices.forEach(invoice => {
        const row = `
            <tr>
                <td>${invoice.number}</td>
                <td>${invoice.customer}</td>
                <td>${invoice.date}</td>
                <td>${invoice.dueDate}</td>
                <td>${invoice.paymentStatus}</td>
                <td class="actions">
                    <button class="action-btn" onclick="editInvoice(${invoices.indexOf(invoice)})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" onclick="deleteInvoice(${invoices.indexOf(invoice)})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    updatePaginationButtons();
    updateCurrentPageNumber();
}

function updateCurrentPageNumber() {
    document.getElementById("currentPage").textContent = currentPage;
}

function editInvoice(index) {
    const invoice = invoices[index];
    document.getElementById("number").value = invoice.number;
    document.getElementById("customer").value = invoice.customer;
    document.getElementById("date").value = invoice.date;
    document.getElementById("dueDate").value = invoice.dueDate;
    document.getElementById("paymentStatus").value = invoice.paymentStatus;
    editIndex = index;
    openPopup();
}

function deleteInvoice(index) {
    const confirmed = window.confirm("Are you sure you want to delete this record?");
    if (confirmed) {
        invoices.splice(index, 1);
        renderTable();
    }
}

function nextPage() {
    if (currentPage < totalPages()) {
        currentPage++;
        renderTable();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function totalPages() {
    return Math.ceil(invoices.length / rowsPerPage);
}

function updatePaginationButtons() {
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages();
}

function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

document.querySelector(".prev").addEventListener("click", prevPage);
document.querySelector(".next").addEventListener("click", nextPage);

renderTable();

let currentStatus = 'Active';

function setStatus(status) {
    currentStatus = status;
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.dropdown-button span');
    if (status === 'Active') {
        statusIndicator.style.backgroundColor = 'green';
        statusText.textContent = 'Active';
    } else {
        statusIndicator.style.backgroundColor = 'red';
        statusText.textContent = 'Inactive';
    }
}
