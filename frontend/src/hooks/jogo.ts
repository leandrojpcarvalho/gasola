import React, { useEffect, useRef, useState } from "react";
import { EEstadoDeJogo } from "jogodaforca-shared";
import type { useSocket } from "./socket";
import { keyboardSounds } from "../utils/keyboard_sounds";

export function useJogo(socket: ReturnType<typeof useSocket>) {
  const { estadoDoJogo, novoJogo, pedirHint, tentarJogada } = socket;
  const [letrasCorretas, setLetrasCorretas] = useState<string[]>([]);
  const [letrasIncorretas, setLetrasIncorretas] = useState<string[]>([]);

  // Refs para controlar sons apenas nas mudanças
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
    // Toca som de acerto se aumentou letras corretas
    if (estadoDoJogo.letrasCorretas.length > prevLetrasCorretas.current) {
      keyboardSounds.playCorrect();
    }

    // Toca som de erro se aumentou letras erradas
    if (estadoDoJogo.letrasErradas.length > prevLetrasIncorretas.current) {
      keyboardSounds.playWrong();
    }

    // Toca som de vitória ou derrota
    if (estadoDoJogo.estado !== prevEstado.current) {
      if (estadoDoJogo.estado === EEstadoDeJogo.VITORIA) {
        setTimeout(() => keyboardSounds.playVictory(), 300);
      } else if (estadoDoJogo.estado === EEstadoDeJogo.DERROTA) {
        setTimeout(() => keyboardSounds.playDefeat(), 300);
      }
    }

    // Atualiza refs
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
  };
}
