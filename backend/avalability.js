const { executeQuery } = require("./dbConfig");
const express = require("express");
const avaliabilityRouter = express.Router();

const convertTo24Hour = (time) => {
  const [hour, minute, modifier] = time.split(/[:\s]/);
  let hours = parseInt(hour, 10);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0; // Midnight case (12 AM)
  }

  return `${hours.toString().padStart(2, "0")}:${minute}:00`;
};

avaliabilityRouter.post("/post", async (req, res) => {
  try {
    const { id, day, date, startTime, endTime, u_startTime, u_endTime } =
      req.body;

    const startTime24 = convertTo24Hour(startTime);
    const endTime24 = convertTo24Hour(endTime);
    const u_startTime24 = convertTo24Hour(u_startTime);
    const u_endTime24 = convertTo24Hour(u_endTime);

    console.log(
      id,
      day,
      date,
      startTime24,
      endTime24,
      u_startTime24,
      u_endTime24
    );

    const post = await executeQuery({
      query: "CALL phonebook.CreateContactAvailability(?, ?, ?, ?, ?, ?, ?)",
      values: [
        id,
        day,
        date,
        startTime24,
        endTime24,
        u_startTime24,
        u_endTime24,
      ], // Use 24-hour times
    });

    res.status(200).send({ message: "Availability set successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "internal server error" });
  }
});

avaliabilityRouter.delete("/delete/:id/:date", async (req, res) => {
  try {
    const { id, date } = req.params;
    console.log(id, date);

    const deleteAvaliablity = await executeQuery({
      query: "CALL phonebook.DeleteContactAvailability(?, ?)",
      values: [id, date],
    });

    res.status(200).send({ message: "Availability Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "internal server error" });
  }
});

module.exports = { avaliabilityRouter };
