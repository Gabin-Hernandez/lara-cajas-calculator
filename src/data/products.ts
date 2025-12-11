// Tipos
export interface Product {
  id: number;
  nombre: string;
  dims: [number, number, number]; // [min, mid, max] en cm
  peso: number; // en gramos
  img: string;
}

export interface Box {
  id: string;
  nombre: string;
  dims: [number, number, number]; // [min, mid, max] en cm
  pesoMax: number; // peso máximo en kg
  aliases: string[];
}

// Datos de productos (peso en gramos)
export const productos: Product[] = [
  { id: 1, nombre: "Ropita Renne", dims: [0.5, 16.5, 16.5], peso: 40, img: "👕" },
  { id: 2, nombre: "Playera", dims: [0.5, 20.5, 25], peso: 80, img: "👚" },
  { id: 3, nombre: "Moño", dims: [1.5, 14.5, 22.5], peso: 40, img: "🎀" },
  { id: 4, nombre: "Libreta", dims: [3, 15.5, 22], peso: 540, img: "📓" },
  { id: 5, nombre: "Sudadera", dims: [3.5, 20, 23], peso: 240, img: "🧥" },
  { id: 6, nombre: "Mochila", dims: [3.5, 26.5, 34.5], peso: 420, img: "🎒" },
  { id: 7, nombre: "Vestido 2", dims: [5.5, 22, 30], peso: 480, img: "👗" },
  { id: 8, nombre: "Vestido", dims: [6, 25, 25], peso: 520, img: "👗" },
  { id: 9, nombre: "Cilindro", dims: [8.2, 8.8, 28.5], peso: 366, img: "🥤" },
  { id: 10, nombre: "Tumbler", dims: [11, 11, 18.5], peso: 160, img: "🥤" },
  { id: 11, nombre: "Peluche Lara", dims: [12, 14.3, 42.5], peso: 580, img: "🧸" },
  { id: 12, nombre: "Peluche Galleta", dims: [16.5, 18.5, 21.5], peso: 320, img: "🍪" },
  { id: 13, nombre: "Peluche Rana", dims: [20.4, 20.4, 25], peso: 580, img: "🐸" },
];

/* NOTA IMPORTANTE: 
 Las dimensiones 'dims' siguen estando ordenadas de menor a mayor [min, mid, max] 
 para que la función de validación matemática funcione, sin importar la rotación.
 Los nombres ahora reflejan exactamente el sistema "Envíos Perro".
 El pesoMax está en kg.
*/
export const cajas: Box[] = [
  // Grupo: 21 x 2 x 27 - Peso máx: 1kg
  { 
    id: 'SOBRES', 
    nombre: "Sobre Documentos / Ropa", 
    dims: [2, 21, 27], 
    pesoMax: 1,
    aliases: ["Libretas", "Sobre Sudadera", "Playera", "Bolsa Mochila Rhenne", "Sobre Pastillas"] 
  },
  // Grupo: 21 x 17 x 15 - Peso máx: 2kg
  { 
    id: 'VASO', 
    nombre: "Vaso con Popote", 
    dims: [15, 17, 21], 
    pesoMax: 2,
    aliases: [] 
  },
  // Grupo: 30 x 23 x 26 - Peso máx: 4kg
  { 
    id: 'RANA_GALLETA', 
    nombre: "Caja Rana / Galleta", 
    dims: [23, 26, 30], 
    pesoMax: 4,
    aliases: ["Caja Mochila", "Caja Rana", "Caja Galleta"] 
  },
  // Grupo: 25 x 25 x 37 - Peso máx: 5kg
  { 
    id: 'RANA_MOCHILA', 
    nombre: "Caja Rana y Mochila", 
    dims: [25, 25, 37], 
    pesoMax: 5,
    aliases: [] 
  },
  // Grupo: 45 x 17 x 14 - Peso máx: 3kg
  { 
    id: 'LARA_CILINDRO', 
    nombre: "Caja Lara / Cilindro", 
    dims: [14, 17, 45], 
    pesoMax: 3,
    aliases: ["Vestido Rosa Neon", "Caja Cilindro", "Caja Lara"] 
  },
  // Grupo: 45 x 17 x 22 - Peso máx: 4kg
  { 
    id: 'LARA_VARIOS', 
    nombre: "Caja Lara y Varios", 
    dims: [17, 22, 45], 
    pesoMax: 4,
    aliases: [] 
  },
  // Grupo: 45 x 17 x 27 - Peso máx: 5kg
  { 
    id: 'LARA_DOBLE', 
    nombre: "Caja Lara Doble", 
    dims: [17, 27, 45], 
    pesoMax: 5,
    aliases: [] 
  },
  // Grupo: 46 x 36 x 11 - Peso máx: 4kg
  { 
    id: 'VESTIDO', 
    nombre: "Caja Vestido", 
    dims: [11, 36, 46], 
    pesoMax: 4,
    aliases: [] 
  },
  // Grupo: 45 x 29 x 28 - Peso máx: 8kg
  { 
    id: 'DOBLE', 
    nombre: "Caja Doble / 8kg", 
    dims: [28, 29, 45], 
    pesoMax: 8,
    aliases: ["Caja Doble Galleta", "Caja Doble 8kg"] 
  },
  // Grupo: 66 x 45 x 45 - Peso máx: 27kg
  { 
    id: 'ESPECIAL', 
    nombre: "Caja Especial", 
    dims: [45, 45, 66], 
    pesoMax: 27,
    aliases: ["Gigante"] 
  },
];

// Función de compatibilidad para un solo producto
export const checkFit = (productDims: [number, number, number], boxDims: [number, number, number]): boolean => {
  const pSorted = [...productDims].sort((a, b) => a - b);
  const bSorted = [...boxDims].sort((a, b) => a - b);
  
  return pSorted[0] <= bSorted[0] && pSorted[1] <= bSorted[1] && pSorted[2] <= bSorted[2];
};
