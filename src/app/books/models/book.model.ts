export interface BookItem {
  _id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  categories: string;
  coverUrl: string;
  description: string;
}

// Forma real de la API (categories es un arreglo), usada por el panel de administración.
export interface ApiBook {
  _id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  categories: string[];
  description?: string;
}

export interface NewBook {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  categories: string[];
  description?: string;
}
