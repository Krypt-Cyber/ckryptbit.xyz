import JSZip from 'jszip';

const sanitizeProjectName = (name: string): string => {
  return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '') || 'ckryptbit_project';
};

const getPackageJsonContent = (projectName: string): string => {
  const sanitizedName = sanitizeProjectName(projectName).toLowerCase();
  return JSON.stringify({
    name: `${sanitizedName}-offline-portal`,
    version: "4.20.3", // Sync with bash script version
    description: `Offline Cybersecurity Portal package for ${projectName}`,
    main: "server.js",
    scripts: {
      "start": "node server.js",
      "install-deps": "npm install"
    },
    dependencies: {
      "express": "^4.18.2" 
    }
  }, null, 2);
};

const getServerJsContent = (projectName: string): string => {
  const sanitizedName = sanitizeProjectName(projectName);
  return `// server.js for ${sanitizedName} offline Cybersecurity Portal
const express = require('express');
const path = require('path');
const fs = require('fs'); // To check if admin dashboard exists
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: Mock Generate Secure Access Key (VPN Key)
app.post('/api/generate-vpn-key', (req, res) => {
    console.log('Received request for VPN key generation for user:', req.body.username);
    // Simple mock key generation
    const key = Buffer.from(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toString('base64');
    // In a real scenario, you might associate this key with the username or store it.
    // For this mock, we just return it.
    // The bash script's frontend expected 'download.ovpn' and 'download.wireguard' which are too complex for this mock.
    // We will return the key directly.
    res.json({ 
        success: true, 
        message: "Secure access key generated successfully.",
        accessKey: key,
        // Mock download links for thematic consistency if frontend tries to use them
        download: {
            ovpn: \`#mock-ovpn-config-for-\${req.body.username || 'user'}\`,
            wireguard: \`#mock-wg-config-for-\${req.body.username || 'user'}\`
        }
    });
});

// Adminpanel – only accessible via .onion (simulated check)
app.get('/admin', (req, res) => {
    const host = req.headers.host;
    // Simulate Tor .onion check. In a real setup, Tor handles this.
    // For local testing, this check will likely always fail unless you manually edit /etc/hosts or use a proxy.
    if (!host || !host.toLowerCase().includes('.onion')) {
        console.warn(\`Admin panel access attempt from non-onion host: \${host}\`);
        return res.status(403).send(
          '<h1><span style="color: red;">&#128683;</span> FORBIDDEN</h1><p>Admin Panel access is restricted to .onion network.</p><p>Current host: '+ host +'</p><style>body{font-family:monospace; background:#111; color:#ccc;} h1{color:red;}</style>'
        );
    }
    const adminDashboardPath = path.join(__dirname, 'public', 'admin-dashboard.html');
    if (fs.existsSync(adminDashboardPath)) {
        res.sendFile(adminDashboardPath);
    } else {
        res.status(404).send('Admin dashboard not found.');
    }
});

// Mock API endpoint for system status (from original generator)
app.get('/api/status', (req, res) => {
  res.json({
    portalName: '${sanitizedName}',
    status: 'Secure Connection Nominal',
    timestamp: new Date().toISOString(),
    message: 'All systems operational. Offline portal mode active.'
  });
});

// Serve the main HTML file for any other GET requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(\`Offline Cybersecurity Portal server for '${sanitizedName}' running on http://localhost:\${PORT}\`);
  console.log('API - Status: http://localhost:\${PORT}/api/status');
  console.log('API - Generate VPN Key (POST): http://localhost:\${PORT}/api/generate-vpn-key');
  console.log('Portal Frontend: http://localhost:\${PORT}/');
  console.log('Admin Panel (Simulated Tor-only): Try accessing /admin (will likely be forbidden locally unless host is manipulated to include .onion)');
});
`;
};

