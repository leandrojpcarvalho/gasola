import { armazenamentoLocal } from "./local_storage";

function gerarUUID(): string {
  // Tenta usar crypto.randomUUID se disponível
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: gera UUID v4 manualmente
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function obterUUID(): string {
  let uuid = armazenamentoLocal({ chave: "uuid", acao: "obter" });
  if (!uuid) {
    uuid = gerarUUID();
    armazenamentoLocal({ chave: "uuid", acao: "atribuir", valor: uuid });
  }
  return uuid;
}
