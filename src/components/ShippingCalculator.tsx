'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Check, Box, ShoppingBag, Layers } from 'lucide-react';
import Link from 'next/link';
import { productos, cajas, checkFit, Product, Box as BoxType } from '@/data/products';

type ViewMode = 'product' | 'box';

export default function ShippingCalculator() {
  const [viewMode, setViewMode] = useState<ViewMode>('product');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBox, setSelectedBox] = useState<BoxType | null>(null);

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

  const getCompatibleProducts = (box: BoxType | null): Product[] => {
    if (!box) return [];
    
    return productos.filter((producto) => checkFit(producto.dims, box.dims));
  };

  const compatibleBoxes = getCompatibleBoxes(selectedProduct);
  const compatibleProducts = getCompatibleProducts(selectedBox);

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
            {viewMode === 'product' 
              ? 'Selecciona un producto para ver en qué cajas puede enviarse'
              : 'Selecciona una caja para ver qué productos caben en ella'}
          </p>
          
          {/* Toggle de vista */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => {
                setViewMode('product');
                setSelectedBox(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                viewMode === 'product'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Por Producto
            </button>
            <button
              onClick={() => {
                setViewMode('box');
                setSelectedProduct(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                viewMode === 'box'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Box className="w-4 h-4" />
              Por Caja
            </button>
            <Link
              href="/grupos"
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-purple-200"
            >
              <Layers className="w-4 h-4" />
              Ver Grupos
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lista de Productos o Cajas según la vista */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {viewMode === 'product' ? 'Productos' : 'Cajas'}
              </h2>
              
              {viewMode === 'product' ? (
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
                            {producto.dims.join(' × ')} cm • {producto.peso}g
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {cajas.map((caja) => (
                    <button
                      key={caja.id}
                      onClick={() => setSelectedBox(caja)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        selectedBox?.id === caja.id
                          ? 'bg-indigo-50 border-2 border-indigo-500 shadow-sm'
                          : 'bg-slate-50 border-2 border-transparent hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-[8px] leading-[1.1] ${
                          selectedBox?.id === caja.id
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-500'
                        }`} style={{ wordBreak: 'break-all' }}>
                          {caja.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm truncate">
                            {caja.nombre}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {caja.dims.join(' × ')} cm • Máx {caja.pesoMax}kg
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grid Principal */}
          <div className="lg:col-span-3">
            {viewMode === 'product' ? (
              /* Vista por Producto */
              !selectedProduct ? (
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
                          <span className="mx-2">•</span>
                          Peso: <span className="font-medium">{selectedProduct.peso}g</span>
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
                                    <p className="text-slate-600 text-sm mt-1">
                                      <span className="font-medium">Peso máx:</span>{' '}
                                      <span className="text-amber-600 font-semibold">{caja.pesoMax} kg</span>
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
              )
            ) : (
              /* Vista por Caja */
              !selectedBox ? (
                <div className="flex items-center justify-center h-[400px] bg-white rounded-2xl border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <Box className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">
                      Selecciona una caja para ver qué productos caben
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[10px] leading-[1.1] text-indigo-700" style={{ wordBreak: 'break-all' }}>
                        {selectedBox.id}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {selectedBox.nombre}
                        </h3>
                        <p className="text-slate-600 mt-1">
                          Dimensiones: <span className="font-medium">{selectedBox.dims.join(' × ')} cm</span>
                          <span className="mx-2">•</span>
                          Peso máx: <span className="font-medium text-amber-600">{selectedBox.pesoMax} kg</span>
                        </p>
                        <p className="text-sm text-indigo-600 font-medium mt-2">
                          {compatibleProducts.length} {compatibleProducts.length === 1 ? 'producto compatible' : 'productos compatibles'}
                        </p>
                        {selectedBox.aliases.length > 0 && (
                          <p className="text-xs text-slate-500 mt-2">
                            <span className="font-semibold">También incluye:</span> {selectedBox.aliases.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="sync">
                      {productos.map((producto) => {
                        const isCompatible = compatibleProducts.some(p => p.id === producto.id);
                        
                        return (
                          <motion.div
                            key={producto.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                              opacity: isCompatible ? 1 : 0.3,
                              scale: isCompatible ? 1 : 0.95,
                            }}
                            transition={{ 
                              duration: 0.3,
                              ease: "easeOut"
                            }}
                            className={`bg-white rounded-2xl shadow-sm border-2 p-6 relative overflow-hidden ${
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
                                className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white p-1.5 rounded-full shadow-lg"
                              >
                                <Check className="w-3 h-3" />
                              </motion.div>
                            )}

                            <div className="flex flex-col items-center text-center">
                              <span className="text-4xl mb-3">{producto.img}</span>
                              <h4 className="font-bold text-slate-900 text-sm mb-1">
                                {producto.nombre}
                              </h4>
                              <p className="text-xs text-slate-500">
                                {producto.dims.join(' × ')} cm
                              </p>
                              <p className="text-xs text-amber-600 font-medium mt-1">
                                {producto.peso}g
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Resumen de productos compatibles */}
                  {compatibleProducts.length > 0 && (
                    <div className="mt-8 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-200 p-6">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-indigo-600" />
                        Productos que caben en esta caja ({compatibleProducts.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {compatibleProducts.map((producto) => (
                          <span
                            key={producto.id}
                            className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 border border-indigo-200"
                          >
                            <span>{producto.img}</span>
                            {producto.nombre}
                            <span className="text-xs text-amber-600">({producto.peso}g)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
