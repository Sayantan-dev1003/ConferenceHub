import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const registrationSchema = mongoose.Schema({
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendee" },
    conferenceId: { type: mongoose.Schema.Types.ObjectId, ref: "Conference" },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Confirmed", "Pending"], default: "Pending" }
});

export default mongoose.model("registration", registrationSchema);