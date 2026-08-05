import React, { useState } from 'react';
import { 
  Search, 
  Calculator, 
  Box, 
  Droplets, 
  Settings, 
  Menu,
  X,
  ChevronRight,
  Printer,
  Grid,
  Image as ImageIcon,
  Heart,
  List,
  ArrowRightLeft,
  AlertTriangle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const CATEGORIES = [
  { id: 'all', name: '全部工具', icon: Grid },
  { id: 'calc', name: '打印计算', icon: Calculator },
  { id: 'material', name: '材料属性', icon: Settings },
  { id: 'cases', name: '效果案例', icon: ImageIcon },
  { id: 'favorites', name: '我的收藏', icon: Heart },
];

const TOOLS = [
  {
    id: '1',
    title: '打印订单计算器',
    description: '一个有测算尼龙烧结成本，快捷报价等功能综合计算器',
    categoryId: 'calc',
    icon: Calculator,
    color: 'bg-emerald-500/10 text-emerald-600',
    path: '/cost-calculator'
  },
  {
    id: '2',
    title: '打印材料明细',
    description: '查看不同尼龙粉末（PA12, PA11, TPU等）的详细物理、化学和热学属性。',
    categoryId: 'material',
    icon: List,
    color: 'bg-blue-500/10 text-blue-600',
    path: '/material-details'
  },
  {
    id: '3',
    title: '零件缺陷案例',
    description: '汇集常见的SLS打印缺陷（如翘曲、开裂、变形）及原因分析与解决方案。',
    categoryId: 'cases',
    icon: AlertTriangle,
    color: 'bg-rose-500/10 text-rose-600',
    path: '/defect-cases'
  },
  {
    id: '4',
    title: '零件后处理案例',
    description: '展示喷砂、染色、化学蒸汽平滑等不同后处理工艺在尼龙零件上的实际效果。',
    categoryId: 'cases',
    icon: Droplets,
    color: 'bg-cyan-500/10 text-cyan-600',
    path: '/post-processing-cases'
  },
  {
    id: '5',
    title: '零件后处理缺陷案例',
    description: '汇集的SLS打印零件后处理缺陷的原因分析与解决方案。',
    categoryId: 'cases',
    icon: ArrowRightLeft,
    color: 'bg-indigo-500/10 text-indigo-600',
    path: '/material-comparison'
  },
  {
    id: '6',
    title: '各材料打印零件案例',
    description: '浏览不同材料打印出的行业应用零件实拍图与案例解析。',
    categoryId: 'cases',
    icon: Box,
    color: 'bg-purple-500/10 text-purple-600',
    path: '/print-cases'
  },
];

export function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === 'all' || 
                            (activeCategory === 'favorites' ? favorites.includes(tool.id) : tool.categoryId === activeCategory);
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50/50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button 
            className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Printer className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">SLS尼龙烧结工具站</span>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-end md:px-8 lg:px-16">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索工具..."
              className="block w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:block lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4 lg:hidden">
            <span className="font-semibold text-gray-900">菜单</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-md p-2 hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="flex h-full flex-col overflow-y-auto py-6">
            <div className="px-4 pb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">分类</h2>
            </div>
            <nav className="flex-1 space-y-1 px-3">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-gray-400")} />
                    {category.name}
                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                  </button>
                );
              })}
            </nav>
            <div className="mt-8 px-6 pb-6">
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <h3 className="text-sm font-medium text-blue-900">关于本站</h3>
                <p className="mt-2 text-xs text-blue-700 leading-relaxed">
                  为3D打印工程师打造的专属效率工具集，提供SLS尼龙烧结相关的全流程计算与辅助工具。
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {activeCategory === 'all' ? '所有工具' : CATEGORIES.find(c => c.id === activeCategory)?.name}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {filteredTools.length} 个可用工具
              </p>
            </div>

            {filteredTools.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
                <Search className="mb-4 h-10 w-10 text-gray-300" />
                <p className="text-gray-500">没有找到匹配的工具</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  清除搜索条件
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        if (tool.path) {
                          navigate(tool.path);
                        }
                      }}
                      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", tool.color)}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">
                        {tool.description}
                      </p>
                      
                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                          立即使用 <ChevronRight className="ml-1 h-4 w-4" />
                        </div>
                        <button 
                          onClick={(e) => toggleFavorite(e, tool.id)}
                          className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
                        >
                          <Heart 
                            className={cn(
                              "h-5 w-5 transition-colors", 
                              favorites.includes(tool.id) 
                                ? "fill-red-500 text-red-500" 
                                : "text-gray-400 hover:text-red-500"
                            )} 
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}