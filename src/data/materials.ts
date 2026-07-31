/**
 * 打印材料数据源（唯一管理入口）
 * ============================================================================
 * 新增材料：在 MATERIALS_DATA 数组末尾加一个对象即可
 * 删除材料：删掉对应对象即可
 * 修改材料：直接改对应字段即可
 *
 * 性能指标（properties）：每种材料可自定义不同的性能指标。
 * 每项包含 label（指标名）/ value（数值，number类型）/ unit（单位）/ testMethod（测试标准，可选）。
 * 例如尼龙关注拉伸强度/热变形温度，TPU关注邵氏硬度/抗撕裂强度。
 *
 * 注意：value 为 number 类型，用于后续材料性能对比功能。
 * ============================================================================
 */

/** 单条性能指标 */
export interface MaterialProperty {
  label: string;      // 指标名称，如 "拉伸强度"
  value: number;      // 数值，如 48
  unit: string;       // 单位，如 "MPa"
  testMethod?: string; // 测试标准（可选），如 "ISO 527-1/-2"
}

export interface Material {
  id: string;
  name: string;
  brand: string;
  baseMaterial: string;
  density: string;
  color: string;
  features: string;
  applications: string;
  /** 性能指标数组 — 每种材料可定义不同指标 */
  properties: MaterialProperty[];
}

