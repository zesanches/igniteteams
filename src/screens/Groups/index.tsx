import { Alert, FlatList, Text } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { GroupCard } from "@components/GroupCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { Container } from "./styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { groupsGetAll } from "@storage/group/groupsGetAll";
import { Loading } from "@components/Loading";

export function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([
    "Galera do Rocketseat",
    "Galera do Ignite",
  ]);
  const navigation = useNavigation();

  const handleNewGroup = () => {
    navigation.navigate("new-group");
  };

  const fetchGroups = async () => {
    try {
      setIsLoading(true);

      const data = await groupsGetAll();
      setGroups(data);
    } catch (error) {
      Alert.alert("Turmas", "Ocorreu um erro ao buscar as turmas cadastradas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenGroup = (group: string) => {
    navigation.navigate("players", { group });
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <Header />
      <Highlight title="Turmas" subtitle="Jogue com a sua turma" />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <GroupCard title={item} onPress={() => handleOpenGroup(item)} />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty message="Que tal cadastrar a primeira turma?" />
          )}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Button title="Criar Turma" onPress={handleNewGroup} />
    </Container>
  );
}
