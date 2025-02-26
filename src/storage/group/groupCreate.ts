import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";
import { AppError } from "@utils/AppError";

export async function groupCreate(name: string) {
  try {
    const storedGroups = await groupsGetAll();
    const alreadyExists = storedGroups.includes(name);

    if (alreadyExists) {
      throw new AppError("Já existe um grupo cadastrado com esse nome.");
    }

    const newStorage = JSON.stringify([...storedGroups, name]);

    await AsyncStorage.setItem(GROUP_COLECTION, newStorage);
  } catch (error) {
    throw error;
  }
}
