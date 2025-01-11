// function isAtLeast12YearsOld(dob) {
//     const today = new Date();
//     const age = today.getFullYear() - dob.getFullYear();
//     const monthDifference = today.getMonth() - dob.getMonth();
//     return age > 12 || (age === 12 && monthDifference >= 0);
// }

// function handleDobChange() {
//     const dob = new Date(this.value);
//     if (!isAtLeast12YearsOld(dob)) {
//         alert("You must be at least 12 years old.");
//         this.value = '';
//     }
// }

function handleFormSubmit(event) {
    event.preventDefault();
    // const dob = new Date(document.getElementById("dob").value);
    // if (!isAtLeast12YearsOld(dob)) {
    //     alert("You must be at least 12 years old.");
    //     return;
    // }
    const formData = new FormData(event.target);
    const formValues = {};
    formData.forEach((value, key) => {
        formValues[key] = value;
    });
    console.log("Form data submitted:", formValues);
}

// document.getElementById("dob").addEventListener("change", handleDobChange);
document.getElementById("registration-form").addEventListener("submit", handleFormSubmit);
