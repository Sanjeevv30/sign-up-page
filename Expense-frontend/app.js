

let token;
let expenses = [];
 
function showPremium() {
  document.getElementById("rzp-button1").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "You are a premium member";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
function showLeaderboard() {
  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = "Show Leaderboard";
  inputElement.onclick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/premium/showLeaderBoard",
        {
          headers: { Authorization: token },
        }
      );
      const userLeaderBoardArray = response.data;

      var LeaderboardElem = document.getElementById("leaderboard");
      LeaderboardElem.innerHTML = "<h1>Leader Board</h1>";

      userLeaderBoardArray.forEach((userDetails) => {
        LeaderboardElem.innerHTML += `<li>- Name:  ${userDetails.name} , Total Expenses : ₹ ${userDetails.totalExpenses}</li>`;
      });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  document.getElementById("message").appendChild(inputElement);
}

async function saveOrUpdateExpense(index, amount, description, category) {
  try {
    if (isNaN(index)) {
      const newExpense = { amount, description, category };
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/expense/add-expense",
        newExpense,
        { headers: { Authorization: token } }
      );
      expenses.expenses.push(response.data);
    } else {
      const updatedExpense = {
        id: expenses[index].id,
        amount,
        description,
        category,
      };
      await axios.put(
        `http://localhost:8000/expense/edit/${updatedExpense.id}`,
        updatedExpense
      );
      expenses[index] = updatedExpense;
    }

    renderExpenses(expenses);
  } catch (error) {
    console.error("Error saving/updating expense:", error);
  }
}
async function deleteExpense(index) {
  try {
    const id = expenses[index].id;
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:8000/expense/delete/${id}`, {
      headers: { Authorization: token },
    });
    expenses.splice(index, 1);
    renderExpenses(expenses);
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
}


function renderExpenses(expenses) {
  const expenseList = document.getElementById("expense-list");
  expenseList.innerHTML = "";
console.log(expenses)
  expenses.expenses.map((expense, index) => {
    const item = document.createElement("li");
    item.className =
      "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `
            <span>${expense.description} - ₹ ${expense.amount} on ${expense.category}</span>
            <div>
                <button class="btn btn-sm btn-danger mr-2" onclick="deleteExpense(${index})">Delete</button>
                <button class="btn btn-sm btn-primary" onclick="editExpense(${index})">Edit</button>
            </div>
        `;
    expenseList.appendChild(item);
  });

  const totalExpenseDisplay = document.getElementById("total-expenses");
  totalExpenseDisplay.textContent = `₹ ${calculateTotalExpenses(expenses)}`;
}

function calculateTotalExpenses(expenses) {
  console.log(expenses)
  return expenses.expenses
    .reduce((total, expense) => total + parseFloat(expense.amount), 0)
    .toFixed(2);
}

function editExpense(index) {
  const expense = expenses[index];

  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseDescriptionInput = document.getElementById(
    "expense-description"
  );
  const expenseCategoryInput = document.getElementById("expense-category");

  expenseAmountInput.value = expense.amount;
  expenseDescriptionInput.value = expense.description;
  expenseCategoryInput.value = expense.category;

  const addExpenseBtn = document.getElementById("add-expense");
  addExpenseBtn.textContent = "Save Edit";
  addExpenseBtn.dataset.index = index;
}

window.addEventListener("DOMContentLoaded", async function () {
  
  const token = localStorage.getItem("token");
  const local = localStorage.getItem("pageNumber");
  console.log(local);
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  const premiumUser = decodeToken.premiumUser;
  try {
    
    if (premiumUser) {
      showPremium();
      showLeaderboard();
      document.getElementById("downloadexpense").removeAttribute("disabled");
      document.getElementById("downloadexpense").removeAttribute("title");
    }
    const response = await axios.get(
      `http://localhost:8000/expense/get-expense?page=${1}&limit=${local}`,
      { headers: { Authorization: token } }
    );

    expenses = response.data;
    renderExpenses(expenses);
    console.log(response);
    paginationFunc(response.data.pageData);
    const files = await axios.get('http://localhost:8000/history',
    {headers: { Authorization: token }});
    console.log(files.data);
    const expenseList = document.getElementById("expense-list");
    files.data.forEach((filesUrl,index)=>{
     
      const items = document.createElement("li");
      items.className =
      "list-group-item d-flex justify-content-between align-items-center";
      items.innerHTML = `
            <span><a href="${filesUrl.url}"> Previous Data ${index +1 }</a></span>`
            expenseList.appendChild(items);
    })
  } catch (error) {
    console.log("Error fetching expenses:", error);
  }

  document.getElementById("add-expense").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const description = document.getElementById("expense-description").value;
    const category = document.getElementById("expense-category").value;

    if (
      isNaN(amount) ||
      amount <= 0 ||
      description.trim() === "" ||
      category.trim() === ""
    ) {
      alert("Please fill in all fields with valid values.");
      return;
    }

    const index = parseInt(
      document.getElementById("add-expense").dataset.index
    );

    if (isNaN(index)) {
      saveOrUpdateExpense(index, amount, description, category);
    } else {
      saveOrUpdateExpense(index, amount, description, category);

      const addExpenseBtn = document.getElementById("add-expense");
      addExpenseBtn.textContent = "Add Expense";
      addExpenseBtn.dataset.index = "";
    }

    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-description").value = "";
  });

  document.getElementById("downloadexpense").onclick =
    async function download() {
      try {
        
        const response = await axios.get("http://localhost:8000/download", {
          headers: { Authorization: token },
        });

        if (response.status === 200) {
          const fileURL = response.data.fileURL;
          //console.log('File URL:', fileURL);
          const a = document.createElement("a");
          a.href = fileURL;
          a.download = "myexpense.csv";
          a.click();
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        showError(err);
      }
    };

  function showError(err) {
    console.log(err);
    document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
  }

  document.getElementById("rzp-button1").onclick = async function (e) {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:8000/purchase/premiummembership",
      { headers: { Authorization: token } }
    );
    console.log(response);
    var options = {
      key: response.data.key_id,
      name: "Expense Company",
      name: "SRIVASTAVA AND SONS",
      order_id: response.data.order.id,
      prefill: {
        name: "Test User",
        email: "test.user@example.com",
        name: "Sanjeev Srivastava",
        email: "sanjeevsrivastava107@gmail.com",
        contact: "8249654461",
      },
      theme: {
        color: "#3399cc",
      },
      handler: async function (response) {
        const res = await axios.post(
          "http://localhost:8000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        console.log(res);
        alert("You are a premium member");
        document.getElementById("rzp-button1").style.visibility = "hidden";
        document.getElementById("message").innerHTML =
          "You are a premium member";
        showLeaderboard();
        localStorage.setItem("token", res.data.token);
      },
    };
    const rzpl = new Razorpay(options);
    rzpl.open();
    e.preventDefault();

    rzpl.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
  };
});

