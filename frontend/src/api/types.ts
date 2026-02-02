export type TiposDeRequest<T, Rota extends object> =
  | {
      rota: keyof Rota;
      metodo: "post";
      payload: T;
    }
  | {
      rota: keyof Rota;
      metodo: "get";
    }
  | {
      rota: keyof Rota;
      metodo: "put";
      payload: Partial<T>;
    };

export type RespostaApi<T> = {
  mensagem: string;
  data: T;
};
