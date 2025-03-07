let customers = [];
let editIndex = -1;
let currentPage = 1;
let rowsPerPage = 5;

document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const company = document.getElementById("company").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const address = document.getElementById("address").value;
    const status = document.getElementById("status").value;

    const customer = { name, company, email, mobile, address, status };

    if (editIndex === -1) {
        customers.push(customer);
    } else {
        customers[editIndex] = customer;
        editIndex = -1;
    }

    document.querySelector("form").reset();
    closePopup();
    renderTable();
});

function renderTable() {
    const tbody = document.querySelector("#customerTable tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const pageCustomers = customers.slice(start, end);

    pageCustomers.forEach(customer => {
        const row = `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.company}</td>
                <td>${customer.email}</td>
                <td>${customer.mobile}</td>
                <td>${customer.status}</td>
                <td class="actions">
                    <button class="action-btn" onclick="editCustomer(${customers.indexOf(customer)})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" onclick="deleteCustomer(${customers.indexOf(customer)})"><i class="fas fa-trash"></i></button>
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

function editCustomer(index) {
    const customer = customers[index];
    document.getElementById("name").value = customer.name;
    document.getElementById("company").value = customer.company;
    document.getElementById("email").value = customer.email;
    document.getElementById("mobile").value = customer.mobile;
    document.getElementById("address").value = customer.address;
    document.getElementById("status").value = customer.status;

    editIndex = index;
    openPopup();
}

function deleteCustomer(index) {
    const confirmed = window.confirm("Are you sure you want to delete this record?");
    if (confirmed) {
        customers.splice(index, 1);
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
    return Math.ceil(customers.length / rowsPerPage);
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

document.querySelector(".prev").addEventListener("click", prevPage);
document.querySelector(".next").addEventListener("click", nextPage);

renderTable();
