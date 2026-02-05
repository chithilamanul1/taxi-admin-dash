# Deploying Discord Bot to Google Cloud Platform (GCP) ☁️

Since Vercel is serverless, it cannot run the Discord Bot 24/7. We will use a **Google Compute Engine (VM)** to host the bot process using your Free Trial.

## Phase 1: Create a VM Instance

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **Compute Engine** > **VM Instances**.
3. Click **Create Instance**.
4. **Name**: `taxi-discord-bot`
5. **Region**: Choose one close to you (e.g., `asia-south1` or `us-central1`).
6. **Machine Type**: `e2-micro` (This is usually free/very cheap and enough for a bot).
7. **Boot Disk**: Change to **Ubuntu 22.04 LTS** (Standard Persistent Disk 10GB is fine).
8. **Firewall**: Check "Allow HTTP traffic" and "Allow HTTPS traffic".
9. Click **Create**.

## Phase 2: Setup the Server

1. Once the instance is running, click the **SSH** button (Connect) next to it in the console.
2. A terminal window will open. Run the following commands to install Node.js and Git:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 or v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager to keep bot alive)
sudo npm install -g pm2

# Verify installation
node -v
pm2 -v
```

## Phase 3: Deploy the Code

1. Clone your repository (You might need to use a Personal Access Token or HTTPS).
    *Tip: If your repo is set to Private, generate a GitHub Token (Settings > Developer Settings > Tokens) and use it in the URL.*

```bash
# Clone the repository
git clone https://github.com/chithilamanul1/taxi-admin-dash.git
cd taxi-admin-dash

# Install dependencies
npm install
```

## Phase 4: Configure Environment Variables

1. You need to create the `.env` file for the server.

```bash
# Create and edit .env file
nano server/.env
```

1. Paste your environment variables into the editor. **Make sure to include these:**

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
DISCORD_BOT_TOKEN=your_discord_bot_token_here
PUSHER_APP_ID=your_pusher_app_id
PUSHER_SECRET=your_pusher_secret
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
```

*(Press `Ctrl+X`, then `Y`, then `Enter` to save and exit)*

## Phase 5: Start the Bot

1. Start the server with PM2 so it runs in the background.

```bash
# Start the server using the npm script
pm2 start npm --name "discord-bot" -- run server

# Save the process list so it restarts on reboot
pm2 save
pm2 startup
```

*(Run the command `pm2 startup` gives you via copy-paste)*

## Verification

* Run `pm2 logs discord-bot` to see the console output.
* You should see `[Bot] Logged in as ...` and `Server running on port 5000`.
* Your bot is now ONLINE! 🤖

## Updating

If you push changes to GitHub, just do:

```bash
cd taxi-admin-dash
git pull
npm install
pm2 restart discord-bot
```
