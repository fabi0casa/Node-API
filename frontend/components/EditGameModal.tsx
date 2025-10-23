import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  useWindowDimensions,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_URL, STATIC_URL, getAddData, getJogoById, updateJogo } from "@/src/api";

interface EditGameModalProps {
  visible: boolean;
  jogoId: string | null;
  onClose: () => void;
  onUpdated: () => void; // callback para atualizar lista após edição
}

export default function EditGameModal({
  visible,
  jogoId,
  onClose,
  onUpdated,
}: EditGameModalProps) {
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
  const [saving, setSaving] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const fileInputRef = useRef<any>(null);

  // Carregar dados auxiliares (gêneros/plataformas)
  useEffect(() => {
    if (visible) {
      (async () => {
        await carregarDados();
        if (jogoId) await carregarJogo();
      })();
    }
  }, [visible, jogoId]);

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

  async function carregarJogo() {
    try {
      setLoading(true);
      const jogo = await getJogoById(jogoId);

      setTitulo(jogo.titulo || "");
      setDescricao(jogo.descricao || "");
      setPreco(String(jogo.preco || ""));
      setEstoque(String(jogo.estoque || ""));
      setImagem(
        jogo.imagem?.startsWith("/uploads/")
          ? STATIC_URL + jogo.imagem
          : jogo.imagem || ""
      );
	  
	  setSelectedGenero(
	    Array.isArray(jogo.genero)
		  ? jogo.genero[0]?._id || null
		  : jogo.genero?._id || null
	  );

	  setSelectedPlataforma(
	    Array.isArray(jogo.plataforma)
	  	  ? jogo.plataforma[0]?._id || null
		  : jogo.plataforma?._id || null
	  );

    } catch (err) {
      console.error(err);
	  if (Platform.OS === "web") alert("Não foi possível carregar as informações do jogo.");
      else Alert.alert("Erro", "Não foi possível carregar as informações do jogo.");
    } finally {
      setLoading(false);
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
      setImagem(URL.createObjectURL(file));
    }
  }

  async function handleAtualizar() {
    if (!titulo || !preco || !estoque || !selectedGenero || !selectedPlataforma) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("preco", preco);
      formData.append("estoque", estoque);
      formData.append("genero[]", selectedGenero);
      formData.append("plataforma[]", selectedPlataforma);

      if (upload && upload.uri && Platform.OS !== "web") {
        const fileExt = upload.uri.split(".").pop() || "jpg";
        const mimeType = upload.mimeType || upload.type || `image/${fileExt}`;
        formData.append("upload", {
          uri: upload.uri,
          name: `foto.${fileExt}`,
          type: mimeType,
        } as any);
      } else if (upload && Platform.OS === "web") {
        formData.append("upload", upload);
      } else if (imagem) {
        formData.append("imagemUrl", imagem);
      }

      await updateJogo(jogoId, formData);
	  
	  if (Platform.OS === "web") alert("Jogo atualizado com sucesso!.");
      else Alert.alert("Sucesso", "Jogo atualizado com sucesso!");
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
	  if (Platform.OS === "web") alert("Não foi possível atualizar o jogo.");
      else Alert.alert("Erro", err.message || "Não foi possível atualizar o jogo.");
    } finally {
      setSaving(false);
    }
  }

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { width: isMobile ? "90%" : "80%" }]}>
          <ScrollView>
            <Text style={styles.title}>Editar Jogo</Text>

            {loading ? (
              <Text style={{ textAlign: "center", marginVertical: 20 }}>Carregando...</Text>
            ) : (
              <>
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
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={[styles.flexItem, { marginLeft: isMobile ? 0 : 8 }]}>
                    <Text style={styles.label}>Estoque *</Text>
                    <TextInput
                      style={styles.input}
                      value={estoque}
                      onChangeText={setEstoque}
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor="#999"
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

                <TouchableOpacity style={styles.uploadButton} onPress={handleSelecionarImagem}>
                  <Text style={styles.uploadText}>
                    {upload ? "Imagem Selecionada" : "Selecionar Imagem do Dispositivo"}
                  </Text>
                </TouchableOpacity>

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
                    style={[styles.preview, { width: isMobile ? "100%" : "40%" }]}
                    resizeMode="contain"
                  />
                ) : null}

                <View style={styles.footer}>
                  <TouchableOpacity style={[styles.cancelBtn, { width: isMobile ? "" : "48%" }]} onPress={onClose}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.saveBtn, saving && { opacity: 0.6 }, { width: isMobile ? "" : "48%" }]}
                    onPress={handleAtualizar}
                    disabled={saving}
                  >
                    <Text style={styles.saveText}>
                      {saving ? "Salvando..." : "Atualizar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: "90%",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },
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
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
    aspectRatio: 1.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 10,
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
	alignItems: "center",
    borderRadius: 8,
  },
  cancelText: { color: "#333", fontWeight: "bold" },
  saveBtn: {
    backgroundColor: "#4400FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
	alignItems: "center",
    borderRadius: 8,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});
