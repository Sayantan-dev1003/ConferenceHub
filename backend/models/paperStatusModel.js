import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const paperStatusSchema = mongoose.Schema({
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: "Paper" },
    status: { type: String, enum: ["Submitted", "Under Review", "Accepted", "Rejected", "Published", "Presented"], default: "Submitted" },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("PaperStatus", paperStatusSchema);