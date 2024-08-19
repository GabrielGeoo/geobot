import mongoose, { InferSchemaType } from "mongoose";

const dataSchema = new mongoose.Schema({
  cs: { type: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    heading: { type: Number, required: true },
    pitch: { type: Number, required: true },
    zoom: { type: Number, required: true },
    streak: { type: Number, required: true, default: 0 },
  }, required: true },
});

type Data = InferSchemaType<typeof dataSchema>;

export default mongoose.model<Data>("Data", dataSchema);