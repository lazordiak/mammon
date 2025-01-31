// eslint-disable-next-line
const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 10000 });

// Replace with your computer's IP address
const printServer = new WebSocket("ws://7.tcp.ngrok.io:20823");

console.log("Print server: ", printServer.OPEN);

// Store connected clients
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.send("Greetings to Unreal Engine!");

  // Handle incoming messages
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    console.log("here are the clients");
    console.log(clients.size);

    // Forward print command to the Local Print Server
    if (messageStr.startsWith("PRINT:")) {
      console.log("Forwarding print command...");
      printServer.send(messageStr); // Send directly to local printer server
    }

    const messageStr = message.toString();
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
