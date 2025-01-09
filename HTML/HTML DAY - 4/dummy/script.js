// Array to store customer data
let customers = [];
let editIndex = -1;

// Form submission
document.getElementById("customerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const company = document.getElementById("company").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const status = document.getElementById("status").value;

    const customer = { name, company, email, mobile, status };

    if (editIndex === -1) {
        // Add customer
        customers.push(customer);
    } else {
        // Update customer
        customers[editIndex] = customer;
        editIndex = -1;
    }

    // Reset form
    document.getElementById("customerForm").reset();

    // Refresh table
    renderTable();
});

// Function to render the table
function renderTable() {
    const tbody = document.querySelector("#customerTable tbody");
    tbody.innerHTML = "";

    customers.forEach((customer, index) => {
        const row = `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.company}</td>
                <td>${customer.email}</td>
                <td>${customer.mobile}</td>
                <td>${customer.status}</td>
                <td>
                    <button class="action-btn edit" onclick="editCustomer(${index})">Edit</button>
                    <button class="action-btn delete" onclick="deleteCustomer(${index})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Edit customer
function editCustomer(index) {
    const customer = customers[index];
    document.getElementById("name").value = customer.name;
    document.getElementById("company").value = customer.company;
    document.getElementById("email").value = customer.email;
    document.getElementById("mobile").value = customer.mobile;
    document.getElementById("status").value = customer.status;

    editIndex = index;
}

// Delete customer
function deleteCustomer(index) {
    customers.splice(index, 1);
    renderTable();
}
