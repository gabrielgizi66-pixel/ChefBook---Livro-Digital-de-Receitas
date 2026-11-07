import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ReceitasService } from "../../core/services/receitas.service";
import { Receita } from "../../core/models/receita.model";

@Component({
  selector: "app-admin",
  imports: [RouterLink],
  templateUrl: "./admin.html",
  styleUrl: "./admin.css",
})
export class Admin {
  private receitaService = inject(ReceitasService);
  private router = inject(Router);

  receitas: Receita[] = [];
  loading = false;
  errorMessage = "";
  sucessMessage = "";

  loadReceitas(): void {
    this.loading = true;
    this.errorMessage = "";
    this.receitaService.getAll().subscribe({
      next: (response) => {
        this.receitas = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = "Erro ao carregar receitas: " + error.message;
        this.loading = false;
      },
    });
  }

  ngnit(): void {
    this.loadReceitas();
  }

  edit(id: string): void {
    this.router.navigate(["/admin/form", id], {
      queryParams: {id},
    });
}

remove(id: string): void {
  const confirmDelete = confirm("Está certo que deseja excluir esta receita?");
  if (!confirmDelete) {
    return;
  }

  this.receitaService.delete(id).subscribe({
    next: () => {
      this.sucessMessage = "Receita excluída com sucesso!";
      this.loadReceitas();
      setTimeout(() => {
        this.sucessMessage = "";
      }, 2000);
    },
    error: (error) => {
      this.errorMessage = "Erro ao excluir receita.";
      setTimeout(() => {
        this.errorMessage = "";
      }, 2000);
    },
  });
}
}