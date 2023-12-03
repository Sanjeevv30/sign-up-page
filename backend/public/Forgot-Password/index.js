async function forgotPassword(e) {
  try {
    e.preventDefault();

    const form = new FormData(e.target);
    const userDetails = {
      email: form.get("email"),
    };

    console.log("User Details:", userDetails);

    const response = await axios.post(
      "http://localhost:8000/password/forgot-password",
      userDetails
    );

    console.log("Server Response:", response.data);
  } catch (err) {
    console.error("Error:", err);

    document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
  }
}
