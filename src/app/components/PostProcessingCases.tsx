import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Droplets, Image as ImageIcon, ChevronRight, ChevronDown, ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// GitHub Pages 子路径前缀，自动匹配 vite.config.ts 中的 base 配置
const BASE = import.meta.env.BASE_URL;
function withBase(path: string): string {
  if (!path) return path;
  return path.startsWith('/') ? `${BASE}${path.slice(1)}` : path;
}

// 后处理案例数据类型定义
interface PostProcessItem {
  id: string;
  title: string;
  description: string;
  advantages: string[];
  notes?: string; // 工艺补充说明
  images?: string[]; // 多张图片，将图片放入 public/post-processing/ 目录
}

// 后处理案例数据
const POST_PROCESS_DATA: PostProcessItem[] = [
  {
    id: '1',
    title: '喷砂处理',
    images: [''],
    description: '通过高压气流将磨料（如石英砂、金刚砂等）高速喷射到零件表面，去除表面粉末残留并获得均匀的哑光质感。',
    advantages: [
      '有效去除SLS打印后残留的尼龙粉末，使零件表面洁净',
      '处理效率高，适合大批量零件的表面清理',
      '可根据需求调整喷砂压力和磨料种类，控制表面粗糙度'
    ],
    notes: '（待补充）'
  },

  {
    id: '2',
    title: '化学蒸汽平滑（熏抛）',
    images: ['/post-processing/XunPao_1176GF30-1.webp',
             '/post-processing/XunPao_1176GF30-2.webp',
             '/post-processing/XunPao_1176GF30-3.webp',
             '/post-processing/XunPao_1172-4.webp'
    ],
    description: '将零件置于密闭腔体内，利用特定溶剂的蒸汽在零件表面凝结并微熔表层，冷却后形成光滑密封的表面。',
    advantages: [
      '大幅降低零件表面粗糙度，获得类注塑件的光滑手感',
      '有效封闭零件表面微孔，提升防水性和气密性',
      '适用于复杂几何形状零件，内腔和外表面均能处理',
      '处理后零件更易清洁，不易藏污纳垢'
    ],
    notes: '化学抛光后产品特点：表面光泽更加美观、表面光滑度明显提高、机械性能提高、气密和水密效果增强、对尺寸影响小。产品直接终端应用。（抛光效果因材料而有差异）'
  },

  {
    id: '3',
    title: '染色处理',
    images: ['/post-processing/RanSe-1.webp',
             '/post-processing/RanSe-2.webp'
    ],
    description: '使用专用尼龙染料将SLS打印的白色/灰色零件染成所需颜色，染料渗入表层微孔，色彩牢固持久。',
    advantages: [
      '突破SLS打印材料的颜色限制，可实现多种颜色选择',
      '染料渗透至零件表层，相对于喷漆不掉色、不脱落',
      '成本较低，适合中小批量生产的着色需求',
    ],
    notes: '染色的效果因不同的材料有差异，同时吸水率高的材料（如TPU）不建议染色，会改变零件尺寸'
  },

  {
    id: '4',
    title: '镶嵌螺套（牙套）',
    images: ['/post-processing/YaoTao-1.webp'],
    description: '自攻螺套也叫自攻牙套，是一种新型的加强螺纹强度的紧固件，自攻螺套内外都有牙纹，嵌入塑料等较软材料内，可以形成较高强度的内螺纹孔。',
    advantages: [
      '对于打印的零件来说可以随时开孔攻牙，调整螺纹尺寸深度',
      '对于非金属打印零件来说，嵌入螺套可以更好保护攻牙后的螺纹，承受多次以及更高强度的使用',
      '自攻螺套（自攻牙套）亦可对已坏的内螺纹进行修复'
    ],
    notes: '牙距是标规，可根据需求调节不同规格的牙距（可调整美规等）和深度，十分灵活'
  },

  {
    id: '5',
    title: '镶嵌热熔螺母',
    images: ['/post-processing/LuoMu-1.webp',
             '/post-processing/LuoMu-2.webp',
             '/post-processing/LuoMu-3.webp'
    ],
    description: '在零件预留的孔位上进行钻孔扩孔，然后使用焊锡笔等其他加热器具对螺母进行加热，对孔位进行热熔镶嵌，可以使零件获得一个长久耐用的螺纹。',
    advantages: [
      '提供高强、耐久的螺纹连接',
      '连接强度明显优于“压入”或“胶粘”',
      '安装过程相对简单、高效',
      '对于复杂结构的最终使用零件和需要定期维护拆装的部件是一个优秀的选择'
    ],
    notes: '热熔螺母一般使用的是铜螺母，也可以支撑不锈钢螺母镶嵌，但是由于不锈钢导热较慢，镶嵌效果会比铜螺母差。'
  },
  
  {
    id: '6',
    title: '喷漆涂装',
    images: ['/post-processing/PenQi-1.webp',
             '/post-processing/PenQi-2.webp'
    ],
    description: '在零件表面喷涂底漆和面漆，实现任意颜色和光泽度的涂装效果，同时起到表面保护和填平层纹的作用。',
    advantages: [
      '颜色选择完全自由，可实现潘通色卡任意颜色',
      '可选择哑光、半光、高光等不同光泽度',
      '喷漆的前处理可填平SLS打印的表面层纹，提升外观质量',
      '可以自由选择不同功能的表面保护层，增强耐磨和抗UV性能等'
    ],
    notes: '喷漆前建议按照潘通/劳尔标准色卡选择颜色，避免色差过大。'
  },
];

