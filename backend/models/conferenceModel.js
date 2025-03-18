import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const conferenceSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    logo: { type: String },
    banner: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    mode: { type: String, required: true },
    venue: { type: String },
    virtualLink: { type: String },
    ticketType: { type: String, required: true },
    ticketPrice: { type: Number },
    registrationDeadline: { type: Date, required: true },
    keynoteSpeakers: { type: String, required: true },
    targetAudience: { type: String, required: true },
    socialMediaLinks: { type: String },
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendee' }]
});

export default mongoose.model("Conference", conferenceSchema);