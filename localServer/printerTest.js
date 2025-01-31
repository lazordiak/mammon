// eslint-disable-next-line @typescript-eslint/no-require-imports
const escpos = require("escpos");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const usb = require("escpos-usb");

// Replace with your actual printer's Vendor ID & Product ID
const device = new usb(0x0485, 0x5741);
const printer = new escpos.Printer(device);

device.open((err) => {
  if (err) {
    console.error("Failed to open printer:", err);
    return;
  }

  // Print "DIVINE COMMANDMENT" in large text, centered
  printer.align("ct").size(2, 2).text("DIVINE COMMANDMENT").newLine();

  // Print the commandment text
  printer
    .align("lt")
    .size(1, 1)
    .text("Thou shalt always seek the best deals and never pay full price.")
    .newLine()
    .newLine();

  // Print "GOD HAS SPOKEN" in large text, centered
  printer.align("ct").size(2, 2).text("GOD HAS SPOKEN").newLine();

  // Cut the paper (if supported)
  printer.cut();

  // Close the connection
  printer.close();
});
