import mongoose, { InferSchemaType, Schema } from "mongoose";

const rankDataSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  date: { type: Date, required: true },
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  geoguessrId: { type: String, required: true },
  rankData: { type: [rankDataSchema], required: false, default: []},
});

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);