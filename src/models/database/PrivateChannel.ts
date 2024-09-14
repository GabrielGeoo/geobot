import mongoose, { InferSchemaType, Schema } from "mongoose";

const privateChannelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
});

type PrivateChannel = InferSchemaType<typeof privateChannelSchema>;

export default mongoose.model<PrivateChannel>("privateChannel", privateChannelSchema);