'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Layers, ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';
import { productos, cajas, checkFit, Product, Box } from '@/data/products';

interface ProductGroup {
  items: { product: Product; quantity: number }[];
  totalVolume: number;
  totalWeight: number; // peso total en gramos
}

// Calcula el volumen aproximado de un grupo de productos apilados
const calculateStackedDimensions = (items: { product: Product; quantity: number }[]): [number, number, number] => {
  if (items.length === 0) return [0, 0, 0];
  
  // Para simplificar, apilamos en la dimensión más pequeña (altura)
  // Sumamos las alturas y tomamos el máximo de ancho y largo
  let totalHeight = 0;
  let maxWidth = 0;
  let maxLength = 0;
  
  items.forEach(({ product, quantity }) => {
    const sorted = [...product.dims].sort((a, b) => a - b);
    totalHeight += sorted[0] * quantity; // Apilamos por la dimensión más pequeña
    maxWidth = Math.max(maxWidth, sorted[1]);
    maxLength = Math.max(maxLength, sorted[2]);
  });
  
  return [totalHeight, maxWidth, maxLength];
};

// Calcula el peso total del grupo en gramos
const calculateTotalWeight = (items: { product: Product; quantity: number }[]): number => {
  return items.reduce((total, { product, quantity }) => total + (product.peso * quantity), 0);
};

// Verifica si un grupo de productos cabe en una caja (dimensiones Y peso)
const checkGroupFit = (items: { product: Product; quantity: number }[], box: Box): boolean => {
  // Verificar dimensiones
  const groupDims = calculateStackedDimensions(items);
  const gSorted = [...groupDims].sort((a, b) => a - b);
  const bSorted = [...box.dims].sort((a, b) => a - b);
  
  const fitsDimensions = gSorted[0] <= bSorted[0] && gSorted[1] <= bSorted[1] && gSorted[2] <= bSorted[2];
  
  // Verificar peso (convertir gramos a kg)
  const totalWeightKg = calculateTotalWeight(items) / 1000;
  const fitsWeight = totalWeightKg <= box.pesoMax;
  
  return fitsDimensions && fitsWeight;
};

// Genera todas las combinaciones posibles de productos para una caja
const generateGroupsForBox = (box: Box, maxItems: number = 3): ProductGroup[] => {
  const groups: ProductGroup[] = [];
  const compatibleProducts = productos.filter(p => checkFit(p.dims, box.dims));
  
  // Grupos de un solo tipo de producto (2, 3... del mismo)
  compatibleProducts.forEach(product => {
    for (let qty = 2; qty <= maxItems; qty++) {
      const items = [{ product, quantity: qty }];
      if (checkGroupFit(items, box)) {
        const dims = calculateStackedDimensions(items);
        groups.push({
          items,
          totalVolume: dims[0] * dims[1] * dims[2],
          totalWeight: calculateTotalWeight(items)
        });
      }
    }
  });
  
  // Combinaciones de 2 productos diferentes
  for (let i = 0; i < compatibleProducts.length; i++) {
    for (let j = i + 1; j < compatibleProducts.length; j++) {
      const items = [
        { product: compatibleProducts[i], quantity: 1 },
        { product: compatibleProducts[j], quantity: 1 }
      ];
      if (checkGroupFit(items, box)) {
        const dims = calculateStackedDimensions(items);
        groups.push({
          items,
          totalVolume: dims[0] * dims[1] * dims[2],
          totalWeight: calculateTotalWeight(items)
        });
      }
    }
  }
  
  // Combinaciones de 3 productos diferentes
  for (let i = 0; i < compatibleProducts.length; i++) {
    for (let j = i + 1; j < compatibleProducts.length; j++) {
      for (let k = j + 1; k < compatibleProducts.length; k++) {
        const items = [
          { product: compatibleProducts[i], quantity: 1 },
          { product: compatibleProducts[j], quantity: 1 },
          { product: compatibleProducts[k], quantity: 1 }
        ];
        if (checkGroupFit(items, box)) {
          const dims = calculateStackedDimensions(items);
          groups.push({
            items,
            totalVolume: dims[0] * dims[1] * dims[2],
            totalWeight: calculateTotalWeight(items)
          });
        }
      }
    }
  }
  
  // Combinaciones de 2 de un producto + 1 de otro
  for (let i = 0; i < compatibleProducts.length; i++) {
    for (let j = 0; j < compatibleProducts.length; j++) {
      if (i !== j) {
        const items = [
          { product: compatibleProducts[i], quantity: 2 },
          { product: compatibleProducts[j], quantity: 1 }
        ];
        if (checkGroupFit(items, box)) {
          const dims = calculateStackedDimensions(items);
          groups.push({
            items,
            totalVolume: dims[0] * dims[1] * dims[2],
            totalWeight: calculateTotalWeight(items)
          });
        }
      }
    }
  }
  
  return groups;
};

