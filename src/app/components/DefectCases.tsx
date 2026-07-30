import { useState, useEffect } from 'react';
import { ArrowLeft, Search, AlertTriangle, Image as ImageIcon, ChevronRight, ChevronDown, ChevronLeft, X } from 'lucide-react';
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

// 缺陷数据类型定义
interface DefectItem {
  id: string;
  title: string;
  category: string;
  symptoms: string;
  causes: string[];
  solutions: string[];
  image?: string;    // 单张图片（兼容旧格式）
  images?: string[]; // 多张图片，优先使用，将图片放入 public/defects/ 目录
}

// 缺陷数据
const DEFECTS_DATA: DefectItem[] = [
  {
    id: '1',
    title: '橘皮',
    images: ['/defects/JuPi-1.webp', '/defects/JuPi-2.webp'],
    category: '表面质量问题',
    symptoms: '零件表面出现坑洼不平的现象',
    causes: [
      '打印温度不稳定，温度不同造成零件表面收缩不同形成坑洼现象',
      '打印材料老化严重，粉末颗粒度不均匀造成橘皮',
      '在成型缸内长时间留存，零件在成型缸内散热困难且不均匀造成橘皮'
    ],
    solutions: [
      '针对于小区域深度较浅的橘皮，可以使用打磨器打磨平整。',
      '针对于小区域深度较深的橘皮，可以使用尼龙粘接胶水混合尼龙粉末，涂抹在零件上，待胶水固化后进行打磨修复。',
      '针对于大面积的橘皮，特别是占据整个面大部分面积，此时没有基准面进行找平，建议交由专业师傅使用原子灰进行整面找平修复，或者干脆重新打印。',
      '特别备注，对于要进行熏抛的零件，使用胶水混合尼龙粉末进行修复时，尽量保证粉末比例多于胶水，这样熏抛能有部分效果，胶水比例太高容易导致熏抛蒸汽无法进入找平区域，呈现明显色差。同时对于有外观需求的零件，建议后期进行喷漆美化。'
    ]
  },
  {
    id: '2',
    title: '翘曲（笑脸型）',
    images: ['/defects/QiaoQu_XiaoLianXing-1.webp'],
    category: '热变形问题',
    symptoms: '一般出现在长条形零件上，两端上翘，中部下沉的弯曲状。',
    causes: [
      '零件由于设计问题，在打印的时候区域间接受的热量不同，导致出现热应力形变。',
      '缸内零件摆放密度不均匀，层间扫描面积/区域之间扫描面积不均匀过度不平滑，导致某零件收到另外的零件打印热量影响造成热应力形变。',
      '零件拆包之后，在散热过程中散热不均，两端散热快中间散热慢导致翘曲。'
    ],
    solutions: [
      '对于实心程度不高，可以依靠人力弯曲的长条形零件，可以使用热矫正。使用热风枪/放置在加热缸内加热零件使零件软化，随后使用夹具进行外力矫正。建议矫正时对于零件进行缓慢降温保压，冷却过快会导致零件矫正效果不佳。',
      '对于实心程度高的零件在打印前进行预防，情况允许的条件下对零件进行抽壳，不要100%烧结，降低热变形的概率论。同时对于实心零件在散热阶段应该避免急速降温，可以在零件拆包后，让外层的粉末包裹零件状态下静止24小时左右散热，保证散热均匀。',
      '在排版阶段尽量保持扫描区域平均过渡，尽量不出现某一区域烧结时间过长/层间扫描面积突变。'
    ]
  },
  {
    id: '3',
    title: '翘曲（对角线）',
    images: ['/defects/QiaoQu_DuiJiaoXian-1.webp', '/defects/QiaoQu_DuiJiaoXian-2.webp', '/defects/QiaoQu_DuiJiaoXian-3.webp'],
    category: '热变形问题',
    symptoms: '一般出现在盒装零件上，盒装零件沿底部的对角线成扭转状翘曲',
    causes: [
      '零件由于在打印时，底面扫描面积大，外壁扫描面积小，零件本身受到的热量不均造成热应力形变。',
      '零件在拆包后散热不均，有一侧温度下降过快，提前收缩发生形变。'
    ],
    solutions: [
      '对于形状规范，特征不易变形或断裂的零件，可以使用热矫正的方式对零件进行矫正修复。',
      '在零件打印前进行加固，易变形的区域拉支撑固定，依靠内部的支撑减少打印后变形的可能。待冷却后保持形状的应力大于变形的力，维持零件形状。'
    ]
  },
  {
    id: '4',
    title: '翘曲（部分区域变形）',
    images: ['/defects/QiaoQu_BuFenQuYu_1.webp'],
    category: '热变形问题',
    symptoms: '零件大部分形状保持良好，某一部分出现变形',
    causes: [
      '零件在拆包/喷砂时，由于内部温度较高，在外力挤压的时候造成某个区域变形，待零件冷却后仍保持变形的状态。'
    ],
    solutions: [
      '在零件拆包时避免温度过高进行热拆，同时在拆包和喷砂时保护零件，避免零件收到过高的外力挤压撞击变形。',
      '零件在发生形变后，偏向规整的零件可以考虑进行热矫正恢复平直。'
    ]
  },
  {
    id: '5',
    title: '错层',
    images: ['/defects/CuoCeng_1.webp', '/defects/CuoCeng_2.webp'],
    category: '打印设备/机械',
    symptoms: '零件打印位置与切片位置不符，发生了肉眼可见的错位',
    causes: [
      '打印时粉面烧结过硬，刮刀铺粉的时候推动粉面导致错层。',
      '铺粉质量较差，粉面不够致密，造成刮刀移动带动特征错位。'
    ],
    solutions: [
      '调整打印的参数，检测设备的灯管温度是否均匀。',
      '检查铺粉机构和粉体质量，确保不是因为铺粉机构或者粉体老化原因导致铺粉粉面不够致密。'
    ]
  },
  {
    id: '6',
    title: '拼接错位',
    category: '激光/能量参数',
    images: ['/defects/PinJieCuoWei-1.webp'],
    symptoms: '出现在多激光设备，零件处于多激光拼接区域，激光直接扫描位置与切片位置不符，造成拼接区域错位。',
    causes: [
      '激光设置的偏移量错误，导致多激光拼接时结合区域没有对齐形成错位'
    ],
    solutions: [
      '对于多激光设备应该完成激光偏移参数的矫正，确保打印的拼接区域正常。',
      '激光参数无法校准的前提下，可以在摆放阶段零件避开拼接区域。'
    ]
  },
  {
    id: '7',
    title: '开裂',
    images: ['/defects/KaiLie-1.webp'],
    category: '热量/温度控制',
    symptoms: '多见于实心零件，零件表面有裂纹，严重的可能发生断裂',
    causes: [
      '在零件散热阶段时，表层散热过快，实心程度高的零件内部散热慢，内外温差过大，导致外表面收缩严重内部过度膨胀，撕裂表面。'
    ],
    solutions: [
      '对实心零件进行抽壳。',
      '无法抽壳的情况下，尽量对零件缓慢散热，减少零件内外温差。'
    ]
  },
  {
    id: '8',
    title: '特征缺失',
    images: ['/defects/TeZhengQueShi-1.webp'],
    category: '模型/设计问题',
    symptoms: '多见于薄壁零件，零件特征缺失，没有打印。或是零件本身特征太小，在清理过程中破坏丢失。',
    causes: [
      '零件特征尺寸（如壁厚、柱径）低于设备的最小打印极限，导致在切片时被直接忽略或激光未能有效烧结。',
      '特征本身虽然被打印出来，但结构极为脆弱，在后期清粉、喷砂等受到外力时发生断裂丢失。'
    ],
    solutions: [
      '对特征过小的区域进行加厚，保证能被切片和打印机打印出来。',
      '对于濒临最小打印厚度的数据，条件允许的情况下，调整切片参数（光补等），变相加厚零件特征。',
      '在清理表面粉面/喷砂时，尽量小心保护好脆弱特征不被破坏。'
    ]
  }
];

