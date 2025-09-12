// eslint-disable-next-line @typescript-eslint/no-require-imports
const escpos = require("escpos");
// eslint-disable-next-line @typescript-eslint/no-require-imports
escpos.USB = require("escpos-usb");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSocket = require("ws");

// Replace with your actual printer's Vendor ID & Product ID
//const device = new usb(0x04b8, 0x0202);
const device = new escpos.USB(0x0485, 0x5741);

const printer = new escpos.Printer(device);

const wss = new WebSocket.Server({ port: 8081 });

console.log("okee, its open");

const haffofCommandment = [
  "Thou shalt never pay full price.",
  "Thou shalt never buy one when thou mayst buy two.",
  "Thou shalt never buy name brand.",
  "Thine time spent hunting for coupons is never wasted.",
  "Thou shalt not question why a bargain has come thy way, be grateful.",
];
const luxiorCommandment = [
  "Thy neighbors shall always know what thou art buying.",
  "Thou shalt never buy storebrand.",
  "Thou shalt always remember what thou paid.",
  "The health of thine wallet is never as important as the health of thy social media following.",
];
const gratisCommandment = [
  "Thou canst never have too much of a free thing.",
  "Tis better for a friend to forget your debt than for you to pay it.",
  "Thou shalt never buy what thou canst get for free.",
  "Thou shalt always take free samples, even if thou hast eaten.",
];
let isWorthy = `WORTHY`;
let god = ``;

wss.on("connection", (ws) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🖨️ Print client connected to WebSocket server.`);

  ws.on("message", (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 📨 Received print command: ${message}`);

    const stringMsg = message.toString();

    switch (stringMsg) {
      case "PRINT: Luxior good":
        console.log("PRINT: Luxior good");
        god = "LUXIOR";
        isWorthy = "WORTHY";
        break;
      case "PRINT: Haffof good":
        console.log("PRINT: Haffof good");
        god = "HAFFOF";
        isWorthy = "WORTHY";
        break;
      case "PRINT: Gratis good":
        console.log("PRINT: Gratis good");
        god = "GRATIS";
        isWorthy = "WORTHY";
        break;
      case "PRINT: Luxior bad":
        console.log("PRINT: Luxior bad");
        god = "LUXIOR";
        isWorthy = "UNWORTHY";
        break;
      case "PRINT: Haffof bad":
        console.log("PRINT: Haffof bad");
        god = "HAFFOF";
        isWorthy = "UNWORTHY";
        break;
      case "PRINT: Gratis bad":
        console.log("PRINT: Gratis bad");
        god = "GRATIS";
        isWorthy = "UNWORTHY";
        break;
      default:
        console.log("No match");
    }

    // Print only if the message contains a commandment
    // Always print after processing the command
    if (god) {
      printReceipt(god);
    }
  });

  ws.on("close", () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🖨️ Print client disconnected.`);
  });
});

// Function to print the receipt
function printReceipt(god) {
  device.open((err) => {
    if (err) {
      console.error("Printer error:", err);
      return;
    }

    const timestamp = new Date().toISOString();
    const printStartTime = Date.now();
    console.log(
      `[${timestamp}] 🎫 Starting print job for: ${god} (${isWorthy})`
    );

    try {
      let textToDisplay =
        god === "HAFFOF"
          ? haffofCommandment[
              Math.floor(Math.random() * haffofCommandment.length)
            ]
          : god === "LUXIOR"
          ? luxiorCommandment[
              Math.floor(Math.random() * luxiorCommandment.length)
            ]
          : gratisCommandment[
              Math.floor(Math.random() * gratisCommandment.length)
            ];

      console.log(`[${timestamp}] 📜 Selected commandment: "${textToDisplay}"`);

      printer.align("ct").size(2, 2).text(`${god}`);
      printer.align("ct").size(2, 2).text(`JUDGES YOU`);
      printer.align("ct").size(2, 2).text(`${isWorthy}`).newLine();
      printer
        .align("ct")
        .size(1, 1)
        .text(textToDisplay.toUpperCase())
        .newLine();
      printer.align("ct").size(2, 2).text("GO FORTH,");
      printer.align("ct").size(2, 2).text("CONSUME");

      const printDuration = Date.now() - printStartTime;
      const endTimestamp = new Date().toISOString();
      console.log(
        `[${endTimestamp}] ✅ Receipt printed successfully! ${god} ${isWorthy} - "${textToDisplay}" (${printDuration}ms)`
      );
      printer.cut();
      printer.close();
    } catch (err) {
      const errorTimestamp = new Date().toISOString();
      console.error(`[${errorTimestamp}] ❌ Printing error:`, err);
    }
  });
}
