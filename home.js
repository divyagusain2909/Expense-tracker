let transactions = [];
let categories = ["Food", "Travel", "Shopping", "Bills", "Other"];
const incomeCategory = "Income";

// Charts
const pieCtx = document.getElementById("pieChart").getContext("2d");
const barCtx = document.getElementById("barChart").getContext("2d");
const heatmapCtx = document.getElementById("heatmapChart").getContext("2d");

let pieChart = new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: categories,
    datasets: [{ data: [0,0,0,0,0], backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"] }]
  }
});

let barChart = new Chart(barCtx, {
  type: "bar",
  data: {
    labels: categories,
    datasets: [{ label: "Expenses (₹)", data: [0,0,0,0,0], backgroundColor: "#1f7aff" }]
  }
});

let heatmapChart = new Chart(heatmapCtx, {
  type: "bar",
  data: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{
      label: "Spending Pattern",
      data: [0,0,0,0],
      backgroundColor: ["#ff7043", "#ffa726", "#ffca28", "#ffb300"]
    }]
  }
});

// Toggle premium features
function toggleFeature(id){
  let box = document.getElementById(id);
  box.style.display = box.style.display === "block" ? "none" : "block";
}

// Add transaction
function addTransaction(){
    const balance= document.getElementById("balance").value
    const money_plus = document.getElementById(
  "money-plus"
);
const money_minus = document.getElementById(
  "money-minus"
);
  const name = document.getElementById("itemName").value;
  let amount = parseFloat(document.getElementById("itemAmount").value);
  const category = document.getElementById("itemCategory").value;

  if(!name || !amount) return alert("Please fill all fields");

  if(category !== incomeCategory) amount = -Math.abs(amount); // Expenses negative
  else amount = Math.abs(amount); // Income positive

  const date = new Date();
  transactions.push({name, amount, category, date});
  updateTransactionList();
  updateCharts();
  updateValues();

  document.getElementById("itemName").value = "";
  document.getElementById("itemAmount").value = "";
}
//Generate Random ID
function generateID(){
  return Math.floor(Math.random()*1000000000);
}

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
   
`;
list.appendChild(item);

  
}
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


// Remove transaction
function removeTransaction(index){
  transactions.splice(index,1);
  updateTransactionList();
  updateCharts();
}

// Update transaction list
function updateTransactionList(){
  const list = document.getElementById("transactionList");
  list.innerHTML = "";
  transactions.forEach((t,i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${t.name} - ₹${t.amount} [${t.category}] - ${t.date.toLocaleDateString()}</span>
                    <span class="remove-btn" onclick="removeTransaction(${i})">Remove</span>`;
    list.appendChild(li);
  });

  // Update balance
  const balance = transactions.reduce((sum,t)=>sum+t.amount,0);
  document.getElementById("balance").textContent = balance.toFixed(2);
}

// Update charts dynamically
function updateCharts(){
  // Pie & Bar chart only for expenses
  let categoryTotals = categories.map(c => 
    transactions.filter(t=>t.category===c).reduce((sum,t)=>sum+t.amount<0? sum - t.amount : sum,0)
  );

  pieChart.data.datasets[0].data = categoryTotals;
  pieChart.update();

  barChart.data.datasets[0].data = categoryTotals;
  barChart.update();

  // Heatmap (weekly totals)
  let weekTotals = [0,0,0,0];
  transactions.forEach(t=>{
    let week = Math.floor((t.date.getDate()-1)/7);
    weekTotals[week] += t.amount;
  });
  heatmapChart.data.datasets[0].data = weekTotals;
  heatmapChart.update();
}

function openTool(title, bodyHTML) {
  document.getElementById("toolTitle").innerText = title;
  document.getElementById("toolBody").innerHTML = bodyHTML;
  document.getElementById("toolModal").style.display = "flex";
}

function closeTool() {
  document.getElementById("toolModal").style.display = "none";
}

/* ========== 1) SMART BUDGET PLANNER ========== */

function smartBudgetTool() {
  let box = document.getElementById("smartBudget");
  box.style.display = "block";
 

  box.innerHTML = `
    <div class="tool-window">
      <h3>Smart Budget Planner</h3>
      <p>Enter your monthly income and expected expenses:</p>
      <input id="incomeInput" type="number" placeholder="Monthly Income"><br><br>
      <input id="expenseInput" type="number" placeholder="Expected Expenses"><br>
      <button class="tool-btn" onclick="calcSmartBudget()">Calculate</button>
      <div id="smartResult" class="result-box"></div>
    </div>
  `;
}

function calcSmartBudget() {
  let income = parseFloat(document.getElementById("incomeInput").value);
  let expense = parseFloat(document.getElementById("expenseInput").value);

  if (isNaN(income) || isNaN(expense)) {
    document.getElementById("smartResult").innerText = "❗ Enter valid numbers";
    return;
  }

  let saving = income - expense;
  let msg = saving >= 0 ?
    `🟢 You can save ₹${saving}` :
    `🔴 You are overspending by ₹${Math.abs(saving)}`;

  document.getElementById("smartResult").innerHTML = msg;
}


