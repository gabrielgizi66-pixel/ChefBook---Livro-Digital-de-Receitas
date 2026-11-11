import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { map } from "rxjs";
import { ReceitasService } from "../../core/services/receitas.service";

@Component({
  selector: "app-home",
  imports: [RouterLink, AsyncPipe],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home {
  readonly receitasDestaque$;

  constructor(receitasService: ReceitasService) {
    this.receitasDestaque$ = receitasService
      .listar()
      .pipe(map((receitas) => receitas.slice(0, 10)));
  }

  moverCarrossel(trilho: HTMLElement, direcao: number): void {
    trilho.scrollBy({ left: direcao * 340, behavior: "smooth" });
  }
}
