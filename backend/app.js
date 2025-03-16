import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import jwt from 'jsonwebtoken';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import attendeeModel from "./models/attendeeModel.js";
import speakerModel from "./models/speakerModel.js";
import organiserModel from "./models/organiserModel.js";
import publisherModel from "./models/publisherModel.js";
import reviewerModel from "./models/reviewerModel.js";
import conferenceModel from "./models/conferenceModel.js"
import registrationModel from "./models/registrationModel.js"

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

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

app.post("/organiser/register", async (req, res) => {
    const { fullname, email, phone, organisation, bio, password } = req.body;

    const existingOrganiser = await organiserModel.findOne({ $or: [{ email }, { fullname }] });

    if (existingOrganiser) return res.status(401).json({ error: "Organiser already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const organiser = await organiserModel.create({ fullname, email, phone, organisation, bio, password: hashedPassword });

    const token = jwt.sign({ email: email, userid: organiser._id, userType: "organiser" }, "Sayantan");
    res.cookie("token", token, { httpOnly: false, sameSite: 'Lax' });
    res.status(201).json({ message: "Organiser registered successfully" });
});

app.post("/organiser/login", async (req, res) => {
    const { email, fullname, password } = req.body;

    const user = await organiserModel.findOne({ email });

    if (!user) return res.status(401).json("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json("Invalid email or password");

    const token = jwt.sign({ email: email, userid: user._id, userType: "organiser" }, "Sayantan");
    res.cookie("token", token, { httpOnly: false, sameSite: 'Lax' });

    return res.status(200).json({ message: "Login Successful", userType: "organiser", fullname: user.fullname });
});

app.post("/paper/register", async (req, res) => {
    const { fullname, email, phone, affiliation, password, userType, areaOfInterest, designation } = req.body;

    // Ensure `userType` is valid
    if (!userType || (userType !== "publisher" && userType !== "reviewer")) {
        return res.status(400).json({ error: "Invalid user type" });
    }

    const existingUser = userType === "publisher"
        ? await publisherModel.findOne({ $or: [{ email }, { fullname }] })
        : await reviewerModel.findOne({ $or: [{ email }, { fullname }] });

    if (existingUser) return res.status(401).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (userType === "reviewer") {
        if (!Array.isArray(areaOfInterest)) {
            return res.status(400).json({ error: "areaOfInterest must be an array" });
        }
        user = await reviewerModel.create({ fullname, email, phone, affiliation, password: hashedPassword, areaOfInterest });
    } else {
        user = await publisherModel.create({ fullname, email, phone, affiliation, password: hashedPassword, designation });
    }

    const token = jwt.sign({ email: email, userid: user._id, userType: userType }, "Sayantan");
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "User registered successfully" });
});

app.post("/paper/login", async (req, res) => {
    const { email, password, role } = req.body;

    if (!role || (role !== "publisher" && role !== "reviewer")) {
        return res.status(400).json({ error: "Invalid role" });
    }

    const user = role === "publisher"
        ? await publisherModelModel.findOne({ email })
        : await reviewerModelModel.findOne({ email });

    if (!user) return res.status(401).json("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json("Invalid email or password");

    const token = jwt.sign({ email: email, userid: user._id, role: role }, "Sayantan");
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ message: "Login Successful", role });
});

// Conference Registration Endpoint
app.post("/api/conference", upload.fields([{ name: 'logo' }, { name: 'banner' }]), async (req, res) => {
    const {
        title,
        description,
        type,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        mode,
        venue,
        virtualLink,
        ticketType,
        ticketPrice,
        registrationDeadline,
        keynoteSpeakers,
        targetAudience,
        socialMediaLinks,
    } = req.body;

    // Validate required fields
    if (!title || !description || !type || !category || !startDate || !endDate || !startTime || !endTime) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new conference entry
    const conferenceData = {
        title,
        description,
        type,
        category,
        logo: req.files['logo'] ? req.files['logo'][0].path : null,
        banner: req.files['banner'] ? req.files['banner'][0].path : null,
        startDate,
        endDate,
        startTime,
        endTime,
        mode,
        venue,
        virtualLink,
        ticketType,
        ticketPrice,
        registrationDeadline,
        keynoteSpeakers,
        targetAudience,
        socialMediaLinks,
    };

    try {
        const newConference = await conferenceModel.create(conferenceData);
        res.status(201).json({ message: "Conference created successfully", conference: newConference });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create conference" });
    }
});

