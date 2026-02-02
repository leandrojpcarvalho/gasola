import { createBrowserRouter } from "react-router-dom";
import { Jogo, Layout, Login, Cadastro, Ranking, PaginaInicial } from "../views/index";
import { NotFound } from "../components/NotFound";
import { Usuario } from "../views/Usuario";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <PaginaInicial />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/cadastro",
        element: <Cadastro />,
      },
      {
        path: "/jogar",
        element: <Jogo />,
      },
      {
        path: "/ranking",
        element: <Ranking />,
      },
      {
        path: "/usuario",
        element: <Usuario />,
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  }
])
