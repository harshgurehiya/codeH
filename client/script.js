import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form"); //targeting our HTML elements manually
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

// Load AI answers
function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

// To type text
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index); //charAt brings character at specific index in the text that AI will return.
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// To generate unique ID(using current time and date) for every single message

function generateUniqueID() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// Creating Chat Stripe

function chatStripe(isAi, value, uniqueID) {
  return `
            <div class="wrapper ${isAi && "ai"}">
                <div class="chat">
                    <div class="profile">
                        <img 
                            src="${isAi ? bot : user}"
                            alt="${isAi ? "bot" : "user"}"
                        />
                    </div>
                    <div class="message" id=${uniqueID}>${value}</div>
                </div>
            </div>
        `;
}

// Creating handleSubmit function to get AI generated response

const handleSubmit = async (e) => {
  e.preventDefault(); // it will prevent default behaviour of browser(i.e., it gets restart on submitting form)

  const data = new FormData(form);

  //generate user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  //bot's chatStripe
  const uniqueID = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueID);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueID); //fetching newly created div

  loader(messageDiv);

  //fetch data from server -> bot's response

  const response = await fetch("https://codeh-2pkd.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json(); //this will give actual response from backend
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
};
//calling handleSubmit
form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
