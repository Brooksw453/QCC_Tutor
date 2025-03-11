// JavaScript for QCC Tutor web app
// List of subjects for easy iteration
const subjects = ["writing", "math", "science", "engineering"];

// Note: Insert your OpenAI API key for testing, but never expose it in production.
const OPENAI_API_KEY = "   ";

// Function to show a given subject section and hide others
function showSection(subject) {
  // Hide the intro message when a subject is selected
  document.getElementById("intro").style.display = "none";
  // Hide all subject sections
  document.querySelectorAll(".subject-section").forEach(section => {
    section.style.display = "none";
  });
  // Remove 'active' class from all nav buttons
  document.querySelectorAll(".nav-buttons button").forEach(btn => {
    btn.classList.remove("active");
  });
  // Show the selected section
  document.getElementById(subject + "Section").style.display = "block";
  // Highlight the active navigation button
  document.getElementById(subject + "Tab").classList.add("active");
}

// Attach click handlers to navigation buttons
subjects.forEach(sub => {
  const tabButton = document.getElementById(sub + "Tab");
  if (tabButton) {
    tabButton.addEventListener("click", () => showSection(sub));
  }
});

// Attach click handlers to recommended query buttons
document.querySelectorAll(".rec-btn").forEach(button => {
  button.addEventListener("click", () => {
    const subject = button.getAttribute("data-subject");
    const query = button.getAttribute("data-query");
    sendQuery(subject, query);
  });
});

// Attach event handlers for search submissions (button click and Enter key)
subjects.forEach(sub => {
  const inputField = document.getElementById(sub + "Query");
  const submitBtn = document.getElementById(sub + "Submit");
  if (submitBtn && inputField) {
    submitBtn.addEventListener("click", () => {
      const query = inputField.value.trim();
      sendQuery(sub, query);
    });
    // Also allow pressing Enter key to submit the query
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitBtn.click();
      }
    });
  }
});

// Function to send the query to OpenAI API and display the response
function sendQuery(subject, query) {
  if (!query) return;  // Do nothing if query is empty

  const outputDiv = document.getElementById(subject + "Response");
  outputDiv.textContent = "Thinking..."; // show a temporary message

  // Call the OpenAI API (text completion endpoint)
  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: query,
      max_tokens: 150,
      temperature: 0.7
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      outputDiv.textContent = "Error: " + data.error.message;
    } else if (data.choices && data.choices.length > 0) {
      // Display the first returned answer
      outputDiv.textContent = data.choices[0].text.trim();
    } else {
      outputDiv.textContent = "No response.";
    }
  })
  .catch(err => {
    console.error("Error calling OpenAI API:", err);
    outputDiv.textContent = "Error fetching response.";
  });
}