const getPortalIndexHtmlContent = (projectName: string): string => {
  const sanitizedName = sanitizeProjectName(projectName);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sanitizedName} - Offline Portal</title>
  <style>
    body { font-family: 'Courier New', Courier, monospace; background-color: #000000; color: #00ff00; padding: 2em; line-height: 1.6; }
    .container { border: 1px solid #00cc00; padding: 20px 30px; border-radius: 5px; background-color: #111111; box-shadow: 0 0 15px rgba(0, 255, 0, 0.4); max-width: 700px; margin: 2em auto; }
    h1 { color: #ff3366; margin-bottom: 0.5em; text-shadow: 0 0 7px #ff3366; font-size: 1.8em; text-align:center; }
    h2 { color: #00ffff; margin-top: 1.5em; margin-bottom: 0.5em; font-size: 1.3em; border-bottom: 1px dashed #00ffff44; padding-bottom: 0.2em;}
    p { margin-bottom: 1em; color: #00cc00; font-size: 0.95em; }
    label { display: block; margin-bottom: 0.3em; font-size: 0.9em; color: #00ffff; }
    input[type="text"] { background-color: #222; border: 1px solid #009900; color: #00ff00; padding: 8px; margin-bottom: 10px; width: calc(100% - 18px); font-family: inherit; border-radius: 3px; }
    input[type="text"]:focus { outline: none; border-color: #00ff00; box-shadow: 0 0 8px #00ff00aa; }
    .button { display: inline-block; margin-top: 0.5em; padding: 0.6em 1.2em; background: #1a1a1a; border: 1px solid #00ff99; color: #00ff99; cursor: pointer; text-decoration: none; font-family: inherit; text-transform: uppercase; transition: background-color 0.2s, box-shadow 0.2s; font-weight: bold; border-radius: 3px; }
    .button:hover { background: #00ff99; color: #111; box-shadow: 0 0 10px #00ff99; }
    .button:active { transform: scale(0.98); }
    pre { background-color: #0a0a0a; border: 1px dashed #009900; padding: 15px; text-align: left; white-space: pre-wrap; word-wrap: break-word; max-width: 100%; overflow-x: auto; margin: 1em 0; color: #00dd00; font-size: 0.9em; border-radius: 3px; min-height: 50px; }
    #status-output { font-size: 0.8em; }
  </style>
</head>
<body>
  <div class="container">
    <h1>&#128672; ${sanitizedName} - Secure Offline Portal &#128672;</h1>
    <p>This is a self-contained offline instance. All systems are isolated and operating under secure protocols.</p>

    <h2>Secure Access Key Generation</h2>
    <label for="username">Operator Username:</label>
    <input type="text" id="username" placeholder="Enter your designated username">
    <button onclick="generateVpnKey()" class="button">&#128273; Generate Secure Access Key</button>
    <pre id="vpn-key-output">Awaiting key generation protocol...</pre>
    
    <h2>System Status Diagnostics</h2>
    <button onclick="fetchStatus()" class="button">Query System Status</button>
    <pre id="status-output">Awaiting system query...</pre>
  </div>

  <script>
    async function fetchStatus() {
      const outputElement = document.getElementById('status-output');
      outputElement.textContent = 'Querying system diagnostics...';
      try {
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error(\`Network response error: \${response.status} - \${response.statusText}\`);
        const data = await response.json();
        outputElement.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        console.error('Fetch status error:', error);
        outputElement.textContent = \`Error fetching status: \${error.message}\\nIs the local server running? (node server.js)\`;
      }
    }

    async function generateVpnKey() {
      const usernameInput = document.getElementById('username');
      const outputElement = document.getElementById('vpn-key-output');
      const username = usernameInput.value.trim();

      if (!username) {
        outputElement.textContent = "ERROR: Username is required for key generation protocol.";
        alert("Please enter a username.");
        return;
      }
      
      outputElement.textContent = 'Initiating secure key generation protocol for ' + username + '...';
      try {
        const response = await fetch('/api/generate-vpn-key', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username })
        });
        if (!response.ok) throw new Error(\`API error: \${response.status} - \${response.statusText}\`);
        const data = await response.json();

        if (data.success && data.accessKey) {
          outputElement.innerHTML = \`
    ✔️ Secure Access Key Generated for Operator: \${username}
    --------------------------------------------------
    Access Key: \${data.accessKey}
    --------------------------------------------------
    Message: \${data.message || ''}
    Timestamp: \${new Date().toISOString()}
    
    (Note: Mock download links below are for thematic consistency)
    Mock OpenVPN Data: <a href="#" onclick="alert('Mock OVPN: '+ data.download.ovpn); return false;">Show OVPN Data</a>
    Mock WireGuard Data: <a href="#" onclick="alert('Mock WG: '+ data.download.wireguard); return false;">Show WG Data</a>
          \`;
        } else {
          outputElement.textContent = "❌ Key Generation Failed: " + (data.message || "Unknown API error during key generation.");
        }
      } catch (error) {
        console.error('Generate VPN key error:', error);
        outputElement.textContent = \`Error generating key: \${error.message}\`;
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('status-output').textContent = "Ready. Click 'Query System Status' to check local server.";
        document.getElementById('vpn-key-output').textContent = "Enter username and click 'Generate Secure Access Key'.";
    });
  </script>
</body>
</html>
`;
};

const getAdminDashboardHtmlContent = (): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>&#128274; DAMAGE INC. Adminpanel</title>
  <style>
    body { background: #000; color: #fff; font-family: monospace; padding: 2em; text-align: center;}
    h1 { color: #ff0033; text-shadow: 0 0 8px #ff0033; }
    p { color: #ccc; }
    code { background: #222; padding: 2px 5px; border-radius: 3px; border: 1px solid #444; color: #ffaa00;}
    .warning { color: #ffaa00; border: 1px dashed #ffaa00; padding: 1em; margin-top: 2em; display: inline-block;}
  </style>
</head>
<body>
  <h1>&#128274; SECURE ADMIN PANEL</h1>
  <p>Access to this panel is restricted and logged. For authorized personnel only.</p>
  <p>Current Host (simulated): <code id="host-display">Fetching...</code></p>
  <p class="warning">This is a MOCK admin panel for the offline package. Functionality is illustrative.</p>
  <script>
    document.getElementById('host-display').textContent = window.location.host || 'Unknown (likely not .onion)';
    // Add any mock admin functionality here via JS if needed
  </script>
</body>
</html>
`;
};

const getReadmeContent = (projectName: string): string => {
  const sanitizedName = sanitizeProjectName(projectName);
  return `# ${projectName} - Offline Cybersecurity Portal Package (v4.20.3)

This package contains a simplified, self-contained "Cybersecurity Portal" based on ${projectName}.

## Features
- Express.js backend server.
- Static HTML/CSS/JS frontend portal.
- Mock API for system status (\`/api/status\`).
- Mock API for Secure Access Key generation (\`/api/generate-vpn-key\`).
- Mock Admin Panel at \`/admin\` (simulated .onion access restriction).

## Prerequisites
- Node.js and npm (or yarn) installed.

## Running the Offline Portal

1.  **Extract the ZIP archive.**
2.  **Navigate to the extracted directory in your terminal:**
    \`\`\`bash
    cd path/to/${sanitizedName}-offline-portal
    \`\`\`
3.  **Install dependencies:**
    \`\`\`bash
    npm run install-deps
    # or npm install
    \`\`\`
4.  **Start the server:**
    \`\`\`bash
    npm start
    # or node server.js
    \`\`\`
5.  Open your browser and go to \`http://localhost:3000\` to access the main portal.
6.  To (attempt to) access the admin panel, you would typically need to be on a Tor network browsing to a .onion address. For local simulation, the server checks if the host header contains ".onion". You can try navigating to \`http://some-test.onion:3000/admin\` after modifying your system's hosts file to point \`some-test.onion\` to \`127.0.0.1\`, or expect a 403 Forbidden error.

## Files Included
- \`package.json\`: Project dependencies and scripts.
- \`server.js\`: The Express.js server logic.
- \`public/\`: Contains static assets:
    - \`index.html\`: The main portal frontend.
    - \`admin-dashboard.html\`: The mock admin panel frontend.
- \`README.md\`: This file.

---
Generated by Projekt Ckryptbit. Handle with discretion.
`;
};


export const generateOfflinePackage = async (projectName: string, _blueprintFiles: any[]): Promise<void> => {
  const sanitizedName = sanitizeProjectName(projectName);
  const zip = new JSZip();

  zip.file("package.json", getPackageJsonContent(projectName));
  zip.file("server.js", getServerJsContent(projectName));
  zip.file("README.md", getReadmeContent(projectName));
  
  const publicFolder = zip.folder("public");
  if (publicFolder) {
    publicFolder.file("index.html", getPortalIndexHtmlContent(projectName));
    publicFolder.file("admin-dashboard.html", getAdminDashboardHtmlContent());
  } else {
    // Fallback if folder creation fails, though unlikely with JSZip
    zip.file("public/index.html", getPortalIndexHtmlContent(projectName));
    zip.file("public/admin-dashboard.html", getAdminDashboardHtmlContent());
  }

  try {
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${sanitizedName}_offline_portal_v4.20.3.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error generating ZIP file:", error);
    throw new Error("Failed to generate ZIP file for offline package.");
  }
};
