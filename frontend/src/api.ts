export const API_URL = "http://192.168.0.10:5000/api";
export const STATIC_URL = "http://192.168.0.10:5000"

export async function getJogos(page = 1) {
  const res = await fetch(`${API_URL}/jogos?page=${page}`);
  if (!res.ok) throw new Error("Erro ao buscar jogos");
  const data = await res.json();

  // converte para objeto padrão
  if (Array.isArray(data)) {
    return {
      currentPage: page,
      totalPages: 1,
      totalJogos: data.length,
      jogos: data,
    };
  }

  return data;
}

// Buscar gêneros e plataformas
export async function getAddData() {
  const res = await fetch(`${API_URL}/jogos/add-data`);
  if (!res.ok) throw new Error("Erro ao buscar dados de cadastro");
  return res.json();
}

// Enviar novo jogo com imagem (FormData)
export async function uploadJogo(formData: FormData) {
  const res = await fetch(`${API_URL}/jogos/add`, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erro HTTP: ${res.status} - ${errText}`);
  }

  return res.json();
}

//Deleta um jogo
export async function deleteJogo(id: string) {
  const res = await fetch(`${API_URL}/jogos/delete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao deletar jogo");
  return res.json();
}

// Buscar um jogo pelo ID
export async function getJogoById(id: string) {
  const res = await fetch(`${API_URL}/jogos/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar jogo");
  return res.json();
}

// Atualizar jogo existente
export async function updateJogo(id: string, formData: FormData) {
  const res = await fetch(`${API_URL}/jogos/edit/${id}`, {
    method: "PUT",
    body: formData,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erro HTTP: ${res.status} - ${errText}`);
  }

  return res.json();
}

