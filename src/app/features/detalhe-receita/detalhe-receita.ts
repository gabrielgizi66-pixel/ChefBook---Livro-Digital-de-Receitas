import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map, switchMap } from "rxjs";
import { ReceitasService } from "../../core/services/receitas.service";

@Component({
  selector: "app-detalhe-receita",
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: "./detalhe-receita.html",
  styleUrl: "./detalhe-receita.css",
})
export class DetalheReceita {
  readonly receita$;

  constructor(route: ActivatedRoute, receitasService: ReceitasService) {
    this.receita$ = route.paramMap.pipe(
      map((parametros) => Number(parametros.get("id"))),
      switchMap((id) => receitasService.buscarPorId(id)),
    );
  }
}
