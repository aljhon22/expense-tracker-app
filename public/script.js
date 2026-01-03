const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// 1. Fetch transactions from Backend API
async function getTransactions() {
    try {
        const res = await fetch('/api/expenses');
        const data = await res.json();

        // I-render ang bawat item sa UI
        data.forEach(addTransactionDOM);
        updateValues(data);
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

// 2. Add Transaction to DOM (UI)
function addTransactionDOM(transaction) {
    // Check kung income (+) o expense (-)
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.description} <span>${sign}₱${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction('${transaction._id}')">x</button>
    `;

    list.appendChild(item);
}

// 3. Update Balance, Income and Expense
function updateValues(transactions) {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
        -1
    ).toFixed(2);

    balance.innerText = `₱${total}`;
    money_plus.innerText = `+₱${income}`;
    money_minus.innerText = `-₱${expense}`;
}

// 4. Add Transaction (Send to Backend)
async function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const transactionData = {
            description: text.value,
            amount: +amount.value,
            type: +amount.value < 0 ? 'expense' : 'income'
        };

        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionData)
            });

            const data = await res.json();

            // Idagdag sa UI at linisin ang input
            addTransactionDOM(data);
            
            // Re-fetch para ma-update ang totals ng tama
            location.reload(); 
        } catch (err) {
            console.error("Error adding transaction:", err);
        }
    }
}

// 5. Delete Transaction
async function removeTransaction(id) {
    try {
        await fetch(`/api/expenses/${id}`, {
            method: 'DELETE'
        });
        
        // Refresh page para mawala sa list
        location.reload();
    } catch (err) {
        console.error("Error deleting transaction:", err);
    }
}

form.addEventListener('submit', addTransaction);

// Tawagin ito sa simula para mag-load ang data
getTransactions();