// Use modern JavaScript (ES6+) features

// Username input validation
document.getElementById("username")?.addEventListener("input", function () {
  const username = this.value;
  // Regex: at least 1 capital, 1 special, 1 number, min 8 chars
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~])[A-Za-z\d@$!%*?&~]{8,}$/;
  this.style.borderColor = regex.test(username) ? "green" : "red";
});

document.addEventListener("DOMContentLoaded", () => {
  const chartTab = document.getElementById("chart-tab");
  let chartInitialized = false;

  chartTab?.addEventListener("shown.bs.tab", () => {
    if (!chartInitialized) {
      const ctx = document.getElementById("barChart").getContext("2d");
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
          scales: { y: { beginAtZero: true } },
        },
      });
      chartInitialized = true;
    }
    updateBarChartWithFormData();
  });

  // Integrate Send Email button with sendChartByEmail
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", sendChartByEmail);
  }
});

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

const getMonthlyIncomeExpenses = () =>
  Object.fromEntries(
    months.map((month) => [
      month,
      {
        income: Number(document.getElementById(`${month}-income`)?.value || 0),
        expenses: Number(
          document.getElementById(`${month}-expenses`)?.value || 0
        ),
      },
    ])
  );

function updateBarChartWithFormData() {
  if (!window.barChart) return;
  const monthlyData = getMonthlyIncomeExpenses();
  window.barChart.data.datasets[0].data = months.map(
    (m) => monthlyData[m].income
  );
  window.barChart.data.datasets[1].data = months.map(
    (m) => monthlyData[m].expenses
  );
  window.barChart.update();
}

// Live update chart on input changes
months.forEach((month) => {
  ["income", "expenses"].forEach((type) => {
    document
      .getElementById(`${month}-${type}`)
      ?.addEventListener("input", updateBarChartWithFormData);
  });
});

function downloadChart() {
  const canvas = document.getElementById("barChart");
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "buck2bar-chart.png";
  link.click();
}

function sendChartByEmail() {
  const emailInput = document.getElementById("userEmail");
  const email = emailInput?.value.trim();
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    alert("Please enter a valid email address.");
    emailInput?.focus();
    return;
  }
  const canvas = document.getElementById("barChart");
  if (!canvas) {
    alert("Chart not found.");
    return;
  }
  const imageData = canvas.toDataURL("image/png");
  // Change fetch URL to point to your Express server (adjust port if needed)
  fetch("http://localhost:3000/send-chart-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, imageData }),
  })
    .then((res) => res.json())
    .then((data) => alert(data.message || "Email sent!"))
    .catch(() => alert("Failed to send email."));
}
