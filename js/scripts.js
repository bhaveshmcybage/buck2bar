// input with id "username" on change
document.getElementById("username").addEventListener("input", function () {
  var username = this.value;
  // regex to check if username has at least 1 capital letter, 1 special character, 1 number and is at least 8 characters long
  var regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (regex.test(username)) {
    // set the username input border to green
    this.style.borderColor = "green";
  } else {
    // set the username input border to red
    this.style.borderColor = "red";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var chartTab = document.getElementById("chart-tab");
  var chartInitialized = false;
  chartTab.addEventListener("shown.bs.tab", function () {
    if (!chartInitialized) {
      var ctx = document.getElementById("barChart").getContext("2d");
      window.barChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          datasets: [
            {
              label: "Income",
              data: [],
              backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
            {
              label: "Expenses",
              data: [],
              backgroundColor: "rgba(255, 99, 132, 0.7)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
      chartInitialized = true;
    }
    // Always update chart data with current form values when tab is shown
    updateBarChartWithFormData();
  });
});

function getMonthlyIncomeExpenses() {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const data = {};
  months.forEach((month) => {
    const incomeInput = document.getElementById(`${month}-income`);
    const expensesInput = document.getElementById(`${month}-expenses`);
    data[month] = {
      income: incomeInput ? Number(incomeInput.value) : 0,
      expenses: expensesInput ? Number(expensesInput.value) : 0,
    };
  });
  return data;
}

function updateBarChartWithFormData() {
  if (!window.barChart) return;
  const monthlyData = getMonthlyIncomeExpenses();
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  // Set the data arrays for income and expenses
  window.barChart.data.datasets[0].data = months.map(
    (m) => monthlyData[m].income
  );
  window.barChart.data.datasets[1].data = months.map(
    (m) => monthlyData[m].expenses
  );
  window.barChart.update();
}

// Add event listeners to update chart live when inputs change
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
months.forEach((month) => {
  ["income", "expenses"].forEach((type) => {
    const input = document.getElementById(`${month}-${type}`);
    if (input) {
      input.addEventListener("input", updateBarChartWithFormData);
    }
  });
});
function downloadChart() {
  var canvas = document.getElementById("barChart");
  var link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "buck2bar-chart.png";
  link.click();
}
