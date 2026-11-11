import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ReceitasService } from "../../core/services/receitas.service";

@Component({
  selector: "app-manutencao-receita",
  standalone: true,
  imports: [],
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
    modoPreparo: [[] as string[], [Validators.required]],
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
        const ingredientes =
          typeof receita.ingredientes === "string"
            ? receita.ingredientes
                .split(",")
                .map((ingrediente) => ingrediente.trim())
                .filter((ingrediente) => ingrediente.length > 0)
            : Array.isArray(receita.ingredientes)
              ? receita.ingredientes.map((ingrediente) => String(ingrediente))
              : [];

        const receitaCarregada = {
          id: Number(receita.id ?? 0),
          nome: String(receita.nome ?? ""),
          categoria: String(receita.categoria ?? ""),
          ingredientes,
          modoPreparo: String(receita.modoPreparo ?? ""),
          tempoPreparoMinutos: Number(receita.tempoPreparoMinutos ?? 0),
          porcoes: Number(receita.porcoes ?? 0),
          publicada: Boolean(receita.publicada),
        };

        this.form.patchValue(receitaCarregada);
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
      id: Number(formsValue.id),
      nome: String(formsValue.nome),
      categoria: String(formsValue.categoria),
      ingredientes: formsValue.ingredientes
        .filter((ingrediente) => ingrediente && ingrediente.trim().length > 0)
        .join(", "),
      modoPreparo: Array.isArray(formsValue.modoPreparo)
        ? formsValue.modoPreparo.filter(
            (passo) => passo && passo.trim().length > 0,
          )
        : String(formsValue.modoPreparo ?? ""),
      tempoPreparoMinutos: String(formsValue.tempoPreparoMinutos ?? "0"),
      porcoes: Number(formsValue.porcoes ?? 0),
      publicada: Boolean(formsValue.publicada),
    };

    if (this.editingId !== null) {
      this.receitasService.update(this.editingId, receitaData)
      .subscribe({
        next: () => {
          this.sucessMessage = "Receita atualizada com sucesso!";
          this.loading = false;
          this.form.reset();
          setTimeout(() => {
            this.router.navigate(["/admin"]);
          }, 1000);
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
        setTimeout(() => {
          this.router.navigate(["/admin"]);
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = "Erro ao salvar a receita: " + error.message;
        this.loading = false;
      },
    });
  }
}

  