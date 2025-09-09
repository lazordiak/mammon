// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 10000 });

// Store connected clients
const clients = new Set();

// Ngrok WebSocket URL (Replace with your actual ngrok TCP address)
// Prefer env var; fall back to local print server for testing
const NGROK_URL = process.env.NGROK_URL || "ws://localhost:8081";
// const NGROK_URL = "ws://7.tcp.ngrok.io:20823";
let printServer = null;
let isReconnecting = false; // Flag to track reconnect attempts
let attempt = 0; // reconnect backoff attempts

// Function to connect to the print server (with retry)
function connectToPrintServer() {
  if (isReconnecting) return; // Prevent reconnection if already in progress

  const baseDelayMs = 1000; // 1s
  const maxDelayMs = 60000; // 60s cap
  const jitterMs = 250; // +/- 250ms jitter
  const delayMs = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
  const jitter = Math.floor((Math.random() * 2 - 1) * jitterMs);
  const nextDelay = Math.max(0, delayMs + jitter);

  if (attempt === 0) {
    console.log("Attempting to connect to the print server...");
  } else {
    console.log(
      `Reconnecting to print server (attempt ${attempt}) in ${nextDelay}ms...`
    );
  }

  isReconnecting = true; // Set flag to true while reconnecting

  const doConnect = () => {
    printServer = new WebSocket(NGROK_URL);

    printServer.on("open", () => {
      console.log("Connected to the print server!");
      isReconnecting = false; // Reset flag when connected
      attempt = 0; // reset backoff
    });

    printServer.on("error", (err) => {
      console.error("Print server connection error:", err);
      isReconnecting = false;
      attempt += 1;
      connectToPrintServer();
    });

    printServer.on("close", () => {
      console.warn("Print server connection closed. Reconnecting...");
      isReconnecting = false;
      attempt += 1;
      connectToPrintServer();
    });
  };

  setTimeout(doConnect, attempt === 0 ? 0 : nextDelay);
}

// Start the connection process
connectToPrintServer();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.send("Greetings to Unreal Engine!");

  // Handle incoming messages
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    console.log("Here are the clients:");
    console.log(clients.size);

    const messageStr = message.toString();

    // Forward print command to the Local Print Server
    if (messageStr.startsWith("PRINT:")) {
      console.log("Forwarding print command...");
      if (printServer && printServer.readyState === WebSocket.OPEN) {
        printServer.send(messageStr);
      } else {
        console.error("Print server is not connected. Retrying...");
        connectToPrintServer();
      }
    }

    // Broadcast only control messages to all clients
    const isControl =
      messageStr.startsWith("Load ") ||
      messageStr.startsWith("PRINT:") ||
      messageStr === "CLOSING SOCKET";

    if (isControl) {
      for (const client of clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      }
    }
  });

  // Remove client on disconnect
  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

console.log("WebSocket server is running!");
