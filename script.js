const MAX_MESSAGES = 18;
const MESSAGE_LIFETIME = 12000;

const chat = document.getElementById("chatMessages");

const COLORS = [
  "#55d6ff", "#ff78c8", "#8cff7a", "#ffd166",
  "#a98cff", "#ff8b6a", "#65e6c7"
];

function safeText(value) {
  return String(value ?? "").replace(/[<>]/g, "");
}

function addMessage(data) {
  const name = safeText(
    data.displayName ||
    data.nick ||
    data.username ||
    data.name ||
    "Viewer"
  );

  const text = safeText(
    typeof data.text === "string" ? data.text : ""
  );

  if (!text.trim()) return;

  const row = document.createElement("div");
  row.className = "chat-line";

  const nameEl = document.createElement("span");
  nameEl.className = "name";
  nameEl.textContent = name + ":";
  nameEl.style.color =
    data.displayColor ||
    COLORS[Math.floor(Math.random() * COLORS.length)];

  const messageEl = document.createElement("span");
  messageEl.className = "message";
  messageEl.textContent = " " + text;

  row.appendChild(nameEl);
  row.appendChild(messageEl);
  chat.appendChild(row);

  while (chat.children.length > MAX_MESSAGES) {
    chat.removeChild(chat.firstElementChild);
  }

  setTimeout(() => {
    if (row.isConnected) row.remove();
  }, MESSAGE_LIFETIME);
}

window.addEventListener("onEventReceived", function (obj) {
  const detail = obj.detail || {};
  const listener = detail.listener;
  const event = detail.event || {};

  if (listener === "message") {
    addMessage(event.data || event);
    return;
  }

  /* Optional StreamElements events */
  if (listener === "follower-latest") {
    const name = event.name || event.data?.name;
    if (name) document.getElementById("newFollower").textContent = safeText(name);
  }

  if (listener === "subscriber-latest") {
    const name = event.name || event.data?.name;
    if (name) document.getElementById("newSub").textContent = safeText(name);
  }

  if (listener === "tip-latest") {
    const name = event.name || event.data?.name || "Anonymous";
    const amount = event.amount ?? event.data?.amount ?? "";
    const currency = event.currency || event.data?.currency || "$";
    document.getElementById("latestDonation").textContent =
      `${safeText(name)}: ${currency}${safeText(amount)}`;
  }
});

/* Test messages while editing the widget */
function testChat() {
  [
    ["Bugimir", "Siema!"],
    ["Royal", "To jest bardzo długa wiadomość testowa, która powinna zostać automatycznie zawinięta i zatrzymana maksymalnie na drugiej linii."],
    ["ZMX", "Wygląda na to, że wszystko działa poprawnie!"],
    ["Bugimir", "Dzięki za sprawdzenie!"],
    ["ZMX", "Nie ma sprawy!"],
  ].forEach(([displayName, text], i) => {
    setTimeout(() => addMessage({ displayName, text }), i * 350);
  });
}

// Uncomment while testing:
// testChat();
