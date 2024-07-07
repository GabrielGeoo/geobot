import User from "../models/database/User";

export default async function resetScoreData(type: string) {
  let toLog;
  switch (type) {
    case "daily":
      toLog = await User.updateMany({}, { "scores.daily": 0 });
      break;
    case "weekly":
      toLog = await User.updateMany({}, { "scores.weekly": 0 });
      break;
    case "monthly":
      toLog = await User.updateMany({}, { "scores.monthly": 0 });
      break;
    default:
      throw new Error("Invalid type");
  }
  console.log(toLog);
}