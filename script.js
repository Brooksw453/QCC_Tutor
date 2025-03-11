const workerUrl = "https://openai-proxy.brookswinchell.workers.dev/";

// Handle navigation clicks
document.querySelectorAll('.nav-buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.subject-section, #intro').forEach(section => {
      section.style.display = 'none';
    });
    document.getElementById(btn.dataset.section).style.display = 'block';
  });
});

// Handle recommended query button clicks
document.querySelectorAll('.rec-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const subject = btn.dataset.subject;
    const query = btn.dataset.query;
    sendQuery(subject, query);
  });
});

// Function to send a query to Cloudflare Worker
function sendQuery(subject, query) {
  const outputDiv = document.getElementById(`${subject}Response`);
  outputDiv.textContent = "Loading...";

  fetch(workerUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ query })
  })
  .then(res => res.json())
  .then(data => {
    if (data.choices && data.choices[0]) {
      outputDiv.textContent = data.choices[0].message.content.trim();
    } else if (data.error) {
      outputDiv.textContent = "API Error: " + data.error.message;
    } else {
      outputDiv.textContent = "No response available.";
    }
  })
  .catch(err => {
    outputDiv.textContent = "Error: unable to fetch response.";
    console.error(err);
  });
}
