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
app.post("/api/conference", upload.fields([{ name: 'logo' }, { name: 'banner' }]), authenticateToken, async (req, res) => {
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
        targetAudience,
        socialMediaLinks,
    };

    try {
        // Create the new conference
        const newConference = await conferenceModel.create(conferenceData);

        // Get the organizer's ID from the token
        const organiserId = req.user.userid; // Ensure req.user is set correctly

        // Update the organizer's conferences array
        await organiserModel.findByIdAndUpdate(
            organiserId,
            { $push: { conferences: newConference._id } }, // Push the new conference ID
            { new: true } // Return the updated document
        );

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
    if (!participantId || !conferenceId || !ticketType) {
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

        // Update the conference to add the participantId to the registrations array
        await conferenceModel.findByIdAndUpdate(
            conferenceId,
            { $push: { registrations: participantId } },
            { new: true } // Return the updated document
        );

        await attendeeModel.findByIdAndUpdate(
            participantId,
            { $push: { conferences: conferenceId } },
            { new: true }
        )

        res.status(201).json({ message: "Registration successful", registration: newRegistration });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Failed to register for the conference" });
    }
});

app.get("/api/register/participant/:participantId", async (req, res) => {
    try {
        const { participantId } = req.params; // Extract participantId from the request parameters
        const registrations = await registrationModel.find({ participantId }); // Find all registrations for the given participantId

        if (!registrations || registrations.length === 0) {
            return res.status(404).json({ error: "No registrations found for this participant" });
        }

        res.json(registrations); // Return the found registrations
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});

// Get Attendee Details
app.get("/attendee", authenticateToken, async (req, res) => {
    if (req.user.role !== "attendee") return res.sendStatus(403);
    const attendee = await attendeeModel.findById(req.user.userid);
    if (!attendee) return res.sendStatus(404);
    res.json(attendee);
});

// Update Attendee Endpoint
app.put('/api/update/attendee', authenticateToken, async (req, res) => {
    const { fullname, email, phone, affiliation, areaOfInterest, location, socialMediaLinks } = req.body;

    try {
        // Find the attendee by ID from the token
        const attendee = await attendeeModel.findById(req.user.userid);
        if (!attendee) {
            return res.status(404).json({ error: "Attendee not found" });
        }

        // Update the attendee's information
        attendee.fullname = fullname || attendee.fullname;
        attendee.email = email || attendee.email;
        attendee.phone = phone || attendee.phone;
        attendee.affiliation = affiliation || attendee.affiliation;
        attendee.areaOfInterest = areaOfInterest || attendee.areaOfInterest;
        attendee.location = location || attendee.location;
        attendee.socialMediaLinks = socialMediaLinks || attendee.socialMediaLinks;

        // Save the updated attendee
        await attendee.save();

        res.status(200).json({ message: "Attendee updated successfully", attendee });
    } catch (error) {
        console.error("Error updating attendee:", error);
        res.status(500).json({ error: "Failed to update attendee" });
    }
});

app.post('/api/passwordchange/attendee', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the attendee by ID from the token
        const attendee = await attendeeModel.findById(req.user.userid);
        if (!attendee) {
            return res.status(404).json({ error: "Attendee not found" });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, attendee.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the attendee's password
        attendee.password = hashedPassword;
        await attendee.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
});

app.delete('/api/delete/account', authenticateToken, async (req, res) => {
    const { password } = req.body;

    try {
        // Find the attendee by ID from the token
        const attendee = await attendeeModel.findById(req.user.userid);
        if (!attendee) {
            return res.status(404).json({ error: "Attendee not found" });
        }

        // Check if the provided password matches
        const isMatch = await bcrypt.compare(password, attendee.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }

        // Delete the attendee account
        await attendeeModel.findByIdAndDelete(req.user.userid);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ error: "Failed to delete account" });
    }
});

