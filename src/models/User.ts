import mongoose, { InferSchemaType } from "mongoose";

const rankDataSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  date: { type: Date, required: true },
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  geoguessrId: { type: String, required: false, default: null},
  rankData: { type: [rankDataSchema], required: false, default: []},
  coins: { type: Number, required: false, default: 0 },
  lastDaily: { type: Date, required: false, default: new Date(0) },
});

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);