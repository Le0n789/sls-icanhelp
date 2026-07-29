import React, { useState } from 'react';
import { ArrowLeft, Search, List, Filter, Info, Box, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 模拟材料数据
const MATERIALS_DATA = [
  {
    id: '1',
    name: 'PA 2200 (标准PA12)',
    brand: 'EOS',
    baseMaterial: '尼龙基材料',
    density: '0.93',
    color: '白色',
    features: '综合性能优异，尺寸稳定性好，吸水率低。最常规且广泛使用的SLS材料。',
    applications: '功能性验证原型，最终用途零件，复杂结构外壳，工装夹具。'
  },
  {
    id: '2',
    name: 'HP HR PA 11',
    brand: 'HP',
    baseMaterial: '尼龙基材料',
    density: '1.04',
    color: '白色',
    features: '优异的抗冲击性和延展性，生物基环保材料，极佳的耐疲劳性能。',
    applications: '耐摔/耐冲击零件，卡扣与活动铰链，汽车内饰组件，医疗康复护具。'
  },
  {
    id: '3',
    name: 'DuraForm GF (玻纤PA12)',
    brand: '3DSystem',
    baseMaterial: '高性能工程塑料',
    density: '1.22',
    color: '浅灰色',
    features: '显著提高的刚度和热变形温度，极佳的机械尺寸稳定性，耐磨损。',
    applications: '较高温度工作环境零件，高刚性结构支撑件，发动机舱周边零件。'
  },
  {
    id: '4',
    name: 'TPU 90A Powder',
    brand: 'Formlabs',
    baseMaterial: '弹性体',
    density: '1.10',
    color: '黑色',
    features: '类橡胶高弹性（邵氏硬度约90A），极佳的耐磨性和抗撕裂性，柔韧弯曲不断。',
    applications: '减震器，密封圈与垫垫，柔性软管，鞋底及运动护具，穿戴设备。'
  },
  {
    id: '5',
    name: 'Alumide (铝粉填充)',
    brand: 'EOS',
    baseMaterial: '高性能工程塑料',
    density: '1.36',
    color: '金属灰色',
    features: '表面具有特殊的金属砂面质感，相比纯尼龙有更好的导热性，易于机械后加工。',
    applications: '少量注塑模具嵌件，金属外观展示模型，需要精细钻孔和攻丝的夹具卡具。'
  },
  {
    id: '6',
    name: 'HP HR PA 12 GB',
    brand: 'HP',
    baseMaterial: '高性能工程塑料',
    density: '1.30',
    color: '深灰色',
    features: '玻璃微珠填充的PA12，具有极高的刚度和尺寸稳定性，热变形表现出色。',
    applications: '刚性要求极高的外壳、底座和工装夹具，长期负载零件。'
  },
  {
    id: '7',
    name: 'Precimid1172Pro (通用型尼龙12)',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '0.95',
    color: '白色',
    features: '表面光洁度高，细节展现优异，综合力学性能平衡，适合多种通用场景。',
    applications: '手板模型验证，医疗辅具，电子外壳，教育与科研用途。'
  }
];

export function MaterialDetails() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrimaryCategory, setActivePrimaryCategory] = useState<'brand' | 'material'>('brand');
  const [activeBrand, setActiveBrand] = useState('全部');
  const [activeMaterial, setActiveMaterial] = useState('全部');
  const [expandedMaterials, setExpandedMaterials] = useState<Record<string, boolean>>({});
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const brands = ['全部', 'EOS', 'HP', 'Formlabs', '3DSystem', 'TPM3D(盈普)'];
  const materials = ['全部', '尼龙基材料', '高性能工程塑料', '弹性体'];

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
              {/* Table Container */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600 border-collapse whitespace-nowrap min-w-[800px]">
                    <thead className="bg-gray-50/80 text-gray-900 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold">所属品牌</th>
                        <th className="px-6 py-4 font-semibold">材料名称</th>
                        <th className="px-6 py-4 font-semibold">材料性质</th>
                        <th className="px-6 py-4 font-semibold">材料颜色</th>
                        <th className="px-6 py-4 font-semibold">烧结密度 (g/cm³)</th>
                        <th className="px-6 py-4 font-semibold text-center">详情</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filteredMaterials.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            未找到匹配的材料信息
                          </td>
                        </tr>
                      ) : (
                        filteredMaterials.map((material) => (
                          <React.Fragment key={material.id}>
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                  material.brand === 'EOS' && "bg-blue-50 text-blue-700 border border-blue-200",
                                  material.brand === 'HP' && "bg-sky-50 text-sky-700 border border-sky-200",
                                  material.brand === 'Formlabs' && "bg-purple-50 text-purple-700 border border-purple-200",
                                  material.brand === '3DSystem' && "bg-rose-50 text-rose-700 border border-rose-200",
                                  material.brand === 'TPM3D(盈普)' && "bg-amber-50 text-amber-700 border border-amber-200",
                                )}>
                                  {material.brand}
                                </span>
                              </td>
                          <td className="px-6 py-4 font-bold text-gray-900">{material.name}</td>
                          <td className="px-6 py-4 font-medium">
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs",
                              material.baseMaterial === '尼龙基材料' && "bg-blue-50 text-blue-700",
                              material.baseMaterial === '高性能工程塑料' && "bg-rose-50 text-rose-700",
                              material.baseMaterial === '弹性体' && "bg-amber-50 text-amber-700"
                            )}>
                              {material.baseMaterial}
                            </span>
                          </td>
                          <td className="px-6 py-4">{material.color}</td>
                              <td className="px-6 py-4 font-medium">{material.density}</td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => toggleMaterial(material.id)}
                                  className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                                  title={expandedMaterials[material.id] ? "收起详情" : "展开详情"}
                                >
                                  <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", expandedMaterials[material.id] ? "rotate-180" : "")} />
                                </button>
                              </td>
                            </tr>
                            {expandedMaterials[material.id] && (
                              <tr className="bg-gray-50/30">
                                <td colSpan={6} className="px-6 py-4 pb-6">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                    <div className="flex items-start gap-2">
                                      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                      <div>
                                        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">材料特性</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-normal break-words">{material.features}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Box className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                                      <div>
                                        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">推荐应用场景</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-normal break-words">{material.applications}</p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
