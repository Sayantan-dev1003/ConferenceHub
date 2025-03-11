import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const sessionSchema = mongoose.Schema({
    title: String,
    conferenceId: { type: mongoose.Schema.Types.ObjectId, ref: "Conference" },
    date: Date,
    time: String,
    duration: Number,
    type: String,
    speakerId: { type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }
});

export default mongoose.model("Session", sessionSchema);