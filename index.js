import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userName = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

mongoose.connect(
  `mongodb+srv://${userName}:${password}@cluster0.5srsomk.mongodb.net/RegisterDATA`,
)
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

const registrationSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const existingUser = await Registration.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.redirect("/error");
    }

    const registrationData = new Registration({
      firstname,
      lastname,
      email,
      password,
    });
    await registrationData.save();
    res.redirect("/success");
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/success.html"));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "pages/error.html"));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
