let isFirstMessage = true;


async function getGeminiResponse(prompt) {
  const outputBox = document.getElementById("outputBox");
  const response = await fetch('http://localhost:3000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();

  const modelName = data.model || "Gemini";

  if (isFirstMessage) {
    outputBox.innerHTML = "";
    isFirstMessage = false;
  }

  outputBox.innerHTML += `<br><b>You:</b> ${prompt}<br>`;
  outputBox.innerHTML += marked.parse(`<b>${modelName}:</b> ${data.response}`);

  outputBox.scrollTo({
    top: outputBox.scrollHeight,
    behavior: "smooth"
  });
  // outputBox.innerHTML = marked.parse(data.response);
}


document.getElementById("sendButton").addEventListener("click", function () {
  const inputBox = document.getElementById("inputBox");
  const userPrompt = inputBox.value.trim();

  if (userPrompt) {
    getGeminiResponse(userPrompt);
    inputBox.value = "";
  } else {
    console.log("whatever");
  }

});

const inputElement = document.getElementById("inputBox");

inputElement.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("sendButton").click();
  }
});