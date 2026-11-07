import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ReceitasService } from "../../core/services/receitas.service";

@Component({
  selector: "app-manutencao-receita",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./manutencao-receita.html",
  styleUrl: "./manutencao-receita.css",
})
export class ManutencaoReceita {
  private fb = inject(FormBuilder);
  private receitasService = inject(ReceitasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editingId: string | null = null;
  loading = false;
  loadingData = false;
  sucessMessage = "";
  errorMessage = "";

  form = this.fb.nonNullable.group({
    id: [0, [Validators.required, Validators.min(1)]],
    nome: ["", [Validators.required, Validators.minLength(15)]],
    categoria: ["", [Validators.required]],
    ingredientes: [[] as string[], [Validators.required]],
    modoPreparo: ["", [Validators.required]],
    tempoPreparoMinutos: [0, [Validators.required, Validators.min(0)]],
    porcoes: [0, [Validators.required, Validators.min(0)]],
    publicada: [false, [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get("id");
    if (id) {
      this.editingId = id;
      this.loadReceita(id);
    }
  }

  loadReceita(id: string): void {
    this.loadingData = true;

    this.receitasService.getById(id).subscribe({
      next: (receita) => {
        this.form.patchValue({
          id: receita.id,
          nome: receita.nome,
          categoria: receita.categoria,
          ingredientes: receita.ingredientes,
          modoPreparo: receita.modoPreparo,
          tempoPreparoMinutos: receita.tempoPreparoMinutos,
          porcoes: receita.porcoes,
          publicada: receita.publicada,
        });
        this.loadingData = false;
      },
      error: (error) => {
        this.errorMessage = "Erro ao carregar a receita: " + error.message;
        this.loadingData = false;
      },
    });
  }

  salvar(): void {
    this.loading = true;
    const formsValue = this.form.getRawValue();
    const receitaData = {
      id: formsValue.id,
      nome: formsValue.nome,
      categoria: formsValue.categoria,
      ingredientes: formsValue.ingredientes,
      modoPreparo: formsValue.modoPreparo,
      tempoPreparoMinutos: formsValue.tempoPreparoMinutos,
      porcoes: formsValue.porcoes,
      publicada: formsValue.publicada,
    };

    if (this.editingId !== null) {
      this.receitasService.update(this.editingId, receitaData).subscribe({
        next: () => {
          this.sucessMessage = "Receita atualizada com sucesso!";
          this.loading = false;
          this.router.navigate(["/receitas"]);
        },
        error: (error) => {
          this.errorMessage = "Erro ao salvar a receita: " + error.message;
          this.loading = false;
        },
      });
      return;
    }

    this.receitasService.create(receitaData).subscribe({
      next: () => {
        this.sucessMessage = "Receita criada com sucesso!";
        this.loading = false;
        this.router.navigate(["/receitas"]);
      },
      error: (error) => {
        this.errorMessage = "Erro ao salvar a receita: " + error.message;
        this.loading = false;
      },
    });
  }
}

  