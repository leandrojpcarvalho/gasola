/**
 * Normaliza texto removendo acentuação para comparação
 * @param texto Texto a ser normalizado
 * @returns Texto sem acentuação
 */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
