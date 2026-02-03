import React, { useEffect, useRef, useState } from "react";
import { EEstadoDeJogo } from "jogodaforca-shared";
import type { useSocket } from "./socket";
import { keyboardSounds } from "../utils/keyboard_sounds";

export function useJogo(socket: ReturnType<typeof useSocket>) {
  const {
    estadoDoJogo,
    novoJogo,
    pedirHint,
    tentarJogada,
    limparConteudoDoJogo,
  } = socket;
  const [letrasCorretas, setLetrasCorretas] = useState<string[]>([]);
  const [letrasIncorretas, setLetrasIncorretas] = useState<string[]>([]);

  const prevLetrasCorretas = useRef<number>(0);
  const prevLetrasIncorretas = useRef<number>(0);
  const prevEstado = useRef<EEstadoDeJogo>(EEstadoDeJogo.ATIVO);

  function cliclarLetra(event: React.MouseEvent<HTMLButtonElement>) {
    const tmpLetra = event.currentTarget.innerHTML.toLowerCase();
    if (!estadoDoJogo) return;
    tentarJogada({ letra: tmpLetra, idJogo: estadoDoJogo.idJogo });
  }

  useEffect(() => {
    if (!estadoDoJogo) return;
    function atualizarLetras() {
      if (!estadoDoJogo) return;
      setLetrasIncorretas(estadoDoJogo.letrasErradas);
      setLetrasCorretas(estadoDoJogo.letrasCorretas);
    }
    atualizarLetras();
    if (estadoDoJogo.letrasCorretas.length > prevLetrasCorretas.current) {
      keyboardSounds.playCorrect();
    }

    if (estadoDoJogo.letrasErradas.length > prevLetrasIncorretas.current) {
      keyboardSounds.playWrong();
    }

    if (estadoDoJogo.estado !== prevEstado.current) {
      if (estadoDoJogo.estado === EEstadoDeJogo.VITORIA) {
        setTimeout(() => keyboardSounds.playVictory(), 300);
      } else if (estadoDoJogo.estado === EEstadoDeJogo.DERROTA) {
        setTimeout(() => keyboardSounds.playDefeat(), 300);
      }
    }

    prevLetrasCorretas.current = estadoDoJogo.letrasCorretas.length;
    prevLetrasIncorretas.current = estadoDoJogo.letrasErradas.length;
    prevEstado.current = estadoDoJogo.estado;
  }, [estadoDoJogo]);

  return {
    estadoDoJogo,
    letrasCorretas,
    letrasIncorretas,
    novoJogo,
    pedirHint,
    cliclarLetra,
    limparConteudoDoJogo,
  };
}
