const API_URL = "http://localhost:5000/api";

export async function getJogos() {
  const res = await fetch(`${API_URL}/jogos`);
  if (!res.ok) throw new Error("Erro ao buscar jogos");
  const data = await res.json();
  // A API retorna { jogos: [...], totalPages, ... }
  return data.jogos || []; // retorna só o array de jogos
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
