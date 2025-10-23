import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  useWindowDimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Header from "@/components/Header";
import { API_URL } from "@/src/api";
import { getAddData, uploadJogo } from "@/src/api";
import { Platform } from "react-native";

export default function CadastrarJogo() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [imagem, setImagem] = useState("");
  const [upload, setUpload] = useState<any>(null);
  const [generos, setGeneros] = useState<any[]>([]);
  const [plataformas, setPlataformas] = useState<any[]>([]);
  const [selectedGenero, setSelectedGenero] = useState<string | null>(null);
  const [selectedPlataforma, setSelectedPlataforma] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  
  // Input de arquivo para o Web
  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const data = await getAddData();
      setGeneros(data.generos || []);
      setPlataformas(data.plataformas || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar gêneros e plataformas.");
    }
  }

  async function handleSelecionarImagem() {
    if (Platform.OS === "web") {
      fileInputRef.current?.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        setUpload(file);
        setImagem(file.uri);
      }
    }
  }
  
  function handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      setUpload(file);
      setImagem(URL.createObjectURL(file)); // preview
    }
  }

	async function handleSubmit() {
	  if (!titulo || !preco || !estoque || !selectedGenero || !selectedPlataforma) {
		return Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
	  }

	  setLoading(true);

	  try {
		const formData = new FormData();
		formData.append("titulo", titulo);
		formData.append("descricao", descricao);
		formData.append("preco", preco);
		formData.append("estoque", estoque);
		formData.append("genero", selectedGenero);
		formData.append("plataforma", selectedPlataforma);

		// Upload de imagem via dispositivo
        if (upload && upload.uri && Platform.OS !== "web") {
          const fileExt = upload.uri.split(".").pop() || "jpg";
          const mimeType = upload.mimeType || upload.type || `image/${fileExt}`;

          formData.append("upload", {
            uri: upload.uri,
            name: `foto.${fileExt}`,
            type: mimeType,
          } as any);
        }
        // Upload web (input file)
        else if (upload && Platform.OS === "web") {
          formData.append("upload", upload);
        }
	  
		// Caso o usuário use link direto (sem upload)
		else if (imagem) {
		  formData.append("imagemUrl", imagem);
		}

		await uploadJogo(formData);

		if (Platform.OS === "web") alert("Jogo cadastrado com sucesso!");
		else Alert.alert("Sucesso", "Jogo cadastrado com sucesso!");

		// Resetar campos
		setTitulo("");
		setDescricao("");
		setPreco("");
		setEstoque("");
		setImagem("");
		setUpload(null);
		setSelectedGenero(null);
		setSelectedPlataforma(null);
	  } catch (err: any) {
		console.error("Erro no envio:", err);
		if (Platform.OS === "web") alert("Erro ao cadastrar jogo.");
		else Alert.alert("Erro", err.message || "Não foi possível cadastrar o jogo.");
	  } finally {
		setLoading(false);
	  }
	}


  function toggleSelect(arr: string[], id: string, setter: any) {
    if (arr.includes(id)) setter(arr.filter((x) => x !== id));
    else setter([...arr, id]);
  }

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Cadastrar Novo Jogo</Text>

        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Digite o título"
		  placeholderTextColor="#999"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Digite uma descrição"
		  placeholderTextColor="#999"
          multiline
        />

        <View style={[styles.row, isMobile && { flexDirection: "column" }]}>
          <View style={[styles.flexItem, { marginRight: isMobile ? 0 : 8 }]}>
            <Text style={styles.label}>Preço *</Text>
            <TextInput
              style={styles.input}
              value={preco}
              onChangeText={setPreco}
              placeholder="0.00"
			  placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.flexItem, { marginLeft: isMobile ? 0 : 8 }]}>
            <Text style={styles.label}>Estoque *</Text>
            <TextInput
              style={styles.input}
              value={estoque}
              onChangeText={setEstoque}
              placeholder="0"
			  placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Gênero</Text>
        <View style={styles.multiSelect}>
			{generos.map((g) => (
			  <TouchableOpacity
				key={g._id}
				style={[
				  styles.selectItem,
				  selectedGenero === g._id && styles.selectedItem,
				]}
				onPress={() => setSelectedGenero(g._id)}
			  >
				<Text
				  style={[
					styles.selectText,
					selectedGenero === g._id && styles.selectedText,
				  ]}
				>
				  {g.nome}
				</Text>
			  </TouchableOpacity>
			))}
        </View>

        <Text style={styles.label}>Plataforma</Text>
        <View style={styles.multiSelect}>
			{plataformas.map((p) => (
			  <TouchableOpacity
				key={p._id}
				style={[
				  styles.selectItem,
				  selectedPlataforma === p._id && styles.selectedItem,
				]}
				onPress={() => setSelectedPlataforma(p._id)}
			  >
				<Text
				  style={[
					styles.selectText,
					selectedPlataforma === p._id && styles.selectedText,
				  ]}
				>
				  {p.nome}
				</Text>
			  </TouchableOpacity>
			))}
        </View>

        <Text style={styles.label}>Imagem (URL)</Text>
        <TextInput
          style={styles.input}
          value={imagem}
          onChangeText={setImagem}
          placeholder="https://exemplo.com/imagem.jpg"
		  placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleSelecionarImagem}
        >
          <Text style={styles.uploadText}>
            {upload ? "Imagem Selecionada" : "Selecionar Imagem do Dispositivo"}
          </Text>
        </TouchableOpacity>
		
		{/* input escondido para web */}
        {Platform.OS === "web" && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        )}

		{imagem ? (
		  <Image
			source={{ uri: imagem }}
			style={[
			  styles.preview,
			  { width: isMobile ? "100%" : "30%" }
			]}
			resizeMode="contain"
		  />
		) : null}

        <TouchableOpacity
          style={[styles.btnSalvar, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.btnSalvarText}>
            {loading ? "Salvando..." : "Salvar Jogo"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#222" },
  label: { fontSize: 14, fontWeight: "500", marginTop: 10, color: "#333" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 4,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  flexItem: { flex: 1 },
  multiSelect: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  selectItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eee",
    margin: 4,
  },
  selectedItem: {
    backgroundColor: "#4400FF",
  },
  selectText: { color: "#333" },
  selectedText: { color: "#fff" },
  uploadButton: {
    backgroundColor: "#2220C9",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  uploadText: { color: "#fff", fontWeight: "600" },
  preview: {
    width: "100%",
    aspectRatio: 1.5, 
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
    resizeMode: "contain",
  },
  btnSalvar: {
    backgroundColor: "#4400FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
	marginBottom: 20,
  },
  btnSalvarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});