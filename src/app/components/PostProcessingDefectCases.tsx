import { useState, useEffect } from 'react';
import { ArrowLeft, Search, ScanSearch, Image as ImageIcon, ChevronRight, ChevronDown, ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// GitHub Pages 子路径前缀
const BASE = import.meta.env.BASE_URL;
function withBase(path: string): string {
  if (!path) return path;
  return path.startsWith('/') ? `${BASE}${path.slice(1)}` : path;
}

// ── 数据模型：两级结构 ──

/** 第二级：缺陷类型 */
interface DefectType {
  id: string;
  title: string;           // 缺陷名称
  analysis: string[];         // 缺陷分析（每个元素为一条分析要点）
  prevention: string[];    // 补救或预防的方法
  images?: string[];
}

/** 第一级：后处理分类 */
interface PostProcessCategory {
  id: string;
  name: string;            // 后处理分类名称，如 染色、喷砂
  description?: string;    // 该分类简介
  defects: DefectType[];
}

// ── 后处理缺陷数据 ──

const POST_PROCESS_DEFECTS_DATA: PostProcessCategory[] = [
  {
    id: 'cat-1',
    name: '熏抛（化学蒸汽平滑）',
    description: '通过溶剂蒸汽在密闭腔体内使零件表层微融再固化，获得光滑表面。',
    defects: [
      {
        id:'cat-1-1',
        title:'熏蒸过度',
        analysis:[
          '熏抛溶液使用过度/熏抛时间过长',
          '参数设定无误的情况下，若多次出现这个情况，判断是设备此工作区域浓度过高，整个工作腔内浓度不均，尽量避免摆放零件。'
        ],
        prevention:[
          '对于形状规整简单的零件，可以使用打磨器去除外层熏抛层，重新设定熏抛参数进行熏抛',
          '对于严重过度区域起皮的情况下，可以使用美工刀/笔刀、手术刀等方式进行切除，然后使用砂纸手动磨除熏抛表层',
          '对于轻微过度，仅折角处的出现轻微反应，在客户接受的情况下无需处理',
          '对于严重过度的零件且表面异型，此时恢复难度过大，建议重打'
        ]
      },
      {
        id:'cat-1-2',
        title:'熏蒸过浅',
        analysis:[
          '熏抛浓度使用过少/熏抛时间过短',
          '挂件时部分零件阻挡溶液蒸汽，导致另外的零件接触零件过少。'
        ],
        prevention:[
          '重新调整参数/重新调整挂件位置进行二次熏抛'
        ]
      },
      {
        id:'cat-1-3',
        title:'熏蒸不均',
        analysis: [
          '一般由于零件自身结构问题造成的，溶液无法进入零件部分区域，或者是零件厚度相差太大，当前设定的溶液参数造成区域间效果不一致',
          '少部分情况是熏蒸设备设计原因，使用的设备对于当前零件熏蒸效果不佳，溶剂蒸汽在在当前设备无法较均匀依附在零件表面进行处理',
        ],
        prevention:[
          '对于溶液无法进入零件部分区域导致熏蒸不足，可尝试调整零件挂件方向让化学蒸汽接触',
          '对于零件自身厚度相差过大，只能确保关键位置的熏蒸，建议尝试手动打磨较薄的区域使少溶剂也能对表面进行较高质量平滑',
          '可以尝试修改设备的参数，调整溶剂温度，舱体压力等参数以改善熏蒸效果'
        ]
      },
    ],
  },
  
  {
    id: 'cat-2',
    name: '镶嵌螺母',
    description: '在零件预留孔位处使用热熔方式镶嵌螺母，让零件获得几乎永久使用的螺母',
    defects: [
      {
        id:'cat-2-1',
        title:'无法镶嵌',
        analysis:[
          '绝大多数由于零件设计问题引起的，镶嵌位置壁厚过薄，焊锡枪/钻头无法进入，孔径孔深设计错误等设计问题导致无法镶嵌',
          '特殊情况盲孔镶嵌盲孔螺母，由于气压问题，镶嵌中压迫孔内气体会造成气压变大，推出螺母'
        ],
        prevention:[
          '更换设计或者更换螺母型号，重新评估镶嵌可能性',
          '若因为孔壁过薄无法进行热熔镶嵌，可以考虑进行镶嵌牙套，对于薄孔壁镶嵌牙套是一个不错的选择'
        ]
      },
      {
        id:'cat-2-2',
        title:'开孔过大',
        analysis:[
          '使用钻头钻孔时，开孔直径大于等于螺母直径，导致无法镶嵌（可能是选择钻头错误/电钻或钻头同轴度较差）'
        ],
        prevention:[
          '更换外径更大的螺母进行镶嵌',
          '对于钻孔的钻头选择一般小于螺母外径0.3mm即可',
          '检查钻头电钻是否存在同轴度问题，存在的话建议更换',
          '以上无法解决建议重打零件，同时不建议使用胶水将螺母固定到孔位中，胶水极易进入螺纹导致螺丝无法拧入'
        ]
      },
      {
        id:'cat-2-3',
        title:'孔壁融化',
        analysis:[
          '镶嵌时间过长/焊锡枪温度过高/孔壁过薄，导致孔壁融化过度'
        ],
        prevention:[
          '调整焊锡枪温度和镶嵌时间，在两者之间找到平衡',
          '若存在镶嵌较长条的不锈钢螺母时，由于不锈钢导热性较差，建议将不锈钢螺母提前加热到较高温度（380-400℃）然后快速镶嵌'
        ]
      },
      {
        id:'cat-2-4',
        title:'熔料侵入螺母',
        analysis:[
          '对于长条形螺母镶嵌（5mm以上），可能会存在熔化的尼龙（或其他熔料）侵入螺母中'
        ],
        prevention:[
          '对于通孔镶嵌，使对应的螺丝拧入螺母即可顶出',
          '对于盲孔镶嵌，在条件允许的情况下，可以在钻孔的时候提前钻深，预留空间给融化的材料'
        ]
      }
    ],
  },

  {
    id: 'cat-3',
    name: '喷漆涂装',
    description: '在零件表面喷涂漆面是零件获得更多样的外观或更好的防护效果',
    defects: [
      {
        id:'cat-3-1',
        title:'漆面质量差',
        analysis:[
          '尼龙打印件表面较为粗糙，打印出来直接喷漆会形成针孔，凹陷不平，粗糙等漆面缺陷'
        ],
        prevention:[
          '在喷漆前建议先对零件进行打磨平整表面，在进一步补腻子填平表面的凹陷和针孔。同时确保涂装面清洁干净无异物，然后在进行喷漆工序'
        ]
      },
      {
        id:'cat-3-2',
        title:'掉漆',
        analysis:[
          '尼龙零件在喷漆前没有做好除油除污等工序，漆面无法牢固附着',
          '喷漆选用工艺不正确，自然风干的油漆附着力较低，可以尝试选用60℃的烤漆工艺'
        ],
        prevention:[
          '对尼龙零件喷涂前清洁好表面，做好相应的除油除污工作',
          '零件喷漆尽可能选择烤漆工艺，烤漆有较好的附着力',
          '喷漆工序最好细化，喷涂增加附着力的底漆，在面漆完成之后喷涂光油进行封闭和保护漆面'
        ]
      },
      {
        id:'cat-3-3',
        title:'色差',
        analysis:[
          '喷漆后的颜色跟自己需求的不一样，存在肉眼可见的色差。此时可能是调色错误/色卡/色板/表面质感有差异，需要仔细甄别'
        ],
        prevention:[
          '在喷漆前选定好色号，最好使用标准潘通/劳尔色卡色号，在沟通中指定好标准色防止表述不清导致色差',
          '如果使用色板/样品指定颜色，最好保存好样品，防止样品受环境/人为的影响，导致表面颜色发生变化（最常见就是白色的油漆氧化发黄或日常使用污染发黄）',
          '在喷漆前确认零件使用环境，更具使用环境选择合适的漆面（例：对于长期在户外使用的零件最好选择带有耐候功能的漆面）',
          '对于已经产生色差的零件，条件允许的话可以物理打磨掉漆面重新喷涂。化学脱漆剂谨慎使用，防止化学脱漆的成分破坏零件'
        ]
      }
    ],
  },

  {
    id: 'cat-4',
    name: '染色',
    description: '通过染料浸渍为尼龙零件赋予目标颜色，常见于消费级外观件。',
    defects: [
      {
        id: 'cat-4-1',
        title: '尺寸超差',
        analysis: [
          '零件吸水率高，在染色中吸入过多水分导致膨胀，烘干后水分未完全排出，尺寸发生变化',
        ],
        prevention: [
          '染色后尽量使用干燥箱等工具烘干，不选择自然晾干方式（特别是湿度较大的地区）',
          '如果材料吸水率较大，烘干后无法回复尺寸，建议更换上色工艺、更换打印材料或重新调整尺寸'
        ],
      },
      {
        id:'cat-4-2',
        title:'材料软化',
        analysis:[
          '零件（一般是纯PA12）染色时间长，同时染缸温度设定较高，染色处理后零件整体发生软化，机械性能下降',
        ],
        prevention:[
          '打印材料更换为更有刚性的玻璃增强PA12或是不受高温潮湿影响的打印材料',
          '如果允许的话，减少染色的温度或时间，降低材料受影响的程度',
          '材料软化已经发生情况下，可以尝试涂装胶水或其他功能性涂层弥补刚性'
        ]
      },
      {
        id:'cat-4-3',
        title:'掉色',
        analysis:[
          '目前仅在TPU打印件上发生，TPU材料在染色后经过72至96小时后会出现掉色现象，推测是TPU材料的烧结后孔隙率较大无法锁住染料导致掉色',
        ],
        prevention:[
          '针对TPU掉色现象，建议TPU零件染色后尽快烘干，然后进行封体处理。一般可以选用化学熏蒸使TPU表面形成致密薄膜，也可使用其他封体的功能性溶液或处理手段',
        ]
      }
    ],
  },
];

// ── 辅助：收集所有缺陷（用于搜索 & 大纲） ──

interface FlatDefect extends DefectType {
  categoryId: string;
  categoryName: string;
}

function flattenDefects(categories: PostProcessCategory[]): FlatDefect[] {
  const result: FlatDefect[] = [];
  for (const cat of categories) {
    for (const d of cat.defects) {
      result.push({ ...d, categoryId: cat.id, categoryName: cat.name });
    }
  }
  return result;
}

export function PostProcessingDefectCases() {
  const navigate = useNavigate();

  // ── 状态 ──
  const [searchQuery, setSearchQuery] = useState('');
  // 图片区域默认展开逻辑：有图片路径 → 展开，无图片路径 → 折叠
  const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    flattenDefects(POST_PROCESS_DEFECTS_DATA).forEach(d => {
      initial[d.id] = !!(d.images && d.images.length > 0);
    });
    return initial;
  });
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({});
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  // 卡片折叠（按缺陷 id）
  const [isCardExpanded, setIsCardExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    flattenDefects(POST_PROCESS_DEFECTS_DATA).forEach(d => { initial[d.id] = false; });
    return initial;
  });

  // 侧边栏分类展开（默认全展开）
  const [expandedSidebarCategories, setExpandedSidebarCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    POST_PROCESS_DEFECTS_DATA.forEach(c => { initial[c.id] = true; });
    return initial;
  });

  // ── 搜索过滤 ──
  const flatDefects = flattenDefects(POST_PROCESS_DEFECTS_DATA);
  const filteredFlatDefects = flatDefects.filter(d => {
    const q = searchQuery.toLowerCase();
    return d.title.toLowerCase().includes(q) ||
      d.analysis.some(a => a.toLowerCase().includes(q)) ||
      d.categoryName.toLowerCase().includes(q);
  });

  // 按分类重组（保留原始顺序）
  const visibleCategoryIds = new Set(filteredFlatDefects.map(d => d.categoryId));
  const visibleCategories = POST_PROCESS_DEFECTS_DATA.filter(c => visibleCategoryIds.has(c.id));

  // ── 交互 ──
  const toggleCard = (defectId: string) => {
    setIsCardExpanded(prev => ({ ...prev, [defectId]: prev[defectId] === false ? true : false }));
  };

  const scrollToItem = (defectId: string) => {
    const element = document.getElementById(`pp-defect-${defectId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (isCardExpanded[defectId] === false) {
        toggleCard(defectId);
      }
      setActiveItemId(defectId);
      setTimeout(() => setActiveItemId(null), 3000);
    }
  };

  useEffect(() => {
    if (!lightboxImage) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [lightboxImage]);

  // ── 渲染 ──
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

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* 页面标题 */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                  <ScanSearch className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  零件后处理缺陷案例
                </h1>
              </div>
              <p className="mt-3 text-sm text-gray-500 max-w-3xl leading-relaxed">
                按后处理工艺分类，汇集 SLS 打印零件在各后处理环节中常见的缺陷表征、分析及补救预防方法。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索缺陷名称、分类或分析..."
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 relative">

            {/* ==================== 主内容区 ==================== */}
            <div className="flex-1 min-w-0">
              <div className="space-y-10">
                {visibleCategories.length === 0 ? (
                  <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
                    <Search className="mb-4 h-10 w-10 text-gray-300" />
                    <p className="text-gray-500">没有找到匹配的缺陷案例</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      清除搜索条件
                    </button>
                  </div>
                ) : (
                  visibleCategories.map(category => {
                    const categoryDefects = category.defects.filter(d =>
                      filteredFlatDefects.some(f => f.id === d.id)
                    );
                    const hasDefects = categoryDefects.length > 0;

                    return (
                      <section key={category.id} className="space-y-4">
                        {/* 分类标题 */}
                        <div className={cn(
                          "flex items-center gap-4 pb-3 border-b-2",
                          hasDefects ? "border-indigo-200" : "border-gray-200"
                        )}>
                          <span className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shrink-0",
                            hasDefects
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-200 text-gray-400"
                          )}>
                            {category.id.split('-')[1]}
                          </span>
                          <div>
                            <h2 className={cn(
                              "text-lg font-bold",
                              hasDefects ? "text-gray-900" : "text-gray-400"
                            )}>
                              {category.name}
                            </h2>
                            {category.description && (
                              <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
                            )}
                          </div>
                          {!hasDefects && (
                            <span className="ml-auto text-xs text-gray-400 italic">缺陷案例待补充</span>
                          )}
                        </div>

                        {/* 缺陷卡片 */}
                        {hasDefects ? (
                          <div className="space-y-4" id={`pp-category-${category.id}`}>
                            {categoryDefects.map(defect => (
                              <div
                                key={defect.id}
                                id={`pp-defect-${defect.id}`}
                                className={cn(
                                  "rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all overflow-hidden duration-500",
                                  activeItemId === defect.id
                                    ? "border-indigo-500 ring-2 ring-indigo-500/20 ring-offset-2"
                                    : "border-gray-200"
                                )}
                              >
                                {/* 卡片标题栏 */}
                                <div className={cn(
                                  "flex items-start justify-between",
                                  isCardExpanded[defect.id] !== false ? "mb-4 border-b border-gray-100 pb-4" : ""
                                )}>
                                  <h3 className="text-xl font-bold text-gray-900">{defect.title}</h3>
                                  <button
                                    onClick={() => toggleCard(defect.id)}
                                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                                    title={isCardExpanded[defect.id] !== false ? "收起案例" : "展开案例"}
                                  >
                                    <ChevronDown className={cn(
                                      "h-5 w-5 transition-transform duration-200",
                                      isCardExpanded[defect.id] !== false ? "rotate-180" : ""
                                    )} />
                                  </button>
                                </div>

                                {/* 卡片展开内容 */}
                                {isCardExpanded[defect.id] !== false && (
                                  <div className="space-y-6">
                                    {/* 缺陷分析 */}
                                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                      <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                        缺陷分析
                                      </h4>
                                      <ul className="space-y-1.5">
                                        {defect.analysis.map((item, idx) => (
                                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-amber-500 font-bold mt-0.5 shrink-0">•</span>
                                            <span className="leading-relaxed">{item}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* 补救或预防的方法 */}
                                    <div>
                                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        补救或预防的方法
                                      </h4>
                                      <ul className="space-y-2">
                                        {defect.prevention.map((item, idx) => (
                                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-emerald-500 font-bold mt-0.5 shrink-0">•</span>
                                            <span className="leading-relaxed">{item}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* 缺陷参考图 */}
                                    <div className="relative pt-6 mt-6 border-t border-gray-100">
                                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                        缺陷参考图
                                      </h4>

                                      <div className={cn(
                                        "relative w-full bg-gray-50 rounded-xl border-2 overflow-hidden transition-all duration-300",
                                        expandedImages[defect.id] !== false ? "h-48 sm:h-64" : "h-16",
                                        defect.images?.length && !imageErrors[defect.id] && expandedImages[defect.id] !== false
                                          ? "border-solid border-gray-200"
                                          : "border-dashed border-gray-200"
                                      )}>
                                        {expandedImages[defect.id] !== false ? (
                                          (() => {
                                            const images = defect.images || [];
                                            const currentIdx = Math.min(
                                              currentImageIndices[defect.id] || 0,
                                              Math.max(0, images.length - 1)
                                            );
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
                                                        onClick={() =>
                                                          setCurrentImageIndices(prev => ({
                                                            ...prev,
                                                            [defect.id]: (currentIdx - 1 + images.length) % images.length,
                                                          }))
                                                        }
                                                        className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                                                        title="上一张"
                                                      >
                                                        <ChevronLeft className="h-5 w-5" />
                                                      </button>
                                                      <button
                                                        onClick={() =>
                                                          setCurrentImageIndices(prev => ({
                                                            ...prev,
                                                            [defect.id]: (currentIdx + 1) % images.length,
                                                          }))
                                                        }
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
                                                  <span className="text-xs text-gray-400 mt-1">
                                                    在数据中添加 images 字段，图片放入 public/post-processing-defects/
                                                  </span>
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
                                          onClick={() => setExpandedImages(prev => ({
                                            ...prev,
                                            [defect.id]: prev[defect.id] === false ? true : false,
                                          }))}
                                          className={cn(
                                            "absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-all",
                                            expandedImages[defect.id] !== false
                                              ? "bottom-2"
                                              : "top-1/2 -translate-y-1/2"
                                          )}
                                          title={expandedImages[defect.id] !== false ? "收起图片" : "展开图片"}
                                        >
                                          <ChevronDown className={cn(
                                            "h-4 w-4 transition-transform duration-200",
                                            expandedImages[defect.id] !== false ? "rotate-180" : ""
                                          )} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-gray-200 bg-white/50 p-8 text-center">
                            <p className="text-sm text-gray-400">该分类下暂未收录缺陷案例</p>
                          </div>
                        )}
                      </section>
                    );
                  })
                )}
              </div>
            </div>

            {/* ==================== 右侧边栏大纲 ==================== */}

            {/* 移动端遮罩 */}
            {isMobileSidebarOpen && (
              <div
                className="fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}

            {/* 移动端展开按钮 */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className={cn(
                "fixed top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-indigo-600 shadow-lg transition-all duration-300 hover:bg-indigo-50 hover:scale-110 md:hidden",
                isMobileSidebarOpen ? "right-72" : "right-0"
              )}
              aria-label={isMobileSidebarOpen ? "收起大纲" : "展开大纲"}
            >
              {isMobileSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>

            {/* 侧边栏本体 */}
            <aside className={cn(
              "w-72 shrink-0",
              "fixed right-0 top-16 bottom-0 z-40 transition-transform duration-300 ease-out",
              "md:sticky md:top-24 md:bottom-auto md:z-auto md:self-start md:w-52 md:translate-x-0 lg:w-60",
              isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}>
              <div className="m-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg flex flex-col max-h-[calc(100vh-8rem)] md:m-0 md:shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">页面大纲</h3>
                <div className="flex flex-col gap-0.5 overflow-y-auto pr-1">
                  {POST_PROCESS_DEFECTS_DATA.map(category => {
                    const isExpanded = expandedSidebarCategories[category.id] !== false;
                    const hasDefects = category.defects.length > 0;

                    return (
                      <div key={category.id}>
                        {/* 分类标题 */}
                        <button
                          onClick={() => {
                            setExpandedSidebarCategories(prev => ({
                              ...prev,
                              [category.id]: !prev[category.id],
                            }));
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 px-2 py-2 rounded-lg text-xs font-semibold transition-colors",
                            "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          )}
                        >
                          <ChevronDown className={cn(
                            "h-3 w-3 transition-transform duration-200",
                            isExpanded ? "" : "-rotate-90"
                          )} />
                          <span className={cn(
                            "flex h-4 w-4 items-center justify-center rounded text-[10px] font-bold shrink-0",
                            hasDefects ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"
                          )}>
                            {category.id.split('-')[1]}
                          </span>
                          <span className="truncate">{category.name}</span>
                          {!hasDefects && (
                            <span className="ml-auto text-[10px] text-gray-400">—</span>
                          )}
                        </button>

                        {/* 缺陷列表 */}
                        {isExpanded && category.defects.length > 0 && (
                          <div className="ml-4 mb-1 flex flex-col gap-0.5">
                            {category.defects.map(defect => (
                              <button
                                key={defect.id}
                                onClick={() => {
                                  scrollToItem(defect.id);
                                  setIsMobileSidebarOpen(false);
                                }}
                                className={cn(
                                  "text-left px-3 py-2 rounded-lg text-sm transition-colors w-full shrink-0 border border-transparent",
                                  activeItemId === defect.id
                                    ? "bg-indigo-50 text-indigo-700 font-medium border-indigo-200"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                              >
                                <span className="line-clamp-2 leading-relaxed">{defect.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      {/* 灯箱 */}
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
