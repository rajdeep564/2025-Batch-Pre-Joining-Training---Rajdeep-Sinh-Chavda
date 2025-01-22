        document.getElementById('taxForm').addEventListener('submit', (e) => {
    // Check if the form is valid using the browser's built-in validation
    if (!e.target.checkValidity()) {
        e.preventDefault(); // Prevent submission
        e.stopPropagation(); // Stop further event handling
        e.target.classList.add('was-validated'); // Add Bootstrap validation styling
        return;
    }

    e.preventDefault(); // Prevent actual form submission for custom handling

    // Calculate Age
    const birthdate = new Date(document.getElementById('birthdate').value);
    const age = new Date().getFullYear() - birthdate.getFullYear();

    // Get Form Values
    const income = Number(document.getElementById('income').value);
    const loan = Number(document.getElementById('loan').value);
    const investment = Number(document.getElementById('investment').value);
    const gender = document.getElementById('gender').value;

    // Tax Slabs
    let noTax, lowTax;
    if (age >= 60) {
        noTax = 300000;
        lowTax = 700000;
    } else if (gender === 'female') {
        noTax = 260000;
        lowTax = 700000;
    } else {
        noTax = 240000;
        lowTax = 600000;
    }

    // Calculate Exemptions
    const loanExemption = Math.min(0.8 * loan, 0.2 * income);
    const investmentExemption = Math.min(investment, 100000);
    const taxableIncome = income - loanExemption - investmentExemption;

    // Calculate Tax
    let tax = 0;
    if (taxableIncome > noTax) {
        tax = taxableIncome <= lowTax
            ? (taxableIncome - noTax) * 0.1
            : (lowTax - noTax) * 0.1 + (taxableIncome - lowTax) * 0.2;
    }

    // Show Results
    const resultSection = document.getElementById('taxResult');
    resultSection.innerHTML = `
        <h4>Tax Calculation Results</h4>
        <p>Category: ${age >= 60 ? 'Senior Citizen' : gender === 'female' ? 'Woman' : 'Man'}</p>
        <p>Gross Income: ₹${income.toLocaleString()}</p>
        <p>Loan Exemption: ₹${loanExemption.toLocaleString()}</p>
        <p>Investment Exemption: ₹${investmentExemption.toLocaleString()}</p>
        <p><strong>Taxable Income: ₹${taxableIncome.toLocaleString()}</strong></p>
        <p><strong>Tax Payable: ₹${tax.toLocaleString()}</strong></p>
    `;
    resultSection.style.display = 'block';
});
