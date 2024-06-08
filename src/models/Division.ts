import { Snowflake } from "discord.js";

class Division {
  divisionNumber: number;
  divisionTier: DivisionTier;
  divisionName: string;
  emojiId: Snowflake;

  constructor(divisionNumber: number) {
    this.divisionNumber = divisionNumber;
    const data = this.initData(divisionNumber);
    this.divisionTier = data.divisionTier;
    this.divisionName = data.divisionName;
    this.emojiId = data.emojiId;
  }

  private initData(divisionNumber: number) {
    switch (divisionNumber) {
      case 1:
        return { divisionTier: DivisionTier.CHAMPION, divisionName: "Champion", emojiId: "1248738140856782858" };
      case 2:
        return { divisionTier: DivisionTier.MASTER, divisionName: "Master I", emojiId: "1248738159353921667" };
      case 3:
        return { divisionTier: DivisionTier.MASTER, divisionName: "Master II", emojiId: "1248738175174836235" };
      case 4:
        return { divisionTier: DivisionTier.GOLD, divisionName: "Gold I", emojiId: "1248738196066537544" };
      case 5:
        return { divisionTier: DivisionTier.GOLD, divisionName: "Gold II", emojiId: "1248738210645807124" };
      case 6:
        return { divisionTier: DivisionTier.GOLD, divisionName: "Gold III", emojiId: "1248738225753952356" };
      case 7:
        return { divisionTier: DivisionTier.SILVER, divisionName: "Silver I", emojiId: "1248738241608290444" };
      case 8:
        return { divisionTier: DivisionTier.SILVER, divisionName: "Silver II", emojiId: "1248738256397533194" };
      case 9:
        return { divisionTier: DivisionTier.SILVER, divisionName: "Silver III", emojiId: "1248738269475110962" };
      default:
        return { divisionTier: DivisionTier.NONE, divisionName: "Aucune", emojiId: "" };
    }
  }
}

enum DivisionTier {
  CHAMPION = "Champion",
  MASTER = "Master",
  GOLD = "Gold",
  SILVER = "Silver",
  BRONZE = "Bronze",
  NONE = "None"
}

export default Division;