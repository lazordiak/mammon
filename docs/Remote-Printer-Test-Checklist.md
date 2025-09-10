### Friend setup (ngrok + printer box)

- **Prereqs**

  - **Node**: v18+ installed.
  - **Thermal printer**: plugged in and powered.
  - **ngrok auth**: your account’s authtoken (or collaborator access).

- **One-time (if not already)**

  - Install ngrok (download installer from ngrok).
  - Set the authtoken (same account that owns the domain):
    ```bash
    ngrok config add-authtoken YOUR_TOKEN
    ```

- **Each time you run the show**

  - Start the local printer app:
    ```bash
    cd C:\Users\lazor\NewCode\mammon\localServer
    npm i
    node index.js
    ```
  - Start ngrok on the reserved domain (TLS/WSS):
    ```bash
    ngrok http --domain=sky.ngrok.dev 8081
    ```
  - Verify ngrok shows: `Forwarding https://sky.ngrok.dev -> http://localhost:8081`
  - Leave both windows open.

- **On the show manager side (already set/confirm)**
  - Backend env `NGROK_URL = wss://sky.ngrok.dev` (Render).
  - Projection open full‑screen: `https://mammon-exe.vercel.app/projection`.
  - Altar and regular chat links (with `?key=gratis_is_good`).

---

### Test checklist (live end‑to‑end)

- **Basic connectivity**

  - ngrok shows the Forwarding line.
  - Render logs show “Connected to the print server!” after starting ngrok + printer app (restart backend if needed).

- **Stage control**

  - Open an altar link (includes `&altar=true`) for Luxior.
  - Projection switches within seconds (receives `Load Luxior`).
  - Chat end sends `CLOSING SOCKET`; projection returns to idle.

- **Conversation overlays (projection)**

  - God (assistant) messages appear on the left; supplicant on the right.
  - The latest message replaces the previous one on its side (no stacking).
  - Bubbles are ~60% width, ~70% opacity, deity fonts/colors applied.
  - Soft fade/float animation is visible.

- **Printing (altar only)**

  - Complete the 4‑message chat.
  - Printer outputs a “judgment” for the selected deity.
  - Test both “worthy” and “unworthy” endings.

- **Regular links don’t control stage**

  - Open a non‑altar link (no `&altar=true`).
  - Projection remains idle; chat works; no print.

- **Reconnect behavior**
  - Stop ngrok; backend logs show reconnect attempts.
  - Start ngrok again; backend should reconnect automatically.
  - Optionally restart the local printer app and confirm reconnect.

---

### Quick troubleshooting

- **Projection didn’t switch**

  - Ensure altar link has `?key=gratis_is_good&altar=true`.
  - Refresh the projection page and retry.

- **No “Connected to the print server!”**

  - Confirm ngrok forwarding is active to `http://localhost:8081`.
  - Confirm `node index.js` is running in `localServer`.
  - Restart the backend on Render (env `NGROK_URL` should be `wss://sky.ngrok.dev`).

- **No print**
  - Expected if using a regular link (no altar).
  - For altar: ensure you reach the final step of the chat.

---

### Optional local sanity test (doesn’t touch live)

- Projection mock: open `https://mammon-exe.vercel.app/projection?mock=1` to preview left/right overlays and timing without affecting live behavior.
