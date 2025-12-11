'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Check } from 'lucide-react';

// Tipos
interface Product {
  id: number;
  nombre: string;
  dims: [number, number, number];
  img: string;
}

interface Box {
  id: string;
  nombre: string;
  dims: [number, number, number];
  aliases: string[];
}

// Datos hardcodeados
const productos: Product[] = [
  { id: 1, nombre: "Ropita Renne", dims: [0.5, 16.5, 16.5], img: "👕" },
  { id: 2, nombre: "Playera", dims: [0.5, 20.5, 25], img: "👚" },
  { id: 3, nombre: "Moño", dims: [1.5, 14.5, 22.5], img: "🎀" },
  { id: 4, nombre: "Libreta", dims: [3, 15.5, 22], img: "📓" },
  { id: 5, nombre: "Sudadera", dims: [3.5, 20, 23], img: "🧥" },
  { id: 6, nombre: "Mochila", dims: [3.5, 26.5, 34.5], img: "🎒" },
  { id: 7, nombre: "Vestido 2", dims: [5.5, 22, 30], img: "👗" },
  { id: 8, nombre: "Vestido", dims: [6, 25, 25], img: "👗" },
  { id: 9, nombre: "Cilindro", dims: [8.2, 8.8, 28.5], img: "🥤" },
  { id: 10, nombre: "Tumbler", dims: [11, 11, 18.5], img: "🥤" },
  { id: 11, nombre: "Peluche Lara", dims: [12, 14.3, 42.5], img: "🧸" },
  { id: 12, nombre: "Peluche Galleta", dims: [16.5, 18.5, 21.5], img: "🍪" },
  { id: 13, nombre: "Peluche Rana", dims: [20.4, 20.4, 25], img: "🐸" },
];

/* NOTA IMPORTANTE: 
 Las dimensiones 'dims' siguen estando ordenadas de menor a mayor [min, mid, max] 
 para que la función de validación matemática funcione, sin importar la rotación.
 Los nombres ahora reflejan exactamente el sistema "Envíos Perro".
*/
const cajas: Box[] = [
  // Grupo: 21 x 2 x 27
  { 
    id: 'SOBRES', 
    nombre: "Sobre Documentos / Ropa", 
    dims: [2, 21, 27], 
    aliases: ["Libretas", "Sobre Sudadera", "Playera", "Bolsa Mochila Rhenne", "Sobre Pastillas"] 
  },
  // Grupo: 21 x 17 x 15
  { 
    id: 'VASO', 
    nombre: "Vaso con Popote", 
    dims: [15, 17, 21], 
    aliases: [] 
  },
  // Grupo: 30 x 23 x 26
  { 
    id: 'RANA_GALLETA', 
    nombre: "Caja Rana / Galleta", 
    dims: [23, 26, 30], 
    aliases: ["Caja Mochila", "Caja Rana", "Caja Galleta"] 
  },
  // Grupo: 25 x 25 x 37
  { 
    id: 'RANA_MOCHILA', 
    nombre: "Caja Rana y Mochila", 
    dims: [25, 25, 37], 
    aliases: [] 
  },
  // Grupo: 45 x 17 x 14
  { 
    id: 'LARA_CILINDRO', 
    nombre: "Caja Lara / Cilindro", 
    dims: [14, 17, 45], 
    aliases: ["Vestido Rosa Neon", "Caja Cilindro", "Caja Lara"] 
  },
  // Grupo: 45 x 17 x 22
  { 
    id: 'LARA_VARIOS', 
    nombre: "Caja Lara y Varios", 
    dims: [17, 22, 45], 
    aliases: [] 
  },
  // Grupo: 45 x 17 x 27
  { 
    id: 'LARA_DOBLE', 
    nombre: "Caja Lara Doble", 
    dims: [17, 27, 45], 
    aliases: [] 
  },
  // Grupo: 46 x 36 x 11
  { 
    id: 'VESTIDO', 
    nombre: "Caja Vestido", 
    dims: [11, 36, 46], 
    aliases: [] 
  },
  // Grupo: 45 x 29 x 28
  { 
    id: 'DOBLE', 
    nombre: "Caja Doble / 8kg", 
    dims: [28, 29, 45], 
    aliases: ["Caja Doble Galleta", "Caja Doble 8kg"] 
  },
  // Grupo: 66 x 45 x 45
  { 
    id: 'ESPECIAL', 
    nombre: "Caja Especial", 
    dims: [45, 45, 66], 
    aliases: ["Gigante"] 
  },
];

