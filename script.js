const MAX_MESSAGES = 30;
const MESSAGE_LIFETIME = 15000;

const chat = document.getElementById("chatMessages");

const COLORS = [
  "#55d6ff",
  "#ff78c8",
  "#8cff7a",
  "#ffd166",
  "#a98cff",
  "#ff8b6a",
  "#65e6c7"
];

function safeText(value) {
  return String(value ?? "").replace(/[<>]/g, "");
}

function addMessage(data) {
  if (!data) return;



  const name = safeText(
    data.name ||
    data.from ||
    data.displayName ||
    data.username ||
    data.nick ||
    "Viewer"
  );

  const text = safeText(
    data.message ||
    data.text ||
    data.comment ||
    ""
  );

  if (!text.trim()) return;

  const row = document.createElement("div");
  row.className = "chat-line";

  /*
   * USERNAME
   */
  const nameEl = document.createElement("span");

  nameEl.className = "name";
  nameEl.textContent = name + ":";

  nameEl.style.color =
    data.color ||
    data.displayColor ||
    COLORS[Math.floor(Math.random() * COLORS.length)];

  /*
   * MESSAGE
   */
  const messageEl = document.createElement("span");

  messageEl.className = "message";
  messageEl.textContent = " " + text;

  /*
   * Dodajemy username + wiadomość
   */
  row.appendChild(nameEl);
  row.appendChild(messageEl);

  chat.appendChild(row);

  /*
   * Maksymalna liczba wiadomości.
   * Usuwamy najstarsze, kiedy jest ich za dużo.
   */
  while (chat.children.length > MAX_MESSAGES) {
    chat.removeChild(chat.firstElementChild);
  }

  /*
   * Automatyczne usunięcie po czasie.
   */
  if (MESSAGE_LIFETIME > 0) {
    setTimeout(() => {
      if (row.isConnected) {
        row.remove();
      }
    }, MESSAGE_LIFETIME);
  }

  /*
   * Zawsze trzymaj najnowszą wiadomość na dole.
   */
  requestAnimationFrame(() => {
    chat.scrollTop = chat.scrollHeight;
  });
}


/*
 * =====================================================
 * STREAMLABS EVENT HANDLER
 * =====================================================
 *
 * Streamlabs używa:
 *
 * document.addEventListener("onEventReceived", ...)
 *
 * a informacje znajdują się w:
 *
 * obj.detail
 */
document.addEventListener("onEventReceived", function (obj) {

  const detail = obj.detail || {};

  console.log("[CHAT EVENT]", detail);

  /*
   * STREAMLABS CHAT MESSAGE
   */
  if (
    detail.type === "message" ||
    detail.type === "chat"
  ) {
    addMessage(detail);
    return;
  }

  /*
   * NIEKTÓRE KONFIGURACJE STREAMLABS
   * mogą przekazywać chat w zagnieżdżonym obiekcie.
   */
  if (detail.event) {

    const event = detail.event;

    if (
      event.type === "message" ||
      event.type === "chat"
    ) {
      addMessage(event);
      return;
    }

    /*
     * Kompatybilność ze starym formatem
     * StreamElements.
     */
    if (detail.listener === "message") {
      addMessage(event.data || event);
      return;
    }
  }

  /*
   * ===================================================
   * FOLLOW
   * ===================================================
   */

  if (
    detail.type === "follow" ||
    detail.listener === "follower-latest"
  ) {

    const name =
      detail.name ||
      detail.from ||
      detail.displayName;

    if (name) {
      document.getElementById("newFollower").textContent =
        safeText(name);
    }

    return;
  }


  /*
   * ===================================================
   * SUB
   * ===================================================
   */

  if (
    detail.type === "subscription" ||
    detail.type === "subscriber" ||
    detail.listener === "subscriber-latest"
  ) {

    const name =
      detail.name ||
      detail.from ||
      detail.displayName;

    if (name) {
      document.getElementById("newSub").textContent =
        safeText(name);
    }

    return;
  }


  /*
   * ===================================================
   * DONATION / TIP
   * ===================================================
   */

  if (
    detail.type === "donation" ||
    detail.type === "tip" ||
    detail.listener === "tip-latest"
  ) {

    const name =
      detail.name ||
      detail.from ||
      "Anonymous";

    const amount =
      detail.amount ??
      detail.formattedAmount ??
      "";

    const currency =
      detail.currency ||
      "$";

    document.getElementById("latestDonation").textContent =
      `${safeText(name)}: ${safeText(currency)}${safeText(amount)}`;

    return;
  }
});


/*
 * =====================================================
 * TEST CHAT
 * =====================================================
 *
 * Odkomentuj testChat();
 * jeśli chcesz sprawdzić wygląd bez prawdziwego czatu.
 */

function testChat() {

  const messages = [

    [
      "Bugimir",
    ],

    [
      "Bugimir",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
    ],

    [
      "ZMX",
      "To jest bardzo długa wiadomość testowa. Powinna automatycznie zawinąć się do kolejnych linii bez ucinania tekstu."
    ],

    [
      "Royal",
      "Jeszcze jedna długa wiadomość testowa sprawdzająca zachowanie całego chatu."
    ]

  ];

  messages.forEach(([name, message], index) => {

    setTimeout(() => {

      addMessage({
        name: name,
        message: message,
        color: COLORS[index % COLORS.length]
      });

    }, index * 500);

  });
}