export const MATERIALS_DATA: Material[] = [
  {
    id: '1',
    name: 'PA 2200',
    brand: 'EOS',
    baseMaterial: '尼龙基材料',
    density: '0.93',
    color: '白色',
    features: '综合性能优异，尺寸稳定性好，吸水率低。最常规且广泛使用的SLS材料。',
    applications: '功能性验证原型，最终用途零件，复杂结构外壳，工装夹具。',
    properties: [
      { label: '拉伸强度', value: 48, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '断裂伸长率', value: 18, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '弯曲模量', value: 1500, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '热变形温度', value: 163, unit: '°C', testMethod: 'ISO 75-1/-2 B (0.45 MPa)' },
      { label: '简支梁冲击强度', value: 53, unit: 'kJ/m²', testMethod: 'ISO 179-1/1eU' },
    ],
  },
  {
    id: '2',
    name: 'HP HR PA 11',
    brand: 'HP',
    baseMaterial: '尼龙基材料',
    density: '1.04',
    color: '白色',
    features: '优异的抗冲击性和延展性，生物基环保材料，极佳的耐疲劳性能。',
    applications: '耐摔/耐冲击零件，卡扣与活动铰链，汽车内饰组件，医疗康复护具。',
    properties: [
      { label: '拉伸强度', value: 52, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '断裂伸长率', value: 50, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '弯曲模量', value: 1300, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '热变形温度', value: 181, unit: '°C', testMethod: 'ISO 75-1/-2 B (0.45 MPa)' },
      { label: '悬臂梁缺口冲击', value: 7.4, unit: 'kJ/m²', testMethod: 'ISO 180/A' },
    ],
  },
  {
    id: '3',
    name: 'DuraForm GF',
    brand: '3DSystem',
    baseMaterial: '尼龙基材料',
    density: '1.22',
    color: '浅灰色',
    features: '显著提高的刚度和热变形温度，极佳的机械尺寸稳定性，耐磨损。',
    applications: '较高温度工作环境零件，高刚性结构支撑件，发动机舱周边零件。',
    properties: [
      { label: '拉伸强度', value: 45, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '断裂伸长率', value: 3, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '弯曲模量', value: 2200, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '热变形温度', value: 179, unit: '°C', testMethod: 'ISO 75-1/-2 B (0.45 MPa)' },
      { label: '简支梁冲击强度', value: 35, unit: 'kJ/m²', testMethod: 'ISO 179-1/1eU' },
    ],
  },
  {
    id: '4',
    name: 'TPU 90A Powder',
    brand: 'Formlabs',
    baseMaterial: '弹性体',
    density: '1.10',
    color: '黑色',
    features: '类橡胶高弹性（邵氏硬度约90A），极佳的耐磨性和抗撕裂性，柔韧弯曲不断。',
    applications: '减震器，密封圈与垫片，柔性软管，鞋底及运动护具，穿戴设备。',
    properties: [
      { label: '邵氏硬度', value: 90, unit: 'A', testMethod: 'ISO 7619-1 / Shore A' },
      { label: '拉伸强度', value: 8, unit: 'MPa', testMethod: 'ISO 37' },
      { label: '断裂伸长率', value: 300, unit: '%', testMethod: 'ISO 37' },
      { label: '抗撕裂强度', value: 70, unit: 'kN/m', testMethod: 'ISO 34-1 B' },
      { label: '压缩永久变形', value: 25, unit: '%', testMethod: 'ISO 815-1 (23°C, 72h)' },
    ],
  },
  {
    id: '5',
    name: 'Alumide',
    brand: 'EOS',
    baseMaterial: '尼龙基材料',
    density: '1.36',
    color: '金属灰色',
    features: '表面具有特殊的金属砂面质感，相比纯尼龙有更好的导热性，易于机械后加工。',
    applications: '少量注塑模具嵌件，金属外观展示模型，需要精细钻孔和攻丝的夹具卡具。',
    properties: [
      { label: '拉伸强度', value: 45, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '断裂伸长率', value: 4, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '弯曲模量', value: 3400, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '热变形温度', value: 175, unit: '°C', testMethod: 'ISO 75-1/-2 B (0.45 MPa)' },
    ],
  },
  {
    id: '6',
    name: 'HP HR PA 12 GB',
    brand: 'HP',
    baseMaterial: '高性能工程塑料',
    density: '1.30',
    color: '深灰色',
    features: '玻璃微珠填充的PA12，具有极高的刚度和尺寸稳定性，热变形表现出色。',
    applications: '刚性要求极高的外壳、底座和工装夹具，长期负载零件。',
    properties: [
      { label: '拉伸强度', value: 46, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '断裂伸长率', value: 6, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '弯曲模量', value: 2900, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '热变形温度', value: 165, unit: '°C', testMethod: 'ISO 75-1/-2 B (0.45 MPa)' },
      { label: '简支梁冲击强度', value: 25, unit: 'kJ/m²', testMethod: 'ISO 179-1/1eU' },
    ],
  },
  {
    id: '7',
    name: 'Precimid1172Pro',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '0.95',
    color: '白色',
    features: '表面光洁度高，细节展现优异，综合力学性能平衡，适合多种通用场景。',
    applications: '手板模型验证，医疗辅具，电子外壳，教育与科研用途。',
    properties: [
      { label: '拉伸强度', value: 47, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '断裂伸长率', value: 20, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '弯曲模量', value: 1500, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '热变形温度', value: 165, unit: '°C', testMethod: 'ISO 75-1/-2 B (0.45 MPa)' },
      { label: '简支梁冲击强度', value: 45, unit: 'kJ/m²', testMethod: 'ISO 179-1/1eU' },
    ],
  },

  {
    id: '8',
    name: 'Precimid1176Pro GF30 BLK',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '1.25',
    color: '灰黑色',
    features: '高强度，耐热变形，高复用率，30%玻璃填充',
    applications: '结构零件，功能外壳，复杂装配件',
    properties: [
      { label: '断裂延伸率', value: 6.8, unit: '%', testMethod: 'ISO 527-1:2012' },
      { label: '弯曲强度', value: 62.6, unit: 'MPa', testMethod: 'ISO 178:2019' },
      { label: '弯曲模量', value: 2340, unit: 'MPa', testMethod: 'ISO 178:2019' },
      { label: '抗热变形温度 0.45MPa', value: 168, unit: '℃', testMethod: 'ISO 75-1:2013' },
      { label: '抗热变形温度 1.8MPa', value: 90, unit: '℃', testMethod: 'ISO 75-1:2020' },
      { label: '拉伸强度', value: 41.7, unit: 'MPa', testMethod: 'ISO 527-1:2019' },
      { label: '拉伸模量', value: 2300, unit: 'MPa', testMethod: 'ISO 527-1:2019 & ISO 527-1:2012' },
      { label: '悬臂梁冲击测试 有凹口', value: 4.6, unit: 'kJ/M²', testMethod: 'ISO 180:2019' },
      { label: '悬臂梁冲击测试 无凹口', value: 19, unit: 'kJ/M²', testMethod: 'ISO 180:2019' },
    ],
  }
];

/**
 * 从数据中自动提取所有品牌（去重），用于筛选侧边栏
 */
export const ALL_BRANDS: string[] = [
  '全部',
  ...Array.from(new Set(MATERIALS_DATA.map(m => m.brand)))
];

/**
 * 从数据中自动提取所有材质分类（去重），用于筛选侧边栏
 */
export const ALL_MATERIAL_TYPES: string[] = [
  '全部',
  ...Array.from(new Set(MATERIALS_DATA.map(m => m.baseMaterial)))
];
