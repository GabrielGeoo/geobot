import { createCanvas } from "canvas";

export default function getLevelImage(data: any) {
    const level = data.user.progress.level;
    const currentXp = data.user.progress.xp - data.user.progress.levelXp;
    const nextLevelXp = data.user.progress.nextLevelXp - data.user.progress.levelXp;
    const width = 4000;
    const height = 320;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#fecd19";
    ctx.font = "italic bold 110px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`NIV ${level}`, width/10, height/2);

    const x = width/5;
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.4;
    ctx.fillRect(x, 0, width - x, height);
    ctx.globalAlpha = 1;

    const w = (currentXp / nextLevelXp) * (width - x);
    ctx.fillStyle = "#fecd19";
    ctx.fillRect(x, 0, w, height);
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "italic bold 104px sans-serif";
    ctx.fillText(`${currentXp} / ${nextLevelXp}`, x+(width-x)/2, height/2);

    return canvas.toBuffer("image/png");
}