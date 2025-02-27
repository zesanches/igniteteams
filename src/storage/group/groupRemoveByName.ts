import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION, GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";

export async function groupRemoveByName(groupName: string) {
  try {
    const storedGroups = await groupsGetAll();
    const newGroups = storedGroups.filter((group) => group !== groupName);
    const newStorage = JSON.stringify(newGroups);

    await AsyncStorage.setItem(GROUP_COLLECTION, newStorage);
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupName}`);
  } catch (error) {
    throw error;
  }
}