app.get('/api/transaction/history/:attendeeId', authenticateToken, async (req, res) => {
    try {
        const { attendeeId } = req.params;

        // Find registrations for the attendee
        const registrations = await registrationModel.find({ participantId: attendeeId });

        if (!registrations.length) {
            return res.status(404).json({ message: "No transaction history found" });
        }

        // Extract conference IDs from registrations
        const conferenceIds = registrations.map(reg => reg.conferenceId);

        // Fetch conference details
        const conferences = await conferenceModel.find({ _id: { $in: conferenceIds } });

        // Map conference data with registration data
        const transactionHistory = registrations.map(reg => {
            const conference = conferences.find(conf => conf._id.toString() === reg.conferenceId.toString());
            return {
                conferenceId: reg.conferenceId,
                registrationId: reg._id,
                title: conference ? conference.title : "Unknown Conference",
                registrationDate: reg.registrationDate,
                status: reg.status,
                ticketType: reg.ticketType,
                ticketPrice: conference ? conference.ticketPrice ? conference.ticketPrice : null : "Unknown Conference",
                dietaryPreference: reg.dietaryPreference,
                paymentMethod: reg.paymentMethod,
                billingAddress: reg.billingAddress
            };
        });

        res.status(200).json({ transactions: transactionHistory });

    } catch (error) {
        console.error("Error fetching transaction history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all events (conferences) for the authenticated attendee
app.get("/api/events", authenticateToken, async (req, res) => {
    try {
        // Fetch the attendee's details using the authenticated user's ID
        const attendee = await attendeeModel.findById(req.user.userid).populate('conferences');

        if (!attendee) {
            return res.status(404).json({ error: "Attendee not found" });
        }

        // Extract conference IDs from the attendee's conferences
        const conferenceIds = attendee.conferences.map(conference => conference._id);

        // Fetch all conferences that match the extracted IDs
        const matchedConferences = await conferenceModel.find({
            _id: { $in: conferenceIds }
        });

        // Return the matched conferences
        res.json(matchedConferences);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

app.get("/api/upcoming-events", authenticateToken, async (req, res) => {
    try {
        // Fetch the attendee's details using the authenticated user's ID
        const attendee = await attendeeModel.findById(req.user.userid).populate('conferences');

        if (!attendee) {
            return res.status(404).json({ error: "Attendee not found" });
        }

        // Extract conference IDs from the attendee's conferences
        const conferenceIds = attendee.conferences.map(conference => conference._id);

        // Get the current date and calculate the date 10 days ahead
        const currentDate = new Date();
        console.log(currentDate)
        const tenDaysLater = new Date();
        tenDaysLater.setDate(tenDaysLater.getDate() + 10);
        console.log(tenDaysLater)

        // Fetch only conferences that match the extracted IDs and have startDate within the next 10 days
        const upcomingConferences = await conferenceModel.find({
            _id: { $in: conferenceIds },
            startDate: { $gte: currentDate, $lte: tenDaysLater } // Filtering based on startDate
        });

        // Return the filtered upcoming conferences
        res.json(upcomingConferences);
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        res.status(500).json({ error: "Failed to fetch upcoming events" });
    }
});

// Get Speaker Details
app.get("/speaker", authenticateToken, async (req, res) => {
    if (req.user.role !== "speaker") return res.sendStatus(403);
    const speaker = await speakerModel.findById(req.user.userid);
    if (!speaker) return res.sendStatus(404);
    res.json(speaker);
});

// Update Speaker Endpoint
app.put('/api/update/speaker', authenticateToken, async (req, res) => {
    const { fullname, email, phone, affiliation, bio, location, socialMediaLinks } = req.body;

    try {
        const speaker = await speakerModel.findById(req.user.userid);
        if (!speaker) {
            return res.status(404).json({ error: "Speaker not found" });
        }

        // Update the speaker's information
        speaker.fullname = fullname || speaker.fullname;
        speaker.email = email || speaker.email;
        speaker.phone = phone || speaker.phone;
        speaker.affiliation = affiliation || speaker.affiliation;
        speaker.bio = bio || speaker.bio;
        speaker.location = location || speaker.location;
        speaker.socialMediaLinks = socialMediaLinks || speaker.socialMediaLinks;

        // Save the updated speaker
        await speaker.save();

        res.status(200).json({ message: "Speaker updated successfully", speaker });
    } catch (error) {
        console.error("Error updating speaker:", error);
        res.status(500).json({ error: "Failed to update speaker", details: error.message }); // Include error details
    }
});

app.post('/api/passwordchange/speaker', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the speaker by ID from the token
        const speaker = await speakerModel.findById(req.user.userid);
        if (!speaker) {
            return res.status(404).json({ error: "Speaker not found" });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, speaker.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the attendee's password
        speaker.password = hashedPassword;
        await speaker.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
});

app.delete('/api/delete/speaker-account', authenticateToken, async (req, res) => {
    const { password } = req.body;

    try {
        // Find the speaker by ID from the token
        const speaker = await speakerModel.findById(req.user.userid);
        if (!speaker) {
            return res.status(404).json({ error: "Speaker not found" });
        }

        // Check if the provided password matches
        const isMatch = await bcrypt.compare(password, speaker.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }

        // Delete the speaker account
        await speakerModel.findByIdAndDelete(req.user.userid);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ error: "Failed to delete account" });
    }
});

// Get Organiser Details
app.get("/organiser", authenticateToken, async (req, res) => {
    // if (req.user.role !== "organiser") return res.sendStatus(403);
    const organiser = await organiserModel.findById(req.user.userid);
    if (!organiser) return res.sendStatus(404);
    res.json(organiser);
});

// Update Organiser Endpoint
app.put('/api/update/organiser', authenticateToken, async (req, res) => {
    const { fullname, email, phone, organisation, bio, location, socialMediaLinks } = req.body;

    try {
        const organiser = await organiserModel.findById(req.user.userid);
        if (!organiser) {
            return res.status(404).json({ error: "Speaker not found" });
        }

        // Update the organiser's information
        organiser.fullname = fullname || organiser.fullname;
        organiser.email = email || organiser.email;
        organiser.phone = phone || organiser.phone;
        organiser.organisation = organisation || organiser.organisation;
        organiser.bio = bio || organiser.bio;
        organiser.location = location || organiser.location;
        organiser.socialMediaLinks = socialMediaLinks || organiser.socialMediaLinks;

        // Save the updated speaker
        await organiser.save();

        res.status(200).json({ message: "Organiser updated successfully", organiser });
    } catch (error) {
        console.error("Error updating organiser:", error);
        res.status(500).json({ error: "Failed to update organiser", details: error.message }); // Include error details
    }
});

app.post('/api/passwordchange/organiser', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the organiser by ID from the token
        const organiser = await organiserModel.findById(req.user.userid);
        if (!organiser) {
            return res.status(404).json({ error: "Organiser not found" });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, organiser.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the attendee's password
        organiser.password = hashedPassword;
        await organiser.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
});

app.delete('/api/delete/organiser-account', authenticateToken, async (req, res) => {
    const { password } = req.body;

    try {
        // Find the organiser by ID from the token
        const organiser = await organiserModel.findById(req.user.userid);
        if (!organiser) {
            return res.status(404).json({ error: "Organiser not found" });
        }

        // Check if the provided password matches
        const isMatch = await bcrypt.compare(password, organiser.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }

        // Delete the organiser account
        await organiserModel.findByIdAndDelete(req.user.userid);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ error: "Failed to delete account" });
    }
});

// Get all conferences created by the authenticated organizer
app.get("/api/organiser/conferences", authenticateToken, async (req, res) => {
    try {
        // Fetch the organizer's conferences using the authenticated user's ID
        const conferences = await conferenceModel.find({ organiserId: req.user.userid }); // Assuming you have an organiserId field in your conference model

        if (!conferences || conferences.length === 0) {
            return res.status(404).json({ error: "No conferences found for this organizer" });
        }

        res.json(conferences); // Return the found conferences
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch conferences" });
    }
});

// User Logout
app.post("/logout", (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.redirect("/");
});

// Catch-all route to serve the frontend
app.get("*", authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(3000, () => console.log("Server started on port 3000"));