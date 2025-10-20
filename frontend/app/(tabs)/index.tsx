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

import Header from "@/components/Header";
import ImagePopup from "@/components/ImagePopup";

import { getJogos, deleteJogo } from "@/src/api";

import trashIcon from "@/assets/images/symbols/trash.png";
import editIcon from "@/assets/images/symbols/edit.png";
import platformIcon from "@/assets/images/symbols/platform.png";

export default function HomeScreen() {
  const [jogos, setJogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJogos, setTotalJogos] = useState(0);

  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  useEffect(() => {
    carregarJogos(page);
  }, [page]);

  async function carregarJogos(pagina: number) {
    try {
      setLoading(true);
      const data = await getJogos(pagina);

      let jogosArray: any[] = [];
      let current = pagina;
      let totalP = 1;
      let totalJ = 0;

      jogosArray = (data as any).jogos;
      current = (data as any).currentPage ?? pagina;
      totalP = (data as any).totalPages ?? 1;
      totalJ = (data as any).totalJogos ?? jogosArray.length;

      setJogos(jogosArray);
      setPage(current);
      setTotalPages(totalP);
      setTotalJogos(totalJ);
	  
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteJogo(id);
    await carregarJogos(1);
  }
  
  
  function handleProximaPagina() {
    if (page < totalPages) setPage(page + 1);
  }

  function handlePaginaAnterior() {
    if (page > 1) setPage(page - 1);
  }
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);

  function handleImagePress(url: string) {
    setSelectedImage(url);
    setPopupVisible(true);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
  <>
    <Header />
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Jogos</Text>

      <FlatList
        data={jogos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
           <TouchableOpacity onPress={() => handleImagePress(item.imagem)}>
              <Image
                source={{ uri: item.imagem || "https://via.placeholder.com/100" }}
                style={styles.image}
              />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.titulo}</Text>

              {/* gênero */}
              <Text style={styles.info}>
                 {item.genero?.map((g: any) => g.nome).join(", ") || "—"}
              </Text>

              {/* plataforma */}
			  <View style={styles.infoRow}>
			    <Image source={platformIcon} style={styles.iconSmall} />
			    <Text style={styles.infoText}>
				  {item.plataforma?.map((p: any) => p.nome).join(", ") || "—"}
			    </Text>
			  </View>

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
             <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(item._id)}>
			   <Image source={trashIcon} style={styles.iconButton} />
			 </TouchableOpacity>

			 <TouchableOpacity
			    style={[styles.btnEdit, isMobile && { marginTop: 5 }]}
			    onPress={() => console.log("Editar", item._id)}
			 >
			   <Image source={editIcon} style={styles.iconButton} />
			 </TouchableOpacity>
            </View>
			
          </View>
        )}
      />
	  
	  	<View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.pageButton, page === 1 && styles.disabledButton]}
            onPress={handlePaginaAnterior}
            disabled={page === 1}
          >
            <Text style={styles.pageButtonText}>← Anterior</Text>
          </TouchableOpacity>
		  
			<Text
			  style={[
				styles.pageInfo,
				isMobile && { fontSize: 12, textAlign: "center" },
			  ]}
			> 
			  {isMobile
				? `${page} de ${totalPages}`
				: `Página ${page} de ${totalPages} — Total de jogos: ${totalJogos}`}
			</Text>
	   
          <TouchableOpacity
            style={[
              styles.pageButton,
              page === totalPages && styles.disabledButton,
            ]}
            onPress={handleProximaPagina}
            disabled={page === totalPages}
          >
            <Text style={styles.pageButtonText}>Próxima →</Text>
          </TouchableOpacity>
        </View>
	  
    </View>
	
	<ImagePopup
      visible={popupVisible}
      imageUrl={selectedImage}
      onClose={() => setPopupVisible(false)}
    />
	
  </>
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  iconSmall: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  infoText: {
    fontSize: 12,
    color: "#555",
  },
  iconButton: {
    width: 18,
    height: 18,
    tintColor: "#fff",
    alignSelf: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 30,
  },
  pageButton: {
    backgroundColor: "#4400FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pageButtonText: { color: "#fff", fontWeight: "bold" },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageInfo: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    alignSelf: "center",
    textAlign: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
