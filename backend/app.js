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
import http from 'http';
import { Server } from 'socket.io';
import attendeeModel from "./models/attendeeModel.js";
import speakerModel from "./models/speakerModel.js";
import organiserModel from "./models/organiserModel.js";
import conferenceModel from "./models/conferenceModel.js"
import registrationModel from "./models/registrationModel.js"
import invitationModel from "./models/invitationModel.js"
import paperModel from "./models/paperModel.js";
import reviewerModel from "./models/reviewerModel.js";
import evaluationModel from "./models/evaluationModel.js"

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your client URL
    methods: ['GET', 'POST'],
    credentials: true
}));
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

const upload = multer({ storage: multer.memoryStorage() });

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

const server = http.createServer(app);
const io = new Server(server);
const organizerSockets = {};
const speakerSockets = {};
const pendingNotifications = {};

// io.on('connection', (socket) => {
//     console.log('New client connected');

//     const speakerId = socket.handshake.query.speakerId; 
//     if (speakerId) {
//         speakerSockets[speakerId] = socket.id; 
//         console.log(`Speaker connected: ${speakerId}, Socket ID: ${socket.id}`);
//     } else {
//         console.log('No speaker ID provided');
//     }

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//         delete speakerSockets[speakerId];
//         console.log(`Speaker disconnected: ${speakerId}`);
//     });
// });

io.on('connection', (socket) => {
    console.log('New client connected');
    const { organizerId, speakerId } = socket.handshake.query;

    if (organizerId) {
        socket.organizerId = organizerId;
        organizerSockets[organizerId] = socket.id;
        console.log(`Organizer connected: ${organizerId}, Socket ID: ${socket.id}`);

        // Emit but don't delete from queue
        if (pendingNotifications[organizerId]) {
            pendingNotifications[organizerId].forEach(notification => {
                socket.emit("paperData", notification);
            });
        }

        // Listen for 'clearNotifications' when button is clicked
        socket.on('clearNotifications', () => {
            console.log(`Clearing notifications for organizer ${organizerId}`);
            delete pendingNotifications[organizerId];
        });

    } else if (speakerId) {
        socket.speakerId = speakerId;
        speakerSockets[speakerId] = socket.id;
        console.log(`Speaker connected: ${speakerId}, Socket ID: ${socket.id}`);

        invitationModel.find({ speakerId, status: 'pending' })
            .then(invitations => {
                if (invitations.length > 0) {
                    socket.emit('invitations', invitations);
                }
            })
            .catch(error => {
                console.error('Error fetching invitations:', error);
            });
    } else {
        console.log('No organizer or speaker ID provided');
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected');

        if (socket.organizerId) {
            delete organizerSockets[socket.organizerId];
            console.log(`Organizer disconnected: ${socket.organizerId}`);
        } else if (socket.speakerId) {
            delete speakerSockets[socket.speakerId];
            console.log(`Speaker disconnected: ${socket.speakerId}`);
        }
    });
});

