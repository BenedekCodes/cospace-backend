require('dotenv').config();

import app from "./app";

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

export default app;
