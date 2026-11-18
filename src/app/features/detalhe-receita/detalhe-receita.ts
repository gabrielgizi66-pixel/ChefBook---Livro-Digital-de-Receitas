import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { catchError, map, of, startWith, switchMap } from "rxjs";
import { Receita } from "../../core/models/receita.model";
import { ReceitasService } from "../../core/services/receitas.service";

type EstadoReceita = Receita | "carregando" | "erro";

@Component({
  selector: "app-detalhe-receita",
  imports: [RouterLink],
  templateUrl: "./detalhe-receita.html",
  styleUrl: "./detalhe-receita.css",
})
export class DetalheReceita {
  private route = inject(ActivatedRoute);
  private receitasService = inject(ReceitasService);

  private estado = toSignal(
    this.route.paramMap.pipe(
      map((parametros) => parametros.get("id") ?? ""),
      switchMap((id) =>
        this.receitasService.getById(id).pipe(
          map((receita): EstadoReceita => receita),
          catchError(() => of<EstadoReceita>("erro")),
          startWith<EstadoReceita>("carregando"),
        ),
      ),
    ),
    { initialValue: "carregando" as EstadoReceita },
  );

  readonly carregando = computed(() => this.estado() === "carregando");
  readonly receita = computed(() => {
    const estado = this.estado();
    return typeof estado === "object" ? estado : null;
  });
}