// Genera un identificador único para el grupo
const getGroupKey = (group: ProductGroup): string => {
  return group.items
    .map(item => `${item.product.id}x${item.quantity}`)
    .sort()
    .join('-');
};

export default function GroupsCalculator() {
  const [expandedBoxes, setExpandedBoxes] = useState<Set<string>>(new Set());
  const [maxItemsFilter, setMaxItemsFilter] = useState<number>(3);

  const groupsByBox = useMemo(() => {
    const result: Map<string, ProductGroup[]> = new Map();
    
    cajas.forEach(box => {
      const groups = generateGroupsForBox(box, maxItemsFilter);
      // Eliminar duplicados
      const uniqueGroups = new Map<string, ProductGroup>();
      groups.forEach(group => {
        const key = getGroupKey(group);
        if (!uniqueGroups.has(key)) {
          uniqueGroups.set(key, group);
        }
      });
      result.set(box.id, Array.from(uniqueGroups.values()));
    });
    
    return result;
  }, [maxItemsFilter]);

  const toggleBox = (boxId: string) => {
    setExpandedBoxes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(boxId)) {
        newSet.delete(boxId);
      } else {
        newSet.add(boxId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedBoxes(new Set(cajas.map(c => c.id)));
  };

  const collapseAll = () => {
    setExpandedBoxes(new Set());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la calculadora
          </Link>
          
          <div className="flex items-center gap-3">
            <Layers className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-900">Grupos Posibles por Caja</h1>
          </div>
          <p className="mt-2 text-slate-600">
            Todas las combinaciones de productos que pueden enviarse juntos en cada caja
          </p>
          
          {/* Filtros */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Máximo de items:</label>
              <select
                value={maxItemsFilter}
                onChange={(e) => setMaxItemsFilter(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={2}>2 items</option>
                <option value={3}>3 items</option>
                <option value={4}>4 items</option>
                <option value={5}>5 items</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Expandir todo
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Colapsar todo
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {cajas.map((caja) => {
            const groups = groupsByBox.get(caja.id) || [];
            const isExpanded = expandedBoxes.has(caja.id);
            const singleProducts = productos.filter(p => checkFit(p.dims, caja.dims));
            
            return (
              <div 
                key={caja.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Header de la caja */}
                <button
                  onClick={() => toggleBox(caja.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[9px] leading-[1.1] text-indigo-700" style={{ wordBreak: 'break-all' }}>
                      {caja.id}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-900">{caja.nombre}</h3>
                      <p className="text-sm text-slate-600">
                        {caja.dims.join(' × ')} cm • <span className="font-medium text-amber-600">Máx {caja.pesoMax} kg</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-indigo-600">
                        {singleProducts.length} productos individuales
                      </p>
                      <p className="text-sm text-slate-500">
                        {groups.length} combinaciones posibles
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>
                
                {/* Contenido expandible */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-slate-200">
                        {/* Productos individuales */}
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Productos individuales que caben
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {singleProducts.map(product => (
                              <span
                                key={product.id}
                                className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700"
                              >
                                <span>{product.img}</span>
                                {product.nombre}
                                <span className="text-xs text-slate-500">({product.peso}g)</span>
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Grupos/Combinaciones */}
                        {groups.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                              <Layers className="w-4 h-4" />
                              Combinaciones posibles ({groups.length})
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {groups.map((group, idx) => {
                                const dims = calculateStackedDimensions(group.items);
                                const totalItems = group.items.reduce((sum, item) => sum + item.quantity, 0);
                                
                                return (
                                  <div
                                    key={idx}
                                    className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-4"
                                  >
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {group.items.map((item, itemIdx) => (
                                        <div
                                          key={itemIdx}
                                          className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg shadow-sm"
                                        >
                                          <span className="text-lg">{item.product.img}</span>
                                          {item.quantity > 1 && (
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                                              ×{item.quantity}
                                            </span>
                                          )}
                                          <span className="text-xs font-medium text-slate-700 truncate max-w-[80px]">
                                            {item.product.nombre}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="text-xs text-slate-500 space-y-1">
                                      <div>
                                        <span className="font-medium">{totalItems} items</span>
                                        <span className="mx-1">•</span>
                                        <span>≈ {dims[0].toFixed(1)} × {dims[1].toFixed(1)} × {dims[2].toFixed(1)} cm</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Scale className="w-3 h-3" />
                                        <span className={`font-medium ${group.totalWeight / 1000 > caja.pesoMax * 0.9 ? 'text-amber-600' : 'text-green-600'}`}>
                                          {(group.totalWeight / 1000).toFixed(2)} kg
                                        </span>
                                        <span className="text-slate-400">/ {caja.pesoMax} kg</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {groups.length === 0 && singleProducts.length <= 1 && (
                          <div className="mt-6 text-center py-8 text-slate-500">
                            <p>No hay combinaciones posibles para esta caja</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
