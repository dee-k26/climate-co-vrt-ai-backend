const express = require("express");
const cors = require("cors");
require("dotenv").config();

const diagnoseAI = require("./routes/diagnoseAI");
const sendToTech = require("./routes/sendToTech");
const contactForm = require("./routes/contactForm");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", diagnoseAI);
app.use("/api", sendToTech);
app.use("/api", contactForm);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
