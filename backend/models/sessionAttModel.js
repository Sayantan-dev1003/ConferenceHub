import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const sessionAttendanceSchema = mongoose.Schema({
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendee" },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" }
});

export default mongoose.model("SessionAttendance", sessionAttendanceSchema);