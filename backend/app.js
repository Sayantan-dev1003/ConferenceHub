import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import attendeeModel from "./models/attendeeModel.js";
import speakerModel from "./models/speakerModel.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Middleware for token verification
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, "Sayantan", (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// User Registration (Attendee or Speaker)
app.post("/register", async (req, res) => {
    const { fullname, email, phone, affiliation, password, userType, areaOfInterest, bio } = req.body;

    // Ensure `userType` is valid
    if (!userType || (userType !== "attendee" && userType !== "speaker")) {
        return res.status(400).json({ error: "Invalid user type" });
    }

    const existingUser = userType === "attendee"
        ? await attendeeModel.findOne({ $or: [{ email }, { fullname }] })
        : await speakerModel.findOne({ $or: [{ email }, { fullname }] });

    if (existingUser) return res.status(401).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (userType === "attendee") {
        if (!Array.isArray(areaOfInterest)) {
            return res.status(400).json({ error: "areaOfInterest must be an array" });
        }
        user = await attendeeModel.create({ fullname, email, phone, affiliation, password: hashedPassword, areaOfInterest });
    } else {
        user = await speakerModel.create({ fullname, email, phone, affiliation, password: hashedPassword, bio });
    }

    const token = jwt.sign({ email: email, userid: user._id, userType: userType }, "Sayantan");
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "User registered successfully" });
});

// User Login
app.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    if (!role || (role !== "attendee" && role !== "speaker")) {
        return res.status(400).json({ error: "Invalid role" });
    }

    const user = role === "attendee"
        ? await attendeeModel.findOne({ email })
        : await speakerModel.findOne({ email });

    if (!user) return res.status(401).json("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json("Invalid email or password");

    const token = jwt.sign({ email: email, userid: user._id, role: role }, "Sayantan");
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ message: "Login Successful", role });
});

// User Logout
app.get("/logout", (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.redirect("/");
});

// Get Attendee Details
app.get("/attendee-dashboard", authenticateToken, async (req, res) => {
    if (req.user.role !== "attendee") return res.sendStatus(403);
    const attendee = await attendeeModel.findById(req.user.userid);
    if (!attendee) return res.sendStatus(404);
    res.json(attendee);
});

// Get Speaker Details
app.get("/speaker-dashboard", authenticateToken, async (req, res) => {
    if (req.user.role !== "speaker") return res.sendStatus(403);
    const speaker = await speakerModel.findById(req.user.userid);
    if (!speaker) return res.sendStatus(404);
    res.json(speaker);
});

app.get("/feed", authenticateToken, (req, res) => {
    res.send("feed");
});

// Catch-all route to serve the frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(3000, () => console.log("Server started on port 3000"));