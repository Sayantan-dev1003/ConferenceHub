import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const registrationSchema = mongoose.Schema({
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendee", required: true },
    conferenceId: { type: mongoose.Schema.Types.ObjectId, ref: "Conference", required: true },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Confirmed", "Pending"], default: "Pending" },
    ticketType: { type: String, required: true },
    dietaryPreference: { type: String },
    paymentMethod: { type: String, required: true },
    billingAddress: { type: String, required: true }
});

export default mongoose.model("Registration", registrationSchema);