import User from "../../models/User";

export default async function registerRankData() {
  const users = await User.find();

  for (const user of users) {
    const url = `https://www.geoguessr.com/_next/data/PAJchk6PWdCRMvFO2CM6T/fr/user/${user.geoguessrId}.json`;
    const progressData = await fetch(url);
    const json = await progressData.json();
    const rating = json.pageProps.user.competitive.rating;

    if (rating) {
      user.rankData!.push({ rating, date: new Date() });
      await user.save();
    }
  }
}