/* INVESTMENT ADVICE TOOL */

function investmentTool() {
  let box = document.getElementById("investAdvice");
  box.style.display = "block";

  box.innerHTML = `
    <div class="tool-window">
      <h3>💹Investment Advisor</h3>
      <p>Enter available investment amount and choose your risk level.</p>

      <input id="investAmount" type="number" placeholder="Investment Amount (₹)">
      <br><br>

      <select id="riskLevel" style="padding:10px;border-radius:8px;width:85%;">
        <option value="">Select Risk Level</option>
        <option value="low">Low Risk (Safe)</option>
        <option value="medium">Medium Risk (Balanced)</option>
        <option value="high">High Risk (Aggressive)</option>
      </select>

      <br><br>
      <button class="tool-btn" onclick="getInvestmentAdvice()">Get Investment Plan</button>

      <div id="investResult" class="result-box"></div>
    </div>
  `;
}

function getInvestmentAdvice() {
  const amount = parseFloat(document.getElementById("investAmount").value);
  const risk = document.getElementById("riskLevel").value;
  const result = document.getElementById("investResult");

  if (isNaN(amount) || amount <= 0 || risk === "") {
    result.innerText = "❗ Please enter a valid amount and select risk level";
    return;
  }

  let plan = "";
  let tips = `
    <br><b>📌 Basic Tips:</b>
    <ul>
      <li>Always keep emergency savings separately</li>
      <li>Invest regularly, not all at once</li>
      <li>Diversify your investments</li>
      <li>Review portfolio every 6 months</li>
    </ul>
  `;

  if (risk === "low") {
    plan = `
      🟢 <b>Low Risk Investment Plan</b><br>
      Fixed Deposits: ₹${(amount * 0.5).toFixed(0)}<br>
      PPF / EPF: ₹${(amount * 0.3).toFixed(0)}<br>
      Government Bonds: ₹${(amount * 0.2).toFixed(0)}<br>
      <br><b>Expected Returns:</b> 5% – 7% annually
    `;
  }

  if (risk === "medium") {
    plan = `
      🟡 <b>Balanced Investment Plan</b><br>
      Index / Mutual Funds: ₹${(amount * 0.5).toFixed(0)}<br>
      Fixed Deposits: ₹${(amount * 0.2).toFixed(0)}<br>
      Blue-chip Stocks: ₹${(amount * 0.3).toFixed(0)}<br>
      <br><b>Expected Returns:</b> 8% – 12% annually
    `;
  }

  if (risk === "high") {
    plan = `
      🔴 <b>High Risk Investment Plan</b><br>
      Stocks: ₹${(amount * 0.5).toFixed(0)}<br>
      ETFs / Growth Funds: ₹${(amount * 0.3).toFixed(0)}<br>
      Crypto / Startups: ₹${(amount * 0.2).toFixed(0)}<br>
      <br><b>Expected Returns:</b> 12% – 20%+ annually
    `;
  }

  result.innerHTML = plan + tips;
}

/* SAVING ROADMAPS*/
function savingsRoadmapTool() {
  let box = document.getElementById("savingRoadmap");
  box.style.display = "block";

  box.innerHTML = `
    <div class="tool-window">
      <h3>Savings Roadmap</h3>
      <p>Enter your savings goal:</p>
      <input id="goalInput" type="number" placeholder="Goal Amount"><br><br>
      <input id="monthsInput" type="number" placeholder="Months to Save"><br>
      <button class="tool-btn" onclick="calcRoadmap()">Generate Roadmap</button>
      <div id="roadmapResult" class="result-box"></div>
    </div>
  `;
}

function calcRoadmap() {
  let goal = parseFloat(document.getElementById("goalInput").value);
  let months = parseFloat(document.getElementById("monthsInput").value);

  if (isNaN(goal) || isNaN(months)) {
    document.getElementById("roadmapResult").innerText = "❗ Enter valid values";
    return;
  }

  let perMonth = Math.ceil(goal / months);

  document.getElementById("roadmapResult").innerHTML =
    `📌 Save <b>₹${perMonth}</b> every month to reach ₹${goal} in ${months} months.`;
}

/* SAVINGS ROADMAP TOOL 
function savingRoadmapTool() {
  openTool("Savings Roadmap", `
    <p>Enter your goal amount:</p>
    <input id="goalInput" type="number" placeholder="Goal: e.g. 50000">
    <button class="tool-btn" onclick="makeRoadmap()">Generate Roadmap</button>
    <div id="roadmapResult" class="result-box"></div>
  `);
}

function makeRoadmap() {
  let goal = parseFloat(document.getElementById("goalInput").value);
  if (!goal) {
    document.getElementById("roadmapResult").innerText = "❗ Enter a valid goal";
    return;
  }
  let perMonth = Math.round(goal / 12);
  document.getElementById("roadmapResult").innerHTML =
    `🎯 Save <b>₹${perMonth}</b> per month to reach ₹${goal} in 12 months.`;
}*/

