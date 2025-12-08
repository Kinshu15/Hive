const { connectDB } = require("./db");

console.log("Attempting to load db module...");

try {
  connectDB().then(() => {
    console.log("connectDB promise resolved (or started)");
    // We don't want to keep the process alive
    process.exit(0);
  }).catch(err => {
    console.error("connectDB failed:", err);
    process.exit(1);
  });
} catch (err) {
  console.error("Synchronous error:", err);
  process.exit(1);
}
