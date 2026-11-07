export interface Receita {
id: string;
nome: string;
categoria: string;
ingredientes: string;
modoPreparo: string[];
tempoPreparoMinutos: number;
porcoes: number;
publicada: boolean;
};