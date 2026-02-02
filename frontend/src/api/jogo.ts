import type { Ranking } from "jogodaforca-shared";
import { jogoApiRequest } from "./config";

export async function obterRanking() {
  return jogoApiRequest<Ranking[]>(
    {
      metodo: "get",
      rota: "ranking",
    },
    false,
  );
}
