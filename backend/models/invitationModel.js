import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const invitationSchema = mongoose.Schema({
    speakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Speaker', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'Pending' }, // e.g., 'pending', 'accepted', 'declined'
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Invitation", invitationSchema);