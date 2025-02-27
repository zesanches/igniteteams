import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { PlayerStorageDTO } from "./PlayerStorageDTO";
import { playersGetByGroup } from "./playersGetByGroup";

export async function playerAddByGroup(
  player: PlayerStorageDTO,
  group: string
) {
  try {
    const storagedPlayers = await playersGetByGroup(group);
    const playerAlreadyExist = await storagedPlayers.filter(
      (p) => p.name === player.name
    );

    console.log(playerAlreadyExist);

    if (playerAlreadyExist.length > 0) {
      throw new AppError("Jogador já está adicionado em um time.");
    }

    const storage = JSON.stringify([...storagedPlayers, player]);

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
  } catch (error) {
    throw error;
  }
}
