let expenses = [];
async function fetchExpenses() {
    try {
        const response = await axios.get('http://localhost:8000/expense/get-expense'); 
        expenses = response.data;
        renderExpenses(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}
async function saveOrUpdateExpense(index, amount, description, category) {
    try {
        if (isNaN(index)) {
            const newExpense = { amount, description, category };
            const response = await axios.post('http://localhost:8000/expense/add-expense', newExpense); 
            expenses.push(response.data);
        } else {
            const updatedExpense = { id: expenses[index].id, amount, description, category };
            await axios.put(`http://localhost:8000/expense/edit/${updatedExpense.id}`, updatedExpense); 
            expenses[index] = updatedExpense;
        }

        renderExpenses(expenses);
    } catch (error) {
        console.error('Error saving/updating expense:', error);
    }
}
async function deleteExpense(index) {
    try {
        const id = expenses[index].id;
        await axios.delete(`http://localhost:8000/expense/delete/${id}`); 
        expenses.splice(index, 1);
        renderExpenses(expenses);
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

function renderExpenses(expenses) {
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    expenses.forEach((expense, index) => {
        const item = document.createElement("li");
        item.className =
            "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
            <span>${expense.description} - $${expense.amount} on ${expense.category}</span>
            <div>
                <button class="btn btn-sm btn-danger mr-2" onclick="deleteExpense(${index})">Delete</button>
                <button class="btn btn-sm btn-primary" onclick="editExpense(${index})">Edit</button>
            </div>
        `;
        expenseList.appendChild(item);
    });

    const totalExpenseDisplay = document.getElementById("total-expenses");
    totalExpenseDisplay.textContent = `$${calculateTotalExpenses(expenses)}`;
}

function calculateTotalExpenses(expenses) {
    return expenses
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

    const index = parseInt(document.getElementById("add-expense").dataset.index);

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


fetchExpenses();