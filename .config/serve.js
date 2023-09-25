// Requirements...
require('dotenv').config();
const execSync = require('child_process').execSync;
const path = require("path");

// Start the server with: shopify theme dev --store={$STORE}
const cmd = `shopify theme dev --store=${process.env.STORE}`;

// Execute the command synchronously
execSync(cmd, { stdio: [0, 1, 2] });
