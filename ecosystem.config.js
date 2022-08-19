module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./apps/api",
      script: "./src/index.js",
      watch: ["./apps/api", "./src", "./openapi"],
    },
    {
      name: "admin",
      cwd: "./apps/admin",
      script: "npm start",
      exec_mode: "fork_mode",
    },
  ],
};
