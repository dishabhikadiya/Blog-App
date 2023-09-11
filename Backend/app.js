const express = require("express");
const cors = require("cors");
const app = express();
const user = require("./Routes/userRoute");
app.use(express.json());
app.use(cors());
app.use("/api", user);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
