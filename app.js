async function signup(e){
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails={
            name :e.target.name.value,
            email: e.target.email.value,
            password:e.target.password.value
        }

        const response = await axios.post('http://localhost:8000/user/signup',signupDetails);
        if(response.status === 201){
            window.location.href="../Login/login.html"
        }else{
            throw new Error('Failed to login');
        }
    }catch{
        document.body.innerHTML +=`<div style="color:red ${err} <div>">`
    }
}