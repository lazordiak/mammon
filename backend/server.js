// eslint-disable-next-line
const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 10000 });

// Store connected clients
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.send("Greetings to Unreal Engine!");

  // Handle incoming messages
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    console.log("here are the clients");

    // Broadcast the message to all clients (including Unreal Engine)
    for (const client of clients) {
      console.log(client);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
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