/* smart warning system*/
function smartWarningTool() {
  alert("SMART WARNING FUNCTION CALLED");
  const box = document.getElementById("smartWarning");
  if (!box) return alert("Smart Warning container missing!");
  box.style.display ="block";

  box.innerHTML = `
    <div class="tool-window">
      <h3>🧠 Smart Investment Risk Analyzer</h3>
      <p>This tool evaluates your decision like a professional advisor.</p>

      <input id="warnAmount" type="number" placeholder="Investment Amount (₹)">
      <br><br>

      <select id="warnRisk" style="padding:10px;border-radius:8px;width:85%;">
        <option value="">Risk Appetite</option>
        <option value="low">Low (Capital Protection)</option>
        <option value="medium">Medium (Balanced Growth)</option>
        <option value="high">High (Aggressive Growth)</option>
      </select>
      <br><br>

      <select id="warnHorizon" style="padding:10px;border-radius:8px;width:85%;">
        <option value="">Investment Horizon</option>
        <option value="short">Short Term (1-2 yrs)</option>
        <option value="mid">Mid Term (3-6 yrs)</option>
        <option value="long">Long Term (7+ yrs)</option>
      </select>

      <br><br>
      <button class="tool-btn" onclick="generateSmartWarnings()">Analyze Investment</button>

      <div id="warningResult" class="result-box"></div>
    </div>
  `;
}
function generateSmartWarnings() {
  const amount = parseFloat(document.getElementById("warnAmount").value);
  const risk = document.getElementById("warnRisk").value;
  const horizon = document.getElementById("warnHorizon").value;
  const result = document.getElementById("warningResult");

  if (isNaN(amount) || amount <= 0 || !risk || !horizon) {
    result.innerHTML = "❗ Please complete all fields for accurate analysis.";
    return;
  }

  let analysis = `<b>📊 Expert Analysis:</b><br>`;
  let warningCount = 0;

  /* CAPITAL ADEQUACY */
  if (amount < 10000) {
    analysis += "⚠️ Capital is very low. Focus on savings before investing.<br>";
    warningCount++;
  }

  /* RISK vs CAPITAL */
  if (risk === "high" && amount < 50000) {
    analysis += "⚠️ High risk with low capital increases loss probability.<br>";
    warningCount++;
  }

  if (risk === "low" && amount > 1000000) {
    analysis += "⚠️ Conservative strategy may not beat inflation for large capital.<br>";
    warningCount++;
  }

  /* TIME HORIZON LOGIC */
  if (horizon === "short" && risk === "high") {
    analysis += "⚠️ Aggressive investments are unsuitable for short-term goals.<br>";
    warningCount++;
  }

  if (horizon === "long" && risk === "low") {
    analysis += "⚠️ Long-term goals require growth assets to compound wealth.<br>";
    warningCount++;
  }

  /* DIVERSIFICATION */
  if (amount > 200000 && risk !== "medium") {
    analysis += "⚠️ Portfolio diversification strongly recommended at this capital level.<br>";
    warningCount++;
  }

  /* BEHAVIORAL FINANCE */
  if (risk === "high" && amount > 500000) {
    analysis += "⚠️ High exposure detected — avoid emotional decision-making.<br>";
    warningCount++;
  }

  /* FINAL VERDICT */
  if (warningCount === 0) {
    analysis += "<br>✅ <b>Advisor Verdict:</b> Strategy appears well-balanced and reasonable.";
  } else {
    analysis += `<br>🔴 <b>Advisor Verdict:</b> ${warningCount} potential risk(s) detected. Review before proceeding.`;
  }

  result.innerHTML = analysis;
}

const assistantMessages = [
  "🔥 Track your expenses with real-time charts and heatmaps.",
  "💹 Get smart investment advice based on your risk level.",
  "🧠 Smart Warning System alerts risky financial decisions.",
  "🎯 Plan savings goals with clear monthly roadmaps.",
  "📊 plan your Budget with us."
];

let msgIndex = 0;

function rotateAssistantMessage() {
  const bubble = document.getElementById("assistantBubble");
  bubble.style.opacity = 0;

  setTimeout(() => {
    bubble.innerText = assistantMessages[msgIndex];
    bubble.style.opacity = 1;
    msgIndex = (msgIndex + 1) % assistantMessages.length;
  }, 400);
}

// Auto talk every 4 seconds
setInterval(rotateAssistantMessage, 4000);

// Click cartoon to replay
document.getElementById("assistantImg").addEventListener("click", rotateAssistantMessage);