// Get all conferences
app.get("/api/conferences", async (req, res) => {
    try {
        const conferences = await conferenceModel.find();
        res.json(conferences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch conferences" });
    }
});

// Get a specific conference by ID
app.get("/api/conference/:id", async (req, res) => {
    try {
        const conference = await conferenceModel.findById(req.params.id);
        if (!conference) return res.status(404).json({ error: "Conference not found" });
        res.json(conference);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch conference" });
    }
});

// Update a conference
app.put("/api/conference/:id", upload.fields([{ name: 'logo' }, { name: 'banner' }]), async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        type,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        mode,
        venue,
        virtualLink,
        ticketType,
        ticketPrice,
        registrationDeadline,
        keynoteSpeakers,
        targetAudience,
        socialMediaLinks,
    } = req.body;

    // Validate required fields
    if (!title || !description || !type || !category || !startDate || !endDate || !startTime || !endTime) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Find the conference by ID
    try {
        const conference = await conferenceModel.findById(id);
        if (!conference) return res.status(404).json({ error: "Conference not found" });

        // Update the conference data
        conference.title = title;
        conference.description = description;
        conference.type = type;
        conference.category = category;
        conference.startDate = startDate;
        conference.endDate = endDate;
        conference.startTime = startTime;
        conference.endTime = endTime;
        conference.mode = mode;
        conference.venue = mode === 'offline' ? venue : null; // Only set venue if offline
        conference.virtualLink = mode === 'online' ? virtualLink : null; // Only set virtual link if online
        conference.ticketType = ticketType;

        // Handle ticketPrice based on ticketType
        if (ticketType === 'paid') {
            conference.ticketPrice = ticketPrice ? Number(ticketPrice) : null; // Convert to number or set to null
        } else {
            conference.ticketPrice = null; // Set to null if ticketType is free
        }

        conference.registrationDeadline = registrationDeadline;
        conference.keynoteSpeakers = keynoteSpeakers;
        conference.targetAudience = targetAudience;
        conference.socialMediaLinks = socialMediaLinks;

        // Handle file uploads
        if (req.files['logo']) {
            conference.logo = req.files['logo'][0].path; // Update logo if a new file is uploaded
        }
        if (req.files['banner']) {
            conference.banner = req.files['banner'][0].path; // Update banner if a new file is uploaded
        }

        // Save the updated conference
        await conference.save();
        res.status(200).json({ message: "Conference updated successfully", conference });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update conference" });
    }
});

// Delete a conference
app.delete("/api/conference/:id", async (req, res) => {
    try {
        const conference = await conferenceModel.findByIdAndDelete(req.params.id);
        if (!conference) return res.status(404).json({ error: "Conference not found" });
        res.json({ message: "Conference deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete conference" });
    }
});

// Conference Registration Endpoint
app.post("/api/register", async (req, res) => {
    const {
        participantId,
        conferenceId,
        ticketType,
        dietaryPreference,
        paymentMethod,
        billingAddress,
    } = req.body;

    // Validate required fields
    if (!participantId || !conferenceId || !ticketType || !paymentMethod || !billingAddress) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if the participant has already registered for the conference
        const existingRegistration = await registrationModel.findOne({
            participantId,
            conferenceId,
        });

        if (existingRegistration) {
            return res.status(400).json({ error: "You have already registered for this conference." });
        }

        // Create a new registration entry
        const registrationData = {
            participantId,
            conferenceId,
            ticketType,
            dietaryPreference,
            paymentMethod,
            billingAddress,
            status: "Confirmed",
        };

        const newRegistration = await registrationModel.create(registrationData);
        res.status(201).json({ message: "Registration successful", registration: newRegistration });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Failed to register for the conference" });
    }
});

app.get("/attendee", authenticateToken, async (req, res) => {
    if (req.user.role !== "attendee") return res.sendStatus(403);
    const attendee = await attendeeModel.findById(req.user.userid);
    if (!attendee) return res.sendStatus(404);
    res.json(attendee);
});

// User Logout
app.get("/logout", (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.redirect("/");
});

// Get Attendee Details

// // Get Speaker Details
// app.get("/speaker-dashboard", authenticateToken, async (req, res) => {
//     if (req.user.role !== "speaker") return res.sendStatus(403);
//     const speaker = await speakerModel.findById(req.user.userid);
//     if (!speaker) return res.sendStatus(404);
//     res.json(speaker);
// });

// Catch-all route to serve the frontend
app.get("*", authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(3000, () => console.log("Server started on port 3000"));