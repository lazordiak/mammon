## Local Printer Test (Windows) — Step‑by‑Step Guide (for non‑technical users)

Follow these steps to run the project locally and print to the thermal printer connected to your computer. You do not need to write code. Just copy/paste the commands into a Command Prompt window.

### What you will do
- Install the correct Node version (using NVM for Windows)
- Start the local printer service
- Start the backend service
- Start the website locally and click the print action

Nothing permanent will be changed. You’re on a temporary branch made just for this test.

---

### Before you start
- You have the thermal printer connected to USB and powered on
- Zadig driver is already set (WinUSB/libusbK) for the printer — already done
- You have Git installed (if not, install from `https://git-scm.com/download/win`)

---

### 1) Install NVM for Windows (Node Version Manager)
1. Download the NVM for Windows installer: `https://github.com/coreybutler/nvm-windows/releases`
   - Find the latest release and download `nvm-setup.exe`.
2. Run the installer. Use the default options.
3. Open a new Command Prompt (Start → type “cmd” → Enter).
4. Install and use Node 18:
```
nvm install 18.19.1
nvm use 18.19.1
node -v
```
You should see something like `v18.19.1`.

If `node -v` shows a different number, run `nvm use 18.19.1` again.

---

### 2) Install build tools (needed for the USB module)
These help the printer driver library compile if needed.
1. Install Visual Studio Build Tools: `https://aka.ms/vs/17/release/vs_BuildTools.exe`
   - When the installer opens, select “Desktop development with C++” and install.
2. Install Python 3 for Windows: `https://www.python.org/downloads/windows/`
   - During installation, check “Add python.exe to PATH”.
3. Close and reopen Command Prompt after installations.

You can verify:
```
python --version
```

---

### 3) Get the project and checkout the test branch
Open Command Prompt and run:
```
cd %USERPROFILE%\NewCode\mammon
git fetch --all
git checkout -f local-print-test
```

If you have local changes you want to discard (this deletes untracked files too — use with care):
```
git reset --hard
git clean -fd
git checkout -f local-print-test
```

---

### 4) Install dependencies
You’ll do three installs — one in each folder.

1) Local printer service
```
cd %USERPROFILE%\NewCode\mammon\localServer
npm install
```
If you see errors mentioning “usb” or “node-gyp”, run:
```
npm run rebuild-usb
```

2) Backend service
```
cd %USERPROFILE%\NewCode\mammon\backend
npm install
```

3) Frontend (website)
```
cd %USERPROFILE%\NewCode\mammon
npm install
```

---

### 5) Start the services (3 separate Command Prompt windows)
Allow any Windows Firewall prompts for “Node.js” on Private networks.

1) Start the local printer service (port 8081)
```
cd %USERPROFILE%\NewCode\mammon\localServer
npm start
```
You should see a message like “okee, its open”. Leave this window running.

2) Start the backend (port 10000)
```
cd %USERPROFILE%\NewCode\mammon\backend
node server.js
```
You should see “WebSocket server is running!” Leave this window running.

3) Start the website (port 3000)
```
cd %USERPROFILE%\NewCode\mammon
npm run dev
```
Open the site in your browser: `http://localhost:3000`

---

### 6) Test a print
- On the website, use the normal button/flow that triggers a print.
- Watch the two terminal windows:
  - Backend window should say: “Forwarding print command...”
  - Printer service window should say it printed. The printer should print.

If you don’t know where the print button is or just want to test the printer directly:
```
cd %USERPROFILE%\NewCode\mammon\localServer
node printerTest.js
```
This should immediately print a test receipt.

---

### 7) When you’re done
- To stop each service, focus its Command Prompt window and press Ctrl + C, then press Y if asked.
- Nothing permanent was changed. You’re on a temporary branch. To get back:
```
cd %USERPROFILE%\NewCode\mammon
git checkout seattle-branch
```

---

### Troubleshooting
- Node version isn’t 18: run `nvm use 18.19.1` again, then `node -v`.
- “usb” build or load errors: make sure Build Tools and Python are installed, then run `npm run rebuild-usb` inside the `localServer` folder.
- Port already in use (8081/10000/3000): close other apps using those ports or restart the computer, then start the services again.
- Printer still doesn’t print: confirm the USB cable is firmly connected and the printer is powered on. Run the direct test: `node printerTest.js`.
- Device not found: ensure Zadig driver is installed for your printer and that the Vendor ID/Product ID in `localServer/index.js` match your device.

---

### What changed in this test branch (for reference)
- Backend now prefers an environment variable for the print server URL and defaults to your local printer service:
  - `backend/server.js`: uses `process.env.NGROK_URL || "ws://localhost:8081"`.
- Local printer service has convenient scripts:
  - `localServer/package.json`: `npm start` and `npm run rebuild-usb`.
- This guide: `LOCAL_TEST_GUIDE_WINDOWS.md`.

You don’t need to modify any code to run the test.


