# The Mammon Show — Simple, Non‑Technical Guide

This guide explains how to run and test the experience without touching code. Think of this like a small theater show:

- The projector laptop is the stage.
- The videos of the gods are the actors.
- A special link on a phone (the “altar” link) is the stage manager’s whistle: it both starts a short god‑chat and tells the stage which god to show.
- Other links (regular links) let people chat too, but they don’t change the stage.
- Optional: a small receipt printer can print a “divine judgment” at the end of an altar chat.

You don’t need to program anything. Just follow the steps.

---

## What you do and don’t need

- Already online (nothing for you to install):

  - The chat website (frontend)
  - The “helper” on the internet that passes simple messages (backend)
  - The page that plays the god videos on the projector (projection page)

- Only needed if you want printing (optional):
  - The thermal printer connected to your laptop
  - A small printer app and “ngrok” (explained later)

---

## Important: you must use a link with a special “key”

To get into the experience, the link must include a security key in the address. It will look like this:

```
?key=gratis_is_good
```

If you forget it, the page shows “YOU ARE JUDGED UNWORTHY.”

The site is: `https://mammon-exe.vercel.app`

We’ll give you full links to copy/paste below.

---

## The parts (in plain language)

- Stage (projector laptop): a web page that plays the correct god video when asked, and shows “MAMMON.EXE” when idle.
- Altar link (special): starts a chat and switches the stage to that god’s video.
- Regular links: start chats but do NOT change the stage and do NOT print.
- Internet helper: quietly forwards “play/stop” messages to the stage.
- Optional ticket printer: prints a short “judgment” at the end of an altar chat.

---

## Links you will use (copy/paste)

Open these directly in a browser. No QR codes are required.

- Stage page (open on the projector laptop):

  - `https://mammon-exe.vercel.app/projection`

- Altar links (these change the stage and can print):

  - Luxior: `https://mammon-exe.vercel.app/?key=gratis_is_good&god=Luxior&altar=true`
  - Gratis: `https://mammon-exe.vercel.app/?key=gratis_is_good&god=Gratis&altar=true`
  - Haffof: `https://mammon-exe.vercel.app/?key=gratis_is_good&god=Haffof&altar=true`

- Regular links (chat only; do not change the stage):
  - Luxior: `https://mammon-exe.vercel.app/?key=gratis_is_good&god=Luxior`
  - Gratis: `https://mammon-exe.vercel.app/?key=gratis_is_good&god=Gratis`
  - Haffof: `https://mammon-exe.vercel.app/?key=gratis_is_good&god=Haffof`

---

## Set up the stage (projector laptop)

1. Open Chrome or Edge on the laptop connected to the projector.
2. Go to: `https://mammon-exe.vercel.app/projection`.
3. Make the browser full‑screen (press F11 on Windows).
4. You should see a big title: “MAMMON.EXE”. That means the stage is ready.

Leave this page open full‑screen.

---

## How the show works during the event

- When someone opens an **altar link** on their phone, a god’s chat begins and the stage switches to that god’s video a few seconds later.
- The chat is short (about four messages). When it ends—or if they simply close the browser tab—the stage returns to “MAMMON.EXE”.
- People can also open **regular links** to chat; those do not change the stage and do not print.

---

## Quick rehearsal (10 minutes)

1. Stage: On the projector laptop, open `https://mammon-exe.vercel.app/projection` (full‑screen). Confirm “MAMMON.EXE” is showing.
2. Altar: On your phone, open an altar link (for example Luxior). The stage should switch to the Luxior video within a few seconds.
3. Tap the “TRANSMIT PRAYER” button to complete the short conversation. When it ends, the stage should return to “MAMMON.EXE”.
4. Regular: On a different phone, open a regular link (no `altar=true`). The stage should NOT change, even though the chat works.

If those steps work, the core show is ready.

---

## Optional: ticket printer (the “souvenir”)

Only do this if you want the small printer to spit out a judgment at the end of an altar chat. If not, skip this section—everything else still works.

Imagine the printer is a phone in the lobby. The internet helper needs a phone number to call it. A tool named **ngrok** gives the printer a temporary phone number. (If you later pay for a “reserved” number, it never changes.)

### What you do for printing

- Plug in the thermal printer to your laptop.
- Start the little printer app.
- Start ngrok to get the temporary address (the phone number).
- Send that address to the person managing the show so they can paste it into the internet helper.

Once they paste it in, altar chats will print a short “judgment” at the end.

### Steps for printing

1. Start the printer app on the laptop:

   - Open Command Prompt.
   - Type:
     - `cd C:\Users\lazor\NewCode\mammon\localServer`
     - `npm i`
     - `node index.js`
   - Leave this window open.

2. Start ngrok to get the temporary address:

   - Install ngrok from ngrok.com (one‑time), then sign in by running:
     - `ngrok config add-authtoken YOUR_TOKEN`
   - Start the tunnel:
     - `ngrok tcp 8081`
   - It will show an address like: `7.tcp.ngrok.io:20823`.
   - Send that text to the person managing the show.

3. The show manager pastes that into the internet helper and confirms it’s set.
4. Test an altar chat; at the end, the printer should print a “judgment”.

Tip: with a paid ngrok “reserved address,” the address never changes—you set it once and skip sending a new address each time.

---

## Troubleshooting (simple checks)

- Stage doesn’t change after opening an altar link:

  - Make sure the stage page is still open and full‑screen on the projector laptop.
  - Close the altar browser tab and try again.
  - Refresh the stage page and try again.

- Stage doesn’t return to “MAMMON.EXE” after the chat:

  - Close the altar browser tab; wait 1–2 seconds.
  - Refresh the stage page; it should show “MAMMON.EXE”.

- Printing doesn’t happen:

  - That’s normal if you didn’t do the printer steps.
  - If you did them: confirm the printer app is running, ngrok shows an address, and the show manager pasted that address into the helper.

- Nothing loads on the stage page:
  - Check the laptop’s internet connection.
  - Close and re‑open the browser.
  - Make sure you typed the link correctly.

---

## What’s happening (explained without tech words)

- The altar link is a special remote: it starts the chat and tells the stage which god to play.
- Regular links are normal remotes: they chat but don’t control the stage.
- The internet helper quietly forwards these “play/stop” notes to the stage.
- The printer (optional) is like a souvenir machine the helper calls at the end of an altar chat.

---

## Share or print this guide

- Email this file directly.
- To make a PDF: open this page in a browser, press Ctrl+P (Windows), choose “Save as PDF.”

---

### Appendix — For the show manager (not required for the runner)

- Stage page listens for “Load Luxior/Gratis/Haffof” and “CLOSING SOCKET”.
- The site requires `?key=gratis_is_good` to enter.
- Printing requires setting `NGROK_URL` on the backend to `ws://HOST:PORT` from ngrok, or to a reserved address.

