module.exports = {
  apps: [
    {
      name: "tp-sms", // Name of your application
      script: "index.js", // Your main server file (change if necessary)
      instances: "max", // Run as many instances as CPU cores
      exec_mode: "cluster", // Enable multi-threading for performance
      autorestart: true, // Restart on crash
      watch: false, // Disable file watching (handled by CI/CD)
      max_memory_restart: "1G", // Restart if memory usage exceeds 1GB
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
