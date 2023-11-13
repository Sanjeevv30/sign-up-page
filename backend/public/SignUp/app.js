async function signup(e) {
    try {
        e.preventDefault();

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        const postResponse = await axios.post('http://16.16.63.197:8000/add-user/Signup', signupDetails);

        if (postResponse.status === 201) {
            window.location.href = "../Login/login.html";
        } else {
            throw new Error('Failed to sign up');
        }

        const getResponse = await axios.get('http://16.16.63.197:8000/get-user/signup');
        console.log(getResponse);
    } catch (err) {
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }
}
