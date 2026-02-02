import React, { useEffect, useState } from "react";
import type { useSocket } from "./socket";

export function useJogo(socket: ReturnType<typeof useSocket>) {
  const { estadoDoJogo, novoJogo, pedirHint, tentarJogada } = socket;
  const [letrasCorretas, setLetrasCorretas] = useState<string[]>([]);
  const [letrasIncorretas, setLetrasIncorretas] = useState<string[]>([]);

  function cliclarLetra(event: React.MouseEvent<HTMLButtonElement>) {
    const tmpLetra = event.currentTarget.innerHTML.toLowerCase();
    tentarJogada({ letra: tmpLetra, idJogo: estadoDoJogo.idJogo });
  }

  useEffect(() => {
    setLetrasIncorretas(estadoDoJogo.letrasErradas);
    setLetrasCorretas(estadoDoJogo.letrasCorretas);
  }, [estadoDoJogo]);

  return {
    estadoDoJogo,
    letrasCorretas,
    letrasIncorretas,
    novoJogo,
    pedirHint,
    cliclarLetra,
  };
}