export function DefectCases() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({});
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [lightboxImage]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    DEFECTS_DATA.forEach(d => { initial[d.id] = false; });
    return initial;
  });

  const toggleCard = (id: string) => {
    setIsCardExpanded(prev => ({ ...prev, [id]: prev[id] === false ? true : false }));
  };

  const [activeDefectId, setActiveDefectId] = useState<string | null>(null);

  const scrollToDefect = (id: string) => {
    const element = document.getElementById(`defect-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // 如果卡片处于折叠状态，顺便将其展开
      if (isCardExpanded[id] === false) {
         toggleCard(id);
      }
      setActiveDefectId(id);
      setTimeout(() => {
        setActiveDefectId(null);
      }, 3000);
    }
  };

  const filteredDefects = DEFECTS_DATA.filter(defect => {
    const matchesSearch = defect.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          defect.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === '全部' || defect.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  零件缺陷案例
                </h1>
              </div>
              <p className="mt-3 text-sm text-gray-500 max-w-3xl leading-relaxed">
                查阅 SLS 打印过程中常见的缺陷表征（如翘曲、层间开裂、粗糙等），快速定位可能原因，并获取系统性的参数调整与排包解决方案。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索缺陷名称或症状..."
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 relative">
            <div className="flex-1 min-w-0">
              <div className="space-y-6">
                {filteredDefects.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
                    <Search className="mb-4 h-10 w-10 text-gray-300" />
                    <p className="text-gray-500">没有找到匹配的缺陷案例</p>
                    <button 
                      onClick={() => {setSearchQuery(''); setActiveCategory('全部');}}
                      className="mt-4 text-sm font-medium text-rose-600 hover:text-rose-500"
                    >
                      清除搜索条件
                    </button>
                  </div>
                ) : (
                  filteredDefects.map((defect) => (
                    <div 
                      key={defect.id} 
                      id={`defect-${defect.id}`}
                      className={cn(
                        "rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all overflow-hidden duration-500",
                        activeDefectId === defect.id ? "border-blue-500 ring-2 ring-blue-500/20 ring-offset-2" : "border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "flex items-start justify-between",
                        isCardExpanded[defect.id] !== false ? "mb-4 border-b border-gray-100 pb-4" : ""
                      )}>
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-gray-900">{defect.title}</h2>
                        </div>
                        <button
                          onClick={() => toggleCard(defect.id)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                          title={isCardExpanded[defect.id] !== false ? "收起案例" : "展开案例"}
                        >
                          <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isCardExpanded[defect.id] !== false ? "rotate-180" : "")} />
                        </button>
                      </div>
                      
                      {isCardExpanded[defect.id] !== false && (
                        <div className="space-y-6">
                          <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              缺陷描述
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{defect.symptoms}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="lg:pr-6 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-gray-100">
                              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                缺陷分析
                              </h4>
                              <ul className="space-y-2">
                                {defect.causes.map((cause, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="text-amber-500 font-bold mt-0.5 shrink-0">•</span>
                                    <span className="leading-relaxed">{cause}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="lg:pl-6 pt-6 lg:pt-0">
                              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                解决方案
                              </h4>
                              <ul className="space-y-2">
                                {defect.solutions.map((solution, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="text-emerald-500 font-bold mt-0.5 shrink-0">•</span>
                                    <span className="leading-relaxed">{solution}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
  
                          {/* 缺陷图片预览区域 */}
                          <div className="relative pt-6 mt-6 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              缺陷参考图
                            </h4>
                            
                            <div className={cn(
                              "relative w-full bg-gray-50 rounded-xl border-2 overflow-hidden transition-all duration-300",
                              expandedImages[defect.id] !== false ? "h-48 sm:h-64" : "h-16",
                              (defect.images?.length || defect.image) && !imageErrors[defect.id] && expandedImages[defect.id] !== false
                                ? "border-solid border-gray-200"
                                : "border-dashed border-gray-200"
                            )}>
                              {expandedImages[defect.id] !== false ? (
                                (() => {
                                  const images = defect.images?.length ? defect.images : (defect.image ? [defect.image] : []);
                                  const currentIdx = Math.min(currentImageIndices[defect.id] || 0, Math.max(0, images.length - 1));
                                  const currentSrc = images[currentIdx];
                                  const hasMultiple = images.length > 1;

                                  if (currentSrc && !imageErrors[defect.id]) {
                                    return (
                                      <>
                                        <img
                                          src={withBase(currentSrc)}
                                          alt={`${defect.title}缺陷参考图 ${currentIdx + 1}`}
                                          className="h-full w-full object-cover cursor-zoom-in"
                                          loading="lazy"
                                          onError={() => setImageErrors(prev => ({ ...prev, [defect.id]: true }))}
                                          onDoubleClick={() => setLightboxImage({ src: currentSrc, title: defect.title })}
                                          title="双击查看原图"
                                        />
                                        {hasMultiple && (
                                          <>
                                            <button
                                              onClick={() => {
                                                setCurrentImageIndices(prev => ({ ...prev, [defect.id]: (currentIdx - 1 + images.length) % images.length }));
                                                setImageErrors(prev => ({ ...prev, [defect.id]: false }));
                                              }}
                                              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                                              title="上一张"
                                            >
                                              <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <button
                                              onClick={() => {
                                                setCurrentImageIndices(prev => ({ ...prev, [defect.id]: (currentIdx + 1) % images.length }));
                                                setImageErrors(prev => ({ ...prev, [defect.id]: false }));
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
                                  } else if (currentSrc && imageErrors[defect.id]) {
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
                                        <span className="text-xs text-gray-400 mt-1">在数据中添加 images 字段，图片放入 public/defects/</span>
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
                                onClick={() => setExpandedImages(prev => ({...prev, [defect.id]: prev[defect.id] === false ? true : false}))}
                                className={cn(
                                  "absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-all",
                                  expandedImages[defect.id] !== false ? "bottom-2" : "top-1/2 -translate-y-1/2"
                                )}
                                title={expandedImages[defect.id] !== false ? "收起图片" : "展开图片"}
                              >
                                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expandedImages[defect.id] !== false ? "rotate-180" : "")} />
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
                "fixed top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-rose-600 shadow-lg transition-all duration-300 hover:bg-rose-50 hover:scale-110 md:hidden",
                isMobileSidebarOpen ? "right-72" : "right-0"
              )}
              aria-label={isMobileSidebarOpen ? "收起大纲" : "展开大纲"}
            >
              {isMobileSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>

            {/* Right Column (Sidebar Filters & Outline) */}
            <aside className={cn(
              "w-72 shrink-0",
              "fixed right-0 top-16 bottom-0 z-40 transition-transform duration-300 ease-out",
              "md:sticky md:top-24 md:bottom-auto md:z-auto md:self-start md:w-48 md:translate-x-0 lg:w-56",
              isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}>
              <div className="m-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg flex flex-col max-h-[calc(100vh-8rem)] md:m-0 md:shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">页面大纲</h3>
                <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                  {DEFECTS_DATA.map(defect => (
                    <button
                      key={defect.id}
                      onClick={() => {
                        scrollToDefect(defect.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={cn(
                        "text-left px-3 py-2 rounded-lg text-sm transition-colors w-full shrink-0 group border border-transparent",
                        activeDefectId === defect.id 
                          ? "bg-blue-50 text-blue-700 font-medium border-blue-200" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="line-clamp-2 leading-relaxed">
                        {defect.title}
                      </div>
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
            alt={`${lightboxImage.title}缺陷参考图`}
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
