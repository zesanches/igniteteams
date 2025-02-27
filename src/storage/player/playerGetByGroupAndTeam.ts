import { playersGetByGroup } from "./playersGetByGroup";

export async function playerGetByGroupAndTeam(group: string, team: string) {
  try {
    const players = await playersGetByGroup(group);

    const playersByTeam = players.filter((player) => player.team === team);

    return playersByTeam;
  } catch (error) {
    throw error;
  }
}
