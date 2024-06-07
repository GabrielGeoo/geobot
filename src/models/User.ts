import mongoose, { InferSchemaType, Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  geoguessrId: { type: String, required: true },
});

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);