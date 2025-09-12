// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSocket = require("ws");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const http = require("http");

// Create an HTTP server and attach a WebSocket server (required for Render WS upgrades)
const server = http.createServer((req, res) => {
  // Basic OK response for health checks
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// Ngrok WebSocket URL (provided via Render environment variable)
const NGROK_URL = process.env.NGROK_URL || "";
let printServer = null;
let isReconnecting = false; // Flag to track reconnect attempts
let attempt = 0; // reconnect backoff attempts

// Function to connect to the print server (with retry)
function connectToPrintServer() {
  if (!NGROK_URL) {
    console.warn("NGROK_URL is not set. Skipping print server connection.");
    return;
  }
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
    // Throttle log noise: log every 10th attempt
    if (attempt % 10 === 0) {
      console.log(
        `Reconnecting to print server (attempt ${attempt}) in ${nextDelay}ms...`
      );
    }
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
  console.log(`WS client connected. Total clients: ${clients.size}`);
  ws.send("Greetings to Unreal Engine!");

  // Heartbeat: ping every 30s, disconnect if no pong within 35s
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  const pingInterval = setInterval(() => {
    if (ws.isAlive === false) {
      console.log("WS client failed heartbeat, terminating");
      ws.terminate();
      return;
    }
    ws.isAlive = false;
    ws.ping();
  }, 30000);

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
      messageStr.startsWith("MSG:USER:") ||
      messageStr.startsWith("MSG:ASSISTANT:") ||
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
    console.log("WS client disconnected");
    clients.delete(ws);
    clearInterval(pingInterval);
    console.log(`Remaining clients: ${clients.size}`);
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 10000;
server.listen(PORT, () => {
  console.log(`HTTP+WS server listening on ${PORT}`);
});
