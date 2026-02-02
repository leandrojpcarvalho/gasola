const localStorageMap: Record<string, string> = {
  token: "token",
  jogoId: "jogoId",
  uuid: "uuid",
  idJogador: "idJogador",
  iaDisponivel: "iaDisponivel",
};

type LocalStorageParams =
  | {
      chave: keyof typeof localStorageMap;
      acao: "obter" | "remover";
    }
  | {
      chave: keyof typeof localStorageMap;
      acao: "atribuir";
      valor: string;
    };

function atribuirLocalStorage(
  chave: keyof typeof localStorageMap,
  valor: string,
) {
  localStorage.setItem(localStorageMap[chave], valor);
}

function obterLocalStorage(chave: keyof typeof localStorageMap) {
  return localStorage.getItem(localStorageMap[chave]);
}

function removerLocalStorage(chave: keyof typeof localStorageMap) {
  localStorage.removeItem(localStorageMap[chave]);
}

export function armazenamentoLocal(params: LocalStorageParams) {
  const { chave, acao } = params;
  if (acao === "atribuir") {
    atribuirLocalStorage(chave, params.valor);
  } else if (acao === "obter") {
    return obterLocalStorage(chave);
  } else if (acao === "remover") {
    removerLocalStorage(chave);
  }
}
