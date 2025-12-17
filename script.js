//1
const balance = document.getElementById(
  "balance"
);
const money_plus = document.getElementById(
  "money-plus"
);
const money_minus = document.getElementById(
  "money-minus"
);
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];

// let transactions = dummyTransactions;

//last 
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

//5
//Add Transaction
function addTransaction(e){
  e.preventDefault();
  if(text.value.trim() === '' || amount.value.trim() === ''){
    alert('please add text and amount')
  }else{
    const transaction = {
      id:generateID(),
      text:text.value,
      amount:+amount.value,
      date: new Date().toLocaleDateString(),
      category: category.value
    }

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateChart();
    updateLocalStorage();

    text.value='';
    amount.value='';
    
  }
}


//5.5
//Generate Random ID
function generateID(){
  return Math.floor(Math.random()*1000000000);
}

//2

//Add Trasactions to DOM list
function addTransactionDOM(transaction) {
  //GET sign
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  //Add Class Based on Value
  item.classList.add(
    transaction.amount < 0 ? "minus" : "plus"
    
  );
  item.innerHTML = `
    <div>
      <small>${transaction.date}</small><br>
      ${transaction.text}
    </div>
    <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
`;
list.appendChild(item);

  
}

//4

//Update the balance income and expence
function updateValues() {
  const amounts = transactions.map(
    (transaction) => transaction.amount
  );
  const total = amounts
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense =
    (amounts
      .filter((item) => item < 0)
      .reduce((acc, item) => (acc += item), 0) *
    -1).toFixed(2);

    balance.innerText=`$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}



//Remove Transaction by ID
function removeTransaction(id){
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  Init();
  updateChart();
}
//last
//update Local Storage Transaction
function updateLocalStorage(){
  localStorage.setItem('transactions',JSON.stringify(transactions));
}


//3

//Init App
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
  updateChart();
  
}

// CHART: Income + categories
const chartCtx = document.getElementById('doughnut').getContext('2d');

let mainChart = new Chart(chartCtx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#4CAF50', // Income
        '#FF5722', // Food
        '#3F51B5', // Travel
        '#FFC107', // Rent
        '#9C27B0', // Shopping
        '#009688'  // Other
      ]
    }]
  }
});

function updateChart(){
  let income = transactions
    .filter(t => t.amount > 0)
    .reduce((a,t)=> a + t.amount, 0);

  let totals = {};
  transactions.forEach(t=>{
    if(t.amount < 0){
      if(!totals[t.category]) totals[t.category]=0;
      totals[t.category] += Math.abs(t.amount);
    }
  });

  let labels = ["Income"];
  let data = [income];

  Object.keys(totals).forEach(cat=>{
    labels.push(cat);
    data.push(totals[cat]);
  });

  mainChart.data.labels = labels;
  mainChart.data.datasets[0].data = data;
  mainChart.update();
}



Init();
updateChart();

form.addEventListener('submit',addTransaction);
            
  // open modals



// CONTACT MODAL JS
const contactModal = document.getElementById("contactModal");
const openContact = document.getElementById("openContact");
const closeContact = document.getElementById("closeContact");

// open contact modal
if (openContact){
openContact.addEventListener("click", function (e) {
  e.preventDefault();
  contactModal.style.display = "flex";
});
}

// close contact modal
if (closeContact){
closeContact.addEventListener("click", function () {
  contactModal.style.display = "none";
});
}

// close modal on outside click
window.addEventListener("click", function (event) {
  if (event.target === contactModal) {
    contactModal.style.display = "none";
  }
});

if(saved.email == signinEmail.value && saved.password == signinPassword.value){
    alert("Login successful! Redirecting...");
    window.location.href = "dashboard.html";   // redirect to new page
} else {
    alert("Invalid Credentials ❌");
}

window.location.href = "dashboard.html";