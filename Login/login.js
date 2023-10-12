async function login(e) {
  try {
    e.preventDefault();
    const form = new FormData(e.target);
    const loginDetails = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const response = await axios.post(
      "http://localhost:8000/login",
      loginDetails
    );
    // if(response.status === 200){
    console.log(response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userDetails", JSON.stringify(response.data.user));
    alert(response.data.message);

    window.location.href = "../Expense-frontend/index.html";

    // } else {
    //     throw new Error('Failed to login')
    // }
  } catch (err) {
    console.log(err);
    document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
  }
}
function forgotpassword() {
  window.location.href = "../ForgotPassword/index.html";
}