// User Registration (Attendee or Speaker)
app.post("/register", async (req, res) => {
    const { fullname, email, phone, affiliation, password, userType, areaOfInterest, bio } = req.body;

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
        user = await attendeeModel.create({ fullname, email, phone, affiliation, password: hashedPassword, areaOfInterest });
    } else {
        if (!bio) {
            return res.status(400).json({ error: "Bio is required for speaker registration" });
        }
        user = await speakerModel.create({ fullname, email, phone, affiliation, password: hashedPassword, bio, areaOfInterest });
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

// Reviewer Registration
app.post("/reviewer/register", async (req, res) => {
    const { fullname, email, phone, affiliation, areaOfInterest, password } = req.body;

    // Check if the reviewer already exists
    const existingReviewer = await reviewerModel.findOne({ $or: [{ email }, { fullname }] });
    if (existingReviewer) return res.status(401).json({ error: "Reviewer already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new reviewer
    const reviewer = await reviewerModel.create({ fullname, email, phone, affiliation, areaOfInterest, password: hashedPassword });

    // Create a JWT token
    const token = jwt.sign({ email: email, userid: reviewer._id, userType: "reviewer" }, "Sayantan");
    res.cookie("token", token, { httpOnly: false, sameSite: 'Lax' });
    res.status(201).json({ message: "Reviewer registered successfully" });
});

// Reviewer Login
app.post("/reviewer/login", async (req, res) => {
    const { email, password } = req.body;

    // Find the reviewer by email
    const reviewer = await reviewerModel.findOne({ email });
    if (!reviewer) return res.status(401).json("Invalid email or password");

    // Compare the password
    const isMatch = await bcrypt.compare(password, reviewer.password);
    if (!isMatch) return res.status(401).json("Invalid email or password");

    // Create a JWT token
    const token = jwt.sign({ email: email, userid: reviewer._id, userType: "reviewer" }, "Sayantan");
    res.cookie("token", token, { httpOnly: false, sameSite: 'Lax' });

    return res.status(200).json({ message: "Login Successful", userType: "reviewer", fullname: reviewer.fullname });
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
    // if (req.user.role !== "attendee") return res.sendStatus(403);
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
        const tenDaysLater = new Date();
        tenDaysLater.setDate(tenDaysLater.getDate() + 10);

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
    // if (req.user.role !== "speaker") return res.sendStatus(403);
    const speaker = await speakerModel.findById(req.user.userid);
    if (!speaker) return res.sendStatus(404);
    res.json(speaker);
});

// Get a specific speaker by ID
app.get("/api/speaker/paper/:id", async (req, res) => {
    try {
        const speaker = await speakerModel.findById(req.params.id);
        if (!speaker) return res.status(404).json({ error: "Speaker not found" });
        res.json(speaker);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch speaker" });
    }
});

// Update Speaker Endpoint
app.put('/api/update/speaker', authenticateToken, async (req, res) => {
    const { fullname, email, phone, affiliation, bio, areaOfInterest, location, socialMediaLinks } = req.body;

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
        speaker.areaOfInterest = areaOfInterest || speaker.areaOfInterest;
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

app.get("/api/speaker-details/:conferenceName", authenticateToken, async (req, res) => {
    // if (req.user.role !== "speaker") return res.sendStatus(403);
    const conferenceName = req.params.conferenceName; // Assuming conference name is passed as a parameter
    if (!conferenceName) return res.status(400).json({ error: "Conference name is required" });
    const conference = await conferenceModel.findOne({ title: conferenceName });
    if (!conference) return res.status(404).json({ error: "Conference not found" });
    const conferenceCategory = conference.category;
    const speakers = await speakerModel.find({ areaOfInterest: conferenceCategory });
    res.json(speakers || []);
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
        // Fetch the organizer's details using the authenticated user's ID
        const organiser = await organiserModel.findById(req.user.userid).populate('conferences'); // Assuming you have a conferences field that references the conference model

        if (!organiser || !organiser.conferences || organiser.conferences.length === 0) {
            return res.status(404).json({ error: "No conferences found for this organizer" });
        }
        res.json(organiser.conferences); // Return the found conferences
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch conferences" });
    }
});

// Get registration details for a specific conference
app.get("/api/conference/:id/registrations", authenticateToken, async (req, res) => {
    const conferenceId = req.params.id;

    try {
        const registrations = await registrationModel.find({ conferenceId })
            .populate('participantId', 'fullname')
            .exec();

        if (!registrations || registrations.length === 0) {
            return res.status(404).json({ error: "No registrations found for this conference" });
        }

        const registrationDetails = registrations.map(reg => ({
            registrationId: reg._id,
            attendeeName: reg.participantId ? reg.participantId.fullname : "Unknown Attendee",
            registrationDate: reg.registrationDate,
            dietaryPreference: reg.dietaryPreference || 'N/A',
            paymentMethod: reg.paymentMethod || 'N/A',
            billingAddress: reg.billingAddress || 'N/A',
            status: reg.status,
        }));

        res.json(registrationDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});

app.post('/api/invite-speaker', authenticateToken, async (req, res) => {
    const { speakerId, title, message } = req.body;

    try {
        // Create a new invitation
        const invitation = await invitationModel.create({
            speakerId,
            title,
            message
        });

        // Emit an event to notify connected speakers
        const speakerSocketId = speakerSockets[speakerId]; // Get the socket ID of the speaker
        if (speakerSocketId) {
            io.to(speakerSocketId).emit('invitation', invitation); // Send the invitation to the specific speaker
        }

        res.status(201).json({ message: "Invitation sent successfully", invitation });
    } catch (error) {
        console.error('Error inviting speaker:', error);
        res.status(500).json({ error: "Failed to send invitation" });
    }
});

// app.post('/api/invite-speaker', authenticateToken, async (req, res) => {
//     const { speakerId, title } = req.body;

//     try {
//         const speaker = await speakerModel.findById(speakerId);
//         if (!speaker) {
//             return res.status(404).json({ error: "Speaker not found" });
//         }

//         const socketId = speakerSockets[speakerId];
//         if (socketId) {
//             io.to(socketId).emit('invitation', {
//                 type: 'INVITATION',
//                 message: `You have been invited to speak at a conference titled "${title}"`,
//                 title: title,
//             });
//             res.status(200).json({ message: "Invitation sent successfully" });
//         } else {
//             console.log(`Speaker with ID ${speakerId} is not connected. Current sockets:`, speakerSockets);
//             res.status(400).json({ error: "Speaker is not connected" });
//         }
//     } catch (error) {
//         console.error('Error inviting speaker:', error);
//         res.status(500).json({ error: "Failed to send invitation" });
//     } 
// });

// User Logout

app.get('/api/invitations', authenticateToken, async (req, res) => {
    try {
        const invitations = await invitationModel.find({ speakerId: req.user.userid, status: 'Pending' });
        res.json(invitations);
    } catch (error) {
        console.error('Error fetching invitations:', error);
        res.status(500).json({ error: "Failed to fetch invitations" });
    }
});

// Get Conference Details by Title
app.get("/api/conference/titles/:title", async (req, res) => {
    const conferenceTitles = req.params.title.split(',').map(title => title.trim()); // Extract and split the titles from the request parameters
    try {
        const conferences = await conferenceModel.find({ title: { $in: conferenceTitles } }); // Find conferences by titles
        if (conferences.length === 0) {
            return res.status(404).json({ error: "Conferences not found" }); // Return 404 if not found
        }
        res.json(conferences); // Return the found conference details
    } catch (error) {
        console.error("Error fetching conferences by titles:", error);
        res.status(500).json({ error: "Failed to fetch conferences" }); // Handle any errors
    }
});

app.patch('/api/invitations/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedInvitation = await invitationModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedInvitation) {
            return res.status(404).json({ error: 'Invitation not found' });
        }

        const speaker = await speakerModel.findById(updatedInvitation.speakerId);
        const conference = await conferenceModel.findOne({ title: updatedInvitation.title });
        speaker.conferences.push(conference._id);
        console.log("Conference:", conference)
        conference.speaker.push(updatedInvitation.speakerId);
        await speaker.save();
        await conference.save();

        res.json(updatedInvitation);
    } catch (error) {
        console.error('Error updating invitation status:', error);
        res.status(500).json({ error: 'Failed to update invitation status' });
    }
});

app.get('/api/invitations/conference/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const invitations = await invitationModel.find({ title: title });

        if (invitations.length === 0) {
            return res.status(404).json({ error: 'Invitations not found' });
        }
        res.json(invitations);
    } catch (error) {
        console.error('Error fetching invitations:', error);
        res.status(500).json({ error: 'Failed to fetch invitations' });
    }
});

app.get("/api/speaker/events", authenticateToken, async (req, res) => {
    try {
        // Fetch the speaker's details using the authenticated user's ID
        const speaker = await speakerModel.findById(req.user.userid).populate('conferences');

        if (!speaker) {
            return res.status(404).json({ error: "Speaker not found" });
        }

        // Extract conference IDs from the speaker's conferences
        const conferenceIds = speaker.conferences.map(conference => conference._id);

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

app.get("/api/speaker/upcoming-events", authenticateToken, async (req, res) => {
    try {
        // Fetch the speaker's details using the authenticated user's ID
        const speaker = await speakerModel.findById(req.user.userid).populate('conferences');

        if (!speaker) {
            return res.status(404).json({ error: "Speaker not found" });
        }

        // Extract conference IDs from the speaker's conferences
        const conferenceIds = speaker.conferences.map(conference => conference._id);

        // Get the current date and calculate the date 10 days ahead
        const currentDate = new Date();
        const tenDaysLater = new Date();
        tenDaysLater.setDate(tenDaysLater.getDate() + 10);

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

app.get("/api/speaker-invited/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const conference = await conferenceModel.findById(id).populate('speaker');

        if (!conference) {
            console.error("Conference not found for ID:", id);
            return res.status(404).json({ error: "Conference not found" });
        }

        const speakers = await speakerModel.find({ _id: { $in: conference.speaker } });
        res.json(speakers);
    } catch (error) {
        console.error('Error fetching speaker details:', error);
        res.status(500).json({ error: 'Failed to fetch speaker details' });
    }
});

// Get Reviewer Details
app.get("/reviewer", authenticateToken, async (req, res) => {
    const reviewer = await reviewerModel.findById(req.user.userid);
    if (!reviewer) return res.sendStatus(404);
    res.json(reviewer);
});

// Paper publishing endpoint
app.post("/api/submit-paper", upload.single('file'), authenticateToken, async (req, res) => {
    const { title, abstract, keywords, speakerId, conferenceId, sessionType } = req.body;

    if (!title || !abstract || !req.file) {
        return res.status(400).json({ error: "All fields are required, including the file." });
    }

    try {
        const paperData = {
            title,
            abstract,
            speakerId,
            conferenceId,
            status: "Submitted",
            sessionType,
            keywords,
            file: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        };

        const newPaper = await paperModel.create(paperData);
        const organizerWithConference = await organiserModel.findOne({ conferences: { $in: [conferenceId] } });

        if (!organizerWithConference) {
            return res.status(404).json({ error: "Organizer not found for the given conference." });
        }

        const organizerId = organizerWithConference._id.toString();
        const organiserSocketId = organizerSockets[organizerId];

        const notification = {
            message: "A new paper has been submitted!",
            ...paperData,
            paperId: newPaper._id.toString() // Added paperId to the notification
        };

        if (organiserSocketId) {
            io.to(organiserSocketId).emit("paperData", {
                message: "A new paper has been submitted!",
                ...paperData,
                paperId: newPaper._id.toString() // Added paperId to the emitted data
            });
        } else {
            // Queue it in memory
            if (!pendingNotifications[organizerWithConference._id.toString()]) {
                pendingNotifications[organizerWithConference._id.toString()] = [];
            }
            pendingNotifications[organizerWithConference._id.toString()].push({
                message: "A new paper has been submitted!",
                ...paperData,
                paperId: newPaper._id.toString() // Added paperId to the queued data
            });
        }

        // Add paper id to papers array field in speakerModel
        const speaker = await speakerModel.findById(speakerId);
        if (speaker) {
            speaker.papers.push(newPaper._id);
            await speaker.save();
        }

        res.status(201).json({ message: "Paper submitted successfully", paper: newPaper });
    } catch (error) {
        console.error("Error submitting paper:", error);
        res.status(500).json({ error: "Failed to submit paper" });
    }
});

app.get('/api/submit/:selectedSession', async (req, res) => {
    const { selectedSession } = req.params;
    try {
        const conference = await conferenceModel.findOne({ title: selectedSession });
        if (!conference) {
            return res.status(404).json({ error: "Conference not found" });
        }
        res.json(conference);
    } catch (error) {
        console.error("Error fetching conference by title:", error);
        res.status(500).json({ error: "Failed to fetch conference" });
    }
});

// Get Reviewer Details
app.get("/reviewers", authenticateToken, async (req, res) => {
    const reviewers = await reviewerModel.find();
    if (!reviewers) return res.sendStatus(404);
    res.json(reviewers);
});

app.post('/assign-reviewer/:paperId/:reviewerId', async (req, res) => {
    const { paperId, reviewerId } = req.params;

    try {
        const paper = await paperModel.findById(paperId);
        const reviewer = await reviewerModel.findById(reviewerId);

        if (!paper || !reviewer) {
            return res.status(404).json({ message: "Paper or Reviewer not found" });
        }

        // Add reviewer to paper if not already added
        if (!paper.paperReviewer.includes(reviewerId)) {
            paper.paperReviewer.push(reviewerId);
        }

        // Change paper status to "Under Review" only if the length of the array of paperReviewer >= 2
        if (paper.paperReviewer.length >= 2 && paper.status === "Submitted") {
            paper.status = "Under Review";

            // 🔔 Remove notification for organizer and notify frontend
            for (let orgId in pendingNotifications) {
                if (pendingNotifications[orgId]) {
                    // Remove notification related to this paper
                    pendingNotifications[orgId] = pendingNotifications[orgId].filter(
                        (notif) => notif.paperId !== paperId
                    );

                    // If organizer is connected, send event to remove from UI
                    const socketId = organizerSockets[orgId];
                    if (socketId) {
                        io.to(socketId).emit("clearNotifications");
                    }
                }
            }
        }

        // Add paper to reviewer's paper list
        if (!reviewer.paperReview.includes(paperId)) {
            reviewer.paperReview.push(paperId);
        }

        // Add notification for the organizer
        for (let orgId in organizerSockets) {
            if (!pendingNotifications[orgId]) {
                pendingNotifications[orgId] = [];
            }

            pendingNotifications[orgId].push({
                paperId,
                message: `Reviewer assigned to paper: ${paper.title}`,
                title: paper.title,
                speakerId: paper.speakerId // Assuming you have a speakerId in the paper model
            });
        }

        await paper.save();
        await reviewer.save();

        res.status(200).json({ message: "Reviewer assigned successfully!" });
    } catch (error) {
        console.error("Assignment Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/api/paper/submissions', authenticateToken, async (req, res) => {
    try {
        const papers = await speakerModel.findById(req.user.userid).populate('papers');
        const paperDetails = await paperModel.find({ _id: { $in: papers.papers } });
        res.status(200).json({ papers: paperDetails });
    } catch (error) {
        console.error("Error fetching papers with details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update Reviewer Endpoint
app.put('/api/reviewer/update', authenticateToken, async (req, res) => {
    const { fullname, email, phone, affiliation, areaOfInterest, location, socialMediaLinks } = req.body;

    try {
        const reviewer = await reviewerModel.findById(req.user.userid);
        if (!reviewer) {
            return res.status(404).json({ error: "Reviewer not found" });
        }

        // Update the reviewer's information
        reviewer.fullname = fullname || reviewer.fullname;
        reviewer.email = email || reviewer.email; 
        reviewer.phone = phone || reviewer.phone;
        reviewer.affiliation = affiliation || reviewer.affiliation;
        reviewer.areaOfInterest = areaOfInterest || reviewer.areaOfInterest;
        reviewer.location = location || reviewer.location;
        reviewer.socialMediaLinks = socialMediaLinks || reviewer.socialMediaLinks;

        // Save the updated reviewer
        await reviewer.save();

        res.status(200).json({ message: "Reviewer updated successfully", reviewer });
    } catch (error) {
        console.error("Error updating reviewer:", error);
        res.status(500).json({ error: "Failed to update reviewer", details: error.message }); // Include error details
    }
});

app.post('/api/reviewer/passwordchange', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the organiser by ID from the token
        const reviewer = await reviewerModel.findById(req.user.userid);
        if (!reviewer) {
            return res.status(404).json({ error: "Reviewer not found" });
        }

        // Check if the old password matches
        const isMatch = await bcrypt.compare(oldPassword, reviewer.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the attendee's password
        reviewer.password = hashedPassword;
        await reviewer.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
});

app.delete('/api/delete/reviewer-account', authenticateToken, async (req, res) => {
    const { password } = req.body;

    try {
        // Find the speaker by ID from the token
        const reviewer = await reviewerModel.findById(req.user.userid);
        if (!reviewer) {
            return res.status(404).json({ error: "Reviewer not found" });
        }

        // Check if the provided password matches
        const isMatch = await bcrypt.compare(password, reviewer.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }

        // Delete the speaker account
        await reviewerModel.findByIdAndDelete(req.user.userid);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ error: "Failed to delete account" });
    }
});

app.get('/api/reviewer/assigned-papers', authenticateToken, async (req, res) => {
    try {
        const reviewer = await reviewerModel.findById(req.user.userid).populate('paperReview');
        if (!reviewer) {
            return res.status(404).json({ error: "Reviewer not found" });
        }

        const papersUnderReview = await paperModel.find({
            status: "Under Review",
            _id: { $in: reviewer.paperReview }
        });

        res.status(200).json({ papers: papersUnderReview });
    } catch (error) {
        console.error("Error fetching papers:", error);
        res.status(500).json({ error: "Failed to fetch papers" });
    }
});

app.get('/api/reviewer/paper-review/:paperId', authenticateToken, async (req, res) => {
    try {
        const paperId = req.params.paperId;
        const paper = await paperModel.findById(paperId);
        if (!paper) {
            return res.status(404).json({ error: "Paper not found" });
        }
        res.status(200).json({ papers: [paper] });
    } catch (error) {
        console.error("Error fetching paper:", error);
        res.status(500).json({ error: "Failed to fetch paper" });
    }
});

app.get('/api/reviewer/history', authenticateToken, async (req, res) => {
    try {
        const reviewer = await reviewerModel.findById(req.user.userid).populate('paperReview');
        if (!reviewer) {
            return res.status(404).json({ error: "Reviewer not found" });
        }

        const papersHistory = await paperModel.find({
            _id: { $in: reviewer.paperReview }
        });

        res.status(200).json({ papers: papersHistory });
    } catch (error) {
        console.error("Error fetching papers:", error);
        res.status(500).json({ error: "Failed to fetch papers" });
    }
});

app.post('/api/evaluation-submit', authenticateToken, async (req, res) => {
    try {
        const evaluationDetails = req.body;
        const reviewerId = req.user.userid;
        const evaluation = new evaluationModel({ ...evaluationDetails, reviewerId });
        await evaluation.save();

        // Update the status of the paper based on the verdict
        const paper = await paperModel.findById(evaluationDetails.paperId);
        if (["Strong Accept", "Accept", "Weak Accept"].includes(evaluationDetails.verdict)) {
            paper.status = "Published";
        } else {
            paper.status = "Rejected";
        }
        await paper.save();

        res.status(201).json({ message: "Evaluation submitted successfully" });
    } catch (error) {
        console.error("Error submitting evaluation:", error);
        res.status(500).json({ error: "Failed to submit evaluation" });
    }
});

app.get('/api/evaluation/details/:paperId', authenticateToken, async (req, res) => {
    try {
        const paperId = req.params.paperId;
        const evaluation = await evaluationModel.findOne({ paperId });
        if (!evaluation) {
            return res.status(404).json({ error: "Evaluation not found" });
        }
        res.status(200).json(evaluation);
    } catch (error) {
        console.error("Error fetching evaluation details:", error);
        res.status(500).json({ error: "Failed to fetch evaluation details" });
    }
});

app.get('/api/archives/papers', async (req, res) => {
    try {
        // Fetch published papers from the database
        const publishedPapers = await paperModel.find({ status: "Published" });

        // Check if any published papers were found
        if (!publishedPapers || publishedPapers.length === 0) {
            return res.status(404).json({ error: "No published papers found" });
        }

        // Extract speaker and conference IDs from the published papers
        const speakerIds = publishedPapers.map(paper => paper.speakerId);
        const conferenceIds = publishedPapers.map(paper => paper.conferenceId);

        // Fetch speakers and conferences in parallel
        const [speakers, conferences] = await Promise.all([
            speakerModel.find({ _id: { $in: speakerIds } }),
            conferenceModel.find({ _id: { $in: conferenceIds } })
        ]);

        // Map the published papers to include speaker and conference names
        const papersWithDetails = publishedPapers.map(paper => {
            const speaker = speakers.find(speaker => String(speaker._id) === String(paper.speakerId));
            const conference = conferences.find(conference => String(conference._id) === String(paper.conferenceId));

            return {
                ...paper.toObject(), // Convert Mongoose document to plain object
                speakerName: speaker ? speaker.fullname : "Unknown Speaker", // Handle case where speaker is not found
                conferenceName: conference ? conference.title : "Unknown Conference" // Handle case where conference is not found
            };
        });

        res.status(200).json(papersWithDetails);
    } catch (error) {
        console.error("Error fetching published papers:", error);
        res.status(500).json({ error: "Failed to fetch published papers" });
    }
});

app.post("/logout", (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.redirect("/");
});

// Catch-all route to serve the frontend
app.get("*", (req, res) => {
    if (req.path !== "/paper-archives") {
        authenticateToken(req, res, () => {
            res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        });
    } else {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
});

// Start the server
server.listen(3000, () => console.log("Server started on port 3000"));