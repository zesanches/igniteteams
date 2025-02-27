import { Container, Form, HeaderList, PlayersNumber } from "./styles";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Alert, FlatList, TextInput } from "react-native";
import { useEffect, useRef, useState } from "react";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type RouteParams = {
  group: string;
};

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [playerName, setPlayerName] = useState<string>("");
  const [team, setTeam] = useState<string>("Time A");
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const route = useRoute();
  const { group } = route.params as RouteParams;
  const inputPlayerNameRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  async function handleAddPlayer() {
    if (playerName.trim().length === 0) {
      return Alert.alert(
        "Novo Jogador",
        "Informe o nome do jogador para adicionar."
      );
    }

    const newPlayer = {
      name: playerName,
      team,
    };

    try {
      await playerAddByGroup(newPlayer, group);

      inputPlayerNameRef.current?.blur();

      setPlayerName("");
      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        return Alert.alert("Novo Jogador", error.message);
      } else {
        return Alert.alert(
          "Novo Jogador",
          "Ocorreu um erro ao adicionar o jogador."
        );
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);

      const playerByTeam = await playerGetByGroupAndTeam(group, team);

      setPlayers(playerByTeam);
    } catch (error) {
      Alert.alert("Novo Jogador", "Ocorreu um erro ao buscar os jogadores.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      Alert.alert("Remover Jogador", "Ocorreu um erro ao remover o jogador.");
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate("groups");
    } catch (error) {
      Alert.alert("Remover Grupo", "Ocorreu um erro ao remover o grupo.");
    }
  }

  async function handleGroupRemove(group: string) {
    Alert.alert("Remover Grupo", "Deseja remover o grupo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => groupRemove() },
    ]);
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />
      <Highlight title={group} subtitle="Adicione a galera e separe os times" />
      <Form>
        <Input
          inputRef={inputPlayerNameRef}
          placeholder="Nome da Pessoa"
          autoCorrect={false}
          onChangeText={setPlayerName}
          value={playerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
        <PlayersNumber>{players.length}</PlayersNumber>
      </HeaderList>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              onRemove={() => handlePlayerRemove(item.name)}
              name={item.name}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há pessoas nesse time." />
          )}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}

      <Button
        title="Remover Turma"
        type="SECONDARY"
        onPress={() => handleGroupRemove(group)}
      />
    </Container>
  );
}
