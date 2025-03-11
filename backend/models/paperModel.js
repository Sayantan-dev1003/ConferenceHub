import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const paperSchema = mongoose.Schema({
    title: String,
    abstract: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendee" },
    conferenceId: { type: mongoose.Schema.Types.ObjectId, ref: "Conference" },
    submissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Submitted", "Under Review", "Accepted", "Rejected", "Published", "Presented"], default: "Submitted" }
});

export default mongoose.model("Paper", paperSchema);