//
// const total_records = document.getElementById("recordsss");
// total_records.onchange=()=>{
//   let pageNumber = document.getElementById("recordsss").value;
//   localStorage.setItem("pageNumber", pageNumber);
// }
// const pages = document.getElementById('pagination');
// const expenseList = document.getElementById("expense-list")
// async function sendGetRequest(pages){
//     try {
//       const local = localStorage.getItem("pageNumber");
//       const token = localStorage.getItem("token");
//         const response = await axios.get(`http://localhost:8000/expense/get-expense?page=${pages}&limit=${local}`,
//          { headers: { "Authorization": token }});
//          //console.log(response)
//         const expenses = response.data;
//          renderExpenses(expenses);
//        }
//       catch (err) {
//           console.log(err);
//       }
//   }

// function paginationFunc(pageData) {
//   const pages = document.getElementById('pagination');
//   console.log(pageData);

//   if (pageData.hasprePage) {
//     const previousPage = pageData.currentPage - 1;
//     pages.innerHTML += `<button id='page${previousPage}' onclick='sendGetRequest(${previousPage})'>${previousPage}</button>`;
//   }
//   pages.innerHTML += `<button id='page${pageData.currentPage}' onclick='sendGetRequest(${pageData.currentPage})'>${pageData.currentPage}</button>`;
//   document.getElementById(`page${pageData.currentPage}`).className = 'active';

//   if (pageData.hasNextPage) {
//     pages.innerHTML += `<button id='page${pageData.currentPage + 1}' onclick='sendGetRequest(${pageData.currentPage + 1})'>${pageData.currentPage + 1}</button>`;
//     document.getElementById(`page${pageData.currentPage + 1}`).className = 'active';
//   } else {
//     pages.innerHTML += `<button id='page${pageData.currentPage + 1}' disabled>${pageData.currentPage + 1}</button>`;
//   }
// }

const pageNumberSelect = document.getElementById("recordsss");

pageNumberSelect.onchange = () => {
  const pageNumber = pageNumberSelect.value;
  localStorage.setItem("pageNumber", pageNumber);
};

async function sendGetRequest(page) {
  try {
    const local = localStorage.getItem("pageNumber");
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8000/expense/get-expense?page=${page}&limit=${local}`, {
      headers: { "Authorization": token }
    });
    //console.log(response);
    const expenses = response.data;
    renderExpenses(expenses);
  } catch (err) {
    console.log(err);
  }
}

function paginationFunc(pageData) {
  const pagination = document.getElementById('pagination');
  //console.log(pageData);

  if (pageData.hasprePage) {
    let previousPage = pageData.currentPage-1;
    pagination.innerHTML += `<button id='page${previousPage}'>Previous</button>`;
  }else{
    pagination.innerHTML += `<button id='page${pageData.currentPage-1}' onclick='sendGetRequest(${pageData.currentPage})'>Prev</button>`;
  }
  if (pageData.hasNextPage) {
    let nextPage = pageData.currentPage+1;
    pagination.innerHTML += `<button id='page${nextPage}}' onclick='sendGetRequest(${nextPage})'>Next</button>`;
  } else {
    pagination.innerHTML += `<button id='page${nextPage}' onclick='sendGetRequest(${nextPage})'>Next</button>`;
  }
}

















