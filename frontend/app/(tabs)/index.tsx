import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { getJogos, deleteJogo } from "@/src/api";

export default function HomeScreen() {
  const [jogos, setJogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    carregarJogos();
  }, []);

  const isMobile = width < 600; // define se é ou não é mobile

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
            <Image
              source={{ uri: item.imagem || "https://via.placeholder.com/100" }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.titulo}</Text>

              {/* gênero */}
              <Text style={styles.info}>
                 {item.genero?.map((g: any) => g.nome).join(", ") || "—"}
              </Text>

              {/* plataforma */}
              <Text style={styles.info}>
                🕹 {item.plataforma?.map((p: any) => p.nome).join(", ") || "—"}
              </Text>

            </View>
			  
			<View style={styles.precoContainer}>
			  <View style={styles.precoLinha}>
				<Text style={styles.simbolo}>R$</Text>
				<Text style={styles.valor}>{item.preco?.toFixed(2) || "0,00"}</Text>
			  </View>
			  <Text style={styles.estoque}>estoque: {item.estoque ?? 0}</Text>
			</View>

			{/* container dinâmico */}
            <View
              style={[
                styles.btnContainer,
                isMobile && { flexDirection: "column" }, // empilha no celular
              ]}
            >
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>🗑</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnEdit, isMobile && { marginTop: 5 }]}
                onPress={() => console.log("Editar", item._id)}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>✎</Text>
              </TouchableOpacity>
            </View>
			
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
	height: 130,
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  nome: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  info: { fontSize: 12, color: "#555", marginBottom: 2 },
  precoContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginRight: 10,
  },
  precoLinha: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  simbolo: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#190061",
    marginRight: 2,
  },
  valor: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#190061",
    minWidth: 10,
    textAlign: "right",
  },
  estoque: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
   btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  btnDelete: {
    backgroundColor: "#CC0000",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
	width: 33,
  },
   btnEdit: {
    backgroundColor: "#0025D6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
	width: 33,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
