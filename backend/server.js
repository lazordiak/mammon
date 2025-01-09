import WebSocket from "ws";

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Store connected clients
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("New client connected");
  clients.add(ws);

  // Handle incoming messages
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    // Broadcast the message to all clients (including Unreal Engine)
    for (const client of clients) {
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

console.log("WebSocket server is running on ws://localhost:8080");
