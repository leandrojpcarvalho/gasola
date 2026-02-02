import type { Usuario } from "jogodaforca-shared";
import { useState, useEffect, useCallback } from "react";
import {
  contaGuest as criarContaGuest,
  obterInfoUsuario,
} from "../api/usuario";
import { armazenamentoLocal } from "../utils/local_storage";

export function useUsuario(): UsuarioHook {
  const [usuario, setUsario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  function existeToken() {
    const token = armazenamentoLocal({
      acao: "obter",
      chave: "token",
    });
    return Boolean(token);
  }

  async function criarGuest() {
    const token = await criarContaGuest();
    if (token) {
      armazenamentoLocal({ chave: "token", valor: token, acao: "atribuir" });
    }
  }

  const fetchUsuario = useCallback(async () => {
    if (!existeToken()) {
      await criarGuest();
    }
    try {
      const info = await obterInfoUsuario();
      setUsario(info);
    } catch {
      setUsario(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuario();
  }, [fetchUsuario]);

  return { usuario, carregando, atualizar: fetchUsuario };
}

export interface UsuarioHook {
  /**
   * Objeto do usuário ou null se não estiver autenticado
   */
  usuario: Usuario | null;
  /**
   * Indica se os dados do usuário estão sendo carregados
   */
  carregando: boolean;
  /**
   * Função para atualizar os dados do usuário
   */
  atualizar: () => Promise<void>;
}
