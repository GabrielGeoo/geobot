import User from "../../models/User";
import getGeoguessrData from "./geoguessr_data";

export default async function registerRankData() {
  const users = await User.find();

  for (const user of users) {
    if (user.geoguessrId) {
      const data = await getGeoguessrData(user.geoguessrId)
      const rating = data.competitive.rating;
  
      user.rankData!.push({ rating, date: new Date() });
      await user.save();
      console.log("Utilisateur data enregistré : " + data.nick)
    }
  }
}