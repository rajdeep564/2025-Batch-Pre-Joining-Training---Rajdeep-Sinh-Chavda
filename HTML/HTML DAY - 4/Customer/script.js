function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Array to store customer data
let customers = [];
let editIndex = -1;

// Handle form submission
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById("name").value;
    const company = document.getElementById("company").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const address = document.getElementById("address").value;

    const customer = { name, company, email, mobile, address };

    if (editIndex === -1) {
        // Add new customer
        customers.push(customer);
    } else {
        // Update existing customer
        customers[editIndex] = customer;
        editIndex = -1; // Reset edit index
    }

    // Reset form
    document.querySelector("form").reset();
    closePopup();

    // Refresh table
    renderTable();
});

// Function to render the table
function renderTable() {
    const tbody = document.querySelector("#customerTable tbody");
    tbody.innerHTML = ""; // Clear existing rows

    customers.forEach((customer, index) => {
        const row = `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.company}</td>
                <td>${customer.email}</td>
                <td>${customer.mobile}</td>
                <td>${customer.address}</td>
                <td class="actions">
                    <button class="action-btn " onclick="editCustomer(${index})"> <i class="fas fa-edit"></i></button>
                    <button class="action-btn " onclick="deleteCustomer(${index})"> <i class="fas fa-trash"></i> </button>
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
    document.getElementById("address").value = customer.address;

    editIndex = index; // Set edit index
    openPopup(); // Open popup to edit
}

// Delete customer
function deleteCustomer(index) {
    customers.splice(index, 1); // Remove customer from array
    renderTable(); // Refresh table
}

// Functions to handle popup visibility
// function openPopup() {
//     document.querySelector("form").style.display = "block";
// }

// function closePopup() {
//     document.querySelector("form").style.display = "none";
//     document.querySelector("form").reset();
//     editIndex = -1; // Reset edit index
// }