export function PostProcessingCases() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({});
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    POST_PROCESS_DATA.forEach(d => { initial[d.id] = false; });
    return initial;
  });
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [lightboxImage]);

  const toggleCard = (id: string) => {
    setIsCardExpanded(prev => ({ ...prev, [id]: prev[id] === false ? true : false }));
  };

  const scrollToItem = (id: string) => {
    const element = document.getElementById(`post-process-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (isCardExpanded[id] === false) {
         toggleCard(id);
      }
      setActiveItemId(id);
      setTimeout(() => {
        setActiveItemId(null);
      }, 3000);
    }
  };

  const filteredData = POST_PROCESS_DATA.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600">
                  <Droplets className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  零件后处理案例
                </h1>
              </div>
              <p className="mt-3 text-sm text-gray-500 max-w-3xl leading-relaxed">
                查阅 SLS 尼龙打印零件后处理工艺的详细案例，了解喷砂、熏抛、染色、喷漆等工艺的效果对比、适用场景及补充说明。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索工艺名称或效果描述..."
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 relative">
            <div className="flex-1 min-w-0">
              <div className="space-y-6">
                {filteredData.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
                    <Search className="mb-4 h-10 w-10 text-gray-300" />
                    <p className="text-gray-500">没有找到匹配的后处理案例</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-sm font-medium text-cyan-600 hover:text-cyan-500"
                    >
                      清除搜索条件
                    </button>
                  </div>
                ) : (
                  filteredData.map((item) => (
                    <div 
                      key={item.id} 
                      id={`post-process-${item.id}`}
                      className={cn(
                        "rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all overflow-hidden duration-500",
                        activeItemId === item.id ? "border-cyan-500 ring-2 ring-cyan-500/20 ring-offset-2" : "border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "flex items-start justify-between",
                        isCardExpanded[item.id] !== false ? "mb-4 border-b border-gray-100 pb-4" : ""
                      )}>
                        <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
                        <button
                          onClick={() => toggleCard(item.id)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                          title={isCardExpanded[item.id] !== false ? "收起案例" : "展开案例"}
                        >
                          <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isCardExpanded[item.id] !== false ? "rotate-180" : "")} />
                        </button>
                      </div>
                      
                      {isCardExpanded[item.id] !== false && (
                        <div className="space-y-6">
                          <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                              工艺描述
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="lg:pr-6 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-gray-100">
                              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                工艺优势与适用场景
                              </h4>
                              <ul className="space-y-2">
                                {item.advantages.map((adv, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="text-amber-500 font-bold mt-0.5 shrink-0">•</span>
                                    <span className="leading-relaxed">{adv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="lg:pl-6 pt-6 lg:pt-0">
                              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                工艺补充说明
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{item.notes || '暂无补充说明'}</p>
                            </div>
                          </div>
  
                          {/* 后处理效果预览区域 */}
                          <div className="relative pt-6 mt-6 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              效果参考图
                            </h4>
                            
                            <div className={cn(
                              "relative w-full bg-gray-50 rounded-xl border-2 overflow-hidden transition-all duration-300",
                              expandedImages[item.id] !== false ? "h-48 sm:h-64" : "h-16",
                              item.images?.length && !imageErrors[item.id] && expandedImages[item.id] !== false
                                ? "border-solid border-gray-200"
                                : "border-dashed border-gray-200"
                            )}>
                              {expandedImages[item.id] !== false ? (
                                (() => {
                                  const images = item.images || [];
                                  const currentIdx = Math.min(currentImageIndices[item.id] || 0, Math.max(0, images.length - 1));
                                  const currentSrc = images[currentIdx];
                                  const hasMultiple = images.length > 1;

                                  if (currentSrc && !imageErrors[item.id]) {
                                    return (
                                      <>
                                        <img
                                          src={withBase(currentSrc)}
                                          alt={`${item.title}效果参考图 ${currentIdx + 1}`}
                                          className="h-full w-full object-cover cursor-zoom-in"
                                          loading="lazy"
                                          onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                                          onDoubleClick={() => setLightboxImage({ src: currentSrc, title: item.title })}
                                          title="双击查看原图"
                                        />
                                        {hasMultiple && (
                                          <>
                                            <button
                                              onClick={() => {
                                                setCurrentImageIndices(prev => ({ ...prev, [item.id]: (currentIdx - 1 + images.length) % images.length }));
                                                setImageErrors(prev => ({ ...prev, [item.id]: false }));
                                              }}
                                              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                                              title="上一张"
                                            >
                                              <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <button
                                              onClick={() => {
                                                setCurrentImageIndices(prev => ({ ...prev, [item.id]: (currentIdx + 1) % images.length }));
                                                setImageErrors(prev => ({ ...prev, [item.id]: false }));
                                              }}
                                              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                                              title="下一张"
                                            >
                                              <ChevronRight className="h-5 w-5" />
                                            </button>
                                            <span className="absolute top-2 left-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm pointer-events-none">
                                              {currentIdx + 1} / {images.length}
                                            </span>
                                          </>
                                        )}
                                        <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm pointer-events-none">
                                          双击查看原图
                                        </span>
                                      </>
                                    );
                                  } else if (currentSrc && imageErrors[item.id]) {
                                    return (
                                      <div className="flex h-full flex-col items-center justify-center">
                                        <ImageIcon className="h-8 w-8 mb-2 opacity-40 text-rose-400" />
                                        <span className="text-sm font-medium text-rose-400">图片加载失败，请检查路径</span>
                                        <span className="text-xs text-gray-400 mt-1 font-mono">{currentSrc}</span>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="flex h-full flex-col items-center justify-center">
                                        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                        <span className="text-sm font-medium">暂无图片</span>
                                        <span className="text-xs text-gray-400 mt-1">在数据中添加 images 字段，图片放入 public/post-processing/</span>
                                      </div>
                                    );
                                  }
                                })()
                              ) : (
                                <div className="flex h-full items-center justify-center gap-2">
                                  <ImageIcon className="h-5 w-5 opacity-50" />
                                  <span className="text-sm font-medium">图片已折叠</span>
                                </div>
                              )}
                              
                              <button
                                onClick={() => setExpandedImages(prev => ({...prev, [item.id]: prev[item.id] === false ? true : false}))}
                                className={cn(
                                  "absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-all",
                                  expandedImages[item.id] !== false ? "bottom-2" : "top-1/2 -translate-y-1/2"
                                )}
                                title={expandedImages[item.id] !== false ? "收起图片" : "展开图片"}
                              >
                                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expandedImages[item.id] !== false ? "rotate-180" : "")} />
                              </button>
                            </div>
                          </div>
  
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Mobile sidebar backdrop */}
            {isMobileSidebarOpen && (
              <div 
                className="fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}

            {/* Mobile sidebar toggle button */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className={cn(
                "fixed top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-cyan-600 shadow-lg transition-all duration-300 hover:bg-cyan-50 hover:scale-110 md:hidden",
                isMobileSidebarOpen ? "right-72" : "right-0"
              )}
              aria-label={isMobileSidebarOpen ? "收起大纲" : "展开大纲"}
            >
              {isMobileSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>

            {/* Right Column (Sidebar Outline) */}
            <aside className={cn(
              "w-72 shrink-0",
              "fixed right-0 top-16 bottom-0 z-40 transition-transform duration-300 ease-out",
              "md:sticky md:top-24 md:bottom-auto md:z-auto md:self-start md:w-48 md:translate-x-0 lg:w-56",
              isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}>
              <div className="m-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg flex flex-col max-h-[calc(100vh-8rem)] md:m-0 md:shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">页面大纲</h3>
                <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                  {POST_PROCESS_DATA.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToItem(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={cn(
                        "text-left px-3 py-2 rounded-lg text-sm transition-colors w-full shrink-0 group border border-transparent",
                        activeItemId === item.id 
                          ? "bg-cyan-50 text-cyan-700 font-medium border-cyan-200" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span className="line-clamp-2 leading-relaxed">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>

        </div>
      </main>

      {/* 图片查看灯箱 */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxImage(null)}
            aria-label="关闭"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={withBase(lightboxImage.src)}
            alt={`${lightboxImage.title}效果参考图`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="absolute bottom-6 text-sm text-white/70">
            {lightboxImage.title} · 点击空白处或按 Esc 关闭
          </span>
        </div>
      )}
    </div>
  );
}
