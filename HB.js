let habits = [];

function loadData() {
  const storedHabits = localStorage.getItem("myHabitTrackerData");
  // to get the data from local storage
  if (storedHabits) {
    // If data exists, parse it from a string back into an array
    habits = JSON.parse(storedHabits);
  } else {
    // Default habits if it's their first time loading the app
    habits = [
      {
        name: "Read 10 Pages",
        checks: [false, false, false, false, false, false, false],
      },
      {
        name: "Drink 4L of water",
        checks: [false, false, false, false, false, false, false],
      },
    ];
  }

  renderTable();
}
// API---- Save the current state of habits to local storage
function saveData() {
  localStorage.setItem("myHabitTrackerData", JSON.stringify(habits));
  updateScore();
}
//  here is the basicly template for rendering the tables
function renderTable() {
  const tbody = document.getElementById("habitBody");
  tbody.innerHTML = ""; // Clear out the existing rows

  habits.forEach((habit, habitIndex) => {
    const tr = document.createElement("tr");

    // habit name
    let html = `<td>${habit.name}</td>`;

    // Create the 7 checkboxes checking if they were previously saved as true
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const isChecked = habit.checks[dayIndex] ? "checked" : "";
      html += `<td><input type="checkbox" ${isChecked} onchange="toggleCheck(${habitIndex}, ${dayIndex})"></td>`;
    }

    // Add the delete button
    html += `<td><button class="delete-btn" onclick="deleteHabit(${habitIndex})">Delete</button></td>`;

    tr.innerHTML = html;
    tbody.appendChild(tr);
  });

  // Make sure the score reflects the newly rendered table
  updateScore();
}

// 4. Handle a checkbox being clicked
function toggleCheck(habitIndex, dayIndex) {
  // Flip the boolean value (true to false, or false to true)
  habits[habitIndex].checks[dayIndex] = !habits[habitIndex].checks[dayIndex];

  // Save the new state and update the score
  saveData();
}

// Adding a new habit
function addHabit() {
  const input = document.getElementById("habitInput");
  const habitName = input.value.trim();

  if (habitName === "") {
    alert("Please enter a habit name.");
    return;
  }

  // Add the new habit object to our array
  habits.push({
    name: habitName,
    checks: [false, false, false, false, false, false, false],
  });

  input.value = "";

  // Save to local storage and re-render the table
  saveData();
  renderTable();
}

// Deleteing a habit
function deleteHabit(habitIndex) {
  // Remove 1 item at the specified index
  habits.splice(habitIndex, 1);

  saveData();
  renderTable();
}

// Calculate and update the score UI
function updateScore() {
  let checkedCount = 0;
  let totalCheckboxes = habits.length * 7;

  // Count how many checks are true in our data array
  habits.forEach((habit) => {
    habit.checks.forEach((check) => {
      if (check) checkedCount++;
    });
  });

  let score = checkedCount * 10;
  let percentage =
    totalCheckboxes > 0 ? (checkedCount / totalCheckboxes) * 100 : 0;

  document.getElementById("score").textContent = score;
  document.getElementById("percentage").textContent = percentage.toFixed(2);
}

// Allow Enter key to work
document
  .getElementById("habitInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addHabit();
    }
  });

// Run loadData once the window loads to kick everything off
window.onload = loadData;
