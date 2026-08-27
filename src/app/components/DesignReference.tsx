import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Box, Image as ImageIcon, ChevronRight, ChevronDown, ChevronLeft, X } from 'lucide-react';
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

// 设计参考数据类型定义
interface DesignItem {
  id: string;
  title: string;
  description: string;
  guidelines: string;
  notes: string;
  images?: string[]; // 多张图片，将图片放入 public/design-reference/ 目录
}

// 设计参考数据
const DESIGN_DATA: DesignItem[] = [
  {
    id: '1',
    title: '最小壁厚/特征',
    description: 'SLS 工艺中零件壁厚的最小可烧结尺寸，直接影响特征能否被完整打印及结构强度。',
    guidelines: '所有零件（尤其是字体，孔位，薄壁件，尖锐边缘）',
    notes: '对于SLS工艺来说，由于工艺特性有一个最小的打印范围，一般是0.5mm到0.8mm，在这个范围内打印的才能承受喷砂清理。\
            零件内部的间隙最小在1.2mm或以上，过窄的间隙两侧的粉末会被激光热量烧结固化，即便拿工具也很难清理干净。综上在\
            零件设计时需要考虑工艺精度。',
  },

  {
    id: '2',
    title: '蜂窝填充',
    description: '将零件某部分填充更换为蜂窝状的晶格或在零件壁上作为加强筋使用',
    guidelines: '较大体积的实心区域，较长的长条形零件的内部填充，薄壁零件的内壁加强筋，平板型零件加强筋',
    notes: '对于占据相同体积的实心区域和蜂窝填充区域，在保证结构强度的同时，蜂窝填充可以显著减少打印材料的使用和减少扫描的面积和时间。\
            给零件自身减重的同时减少了打印时的热量堆积，有效减弱因为热量导致的零件变形开裂等问题。同时对于打印完成需要等待散热清粉的零件，\
            蜂窝裸漏的蜂窝填充结构可以增大零件的表面积，对于零件散热有极大的帮助。对于因为零件散热时导致的冷热不均引起的变形问题同样有明显的减缓作用。',
    images:[
      'designReference/FengWoTianChong-2.jpg'
    ]        
  },

  {
    id: '3',
    title: '厚度均匀',
    description: '在零件整体满足使用要求的情况下，零件整体壁厚均匀，整体厚度相差减少，在厚度相差的区域过渡平滑',
    guidelines: '所有零件',
    notes: '在SLS工艺中，打印件均匀的厚度代表打印时候的热场趋于稳定，零件内部应力处于较低水平不容易出现变形开裂的情况。\
            同时均匀的厚度能够更好的控制尺寸，尼龙打印后会出现收缩的现象，零件尺寸变小，对于均匀的厚度来说，整个零件的缩水更容易预测和控制，\
            同时可以减少局部因收缩导致的凹陷。最后是厚度变化均匀，这样零件内部应力也是均匀过度，避免出现应力集中，进而在应力集中的位置受外力碰撞/自行裂开。',
  },

  {
    id: '4',
    title: '抽壳',
    description: '对于实心程度高，体积较大的零件进行抽壳',
    guidelines: '大体积或实心程度高的零件，尤其是两个特点都具有的零件',
    notes: '对于大体积的实心零件，如果不方便进行蜂窝填充的情况下可以对零件进行抽壳。抽壳可以不是壁厚完全一致的，\
            可以有厚度相差。主要目的是为了让零件内部形成空腔，减少扫描的面积，这样可以减弱橘皮和开裂的产生，同时抽壳情况下，\
            清粉孔是可选的。如果不开清粉孔可以保留内部粉末保证重量。如果需要开清粉孔清理，与蜂窝结构相比，清理的难度也比蜂窝结构简单很多。',
  },

  {
    id: '5',
    title: '粉末清除',
    description: '为了清理干净零件内部腔体粉末，对零件开清粉孔，扩大零件本身圆孔等设计',
    guidelines: '零件内部有需要清理的空腔，且零件内部本身封闭程度高（全封闭或仅有少部分孔位）',
    notes: '对于零件内部有腔体的零件，在设计时规划好粉末排出的方法和路径，有助于零件减轻重量，减少打印的价格，\
            对于腔体内有洁净要求的零件更是决定零件是否可用的关键。对于大空腔零件至少2各有3mm或以上的对向排粉口，对于窄深槽喷砂无法有效清理，请扩大槽位。',
  },

  {
    id: '6',
    title: '拆件',
    description: '对零件进行拆分',
    guidelines: '无法放入成型缸的零件，体积过大的零件（打印价格过高），大平板大长条零件',
    notes: '对于SLS工艺，打印的零件体积越大越高，消耗的粉末越多，打印价格也就越高。对于体积过大的零件，\
            厂家难以拼单打印，这时候可以进行拆件，降低打印的费用。对于无法放入成型缸的零件也需要进行拆件才能正常打印。\
            对于大平板大长条这些零件，由于打印容易发生翘曲变形，适当进行拆分可以提升成品打印质量。',
  },

  {
    id: '7',
    title: '加强筋',
    description: '对于容易变形的零件增加加强筋，增加自身刚性用于抵抗破坏和变形',
    guidelines: '盒状零件，大平板零件，薄壁零件等易变形和被破坏的零件',
    notes: '在打印时零件内部可能有较大的热应力，甚至于在初步散热阶段或打印时已经开始发生变形，在基础设计不容更改的情况下，\
            可以对零件添加加强筋，盒装零件可以在侧壁增加筋或是在开口处增加“裙边”，大平板可以增加蜂窝/网格/圆环等加强筋，\
            其他类型容易变形的零件可以根据实际情况增加保形肋。',
  },

  {
    id: '8',
    title: '后处理余量预留',
    description: 'SLS 零件为后续后处理工艺（打磨、切削、喷漆等）需要预留的尺寸余量。',
    guidelines: '需要后续进行打磨，切削，喷漆等后处理工艺的零件',
    notes: '对于相当多的零件来说，SLS打印仅仅是初步的成型手段，后续为了零件实际应用或外观等需求，SLS打印零件仍需要进行一个或以上的工序后处理。\
            对于需要切削打磨等减材加工，在数模上应该提前增加余量，对于需要喷漆（特别是涉及到装配）的零件，在数模上也应该减出余量保证零件的可装配性。',
  },
];

