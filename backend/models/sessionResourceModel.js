import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const sessionResourceSchema = mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" }
});

export default mongoose.model("SessionResource", sessionResourceSchema);