import { useState, Fragment } from 'react';
import { ArrowLeft, Search, List, Filter, Info, Box, ChevronDown, Gauge, ArrowUpDown, Rows2, Rows3 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MATERIALS_DATA, ALL_BRANDS, ALL_MATERIAL_TYPES } from '../../data/materials';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function MaterialDetails() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrimaryCategory, setActivePrimaryCategory] = useState<'brand' | 'material'>('brand');
  const [activeBrand, setActiveBrand] = useState('全部');
  const [activeMaterial, setActiveMaterial] = useState('全部');
  const [expandedMaterials, setExpandedMaterials] = useState<Record<string, boolean>>({});
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [sortBy, setSortBy] = useState<'default' | 'brand' | 'material' | 'density-asc' | 'density-desc'>('default');
  const [gridCols, setGridCols] = useState<2 | 3>(3);

  const brands = ALL_BRANDS;
  const materials = ALL_MATERIAL_TYPES;

  const filteredMaterials = MATERIALS_DATA.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          material.features.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (activePrimaryCategory === 'brand') {
      matchesCategory = activeBrand === '全部' || material.brand === activeBrand;
    } else {
      matchesCategory = activeMaterial === '全部' || material.baseMaterial === activeMaterial;
    }

    return matchesSearch && matchesCategory;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case 'brand': return a.brand.localeCompare(b.brand, 'zh');
      case 'material': return a.baseMaterial.localeCompare(b.baseMaterial, 'zh');
      case 'density-asc': return parseFloat(a.density) - parseFloat(b.density);
      case 'density-desc': return parseFloat(b.density) - parseFloat(a.density);
      default: return 0;
    }
  });

  const toggleMaterial = (id: string) => {
    setExpandedMaterials(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 rounded-lg py-2 pl-2 pr-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          返回工具站
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <List className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  打印材料明细
                </h1>
              </div>
              <p className="mt-3 text-sm text-gray-500 max-w-3xl leading-relaxed">
                查看不同 SLS 尼龙粉末（PA12, PA11, TPU, 复合材料等）的详细物理、化学和热学属性。为您选择合适的打印材料提供科学依据。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索材料名称或特性..."
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative">
            <div className="flex-1 min-w-0">

              {/* Control Bar */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">排序</span>
                  <div className="flex gap-1">
                    {([
                      { key: 'default', label: '默认' },
                      { key: 'brand', label: '品牌' },
                      { key: 'material', label: '材质' },
                      { key: 'density-asc', label: '密度↑' },
                      { key: 'density-desc', label: '密度↓' },
                    ] as const).map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setSortBy(opt.key)}
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                          sortBy === opt.key
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: count + columns */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    共 {sortedMaterials.length} 种材料
                  </span>
                  <div className="h-4 w-px bg-gray-200" />
                  <div className="flex gap-0.5 rounded-md bg-gray-100 p-0.5">
                    <button
                      onClick={() => setGridCols(2)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors",
                        gridCols === 2
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                      title="2列布局"
                    >
                      <Rows2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setGridCols(3)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors",
                        gridCols === 3
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                      title="3列布局"
                    >
                      <Rows3 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Grid */}
              {sortedMaterials.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
                  <Search className="mb-4 h-10 w-10 text-gray-300" />
                  <p className="text-gray-500">没有找到匹配的材料信息</p>
                </div>
              ) : (
                <div className={cn(
                  "grid gap-4 items-start",
                  gridCols === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                )}>
                  {sortedMaterials.map((material, idx) => {
                    const materialStyle = (() => {
                      switch (material.baseMaterial) {
                        case '尼龙基材料': return 'bg-blue-50 text-blue-700';
                        case '高性能工程塑料': return 'bg-rose-50 text-rose-700';
                        case '弹性体': return 'bg-amber-50 text-amber-700';
                        default: return 'bg-gray-50 text-gray-700';
                      }
                    })();

                    const prev = idx > 0 ? sortedMaterials[idx - 1] : null;
                    const isNewGroup = sortBy !== 'default' && (
                      !prev || (
                        sortBy === 'brand'
                          ? material.brand !== prev.brand
                          : material.baseMaterial !== prev.baseMaterial
                      )
                    );

                    return (
                      <Fragment key={material.id}>
                        {isNewGroup && (
                          <div className="col-span-full mt-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">
                                {sortBy === 'brand' ? material.brand : material.baseMaterial}
                              </span>
                              <div className="h-px flex-1 bg-gray-100" />
                            </div>
                          </div>
                        )}
                      <div
                        className={cn(
                          "rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
                          expandedMaterials[material.id] 
                            ? "border-blue-300 col-span-full" 
                            : "border-gray-200"
                        )}
                      >
                        {/* Card Header */}
                        <button
                          onClick={() => toggleMaterial(material.id)}
                          className="w-full text-left p-5 focus:outline-none"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base font-bold text-gray-900 leading-snug mb-3">
                                {material.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs text-gray-400 font-medium">
                                  {material.brand}
                                </span>
                                <span className={cn(
                                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                  materialStyle
                                )}>
                                  {material.baseMaterial}
                                </span>
                              </div>
                            </div>
                            <ChevronDown className={cn(
                              "h-5 w-5 text-gray-400 shrink-0 mt-1 transition-transform duration-200",
                              expandedMaterials[material.id] ? "rotate-180 text-blue-500" : ""
                            )} />
                          </div>
                        </button>

                        {/* Expanded Details */}
                        {expandedMaterials[material.id] && (
                          <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                            <div className="pt-4 space-y-4">
                              {/* Color + Density summary */}
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 text-gray-500">
                                  <span className="inline-block w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: material.color === '白色' ? '#f9fafb' : material.color === '浅灰色' ? '#d1d5db' : material.color === '深灰色' ? '#6b7280' : material.color === '金属灰色' ? '#9ca3af' : '#111827' }} />
                                  {material.color}
                                </div>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-500">
                                  密度 <strong className="text-gray-700">{material.density} g/cm³</strong>
                                </span>
                              </div>

                              {/* Features */}
                              <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">材料特性</h4>
                                  <p className="text-sm text-gray-600 leading-relaxed">{material.features}</p>
                                </div>
                              </div>

                              {/* Applications */}
                              <div className="flex items-start gap-2">
                                <Box className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">推荐应用场景</h4>
                                  <p className="text-sm text-gray-600 leading-relaxed">{material.applications}</p>
                                </div>
                              </div>

                              {/* Performance Properties */}
                              {material.properties && material.properties.length > 0 && (
                                <div className="flex items-start gap-2">
                                  <Gauge className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">性能指标</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                      {material.properties.map((prop, idx) => (
                                        <div
                                          key={idx}
                                          className="rounded-lg bg-gray-50 px-3 py-2 text-center border border-gray-100"
                                        >
                                          <div className="text-base font-bold text-gray-900 leading-none mb-0.5">
                                            {prop.value}
                                            <span className="text-[11px] font-normal text-gray-400 ml-0.5">{prop.unit}</span>
                                          </div>
                                          <div className="text-[11px] text-gray-600 leading-tight">{prop.label}</div>
                                          {prop.testMethod && (
                                            <div className="text-[10px] text-gray-400 leading-tight mt-0.5 font-mono tracking-tight">
                                              {prop.testMethod}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      </Fragment>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column (Sidebar) */}
            {isSidebarExpanded ? (
              <aside className="fixed inset-0 z-50 flex flex-col lg:static lg:block lg:w-64 lg:shrink-0 lg:z-auto">
                <div 
                  className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm lg:hidden"
                  onClick={() => setIsSidebarExpanded(false)}
                />
                <div className="relative mt-auto h-[60vh] rounded-t-3xl border border-gray-200 bg-white p-5 shadow-2xl flex flex-col lg:h-auto lg:max-h-[calc(100vh-8rem)] lg:rounded-2xl lg:shadow-sm lg:sticky lg:top-24 lg:mt-0">
                  <div className="flex justify-between items-center mb-4 pb-2 shrink-0 lg:block lg:mb-4 lg:pb-0">
                    <h3 className="font-semibold text-gray-900 lg:hidden">材料筛选</h3>
                    <button 
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500 lg:hidden"
                      onClick={() => setIsSidebarExpanded(false)}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Primary Categories */}
                  <div className="flex gap-2 mb-4 shrink-0">
                    <button
                      onClick={() => setActivePrimaryCategory('brand')}
                      className={cn(
                        "flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-colors",
                        activePrimaryCategory === 'brand' ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      品牌分类
                    </button>
                    <button
                      onClick={() => setActivePrimaryCategory('material')}
                      className={cn(
                        "flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-colors",
                        activePrimaryCategory === 'material' ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      材质分类
                    </button>
                  </div>

                  {/* Secondary Categories */}
                  <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1">
                    {activePrimaryCategory === 'brand' ? (
                      brands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => {
                            setActiveBrand(brand);
                            if (window.innerWidth < 1024) setIsSidebarExpanded(false);
                          }}
                          className={cn(
                            "text-left px-4 py-3 lg:py-2.5 rounded-lg text-sm font-medium transition-colors w-full shrink-0",
                            activeBrand === brand 
                              ? "bg-blue-50 text-blue-700" 
                              : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          {brand}
                        </button>
                      ))
                    ) : (
                      materials.map(mat => (
                        <button
                          key={mat}
                          onClick={() => {
                            setActiveMaterial(mat);
                            if (window.innerWidth < 1024) setIsSidebarExpanded(false);
                          }}
                          className={cn(
                            "text-left px-4 py-3 lg:py-2.5 rounded-lg text-sm font-medium transition-colors w-full shrink-0",
                            activeMaterial === mat 
                              ? "bg-blue-50 text-blue-700" 
                              : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          {mat}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Collapse Button (Desktop Only) */}
                  <div className="mt-1 justify-end shrink-0 hidden lg:flex -mr-2">
                    <button
                      onClick={() => setIsSidebarExpanded(false)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                      title="收起侧边栏"
                    >
                      <ChevronDown className="h-5 w-5 -rotate-90" />
                    </button>
                  </div>
                </div>
              </aside>
            ) : null}

            {/* Floating FAB when Sidebar is collapsed or on Mobile */}
            <div className={cn("fixed bottom-8 right-8 z-40", isSidebarExpanded ? "hidden" : "block")}>
              <button
                onClick={() => setIsSidebarExpanded(true)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
                title="展开分类筛选"
              >
                <Filter className="h-6 w-6" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
