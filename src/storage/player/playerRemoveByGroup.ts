import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playersGetByGroup } from "./playersGetByGroup";

export async function playerRemoveByGroup(
  playerName: string,
  playerGroup: string
) {
  try {
    const players = await playersGetByGroup(playerGroup);
    const newPlayers = players.filter((player) => player.name !== playerName);
    const newStorage = JSON.stringify(newPlayers);

    await AsyncStorage.setItem(
      `${PLAYER_COLLECTION}-${playerGroup}`,
      newStorage
    );
  } catch (error) {
    throw error;
  }
}