export function DesignReference() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
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
    DESIGN_DATA.forEach(d => { initial[d.id] = false; });
    return initial;
  });

  const toggleCard = (id: string) => {
    setIsCardExpanded(prev => ({ ...prev, [id]: prev[id] === false ? true : false }));
  };

  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const scrollToItem = (id: string) => {
    const element = document.getElementById(`design-${id}`);
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

  const filteredItems = DESIGN_DATA.filter(item => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.description.toLowerCase().includes(searchQuery.toLowerCase());
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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                  <Box className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  面向 SLS 零件设计参考
                </h1>
              </div>
              <p className="mt-3 text-sm text-gray-500 max-w-3xl leading-relaxed">
                对使用 SLS 工艺生产的零件提供设计参考，包括零件特征尺寸、结构设计、排版工艺、后处理余量等准则，帮助在设计阶段规避常见打印缺陷。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索设计描述..."
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 relative">
            <div className="flex-1 min-w-0">
              <div className="space-y-6">
                {filteredItems.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
                    <Search className="mb-4 h-10 w-10 text-gray-300" />
                    <p className="text-gray-500">没有找到匹配的设计参考</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-500"
                    >
                      清除搜索条件
                    </button>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      id={`design-${item.id}`}
                      className={cn(
                        "rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all overflow-hidden duration-500",
                        activeItemId === item.id ? "border-purple-500 ring-2 ring-purple-500/20 ring-offset-2" : "border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "flex items-start justify-between",
                        isCardExpanded[item.id] !== false ? "mb-4 border-b border-gray-100 pb-4" : ""
                      )}>
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
                        </div>
                        <button
                          onClick={() => toggleCard(item.id)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                          title={isCardExpanded[item.id] !== false ? "收起" : "展开"}
                        >
                          <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isCardExpanded[item.id] !== false ? "rotate-180" : "")} />
                        </button>
                      </div>

                      {isCardExpanded[item.id] !== false && (
                        <div className="space-y-6">
                          {/* 设计描述 */}
                          <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                              设计描述
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                          </div>

                          {/* 适用范围 + 设计优势 */}
                          <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="lg:pr-6 pb-6 lg:pb-0 border-b lg:border-b-0 lg:border-r border-gray-100">
                              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                适用范围
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{item.guidelines}</p>
                            </div>
                            <div className="lg:pl-6 pt-6 lg:pt-0">
                              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                设计优势
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{item.notes}</p>
                            </div>
                          </div>

                          {/* 设计参考图 */}
                          <div className="relative pt-6 mt-6 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              设计参考图
                            </h4>

                            <div className={cn(
                              "relative w-full bg-gray-50 rounded-xl border-2 overflow-hidden transition-all duration-300",
                              expandedImages[item.id] === true ? "h-48 sm:h-64" : "h-16",
                              item.images?.length && !imageErrors[item.id] && expandedImages[item.id] === true
                                ? "border-solid border-gray-200"
                                : "border-dashed border-gray-200"
                            )}>
                              {expandedImages[item.id] === true ? (
                                (() => {
                                  const images = item.images?.length ? item.images : [];
                                  const currentIdx = Math.min(currentImageIndices[item.id] || 0, Math.max(0, images.length - 1));
                                  const currentSrc = images[currentIdx];
                                  const hasMultiple = images.length > 1;

                                  if (currentSrc && !imageErrors[item.id]) {
                                    return (
                                      <>
                                        <img
                                          src={withBase(currentSrc)}
                                          alt={`${item.title}设计参考图 ${currentIdx + 1}`}
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
                                        <ImageIcon className="h-8 w-8 mb-2 opacity-40 text-purple-400" />
                                        <span className="text-sm font-medium text-purple-400">图片加载失败，请检查路径</span>
                                        <span className="text-xs text-gray-400 mt-1 font-mono">{currentSrc}</span>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="flex h-full flex-col items-center justify-center">
                                        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                        <span className="text-sm font-medium">暂无图片</span>
                                        <span className="text-xs text-gray-400 mt-1">在数据中添加 images 字段，图片放入 public/design-reference/</span>
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
                                onClick={() => setExpandedImages(prev => ({ ...prev, [item.id]: prev[item.id] === true ? false : true }))}
                                className={cn(
                                  "absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-all",
                                  expandedImages[item.id] === true ? "bottom-2" : "top-1/2 -translate-y-1/2"
                                )}
                                title={expandedImages[item.id] === true ? "收起图片" : "展开图片"}
                              >
                                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expandedImages[item.id] === true ? "rotate-180" : "")} />
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
                "fixed top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-purple-600 shadow-lg transition-all duration-300 hover:bg-purple-50 hover:scale-110 md:hidden",
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
                  {DESIGN_DATA.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToItem(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={cn(
                        "text-left px-3 py-2 rounded-lg text-sm transition-colors w-full shrink-0 group border border-transparent",
                        activeItemId === item.id
                          ? "bg-purple-50 text-purple-700 font-medium border-purple-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="line-clamp-2 leading-relaxed">
                        {item.title}
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
            alt={`${lightboxImage.title}设计参考图`}
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
