import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, Calculator, PieChart as PieChartIcon, RotateCcw, ChevronDown, Lock, Unlock, Trash2, Plus, Save, Upload, Download, Filter, Copy, Check } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INITIAL_PRESETS = [
  { id: '1', model: '无', material: '无', density: 0, price: 0, ratio: 0 },
];

export function CostCalculator() {
  const navigate = useNavigate();
  // Input states
  const [printerModel, setPrinterModel] = useState('');
  const [material, setMaterial] = useState('');
  const [densityPerMm, setDensityPerMm] = useState<number | string>('');
  const [printHeight, setPrintHeight] = useState<number | string>('');
  const [newPowderRatio, setNewPowderRatio] = useState<number | string>('');
  const [price, setPrice] = useState<number | string>('');
  const [partWeight, setPartWeight] = useState<number | string>('');
  const [quoteMultiplier, setQuoteMultiplier] = useState<number | string>('');
  const [taxRate, setTaxRate] = useState<number | string>(13);
  const [postProcessingItems, setPostProcessingItems] = useState([
    { id: '1', name: '熏蒸（小件）', count: '' as number | string, unitPrice: '' as number | string },
    { id: '2', name: '镶嵌螺母', count: '' as number | string, unitPrice: '' as number | string },
    { id: '3', name: '镶嵌牙套', count: '' as number | string, unitPrice: '' as number | string },
    { id: '4', name: '攻丝', count: '' as number | string, unitPrice: '' as number | string },
  ]);
  const [isDeletingPostProcessing, setIsDeletingPostProcessing] = useState(false);

  const [isPostProcessingEnabled, setIsPostProcessingEnabled] = useState(false);
  const [isPostProcessingExpanded, setIsPostProcessingExpanded] = useState(false);
  
  const [isMaterialCostEnabled, setIsMaterialCostEnabled] = useState(true);
  const [isMaterialCostExpanded, setIsMaterialCostExpanded] = useState(true);
  
  const [isMultiVatEnabled, setIsMultiVatEnabled] = useState(false);
  const [maxVatHeight, setMaxVatHeight] = useState<number | string>('');
  const [vatPrintTimeDays, setVatPrintTimeDays] = useState<number | string>('');
  
  const [isQuickQuoteEnabled, setIsQuickQuoteEnabled] = useState(false);
  const [isQuickQuoteExpanded, setIsQuickQuoteExpanded] = useState(false);
  const [isQuickQuoteTableExpanded, setIsQuickQuoteTableExpanded] = useState(true);
  const [isQuickQuoteOverviewExpanded, setIsQuickQuoteOverviewExpanded] = useState(true);

  const [isChartExpanded, setIsChartExpanded] = useState(true);

  const [copyPermissions, setCopyPermissions] = useState<Record<string, boolean>>({});
  const [isCopied, setIsCopied] = useState(false);

  const [presets, setPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('cost-calculator-presets-v2');
      return saved ? JSON.parse(saved) : INITIAL_PRESETS;
    } catch (e) {
      return INITIAL_PRESETS;
    }
  });
  const [presetFilters, setPresetFilters] = useState({
    model: '', material: '', density: '', price: '', ratio: ''
  });
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const [isPresetEnabled, setIsPresetEnabled] = useState(true);
  const [isPresetExpanded, setIsPresetExpanded] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [isDeletingPreset, setIsDeletingPreset] = useState(false);
  const [newPresetData, setNewPresetData] = useState({
    model: '', material: '', density: '', price: '', ratio: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('cost-calculator-presets-v2', JSON.stringify(presets));
  }, [presets]);

  // Calculations
  const results = useMemo(() => {
    const h = Number(printHeight) || 0;
    const dMm = Number(densityPerMm) || 0;
    const nRatio = Number(newPowderRatio) || 0;
    const p = Number(price) || 0;
    const qMult = Number(quoteMultiplier) || 0;
    const tRate = Number(taxRate) || 0;
    const w = Number(partWeight) || 0;

    // 打印高度(mm) * 单位高度材料密度(kg/mm) * 新粉比例(%) / 100 * 材料价格(元/kg)
    const newPowderWeight = isMaterialCostEnabled ? (h * dMm * (nRatio / 100)) : 0;
    const directMaterialCost = newPowderWeight * p;
    
    const postProcessingCost = isPostProcessingEnabled ? postProcessingItems.reduce((acc, item) => {
      const count = Math.max(0, Math.floor(Number(item.count) || 0));
      const unitP = Math.max(0, Number(item.unitPrice) || 0);
      return acc + (count * unitP);
    }, 0) : 0;
    
    const totalCost = directMaterialCost + postProcessingCost;
    
    // 报价金额 = 总生产成本 * 粉体成本倍数 * (1 + 税率)
    const quoteAmount = isQuickQuoteEnabled ? totalCost * qMult * (1 + tRate / 100) : 0;
    
    // 克单价 = 报价金额 / 零件重量
    const pricePerGram = (w > 0 && isQuickQuoteEnabled) ? quoteAmount / w : 0;

    // 多缸排版相关计算
    const totalVats = isMultiVatEnabled && h > 0 && Number(maxVatHeight) > 0 ? Math.ceil(h / Number(maxVatHeight)) : 0;
    const minPrintDays = isMultiVatEnabled && totalVats > 0 ? totalVats * (Number(vatPrintTimeDays) || 0) : 0;

    return {
      newPowderWeight,
      directMaterialCost,
      postProcessingCost,
      totalCost,
      totalVats,
      minPrintDays,
      quoteAmount,
      pricePerGram,
      chartData: [
        { name: '零件纯材料成本', value: directMaterialCost, color: '#3b82f6' }, // blue-500
        { name: '后处理成本计算', value: postProcessingCost, color: '#10b981' }, // emerald-500
      ].filter(item => item.value > 0)
    };
  }, [printHeight, densityPerMm, newPowderRatio, price, quoteMultiplier, taxRate, partWeight, postProcessingItems, isPostProcessingEnabled, isMaterialCostEnabled, isQuickQuoteEnabled, isMultiVatEnabled, maxVatHeight, vatPrintTimeDays]);

  const handleResetMaterialCost = () => {
    setPrinterModel('');
    setMaterial('');
    setDensityPerMm('');
    setPrintHeight('');
    setNewPowderRatio('');
    setPrice('');
    setPartWeight('');
  };

  const handleResetPostProcessing = () => {
    setPostProcessingItems([
      { id: '1', name: '熏蒸（小件）', count: '', unitPrice: '' },
      { id: '2', name: '镶嵌螺母', count: '', unitPrice: '' },
      { id: '3', name: '镶嵌牙套', count: '', unitPrice: '' },
      { id: '4', name: '攻丝', count: '', unitPrice: '' },
    ]);
  };

  const updatePostProcessingItem = (id: string, field: string, value: string | number) => {
    setPostProcessingItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addPostProcessingItem = () => {
    const newId = Date.now().toString();
    setPostProcessingItems(prev => [...prev, { id: newId, name: '', count: '', unitPrice: '' }]);
  };

  const deletePostProcessingItem = (id: string) => {
    setPostProcessingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleApplyPreset = (preset: typeof INITIAL_PRESETS[0]) => {
    setPrinterModel(preset.model === '无' ? '' : preset.model);
    setMaterial(preset.material === '无' ? '' : preset.material);
    setDensityPerMm(preset.density);
    setPrice(preset.price);
    setNewPowderRatio(preset.ratio);
  };

  const updatePreset = (id: string, field: string, value: string | number) => {
    setPresets(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const toggleEditPreset = (id: string) => {
    setEditingRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAddPreset = () => {
    if (isAddingPreset) {
      // Save the new preset
      const finalPreset = {
        id: Date.now().toString(),
        model: newPresetData.model || '无',
        material: newPresetData.material || '无',
        density: newPresetData.density === '' ? 0 : Number(newPresetData.density),
        price: newPresetData.price === '' ? 0 : Number(newPresetData.price),
        ratio: newPresetData.ratio === '' ? 0 : Number(newPresetData.ratio),
      };
      setPresets([...presets, finalPreset]);
      setIsAddingPreset(false);
      setNewPresetData({ model: '', material: '', density: '', price: '', ratio: '' });
    } else {
      // Enter Add mode
      setIsAddingPreset(true);
      setIsDeletingPreset(false);
    }
  };

  const handleDeletePreset = (id: string) => {
    if (window.confirm('是否确认删除此预设？')) {
      setPresets(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleExportPresets = () => {
    const dataStr = JSON.stringify(presets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sls-presets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPresets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setPresets(parsed);
          alert('预设导入成功！');
        } else {
          alert('导入失败：文件格式不正确，需要是预设数组格式。');
        }
      } catch (err) {
        alert('导入失败：无法解析该 JSON 文件。');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  const toggleCopyPermission = (key: string) => {
    setCopyPermissions(prev => ({
      ...prev,
      [key]: prev[key] === false ? true : false
    }));
  };

  const handleCopyInfo = async () => {
    const lines: string[] = [];
    
    if (copyPermissions['material'] !== false) lines.push(`打印材料：\t${material || '未设置'}`);
    if (copyPermissions['powder'] !== false) lines.push(`消耗新粉：\t${results.newPowderWeight.toFixed(2)} kg`);
    
    if (isPostProcessingEnabled) {
      postProcessingItems.forEach(item => {
        const count = Math.max(0, Math.floor(Number(item.count) || 0));
        const unitP = Math.max(0, Number(item.unitPrice) || 0);
        const subtotal = count * unitP;
        if (subtotal > 0 && item.name && copyPermissions[`post-${item.id}`] !== false) {
          lines.push(`${item.name}：\t¥ ${subtotal.toFixed(2)}`);
        }
      });
    }

    if (copyPermissions['vats'] !== false) lines.push(`打印总缸数：\t${isMultiVatEnabled ? `${results.totalVats} 缸` : '-'}`);
    if (copyPermissions['days'] !== false) lines.push(`工期：\t${isMultiVatEnabled ? `${results.minPrintDays.toFixed(1)} 天` : '-'}`);
    if (copyPermissions['amount'] !== false) lines.push(`最终报价金额：\t¥ ${results.quoteAmount.toFixed(2)}`);
    if (copyPermissions['pricePerGram'] !== false) lines.push(`克单价：\t¥ ${results.pricePerGram.toFixed(2)} / 克`);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      alert('复制失败，请检查浏览器权限');
    }
  };

  const filteredPresets = presets.filter(p => {
    return (
      (presetFilters.model === '' || p.model.toLowerCase().includes(presetFilters.model.toLowerCase())) &&
      (presetFilters.material === '' || p.material.toLowerCase().includes(presetFilters.material.toLowerCase())) &&
      (presetFilters.density === '' || String(p.density).includes(presetFilters.density)) &&
      (presetFilters.price === '' || String(p.price).includes(presetFilters.price)) &&
      (presetFilters.ratio === '' || String(p.ratio).includes(presetFilters.ratio))
    );
  });

  const renderTextInput = (
    label: string, 
    value: string, 
    setValue: (val: string) => void, 
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
  const renderInput = (
    label: string, 
    value: string | number, 
    setValue: (val: string | number) => void, 
    unit: string, 
    step: string = "1",
    min?: number,
    max?: number
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative flex items-center">
        <input
          type="number"
          min={min !== undefined ? min : "0"}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (val !== '') {
              const num = Number(val);
              if (min !== undefined && num < min) return;
              if (max !== undefined && num > max) return;
              if (step && val.includes('.')) {
                const decimals = step.split('.')[1]?.length || 0;
                if (decimals > 0 && val.split('.')[1].length > decimals) return;
              }
            }
            setValue(val);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-4 text-sm text-gray-400 pointer-events-none">
          {unit}
        </span>
      </div>
    </div>
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
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Calculator className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                打印订单计算器
              </h1>
            </div>
            <p className="mt-3 text-sm text-gray-500 max-w-3xl leading-relaxed">
              一个有测算尼龙烧结成本，快捷报价等功能综合计算器
            </p>
          </div>

          {/* Presets Table (Placed between Title and Calculation Grid) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">数据预设</h2>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPresetEnabled}
                  onClick={() => {
                    const nextEnabled = !isPresetEnabled;
                    setIsPresetEnabled(nextEnabled);
                    if (!nextEnabled) {
                      setIsPresetExpanded(false);
                    } else {
                      setIsPresetExpanded(true);
                    }
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                    isPresetEnabled ? "bg-blue-600 border-blue-600" : "bg-gray-100 border-gray-300"
                  )}
                >
                  <span className="sr-only">启用数据预设</span>
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isPresetEnabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFilterActive(!isFilterActive);
                    if (isFilterActive) {
                      setPresetFilters({model:'', material:'', density:'', price:'', ratio:''});
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 p-1.5 px-3 rounded-md text-sm transition-colors",
                    isFilterActive ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
                  )}
                  title={isFilterActive ? "取消筛选" : "开始筛选"}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">筛选</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPresetExpanded(!isPresetExpanded)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isPresetExpanded ? "rotate-180" : "")} />
                </button>
              </div>
            </div>
            
            {isPresetExpanded && (
              <>
                <p className="text-sm text-gray-500 mb-4">快速应用或编辑常用机型和材料的基础参数</p>
                <div className="overflow-auto max-h-[275px] rounded-xl border border-gray-200 relative">
                  <table className="w-full text-left text-sm text-gray-600 border-collapse whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-900 sticky top-0 z-10 shadow-[0_1px_0_#e5e7eb]">
                      <tr>
                        {isDeletingPreset && <th className="border-b border-gray-200 px-4 py-3 font-medium text-center w-12 text-red-600">删除</th>}
                        <th className="border-b border-gray-200 px-4 py-3 font-medium text-center w-20">编辑预设</th>
                        <th className="border-b border-gray-200 px-4 py-3 font-medium text-center w-16">序列号</th>
                        <th className="border-b border-gray-200 px-4 py-3 font-medium">打印机型</th>
                        <th className="border-b border-gray-200 px-4 py-3 font-medium">打印材料</th>
                        <th className="border-b border-gray-200 px-4 py-3 font-medium">单位高度材料密度 (kg/mm)</th>
                        <th className="border-b border-gray-200 px-4 py-3 font-medium">材料价格 (元/kg)</th>
                        <th className="border-b border-gray-200 px-4 py-3 font-medium">新粉比例 (%)</th>
                        <th className="border-b border-gray-200 px-4 py-3 font-medium text-center w-24">操作</th>
                      </tr>
                      {isFilterActive && (
                        <tr className="bg-gray-50/50">
                          {isDeletingPreset && <th className="border-b border-gray-200 px-2 py-1.5"></th>}
                          <th className="border-b border-gray-200 px-2 py-1.5"></th>
                          <th className="border-b border-gray-200 px-2 py-1.5 text-center text-xs font-normal text-gray-500">筛选</th>
                          <th className="border-b border-gray-200 px-2 py-1.5">
                            <input type="text" placeholder="机型..." value={presetFilters.model} onChange={e => setPresetFilters({...presetFilters, model: e.target.value})} className="w-full border border-gray-300 rounded px-1.5 py-1 text-xs font-normal focus:outline-none focus:border-blue-500" />
                          </th>
                          <th className="border-b border-gray-200 px-2 py-1.5">
                            <input type="text" placeholder="材料..." value={presetFilters.material} onChange={e => setPresetFilters({...presetFilters, material: e.target.value})} className="w-full border border-gray-300 rounded px-1.5 py-1 text-xs font-normal focus:outline-none focus:border-blue-500" />
                          </th>
                          <th className="border-b border-gray-200 px-2 py-1.5">
                            <input type="text" placeholder="密度..." value={presetFilters.density} onChange={e => setPresetFilters({...presetFilters, density: e.target.value})} className="w-full border border-gray-300 rounded px-1.5 py-1 text-xs font-normal focus:outline-none focus:border-blue-500" />
                          </th>
                          <th className="border-b border-gray-200 px-2 py-1.5">
                            <input type="text" placeholder="价格..." value={presetFilters.price} onChange={e => setPresetFilters({...presetFilters, price: e.target.value})} className="w-full border border-gray-300 rounded px-1.5 py-1 text-xs font-normal focus:outline-none focus:border-blue-500" />
                          </th>
                          <th className="border-b border-gray-200 px-2 py-1.5">
                            <input type="text" placeholder="比例..." value={presetFilters.ratio} onChange={e => setPresetFilters({...presetFilters, ratio: e.target.value})} className="w-full border border-gray-300 rounded px-1.5 py-1 text-xs font-normal focus:outline-none focus:border-blue-500" />
                          </th>
                          <th className="border-b border-gray-200 px-2 py-1.5 text-center">
                            <button onClick={() => setPresetFilters({model:'', material:'', density:'', price:'', ratio:''})} className="text-xs text-gray-500 hover:text-blue-600 font-normal w-full">清空</button>
                          </th>
                        </tr>
                      )}
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredPresets.map((preset, index) => {
                        const isEditing = editingRows[preset.id];
                        return (
                          <tr key={preset.id} className="hover:bg-gray-50/50 transition-colors">
                            {isDeletingPreset && (
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleDeletePreset(preset.id)}
                                  className="p-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors mx-auto flex items-center justify-center"
                                  title="删除此预设"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <button
                                onClick={() => toggleEditPreset(preset.id)}
                                className={cn(
                                  "p-1.5 rounded-md transition-colors mx-auto flex items-center justify-center",
                                  isEditing ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                )}
                                title={isEditing ? "锁定并保存" : "解锁编辑"}
                              >
                                {isEditing ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {isEditing ? (
                                <input 
                                  value={preset.model} 
                                  onChange={e => updatePreset(preset.id, 'model', e.target.value)}
                                  className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50"
                                />
                              ) : preset.model}
                            </td>
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input 
                                  value={preset.material} 
                                  onChange={e => updatePreset(preset.id, 'material', e.target.value)}
                                  className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50"
                                />
                              ) : preset.material}
                            </td>
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input 
                                  type="number"
                                  step="0.001"
                                  value={preset.density} 
                                  onChange={e => updatePreset(preset.id, 'density', e.target.value)}
                                  className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50"
                                />
                              ) : Number(preset.density).toFixed(3)}
                            </td>
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input 
                                  type="number"
                                  step="1"
                                  value={preset.price} 
                                  onChange={e => updatePreset(preset.id, 'price', e.target.value)}
                                  className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50"
                                />
                              ) : preset.price}
                            </td>
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input 
                                  type="number"
                                  value={preset.ratio} 
                                  onChange={e => updatePreset(preset.id, 'ratio', e.target.value)}
                                  className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50"
                                />
                              ) : preset.ratio}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleApplyPreset(preset)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                              >
                                使用预设
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      
                      {isAddingPreset && (
                        <tr className="bg-blue-50/30">
                          {isDeletingPreset && <td></td>}
                          <td className="px-4 py-3 text-center">
                            <div className="p-1.5 rounded-md bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                              <Lock className="h-4 w-4" />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-blue-600">
                            {presets.length + 1}
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              value={newPresetData.model} 
                              onChange={e => setNewPresetData({...newPresetData, model: e.target.value})}
                              placeholder="无"
                              className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              value={newPresetData.material} 
                              onChange={e => setNewPresetData({...newPresetData, material: e.target.value})}
                              placeholder="无"
                              className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number"
                              step="0.001"
                              value={newPresetData.density} 
                              onChange={e => setNewPresetData({...newPresetData, density: e.target.value})}
                              placeholder="0"
                              className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number"
                              step="1"
                              value={newPresetData.price} 
                              onChange={e => setNewPresetData({...newPresetData, price: e.target.value})}
                              placeholder="0"
                              className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number"
                              value={newPresetData.ratio} 
                              onChange={e => setNewPresetData({...newPresetData, ratio: e.target.value})}
                              placeholder="0"
                              className="w-full border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-xs font-medium text-blue-500 whitespace-nowrap">
                              填写中...
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input 
                      type="file" 
                      accept=".json" 
                      ref={fileInputRef} 
                      className="hidden"
                      onChange={handleImportPresets} 
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-1.5 p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-lg transition-colors bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                      title="导入预设"
                    >
                      <Upload className="h-4 w-4 shrink-0" />
                      <span className="hidden sm:inline">导入预设</span>
                    </button>
                    <button
                      onClick={handleExportPresets}
                      className="flex items-center justify-center gap-1.5 p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-lg transition-colors bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                      title="导出预设"
                    >
                      <Download className="h-4 w-4 shrink-0" />
                      <span className="hidden sm:inline">导出预设</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={handleToggleAddPreset}
                      className="flex items-center justify-center gap-1.5 p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      title={isAddingPreset ? '保存预设' : '新增预设'}
                    >
                      {isAddingPreset ? <Save className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
                      <span className="hidden sm:inline">{isAddingPreset ? '保存预设' : '新增预设'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDeletingPreset(!isDeletingPreset);
                        setIsAddingPreset(false);
                      }}
                      className={cn(
                        "flex items-center justify-center gap-1.5 p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-lg transition-colors border shadow-sm",
                        isDeletingPreset 
                          ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                          : "bg-white text-red-500 border-gray-200 hover:bg-gray-50 hover:text-red-600"
                      )}
                      title={isDeletingPreset ? '完成删除' : '删除预设'}
                    >
                      <Trash2 className="h-4 w-4 shrink-0" />
                      <span className="hidden sm:inline">{isDeletingPreset ? '完成删除' : '删除预设'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
            {/* Row 1: Material Cost Form (Left) and Results (Right) */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">成本计算</h2>
                
                <div className="mb-8">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-gray-900">材料成本计算</h3>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isMaterialCostEnabled}
                        onClick={() => {
                          const nextEnabled = !isMaterialCostEnabled;
                          setIsMaterialCostEnabled(nextEnabled);
                          if (!nextEnabled) {
                            setIsMaterialCostExpanded(false);
                          } else {
                            setIsMaterialCostExpanded(true);
                          }
                        }}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                          isMaterialCostEnabled ? "bg-blue-600 border-blue-600" : "bg-gray-100 border-gray-300"
                        )}
                      >
                        <span className="sr-only">启用材料成本计算</span>
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            isMaterialCostEnabled ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleResetMaterialCost}
                        className="flex items-center gap-1.5 p-1.5 rounded-md text-sm text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                        title="重置材料成本计算"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="hidden sm:inline">重置</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsMaterialCostExpanded(!isMaterialCostExpanded)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                      >
                        <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isMaterialCostExpanded ? "rotate-180" : "")} />
                      </button>
                    </div>
                  </div>
                  
                  {isMaterialCostExpanded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-6">
                        {renderTextInput("打印机型", printerModel, setPrinterModel)}
                        {renderTextInput("打印材料", material, setMaterial)}
                        {renderInput("单位高度材料密度", densityPerMm, setDensityPerMm, "kg/mm", "0.001", 0)}
                        {renderInput("打印高度", printHeight, setPrintHeight, "mm", "1", 0)}
                      </div>

                      <div className="space-y-6">
                        {renderInput("新粉比例", newPowderRatio, setNewPowderRatio, "%", "1", 0, 100)}
                        {renderInput("材料价格", price, setPrice, "元/kg", "1", 0)}
                        {renderInput("零件重量", partWeight, setPartWeight, "g", "0.1", 0)}
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-gray-700">消耗新粉</label>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              readOnly
                              value={results.newPowderWeight.toFixed(2)}
                              className="w-full rounded-lg border border-transparent bg-gray-50 px-4 py-2.5 text-sm text-gray-900 font-medium focus:outline-none"
                            />
                            <span className="absolute right-4 text-sm text-gray-500 pointer-events-none">
                              kg
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isMaterialCostExpanded && (
                    <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50/50 p-5 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-bold text-gray-900 cursor-pointer flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isMultiVatEnabled}
                              onChange={(e) => setIsMultiVatEnabled(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                            />
                            多缸排版计算
                          </label>
                        </div>
                        {isMultiVatEnabled && (
                          <button
                            type="button"
                            onClick={() => { setMaxVatHeight(''); setVatPrintTimeDays(''); }}
                            className="flex items-center gap-1.5 p-1.5 rounded-md text-sm text-gray-500 hover:text-blue-600 hover:bg-gray-200 transition-colors"
                            title="重置多缸排版数据"
                          >
                            <RotateCcw className="h-4 w-4" />
                            <span className="hidden sm:inline">重置</span>
                          </button>
                        )}
                      </div>

                      {isMultiVatEnabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-gray-200/60 mt-4">
                          <div className="space-y-6">
                            {renderInput("单缸限定高度", maxVatHeight, setMaxVatHeight, "mm", "1", 0)}
                            {renderInput("单缸打印时间", vatPrintTimeDays, setVatPrintTimeDays, "天", "0.1", 0)}
                          </div>
                          <div className="space-y-6">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-sm font-medium text-gray-700">打印总缸数</label>
                              <div className="relative flex items-center">
                                <input
                                  type="text"
                                  readOnly
                                  value={results.totalVats}
                                  className="w-full rounded-lg border border-transparent bg-white px-4 py-2.5 text-sm text-blue-900 font-medium focus:outline-none shadow-sm"
                                />
                                <span className="absolute right-4 text-sm text-blue-600 pointer-events-none">
                                  缸
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-sm font-medium text-gray-700">打印最少总天数</label>
                              <div className="relative flex items-center">
                                <input
                                  type="text"
                                  readOnly
                                  value={results.minPrintDays.toFixed(1)}
                                  className="w-full rounded-lg border border-transparent bg-white px-4 py-2.5 text-sm text-blue-900 font-medium focus:outline-none shadow-sm"
                                />
                                <span className="absolute right-4 text-sm text-blue-600 pointer-events-none">
                                  天
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-gray-900">后处理成本计算</h3>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isPostProcessingEnabled}
                        onClick={() => {
                          const nextEnabled = !isPostProcessingEnabled;
                          setIsPostProcessingEnabled(nextEnabled);
                          if (!nextEnabled) {
                            setIsPostProcessingExpanded(false);
                          } else {
                            setIsPostProcessingExpanded(true);
                          }
                        }}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                          isPostProcessingEnabled ? "bg-blue-600 border-blue-600" : "bg-gray-100 border-gray-300"
                        )}
                      >
                        <span className="sr-only">启用后处理计算</span>
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                            isPostProcessingEnabled ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleResetPostProcessing}
                        className="flex items-center gap-1.5 p-1.5 rounded-md text-sm text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                        title="重置后处理成本计算"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="hidden sm:inline">重置</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPostProcessingExpanded(!isPostProcessingExpanded)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                      >
                        <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isPostProcessingExpanded ? "rotate-180" : "")} />
                      </button>
                    </div>
                  </div>
                  
                  {isPostProcessingExpanded && (
                    <div className="mt-6">
                      <div className="overflow-auto max-h-[260px] rounded-xl border border-gray-200 relative">
                        <table className="w-full text-left text-sm text-gray-600 border-collapse whitespace-nowrap">
                          <thead className="bg-gray-50 text-gray-900 sticky top-0 z-10 shadow-[0_1px_0_#e5e7eb]">
                            <tr>
                              <th className="px-4 py-3 font-medium">后处理名称</th>
                              <th className="px-4 py-3 font-medium">数量 (个/件)</th>
                              <th className="px-4 py-3 font-medium">单价 (元)</th>
                              <th className="px-4 py-3 font-medium">金额小计 (元)</th>
                              <th className="px-4 py-3 font-medium text-center w-24">表格操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {postProcessingItems.map(item => {
                              const subtotal = (Math.max(0, Math.floor(Number(item.count) || 0)) * Math.max(0, Number(item.unitPrice) || 0)).toFixed(2);
                              return (
                                <tr key={item.id} className="hover:bg-gray-50/50">
                                  <td className="px-4 py-2">
                                    <input 
                                      type="text" 
                                      value={item.name} 
                                      onChange={(e) => updatePostProcessingItem(item.id, 'name', e.target.value)}
                                      placeholder="请输入名称"
                                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <input 
                                      type="number" 
                                      min="0"
                                      step="1"
                                      value={item.count} 
                                      onChange={(e) => updatePostProcessingItem(item.id, 'count', e.target.value)}
                                      placeholder="0"
                                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                  </td>
                                  <td className="px-4 py-2">
                                    <input 
                                      type="number" 
                                      min="0"
                                      step="0.01"
                                      value={item.unitPrice} 
                                      onChange={(e) => updatePostProcessingItem(item.id, 'unitPrice', e.target.value)}
                                      placeholder="0.00"
                                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                  </td>
                                  <td className="px-4 py-2 font-medium text-gray-700">
                                    ¥ {subtotal}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {isDeletingPostProcessing && (
                                      <button
                                        onClick={() => deletePostProcessingItem(item.id)}
                                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors mx-auto flex items-center justify-center"
                                        title="删除此项目"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex items-center justify-end gap-3">
                        <button
                          onClick={addPostProcessingItem}
                          className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        >
                          <Plus className="h-4 w-4 shrink-0" />
                          <span className="hidden sm:inline">新增项目</span>
                        </button>
                        <button
                          onClick={() => setIsDeletingPostProcessing(!isDeletingPostProcessing)}
                          className={cn(
                            "flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors border shadow-sm",
                            isDeletingPostProcessing 
                              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                              : "bg-white text-red-500 border-gray-200 hover:bg-gray-50 hover:text-red-600"
                          )}
                        >
                          <Trash2 className="h-4 w-4 shrink-0" />
                          <span className="hidden sm:inline">{isDeletingPostProcessing ? '完成删除' : '删除项目'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              {/* Results Column */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">计算结果</h2>
                  <button
                    type="button"
                    onClick={() => setIsChartExpanded(!isChartExpanded)}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors flex items-center gap-1.5"
                    title={isChartExpanded ? "收起图表" : "展开图表"}
                  >
                    <span className="text-sm">图表</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isChartExpanded ? "rotate-180" : "")} />
                  </button>
                </div>
                
                <div className="rounded-xl bg-blue-50/50 p-6 text-center border border-blue-100">
                  <p className="text-sm font-medium text-blue-600 mb-1">总生产成本 (预估)</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-blue-700">¥</span>
                    <span className="text-4xl font-black text-blue-700 tracking-tight">
                      {results.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {isMaterialCostEnabled && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        零件纯材料成本
                      </div>
                      <span className="font-semibold text-gray-900">¥ {results.directMaterialCost.toFixed(2)}</span>
                    </div>
                  )}
                  {isPostProcessingEnabled && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        后处理成本计算
                      </div>
                      <span className="font-semibold text-gray-900">¥ {results.postProcessingCost.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {results.totalCost > 0 && isChartExpanded && (
                  <div className="mt-8 h-[300px] w-full min-h-[300px] border-t border-gray-100 pt-6">
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                      <PieChart>
                        <Pie
                          data={results.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(1)}%` : ''}
                        >
                          {results.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: number) => [`¥${value.toFixed(2)}`, '成本']}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Quick Quote Form (Left) and Quick Quote Results (Right) */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">快捷报价计算</h2>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isQuickQuoteEnabled}
                      onClick={() => {
                        const nextEnabled = !isQuickQuoteEnabled;
                        setIsQuickQuoteEnabled(nextEnabled);
                        if (!nextEnabled) {
                          setIsQuickQuoteExpanded(false);
                        } else {
                          setIsQuickQuoteExpanded(true);
                        }
                      }}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                        isQuickQuoteEnabled ? "bg-blue-600 border-blue-600" : "bg-gray-100 border-gray-300"
                      )}
                    >
                      <span className="sr-only">启用快捷报价计算</span>
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          isQuickQuoteEnabled ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQuickQuoteExpanded(!isQuickQuoteExpanded)}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isQuickQuoteExpanded ? "rotate-180" : "")} />
                  </button>
                </div>

                {isQuickQuoteExpanded && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mt-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">自定义粉体成本倍数</label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={quoteMultiplier}
                            onChange={(e) => {
                              const val = e.target.value;
                              // Allow empty string to easily delete and type anew
                              if (val === '') {
                                setQuoteMultiplier('');
                                return;
                              }
                              // Regex to match positive numbers with up to 2 decimal places
                              if (/^\d*\.?\d{0,2}$/.test(val)) {
                                setQuoteMultiplier(val);
                              }
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="absolute right-4 text-sm text-gray-400 pointer-events-none">
                            倍
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">请输入大于等于0的数字，最多支持两位小数。</p>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">税率</label>
                        <div className="relative flex items-center">
                          <select
                            value={taxRate}
                            onChange={(e) => setTaxRate(Number(e.target.value))}
                            className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="0">0% (不含税)</option>
                            <option value="6">6%</option>
                            <option value="13">13%</option>
                          </select>
                          <div className="pointer-events-none absolute right-4 flex items-center">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-900">报价金额快速对照表</h3>
                        <button
                          type="button"
                          onClick={() => setIsQuickQuoteTableExpanded(!isQuickQuoteTableExpanded)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                          title={isQuickQuoteTableExpanded ? "收起对照表" : "展开对照表"}
                        >
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isQuickQuoteTableExpanded ? "rotate-180" : "")} />
                        </button>
                      </div>
                      
                      {isQuickQuoteTableExpanded && (
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                          <table className="w-full text-left text-sm text-gray-600 border-collapse">
                            <thead className="bg-gray-50 text-gray-900">
                              <tr>
                                <th className="border border-gray-200 px-4 py-3 font-medium">X倍粉体</th>
                                <th className="border border-gray-200 px-4 py-3 font-medium">报价金额（{taxRate}%税率）</th>
                                <th className="border border-gray-200 px-4 py-3 font-medium">克单价</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {[2, 3, 4].map((multiplier) => {
                                const tRate = Number(taxRate) || 0;
                                const w = Number(partWeight) || 0;
                                const rowQuoteAmount = results.totalCost * multiplier * (1 + tRate / 100);
                                const rowPricePerGram = w > 0 ? rowQuoteAmount / w : 0;
                                
                                return (
                                  <tr key={multiplier}>
                                    <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">{multiplier}</td>
                                    <td className="border border-gray-200 px-4 py-3 text-gray-700">¥ {rowQuoteAmount.toFixed(2)}</td>
                                    <td className="border border-gray-200 px-4 py-3 text-gray-700">¥ {rowPricePerGram.toFixed(2)} / 克</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-900">对外报价信息预览</h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCopyInfo}
                            className="flex items-center gap-1.5 p-1.5 px-3 rounded-md text-sm transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span className="hidden sm:inline">{isCopied ? '已复制' : '复制信息'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsQuickQuoteOverviewExpanded(!isQuickQuoteOverviewExpanded)}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                            title={isQuickQuoteOverviewExpanded ? "收起总览" : "展开总览"}
                          >
                            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isQuickQuoteOverviewExpanded ? "rotate-180" : "")} />
                          </button>
                        </div>
                      </div>
                      
                      {isQuickQuoteOverviewExpanded && (
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                          <table className="w-full text-left text-sm text-gray-600 border-collapse">
                            <thead className="bg-gray-50 text-gray-900">
                              <tr>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium">信息项</th>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium">数据 / 金额</th>
                                <th className="border-b border-gray-200 px-4 py-3 font-medium text-center w-24">复制许可</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr className={copyPermissions['material'] === false ? "opacity-50" : ""}>
                                <td className="px-4 py-3">打印材料：</td>
                                <td className="px-4 py-3 text-gray-900 font-medium">{material || '未设置'}</td>
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={copyPermissions['material'] !== false} 
                                    onChange={() => toggleCopyPermission('material')}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                  />
                                </td>
                              </tr>
                              <tr className={copyPermissions['powder'] === false ? "opacity-50" : ""}>
                                <td className="px-4 py-3">消耗新粉：</td>
                                <td className="px-4 py-3 text-gray-900 font-medium">{results.newPowderWeight.toFixed(2)} kg</td>
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={copyPermissions['powder'] !== false} 
                                    onChange={() => toggleCopyPermission('powder')}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                  />
                                </td>
                              </tr>
                              {isPostProcessingEnabled && postProcessingItems.map((item) => {
                                const count = Math.max(0, Math.floor(Number(item.count) || 0));
                                const unitP = Math.max(0, Number(item.unitPrice) || 0);
                                const subtotal = count * unitP;
                                
                                if (subtotal > 0 && item.name) {
                                  const key = `post-${item.id}`;
                                  return (
                                    <tr key={item.id} className={copyPermissions[key] === false ? "opacity-50" : ""}>
                                      <td className="px-4 py-3">{item.name}：</td>
                                      <td className="px-4 py-3 text-gray-900 font-medium">¥ {subtotal.toFixed(2)}</td>
                                      <td className="px-4 py-3 text-center">
                                        <input 
                                          type="checkbox" 
                                          checked={copyPermissions[key] !== false} 
                                          onChange={() => toggleCopyPermission(key)}
                                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                        />
                                      </td>
                                    </tr>
                                  );
                                }
                                return null;
                              })}
                              <tr className={copyPermissions['vats'] === false ? "opacity-50" : ""}>
                                <td className="px-4 py-3">打印总缸数：</td>
                                <td className="px-4 py-3 text-gray-900 font-medium">{isMultiVatEnabled ? `${results.totalVats} 缸` : '-'}</td>
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={copyPermissions['vats'] !== false} 
                                    onChange={() => toggleCopyPermission('vats')}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                  />
                                </td>
                              </tr>
                              <tr className={copyPermissions['days'] === false ? "opacity-50" : ""}>
                                <td className="px-4 py-3">工期：</td>
                                <td className="px-4 py-3 text-gray-900 font-medium">{isMultiVatEnabled ? `${results.minPrintDays.toFixed(1)} 天` : '-'}</td>
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={copyPermissions['days'] !== false} 
                                    onChange={() => toggleCopyPermission('days')}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                  />
                                </td>
                              </tr>
                              <tr className={cn("bg-amber-50", copyPermissions['amount'] === false ? "opacity-50" : "")}>
                                <td className="px-4 py-3 font-semibold text-amber-900">最终报价金额：</td>
                                <td className="px-4 py-3 font-bold text-amber-700">¥ {results.quoteAmount.toFixed(2)}</td>
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={copyPermissions['amount'] !== false} 
                                    onChange={() => toggleCopyPermission('amount')}
                                    className="h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-600 cursor-pointer"
                                  />
                                </td>
                              </tr>
                              <tr className={cn("bg-amber-50/50", copyPermissions['pricePerGram'] === false ? "opacity-50" : "")}>
                                <td className="px-4 py-3 font-semibold text-amber-900">克单价：</td>
                                <td className="px-4 py-3 font-bold text-amber-700">¥ {results.pricePerGram.toFixed(2)} / 克</td>
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={copyPermissions['pricePerGram'] !== false} 
                                    onChange={() => toggleCopyPermission('pricePerGram')}
                                    className="h-4 w-4 rounded border-amber-300 text-amber-500 focus:ring-amber-500 cursor-pointer"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              {/* Quick Quote Result Section */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">报价结果总览</h2>
                <div className="rounded-xl bg-amber-50/50 p-6 text-center border border-amber-100 flex flex-col">
                  <p className="text-sm font-medium text-amber-600 mb-2">
                    报价金额（{quoteMultiplier === '' ? 0 : quoteMultiplier}倍粉体）
                  </p>
                  <div className="flex items-baseline justify-center gap-1 mb-5">
                    <span className="text-3xl font-bold text-amber-700">¥</span>
                    <span className="text-4xl font-black text-amber-700 tracking-tight">
                      {results.quoteAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-amber-200/60 pt-4">
                    <span className="text-amber-700 font-medium">克单价</span>
                    <span className="font-semibold text-amber-900">¥ {results.pricePerGram.toFixed(2)} / 克</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}