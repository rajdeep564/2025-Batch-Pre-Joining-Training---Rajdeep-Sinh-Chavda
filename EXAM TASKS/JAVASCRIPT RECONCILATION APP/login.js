document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://trainingsampleapi.satva.solutions/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Email: email, Password: password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('jwt_token', data.token);
        console.log(data);
        window.location.href = 'transaction-list.html'; // Redirect to Transaction List page
    } catch (error) {
        document.getElementById('error-message').style.display = 'block';
    }
});
