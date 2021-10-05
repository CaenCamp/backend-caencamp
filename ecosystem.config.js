module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./apps/api",
      script: "./src/index.js",
      watch: ["./src"],
    },
    {
      name: "admin",
      cwd: "./apps/admin",
      script: "npm start",
      watch: ["./src"],
      exec_mode: "fork_mode",
    },
  ],
};
