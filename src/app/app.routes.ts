// @ts-ignore - resolves the editor warning when Angular router typings are not yet available in the environment
import { Routes } from "@angular/router";
export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/home/home").then((m) => m.Home),
    title: "Início | ChefBook",
  },
  {
    path: "sobre",
    loadComponent: () => import("./features/sobre/sobre").then((m) => m.Sobre),
    title: "Sobre | ChefBook",
  },
  {
    path: "receitas",
    loadComponent: () =>
      import("./features/receitas/receitas").then((m) => m.receitas),
    title: "Receitas | ChefBook",
  },
  {
    path: "receitas/:id",
    loadComponent: () =>
      import("./features/detalhe-receita/detalhe-receita").then(
        (m) => m.Detalhereceita,
      ),
    title: "Detalhes da receita | ChefBook",
  },
  {
    path: "admin",
    loadComponent: () => import("./features/admin/admin").then((m) => m.Admin),
    title: "Admin | ChefBook",
  },
  {
    path: "admin/novo",
    loadComponent: () =>
      import("./features/manutencao-receita/manutencao-receita").then(
        (m) => m.Manutencaoreceita,
      ),
    title: "Nova receita | ChefBook",
  },
  {
    path: "admin/editar/:id",
    loadComponent: () =>
      import("./features/manutencao-receita/manutencao-receita").then(
        (m) => m.Manutencaoreceita,
      ),
    title: "Editar receita | ChefBook",
  },
  { path: "**", redirectTo: "" },
];
