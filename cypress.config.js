const { defineConfig } = require("cypress");
const { spawn } = require("child_process");
let server;
let baseUrl;
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      on("task", {
        startServer() {
          return new Promise((resolve, reject) => {
            // Check if the server is already running
            if (server) {
              resolve(baseUrl);
              return;
            }
            server = spawn("node", ["-r", "nyc", "index-test.js"]);
            server.stdout.on("data", (data) => {
              const output = data.toString();
              console.log(output);
              if (output.includes("Student Management System is running at")) {
                baseUrl = "http://localhost:5050/";
                resolve(baseUrl);
              }
            });
            server.stderr.on("data", (data) => {
              reject(data);
            });
          });
        },
        stopServer() {
          if (server) {
            server.kill();
          }
          return null;
        },
      });
      return config;
    },
  },
});
