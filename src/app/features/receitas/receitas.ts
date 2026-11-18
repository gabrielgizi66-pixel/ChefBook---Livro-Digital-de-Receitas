import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Receita } from "../../core/models/receita.model";
import { ReceitasService } from "../../core/services/receitas.service";

@Component({
  selector: "app-receitas",
  templateUrl: "./receitas.html",
  styleUrl: "./receitas.css",
  imports: [RouterLink],
})
export class Receitas implements OnInit {
  private receitaService = inject(ReceitasService);

  receitas = signal<Receita[]>([]);
  loading = signal(true);
  errorMessage = signal("");
  busca = signal("");

  receitasFiltradas = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    return this.receitas()
      .filter((receita) => receita.publicada)
      .filter(
        (receita) =>
          !termo ||
          receita.nome.toLowerCase().includes(termo) ||
          receita.categoria.toLowerCase().includes(termo),
      );
  });

  ngOnInit(): void {
    this.loadReceitas();
  }

  loadReceitas(): void {
    this.loading.set(true);
    this.errorMessage.set("");
    this.receitaService.getAll().subscribe({
      next: (response) => {
        this.receitas.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set("Erro ao carregar receitas: " + error.message);
        this.loading.set(false);
      },
    });
  }
}