// Función de compatibilidad
const checkFit = (productDims: [number, number, number], boxDims: [number, number, number]): boolean => {
  const pSorted = [...productDims].sort((a, b) => a - b);
  const bSorted = [...boxDims].sort((a, b) => a - b);
  
  return pSorted[0] <= bSorted[0] && pSorted[1] <= bSorted[1] && pSorted[2] <= bSorted[2];
};

export default function ShippingCalculator() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getCompatibleBoxes = (product: Product | null): Set<string> => {
    if (!product) return new Set();
    
    const compatible = new Set<string>();
    cajas.forEach((caja) => {
      if (checkFit(product.dims, caja.dims)) {
        compatible.add(caja.id);
      }
    });
    return compatible;
  };

  const compatibleBoxes = getCompatibleBoxes(selectedProduct);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-900">Calculadora de Envíos</h1>
          </div>
          <p className="mt-2 text-slate-600">
            Selecciona un producto para ver en qué cajas puede enviarse
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lista de Productos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Productos</h2>
              <div className="space-y-2">
                {productos.map((producto) => (
                  <button
                    key={producto.id}
                    onClick={() => setSelectedProduct(producto)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      selectedProduct?.id === producto.id
                        ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm'
                        : 'bg-slate-50 border-2 border-transparent hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{producto.img}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">
                          {producto.nombre}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {producto.dims.join(' × ')} cm
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Principal - Cajas */}
          <div className="lg:col-span-3">
            {!selectedProduct ? (
              <div className="flex items-center justify-center h-[400px] bg-white rounded-2xl border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">
                    Selecciona un producto para comenzar
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedProduct.img}</span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {selectedProduct.nombre}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        Dimensiones: <span className="font-medium">{selectedProduct.dims.join(' × ')} cm</span>
                      </p>
                      <p className="text-sm text-indigo-600 font-medium mt-2">
                        {compatibleBoxes.size} {compatibleBoxes.size === 1 ? 'caja compatible' : 'cajas compatibles'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="sync">
                    {cajas.map((caja) => {
                      const isCompatible = compatibleBoxes.has(caja.id);
                      
                      return (
                        <motion.div
                          key={caja.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ 
                            opacity: isCompatible ? 1 : 0.3,
                            scale: isCompatible ? 1 : 0.95,
                          }}
                          transition={{ 
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                          className={`bg-white rounded-2xl shadow-sm border-2 p-8 relative overflow-hidden min-h-[200px] ${
                            isCompatible
                              ? 'border-indigo-400 shadow-indigo-100'
                              : 'border-slate-200 grayscale'
                          }`}
                        >
                          {/* Badge de compatibilidad */}
                          {isCompatible && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2, duration: 0.3, type: "spring" }}
                              className="absolute bottom-3 right-6 bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                            >
                              <Check className="w-4 h-4" />
                              Compatible
                            </motion.div>
                          )}

                          <div className="space-y-5">
                            <div>
                              <div className="flex items-start gap-4 mb-4">
                                <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-[9px] leading-[1.1] p-2 break-words hyphens-auto ${
                                  isCompatible
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-slate-100 text-slate-500'
                                }`} style={{ wordBreak: 'break-all' }}>
                                  {caja.id}
                                </div>
                                <div className="flex-1 min-w-0 pt-2">
                                  <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2">
                                    {caja.nombre}
                                  </h4>
                                  <p className="text-slate-600 text-sm">
                                    <span className="font-medium">Dimensiones:</span>{' '}
                                    <span className="text-slate-900">{caja.dims.join(' × ')} cm</span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {caja.aliases.length > 0 && (
                              <div className="pt-3 border-t border-slate-200">
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  <span className="font-semibold text-slate-600">También incluye:</span>{' '}
                                  {caja.aliases.join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
