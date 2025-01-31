// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 10000 });

// Store connected clients
const clients = new Set();

// Ngrok WebSocket URL (Replace with your actual ngrok TCP address)
const NGROK_URL = "ws://7.tcp.ngrok.io:20823";
let printServer = null;

// Function to connect to the print server (with retry)
function connectToPrintServer() {
  console.log("Attempting to connect to the print server...");
  printServer = new WebSocket(NGROK_URL);

  printServer.on("open", () => {
    console.log("Connected to the print server!");
  });

  printServer.on("error", (err) => {
    console.error("Print server connection error:", err);
    setTimeout(connectToPrintServer, 5000); // Retry after 5 seconds
  });

  printServer.on("close", () => {
    console.warn("Print server connection closed. Reconnecting...");
    setTimeout(connectToPrintServer, 5000); // Retry after 5 seconds
  });
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

    // Broadcast the message to all clients (including Unreal Engine)
    for (const client of clients) {
      console.log(client.OPEN === client.readyState);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
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
