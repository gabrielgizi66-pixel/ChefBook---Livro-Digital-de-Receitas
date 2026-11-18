import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Receita } from "../../core/models/receita.model";
import { ReceitasService } from "../../core/services/receitas.service";

@Component({
  selector: "app-manutencao-receita",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./manutencao-receita.html",
  styleUrl: "./manutencao-receita.css",
})
export class ManutencaoReceita implements OnInit {
  private fb = inject(FormBuilder);
  private receitasService = inject(ReceitasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editingId: string | null = null;
  loading = false;
  loadingData = false;
  sucessMessage = "";
  errorMessage = "";

  readonly categorias = ["Doces", "Salgados", "Massas", "Carnes", "Bebidas", "Saladas", "Sopas", "Lanches"];
  readonly icones = ["🍲", "🍝", "🍰", "🥗", "🍕", "🍔", "🥘", "🍗", "🍞", "🥤", "🍫", "🥟"];
  readonly cores = [
    { valor: "vermelho", nome: "Vermelho" },
    { valor: "laranja", nome: "Laranja" },
    { valor: "amarelo", nome: "Amarelo" },
    { valor: "coral", nome: "Coral" },
    { valor: "vinho", nome: "Vinho" },
  ];

  form = this.fb.nonNullable.group({
    nome: ["", [Validators.required, Validators.minLength(3)]],
    categoria: ["", [Validators.required]],
    ingredientes: ["", [Validators.required]],
    modoPreparo: ["", [Validators.required]],
    tempoPreparoMinutos: [0, [Validators.required, Validators.min(1)]],
    porcoes: [1, [Validators.required, Validators.min(1)]],
    icone: ["🍲", [Validators.required]],
    cor: ["laranja", [Validators.required]],
    publicada: [true],
  });

  ngOnInit(): void {
    const id =
      this.route.snapshot.paramMap.get("id") ??
      this.route.snapshot.queryParamMap.get("id");
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
          nome: receita.nome,
          categoria: receita.categoria,
          ingredientes: receita.ingredientes.join("\n"),
          modoPreparo: receita.modoPreparo.join("\n"),
          tempoPreparoMinutos: receita.tempoPreparoMinutos,
          porcoes: receita.porcoes,
          icone: receita.icone,
          cor: receita.cor,
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

  private paraLista(texto: string): string[] {
    return texto
      .split("\n")
      .map((linha) => linha.trim())
      .filter((linha) => linha.length > 0);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = "";
    const valores = this.form.getRawValue();
    const receitaData: Omit<Receita, "id"> = {
      nome: valores.nome.trim(),
      categoria: valores.categoria,
      ingredientes: this.paraLista(valores.ingredientes),
      modoPreparo: this.paraLista(valores.modoPreparo),
      tempoPreparoMinutos: Number(valores.tempoPreparoMinutos),
      porcoes: Number(valores.porcoes),
      icone: valores.icone,
      cor: valores.cor,
      publicada: valores.publicada,
    };

    const requisicao =
      this.editingId !== null
        ? this.receitasService.update(this.editingId, receitaData)
        : this.receitasService.create(receitaData);

    requisicao.subscribe({
      next: () => {
        this.sucessMessage =
          this.editingId !== null
            ? "Receita atualizada com sucesso!"
            : "Receita criada com sucesso!";
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
