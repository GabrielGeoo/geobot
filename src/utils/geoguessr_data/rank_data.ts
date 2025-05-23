import { Client } from "discord.js";
import Division from "../../models/database/Division";
import getGeoguessrStats from "./geoguessr_stats";

export default async function getRankDataString(data: any, user: any, client: Client) {
  const bestData = await fetch(`https://www.geoguessr.com/api/v4/ranked-system/best/${user.geoguessrId}`);
  let bestDivision;
  if (bestData.ok) {
    const bestDataJson = await bestData.json();
    bestDivision = new Division(bestDataJson.divisionNumber);
  } else {
    bestDivision = new Division(0);
  }

  const progressData = await fetch(`https://www.geoguessr.com/api/v4/ranked-system/progress/${user.geoguessrId}`);
  let progressDivision;
  let divisionPosition = "";
  if (progressData.status === 200) {
    const progressDataJson = await progressData.json();
    progressDivision = new Division(progressDataJson.divisionNumber);
  } else {
    progressDivision = new Division(0);
  }

  const stats = await getGeoguessrStats(user.geoguessrId);

  const guild = await client.guilds.fetch("728006388936081528");
  return `Elo : ${data.competitive.rating}\n` 
    + `Ligue actuel : ${progressDivision.divisionName} ${guild.emojis.cache.get(progressDivision.emojiId) ?? ""}${divisionPosition}\n` 
    + `Meilleure ligue : ${bestDivision.divisionName} ${guild.emojis.cache.get(bestDivision.emojiId) ?? ""}\n`
    + `Parties terminées : ${stats.gamesPlayed}\n`
    + `Daily challenge streak : ${stats.dailyChallengeStreak}\n`;
    //+ `Duels : ${data.userExtendedStats.duels.numWins}/${data.userExtendedStats.duels.numGamesPlayed} (${data.userExtendedStats.duels.winRatio}%)\n`
}