import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Receita } from "../models/receita.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

type FirebaseReceita = Partial<Omit<Receita, "id" | "ingredientes" | "modoPreparo">> & {
  id?: unknown;
  ingredientes?: string[] | string;
  modoPreparo?: string[] | string;
};

function paraLista(valor: string[] | string | undefined, separador: RegExp): string[] {
  if (Array.isArray(valor)) {
    return valor.map((item) => String(item).trim()).filter((item) => item.length > 0);
  }
  if (typeof valor === "string") {
    return valor.split(separador).map((item) => item.trim()).filter((item) => item.length > 0);
  }
  return [];
}

function normalizar(id: string, receita: FirebaseReceita): Receita {
  return {
    id,
    nome: String(receita.nome ?? ""),
    categoria: String(receita.categoria ?? ""),
    ingredientes: paraLista(receita.ingredientes, /[,\n]/),
    modoPreparo: paraLista(receita.modoPreparo, /\n/),
    tempoPreparoMinutos: Number(receita.tempoPreparoMinutos ?? 0),
    porcoes: Number(receita.porcoes ?? 0),
    publicada: String(receita.publicada) === "true",
    icone: receita.icone || "🍲",
    cor: receita.cor || "laranja",
  };
}

@Injectable({ providedIn: "root" })

export class ReceitasService {

private http = inject(HttpClient);
private apiUrl = "https://chefbook---livro-digital-default-rtdb.firebaseio.com/receitas";
private sufix = ".json";

getAll(): Observable<Receita[]> {
  return this.http
  .get<Record<string, FirebaseReceita> |null>(this.apiUrl + this.sufix)
  .pipe(
    map((response) => {
      if (!response) {
        return [];
      }
      return Object.entries(response).map(([id, receita]) => normalizar(id, receita));
    }),
    );
  }

  getById(id: string): Observable<Receita> {
    return this.http.get<FirebaseReceita | null>
    (`${this.apiUrl}/${id}${this.sufix}`)
    .pipe(
      map((response) => {
        if (!response) {
          throw new Error("Receita não encontrada!");
        }
        return normalizar(id, response);
      }),
    );
  }

 create(receita:Omit<Receita, "id">): Observable<Receita> {
    return this.http.post< { name: string } >
    (this.apiUrl + this.sufix, receita)
    .pipe(
      map((response) => ({
        id: response.name,
        ...receita,
      }))
    );
  }

  update(id:string, receita:Omit<Receita, "id">): Observable<Receita> {
    return this.http.put<Omit<Receita, "id">>
    (`${this.apiUrl}/${id}${this.sufix}`, receita)
    .pipe(
      map(() => ({
        id,
        ...receita,
      }))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}${this.sufix}`);
  }


}
