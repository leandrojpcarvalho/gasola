import { io, Socket } from "socket.io-client";
import { armazenamentoLocal } from "../utils/local_storage";
import { baseURL } from "../api/config";
import {
  ESocketEventos,
  EEstadoDeJogo,
  type Tentativa,
  type Usuario,
  type Estado,
  type RestaurarJogo,
  type FinalizarJogo,
  type SolicitarDica,
  type RespostaAtualizarJogo,
  type RespostaCarregarJogo,
  type GerarJogoPorIA,
  type SolicitarNovoJogo,
  type RespostaConectar,
} from "jogodaforca-shared";
import { useState, useEffect } from "react";
import { alert } from "../utils/alert";
import { useNavigate } from "react-router-dom";

let socketInstance: Socket | null = null;

function getSocket() {
  if (!socketInstance) {
    const token = armazenamentoLocal({
      acao: "obter",
      chave: "token",
    });

    socketInstance = io(baseURL, {
      auth: { token },
      autoConnect: false,
    });
  }
  return socketInstance;
}

export function useSocket(usuario: Usuario | null) {
  const socketCliente = getSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const nav = useNavigate();
  const [estadoDoJogo, setEstadoDoJogo] = useState<Estado | null>(null);

  function solicitarRestaurarJogo(idJogo: number) {
    if (usuario) {
      setIsLoading(true);
      const dadosRestaurarJogo: RestaurarJogo = {
        jogoId: idJogo,
        type: "restaurar",
      };
      socketCliente.emit(ESocketEventos.ATUALIZAR_PARTIDA, dadosRestaurarJogo);
    }
  }

  function irParaJogar() {
    nav("/jogar");
  }

  function irParaPaginaInicial() {
    nav("/");
  }

  function finalizarJogo(idJogo: number) {
    setIsLoading(true);
    const finalizar: FinalizarJogo = {
      type: "finalizar",
      idJogo,
    };
    socketCliente.emit(ESocketEventos.ATUALIZAR_PARTIDA, finalizar);
  }

  function novoJogoTemaIA(tema: string, idUsuario: number) {
    setIsLoading(true);
    const novoJogoIa: GerarJogoPorIA = {
      type: "gerar",
      tema,
      idUsuario,
    };
    socketCliente.emit(ESocketEventos.NOVO_JOGO, novoJogoIa);
  }

  function novoJogo(novoJogo: SolicitarNovoJogo) {
    setIsLoading(true);
    socketCliente.emit(ESocketEventos.NOVO_JOGO, novoJogo);
  }

  function tentarJogada(tentativa: Tentativa) {
    socketCliente.emit(ESocketEventos.ATUALIZAR_PARTIDA, tentativa);
  }

  function pedirHint() {
    if (!estadoDoJogo) return;
    setIsLoadingHint(true);
    const dica: SolicitarDica = {
      type: "dica",
      idJogo: estadoDoJogo.idJogo,
      geradaPorIa: estadoDoJogo.dicasUtilizadas.length === 3 ? true : false,
    };
    socketCliente.emit(ESocketEventos.ATUALIZAR_PARTIDA, dica);
  }

  useEffect(() => {
    if (!estadoDoJogo) return;
    if (estadoDoJogo.estado !== EEstadoDeJogo.ATIVO) {
      armazenamentoLocal({
        acao: "remover",
        chave: "jogoId",
      });
    }
  }, [estadoDoJogo]);

  useEffect(() => {
    const handleAtualizarPartida = (novoEstado: RespostaAtualizarJogo) => {
      setIsLoading(false);
      setIsLoadingHint(false);
      if (!novoEstado.sucesso) {
        alert(400, "Erro", novoEstado.mensagem);
        return;
      }
      if (novoEstado.type === "carregado") {
        if (novoEstado.dado.estado !== EEstadoDeJogo.ATIVO) {
          setEstadoDoJogo(null);
          return;
        }
        setEstadoDoJogo(novoEstado.dado);
        irParaJogar();
        return;
      }

      if (novoEstado.type === "finalizado") {
        setEstadoDoJogo(null);
        irParaPaginaInicial();
        return;
      }
    };

    const handleNovoJogo = (novoJogo: RespostaCarregarJogo) => {
      setIsLoading(false);
      if (novoJogo.sucesso) {
        if (novoJogo.type === "carregado") {
          setEstadoDoJogo(novoJogo.dado);
        }
        armazenamentoLocal({
          acao: "atribuir",
          chave: "jogoId",
          valor: novoJogo.dado.idJogo.toString(),
        });
        irParaJogar();
      } else {
        alert(400, "Novo Jogo", "Não foi possível iniciar um novo jogo.");
      }
    };
    socketCliente.on(ESocketEventos.CONECTAR, (resposta: RespostaConectar) => {
      if (resposta.sucesso) {
        armazenamentoLocal({
          acao: "atribuir",
          chave: "iaDisponivel",
          valor: resposta.dado.ia ? "true" : "false",
        });
      }
    });
    socketCliente.on(ESocketEventos.ATUALIZAR_PARTIDA, handleAtualizarPartida);
    socketCliente.on(ESocketEventos.NOVO_JOGO, handleNovoJogo);

    if (!socketCliente.connected) {
      socketCliente.connect();
    }

    socketCliente.on("connect", () => {
      socketCliente.emit(ESocketEventos.CONECTAR);
    });

    return () => {
      socketCliente.off(
        ESocketEventos.ATUALIZAR_PARTIDA,
        handleAtualizarPartida,
      );
      socketCliente.off(ESocketEventos.NOVO_JOGO, handleNovoJogo);
      socketCliente.off(ESocketEventos.DESCONECTAR);
    };
  }, [socketCliente, usuario]);

  return {
    novoJogo,
    tentarJogada,
    pedirHint,
    solicitarRestaurarJogo,
    finalizarJogo,
    novoJogoTemaIA,
    estadoDoJogo,
    isLoading,
    isLoadingHint,
  };
}
