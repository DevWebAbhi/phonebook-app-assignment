const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const { contactRouter } = require("./contact");
const { avaliabilityRouter } = require("./avalability");

const app = express();
const PORT = process.env.PORT || 3005;


app.use(express.json());  
app.use(cors());         


app.get("/", (req, res) => {
    return res.status(200).send({ message: "This is PHONEBOOK backend" });
});

app.use("/contact",contactRouter);

app.use("/avalivility",avaliabilityRouter);

app.listen(PORT, async () => {
    try {
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.error("Failed to start the server due to database connection issues");
        process.exit(1);  
    }
});
