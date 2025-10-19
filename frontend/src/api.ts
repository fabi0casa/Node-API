const API_URL = "http://192.168.0.10:5000/api";

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

export async function addJogo(jogo: any) {
  const res = await fetch(`${API_URL}/jogos/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jogo),
  });
  if (!res.ok) throw new Error("Erro ao adicionar jogo");
  return res.json();
}

export async function deleteJogo(id: string) {
  const res = await fetch(`${API_URL}/jogos/delete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao deletar jogo");
  return res.json();
}
