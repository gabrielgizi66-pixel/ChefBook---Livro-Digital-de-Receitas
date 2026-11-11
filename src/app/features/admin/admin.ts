import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ReceitasService } from "../../core/services/receitas.service";
import { Receita } from "../../core/models/receita.model";
import { signal } from "@angular/core";

@Component({
  selector: "app-admin",
  imports: [RouterLink],
  templateUrl: "./admin.html",
  styleUrl: "./admin.css",
})
export class Admin {
  private receitaService = inject(ReceitasService);
  private router = inject(Router);

  receitas= signal<Receita[]>([]);
  loading = signal(true);
  errorMessage = signal("");
  sucessMessage = signal("");

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

  ngOnInit(): void {
    this.loadReceitas();
  }

  edit(id: string): void {
    this.router.navigate(["/admin/form", id], {
      queryParams: {id},
    });
}

delete(id: string): void {
  const confirmDelete = confirm("Está certo que deseja excluir esta receita?");
  if (!confirmDelete) {
    return;
  }

  this.receitaService.delete(id).subscribe({
    next: () => {
      this.sucessMessage.set("Receita excluída com sucesso!");
      this.loadReceitas();
      setTimeout(() => {
        this.sucessMessage.set("");
      }, 2000);
    },
    error: (error) => {
      this.errorMessage.set("Erro ao excluir receita.");
      setTimeout(() => {
        this.errorMessage.set("");
      }, 2000);
    },
  });
}
}