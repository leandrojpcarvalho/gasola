import { createBrowserRouter } from "react-router-dom";
import { Historico, Index, Jogo, Layout, Login, Ranking } from "../views/index";
import { NotFound } from "../components/NotFound";
import { Usuario } from "../views/Usuario";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
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
        children: [
          {
            path: "historico",
            element: <Historico />,
          }
        ],
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  }
])
