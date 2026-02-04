
export enum Gravite {
  LEGER = 'lejè',
  MODERE = 'modere',
  GRAVE = 'grav'
}

export interface Plant {
  id: string;
  nom_kreyol: string;
  nom_scientifique: string;
  nom_francais: string;
  famille: string;
  description: string;
  proprietes: string[];
  contre_indications: string[];
  effets_secondaires: string[];
  image: string;
  region: string;
  preparation: string;
  dosage: string;
}

export interface Maladie {
  id: string;
  nom: string;
  categorie: string;
  symptomes: string[];
  causes: string;
  prevention: string;
  gravite: Gravite;
  remedes_ids: string[]; // IDs of plants used for this disease
}

export interface UserContribution {
  id: string;
  userName: string;
  remedeName: string;
  content: string;
  rating: number;
  date: string;
}
