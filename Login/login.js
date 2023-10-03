async function login(e) {
    try {
        e.preventDefault();

        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        const response = await axios.post('http://localhost:8000/login', loginDetails);
        console.log(response.data);
        alert(response.data.message);
        
        // if (Response.status === 201) {
        //     window.location.href = "../Signup/sign.html";
        // } else {
        //     throw new Error('Failed to sign up');
        // }
    } catch (err) {
        console.log(err);
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }
}
