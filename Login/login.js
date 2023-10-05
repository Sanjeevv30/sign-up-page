async function login(e) {
  try {
    e.preventDefault();

    const loginDetails = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const response = await axios.post(
      "http://localhost:8000/login",
      loginDetails
    );
    console.log(response.data);
    localStorage.setItem("token", response.data.token);
    alert(response.data.message);

    window.location.href = "../Expense-frontend/index.html";
  } catch (err) {
    console.log(err);
    document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
  }
}
