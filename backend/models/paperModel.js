import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const paperSchema = mongoose.Schema({
    title: String,
    abstract: String,
    speakerId: { type: mongoose.Schema.Types.ObjectId, ref: "speaker" },
    conferenceId: { type: mongoose.Schema.Types.ObjectId, ref: "Conference", default: null },
    submissionDate: { type: Date, default: Date.now },
    deadlineDate: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days later
    },
    status: { type: String, enum: ["Submitted", "Under Review", "Rejected", "Published"], default: "Submitted" },
    sessionType: { type: String, enum: ["Independent Publication", "Session Publication"], required: true },
    keywords: [String],
    file: {
        data: {
            type: Buffer,
            required: true,
            validate: {
                validator: function (data) {
                    return data.length <= 104857600; // 100 MB
                },
                message: "File size must be less than 100MB"
            }
        },
        contentType: {
            type: String,
            required: true
        }
    },
    paperReviewer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reviewer' }]
});

export default mongoose.model("Paper", paperSchema);