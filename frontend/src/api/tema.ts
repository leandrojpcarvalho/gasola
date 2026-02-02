import type { Tema } from "jogodaforca-shared";
import { temaApiRequest } from "./config";

export async function obterTemas() {
  return temaApiRequest<Tema[]>(
    {
      metodo: "get",
      rota: "listar",
    },
    false,
  );
}
