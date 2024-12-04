const { defineConfig } = require("cypress");
const { spawn } = require("child_process");
let server;
let baseUrl;

module.exports = defineConfig({
  e2e: {
    baseUrl: baseUrl || "http://localhost:5050", // Default to localhost if baseUrl is not set
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);

      on("task", {
        startServer() {
          return new Promise((resolve, reject) => {
            // Check if the server is already running
            if (server) {
              console.log(
                "Server already running, returning base URL:",
                baseUrl
              );
              resolve(baseUrl); // Return the base URL if server is already running
              return;
            }

            // Start the server
            console.log("Starting the server...");
            server = spawn("node", ["-r", "nyc", "index-test.js"]);

            server.stdout.on("data", (data) => {
              const output = data.toString();
              console.log("Server stdout:", output); // Log the output for debugging

              // Check if the server is ready and the base URL is printed
              if (output.includes("Student Management System is running at:")) {
                const baseUrlPrefix =
                  "Student Management System is running at: ";
                const startIndex = output.indexOf(baseUrlPrefix);
                if (startIndex !== -1) {
                  baseUrl = output
                    .substring(startIndex + baseUrlPrefix.length)
                    .trim();
                  console.log("Base URL extracted:", baseUrl);

                  // Add a delay to make sure the server is fully started before resolving
                  setTimeout(() => {
                    console.log("Server is fully ready, resolving base URL");
                    resolve(baseUrl);
                  }, 3000); // 3-second delay to ensure the server is ready
                }
              }
            });

            server.stderr.on("data", (data) => {
              console.error("Server stderr:", data.toString()); // Log errors
              reject(data); // Reject on error
            });

            server.on("exit", (code) => {
              if (code !== 0) {
                console.error(`Server process exited with code ${code}`);
              }
            });
          });
        },

        stopServer() {
          if (server) {
            console.log("Stopping the server...");
            server.kill(); // Kill the server process
          }
          return null;
        },
      });

      return config;
    },
  },
});
