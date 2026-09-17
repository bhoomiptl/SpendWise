const express = require("express");
const app = express();
const PORT = 5000;
app.get("/", (req, res) => {
    res.send("SpendWise API is running!");
});
app.listen(PORT, () => {
    console.log(`SpendWise server running on http://localhost:${PORT}`);
});