// Initial Data
let tableEntries = [];
let pieChart;

// Function to initialize the pie chart
function initializePieChart() {
    const ctx = document.getElementById('incomePieChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [0, 0], // Initial data
                backgroundColor: ['#36a2eb', '#ff6384'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Function to update the pie chart data
function updatePieChart() {
    const totalIncome = tableEntries.reduce((total, entry) => entry.type === 1 ? total + entry.amount : total, 0);
    const totalExpenses = tableEntries.reduce((total, entry) => entry.type === 0 ? total + entry.amount : total, 0);

    if (pieChart) {
        pieChart.data.datasets[0].data = [totalIncome, totalExpenses];
        pieChart.update();
    }
}

// Function to update data expense summary
function updateSummary() {
    const totalIncome = tableEntries.reduce((total, entry) => entry.type === 1 ? total + entry.amount : total, 0);
    const totalExpenses = tableEntries.reduce((total, entry) => entry.type === 0 ? total + entry.amount : total, 0);
    document.getElementById('updatedInc').innerText = totalIncome;
    document.getElementById('updatedExp').innerText = totalExpenses;
    document.getElementById('updatedBal').innerText = totalIncome - totalExpenses;

    // Update Pie Chart
    updatePieChart();
}

// Function to add a new item
function addItem() {
    const name = document.getElementById('name').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = parseInt(document.getElementById('itemType').value);

    if (name && !isNaN(amount) && (type === 0 || type === 1)) {
        const newItem = { name, amount, type };
        tableEntries.push(newItem);
        renderTable();
        updateSummary();
    } else {
        alert('Please enter valid data.');
    }
}

// Function to render table entries
function renderTable() {
    const tbody = document.querySelector('#table tbody');
    tbody.innerHTML = '';

    tableEntries.forEach((entry, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.amount}</td>
            <td>${entry.type === 0 ? 'Expense' : 'Income'}</td>
            <td><button onclick="deleteItem(${index})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Function to delete an item
function deleteItem(index) {
    tableEntries.splice(index, 1);
    renderTable();
    updateSummary();
}

// Function to save data
function saveData() {
    const month = document.getElementById('month').value;
    if (month) {
        localStorage.setItem(month, JSON.stringify(tableEntries));
        alert('Data saved successfully.');
    } else {
        alert('Please select a month.');
    }
}

// Function to load data
function loadData() {
    const month = document.getElementById('month').value;
    if (month) {
        const savedData = localStorage.getItem(month);
        if (savedData) {
            tableEntries = JSON.parse(savedData);
            renderTable();
            updateSummary();
        } else {
            alert('No data found for the selected month.');
        }
    } else {
        alert('Please select a month.');
    }
}

// Function to initialize month selection
function initializeMonthSelect() {
    const monthSelect = document.getElementById('month');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializePieChart();
    initializeMonthSelect();
    
    document.getElementById('addItemButton').addEventListener('click', addItem);
    document.getElementById('saveButton').addEventListener('click', saveData);
    document.getElementById('loadButton').addEventListener('click', loadData);
});

// Mouse move event for gradient background
document.addEventListener('mousemove', (event) => {
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    // Calculate the background position
    const gradientColor1 = `rgba(${Math.floor(x * 255)}, ${Math.floor(y * 255)}, 200, 0.7)`;
    const gradientColor2 = `rgba(${Math.floor((1 - x) * 255)}, ${Math.floor((1 - y) * 255)}, 200, 0.7)`;

    document.body.style.background = `linear-gradient(135deg, ${gradientColor1}, ${gradientColor2})`;
});
