import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { Receita } from "../models/receita.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

type FirebaseReceita = Omit<Receita, "id"> & {id?: unknown};

@Injectable({ providedIn: "root" })
wexport class ReceitasService {

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
      return Object.entries(response).map(([id, receita]) => {
        const { id: _ignoredId, ...receitaData} = receita;
        return { id, ...receitaData } as Receita;
      });
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
        const { id: _ignoredId, ...receitaData } = response;
        return { id, ...receitaData };
      }),
    );
  }  

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}${this.sufix}`);
  }


}
