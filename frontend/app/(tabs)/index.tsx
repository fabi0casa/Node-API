import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { getJogos, deleteJogo } from "@/src/api";

export default function HomeScreen() {
  const [jogos, setJogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarJogos();
  }, []);

  async function carregarJogos() {
    try {
      setLoading(true);
      const data = await getJogos();
      setJogos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteJogo(id);
    await carregarJogos();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Lista de Jogos</Text>
      <FlatList
        data={jogos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagem || "https://via.placeholder.com/100" }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.titulo}</Text>
              <Text style={styles.info}>{item.genero?.map((g: any) => g.nome).join(", ")}</Text>
              <Text style={styles.info}>R$ {item.preco?.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item._id)}>
              <Text style={{ color: "#fff" }}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#222" },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  nome: { fontSize: 18, fontWeight: "600" },
  info: { fontSize: 14, color: "#555" },
  btnDelete: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
