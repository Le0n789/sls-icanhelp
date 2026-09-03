/**
 * 打印材料数据源（唯一管理入口）
 * ============================================================================
 * 新增材料：在 MATERIALS_DATA 数组末尾加一个对象即可
 * 删除材料：删掉对应对象即可
 * 修改材料：直接改对应字段即可
 *
 * 性能指标（properties）：每种材料可自定义不同的性能指标。
 * 每项包含 label（指标名）/ value（数值，number类型/string类型）/ unit（单位）/ testMethod（测试标准，可选）。
 * 例如尼龙关注拉伸强度/热变形温度，TPU关注邵氏硬度/抗撕裂强度。
 *
 * 注意：value 为 number 类型，用于后续材料性能对比功能。
 * ============================================================================
 */

/** 
 * 打印材料数据结构复制模板
 * {
    id: '', 
    name: '',
    brand: '',
    baseMaterial: '',
    density: '',
    color: '',
    features: '',
    applications: '',
    properties: [
      { label: '', value: , unit: '', testMethod: '' },
      { label: '', value: , unit: '', testMethod: '' },
      { label: '', value: , unit: '', testMethod: '' },
      { label: '', value: , unit: '', testMethod: '' },
      { label: '', value: , unit: '', testMethod: '' },
      { label: '', value: , unit: '', testMethod: '' },
      { label: '', value: , unit: '', testMethod: '' },
      { label: '', value: , unit: '', testMethod: '' },
      { label: '', value: , unit: '', testMethod: '' },
    ],
  }
 */


/** 单条性能指标 */
export interface MaterialProperty {
  label: string;      // 指标名称，如 "拉伸强度"
  value: string | number;      // 数值，如 48 或 '48'
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

/**
 * ============================================================================
 * 常用变量（新增材料时直接引用，避免重复手打、减少出错）
 * ============================================================================
 */

/** 常用品牌 */
export const BRANDS = {
  EOS: 'EOS',
  HP: 'HP',
  Formlabs: 'Formlabs',
  D3S: '3DSystems',
  TPM3D: 'TPM3D(盈普)',
} as const;

/** 常用材质分类 */
export const MATERIAL_TYPES = {
  NILONG: '尼龙基材料',
  TANXINGTI: '弹性体',
  GAOXINGNENG: '高性能工程塑料',
} as const;

/** 常用单位 */
export const UNITS = {
  MPA: 'MPa',
  PERCENT: '%',
  KJ_M2: 'kJ/m²',
  J_M: 'J/m',
  TEMP: '°C',
  KN_M: 'kN/m',
  NONE: '',
} as const;



export const MATERIALS_DATA: Material[] = [
  {
    id: '1',
    name: 'PA 2200',
    brand: 'EOS',
    baseMaterial: '尼龙基材料',
    density: '0.93',
    color: '白色',
    features: '100% 经过验证的质量和减少 45% 的CO2，均衡的物业概况，多用途材料，符合（欧盟）第 1935/2004 号标准和 GMP 标准',
    applications: '夹具等生产设备，用于医疗行业的手术切割指南和骨骼模型，消费品行业中的眼镜，支架或盖子等备件，如汽车行业，包括铰链或螺纹的原型制作功能部件',
    properties: [
      { label: '拉伸强度(X/Y/Z 方向)', value: '48/48/42', unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '拉伸模量(X/Y/Z 方向)', value: 1650, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '断裂时的标称应变', value: 18, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '弯曲模量(X 方向)', value: 1500, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '夏比冲击强度(+23°C)(X方向)', value: 53, unit: 'kJ/m²', testMethod: 'ISO 179/1eU' },
      { label: '夏比缺口冲击强度(+23°C)(X方向)', value: 4.8, unit: 'kJ/m²', testMethod: 'ISO 179-1/1eU' },
      { label: '伊佐德缺口冲击强度(+23°C)(X方向)', value: 4.4, unit: 'kJ/m²', testMethod: 'ISO 180/1A' },
      { label: '邵氏D硬度', value: 75, unit: '', testMethod: 'ISO 7619-1' },
      { label: '熔化温度', value: 175, unit: '°C', testMethod: 'ISO 11357-1/-3' },
      { label: '负载 1.80 MPa时的挠度温度(X/Z 方向)', value: '64/57', unit: '°C', testMethod: 'ISO 75-1/-2' },
      { label: '维卡软化温度(X 方向)', value: 176, unit: '°C', testMethod: 'ISO 75-1/-2' },
      { label: '阻燃性能(厚度0.5/1.6/3.2 mm)', value: 'HB', unit: '', testMethod: 'UL 94' },
      { label: '比较跟踪指数 CTI(X,Y,Z 方向)', value: '>=600', unit: '', testMethod: 'IEC 60112' },
    ],
  },

  {
    id: '2',
    name: 'HP HR PA 11',
    brand: 'HP',
    baseMaterial: '尼龙基材料',
    density: '1.05',
    color: '白色',
    features: '优异的抗冲击性和延展性，生物基环保材料，极佳的耐疲劳性能，优异的化学耐受性',
    applications: '耐摔/耐冲击零件，卡扣与活动铰链，汽车内饰组件，医疗康复护具',
    properties: [
      { label: '拉伸强度', value: 54, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量(X/Y/Z 方向)', value: '1700/1700/1800', unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '屈服伸长率(X/Y/Z 方向)', value: '25/25/20', unit: '%', testMethod: 'ASTM D638' },
      { label: '断裂延伸率(X/Y/Z 方向)', value: '40/40/30', unit: '%', testMethod: 'ASTM D638' },
      { label: '冲击强度(X/Y/Z 方向)', value: '7.0/7.0/4.5', unit: 'kJ/m²', testMethod: 'ASTM D638' },
    ],
  },

  {
    id: '3',
    name: 'DuraForm ProX GF Plastic',
    brand: '3DSystem',
    baseMaterial: '尼龙基材料',
    density: '1.33',
    color: '浅灰色',
    features: '玻纤增强复合材料- 同类材料中最佳的刚性与硬度，出色的表面质量与细节分辨率，相比未填充材料，耐热性能更佳',
    applications: '汽车 / 发动机舱部件、进气歧管等耐高温刚性部件，航空航天 / 航空领域，外壳、箱体与盖板，电动工具与小发动机零部件，\
    夹具与治具，热成型与液压成型模具',
    properties: [
      { label: '拉伸强度', value: 45, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量', value: 3720, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '断裂延伸率', value: 2.8 , unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 60, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 3120, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '邵氏 D 硬度', value: 73, unit: '', testMethod: 'ASTM D2240' },
      { label: '伊佐德缺口冲击强度(+23°C)', value: 48, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '伊佐德冲击强度(+23°C)', value: 207, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '热变形温度(0.45 MPa)', value: 180, unit: '°C', testMethod: 'ASTM D648' },
      { label: '热变形温度(1.82 MPa)', value: 129, unit: '°C', testMethod: 'ASTM D648' },
      { label: '热膨胀系数(0-50 °C)', value: 85.3, unit: 'μm/m·°C', testMethod: 'ASTM E831' },
      { label: '热膨胀系数(85-145 °C)', value: 173.7, unit: 'μm/m·°C', testMethod: 'ASTM E831' },
      { label: '比热容', value: 1.26, unit: 'J/g·°C', testMethod: 'ASTM E1269' },
      { label: '导热系数', value: 0.33, unit: 'W/m·K', testMethod: 'ASTM E1530' },
      { label: '阻燃等级(厚度3.0mm)', value: 'HB', unit: '', testMethod: 'UL 94' },
      { label: '体积电阻率', value: '7.20 × 10¹⁴', unit: 'Ω·cm', testMethod: 'ASTM D257'},
      { label: '表面电阻率', value: '2.76 × 10¹⁴', unit: 'Ω/sq', testMethod: 'ASTM D257'},
      { label: '损耗因数(1kHz)', value: 0.051, unit: '', testMethod: 'ASTM D150'},
      { label: '介电常数(1kHz)', value: 3.31, unit: '', testMethod: 'ASTM D150'},
      { label: '介电强度', value: 18.1, unit: 'kV/mm', testMethod: 'ASTM D149'},
    ],
  },

  {
    id: '4',
    name: 'TPU 90A Powder',
    brand: 'Formlabs',
    baseMaterial: '弹性体',
    density: '1.14',
    color: '黑色',
    features: '高断裂伸长率，卓越的抗撕裂强度，可安全接触皮肤',
    applications: '可穿戴设备和触感柔软的元件，垫圈、密封件、面罩、皮带、插头和管子，填充物、阻尼器、靠垫和夹持器，运动防护装备',
    properties: [
      { label: '拉伸强度(X/Y/Z 方向)', value: '8.7/8.7/7.2', unit: 'MPa', testMethod: 'ASTM D412-16(方法 A)' },
      { label: '断裂延伸率(X/Y/Z 方向)', value: '310/310/110', unit: '%', testMethod: 'ASTM D412-16(方法 A)' },
      { label: '伸长率为 50% 时的应力 (X/Y/Z 方向)', value: '6.1/6.1/5.9', unit: 'MPa', testMethod: 'ASTM D412-16(方法 A)' },
      { label: '伸长率为 100% 时的应力 (X/Y/Z 方向)', value: '7.2/7.2/7.0', unit: 'MPa', testMethod: 'ASTM D412-16(方法 A)' },
      { label: '抗撕裂强度(X/Y/Z 方向)', value: '66/66/39', unit: 'kN/m', testMethod: 'ASTM D624-00 (2020)' },
      { label: '在 23°C 下的压缩形变', value: 20.5, unit: '%', testMethod: 'ASTM D395-18(方法 B)' },
      { label: '在 70°C 下的压缩形变', value: 59.9, unit: '%', testMethod: 'ASTM D395-18(方法 B)' },
      { label: '邵氏硬度', value: 90, unit: 'A', testMethod: 'ASTM D2240-15 (2021)' },
      { label: '泰伯磨耗', value: 122, unit: 'mm³', testMethod: 'ISO 4649(40 转/分,10N 负载)' },
      { label: '维卡软化温度', value: 94.3, unit: '°C', testMethod: 'ASTM D1525' },
      { label: '含水率(粉末)', value: 0.19, unit: '%', testMethod: 'ISO 15512 方法 D' },
      { label: '吸水率(打印部件)', value: 0.89, unit: '%', testMethod: 'ASTM D570' },
      { label: '非细胞毒性', value: '通过', unit: '', testMethod: 'ISO 10993-5: 2009' },
      { label: '无刺激性', value: '通过', unit: '', testMethod: 'ISO 10993-23:2021' },
      { label: '无致敏性', value: '通过', unit: '', testMethod: 'ISO 10993-10:2021' },
    ],
  },

  {
    id: '5',
    name: 'Alumide',
    brand: 'EOS',
    baseMaterial: '尼龙基材料',
    density: '1.36',
    color: '金属灰色',
    features: '高硬度、金属外观，相比纯尼龙有更好的导热性，易于机械后加工',
    applications: '少量注塑模具嵌件，金属外观展示模型，夹具等生产设备',
    properties: [
      { label: '拉伸模量(X/Y 方向)', value: 3800, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '拉伸强度(X/Y 方向)', value: 48, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '断裂应变', value: 4, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '弯曲模量', value: 3600, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '挠曲强度(X 方向)', value: 72, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '夏比冲击强度(+23°C)', value: 29, unit: 'kJ/m²', testMethod: 'ISO 179/1eU' },
      { label: '夏比缺口冲击强度(+23°C)', value: 4.6, unit: 'kJ/m²', testMethod: 'ISO 179/1eA' },
      { label: '邵氏D硬度', value: 76, unit: '', testMethod: 'ISO 7619-1' },
      { label: '熔化温度', value: 176, unit: '°C', testMethod: 'ISO 11357-1/-3' },
      { label: '负载 1.80 MPa时的挠度温度(X 方向)', value: 144, unit: '°C', testMethod: 'ISO 75-1/-2' },
      { label: '负载 0.45 MPa时的挠度温度(X 方向)', value: 175, unit: '°C', testMethod: 'ISO 75-1/-2' },
      { label: '维卡软化温度(X 方向)', value: 169, unit: '°C', testMethod: 'ISO 306/B50' },
      { label: '体积电阻率(X 方向)', value: '3E12', unit: 'Ω·m', testMethod: 'IEC 62631-3-1'},
      { label: '表面电阻率(X 方向)', value: '5E14', unit: 'Ω', testMethod: 'IEC 62631-3-2'},
      { label: '相对脆导率(100Hz,X 方向)', value: 13, unit: '', testMethod: 'IEC 62631-2-1'},
      { label: '相对脆导率(1MHz,X 方向)', value: 10, unit: '', testMethod: 'IEC 62631-2-1'},
      { label: '耗散因子(1MHz,X 方向)', value: 180, unit: 'E-4', testMethod: 'IEC 62631-2-1'},
      { label: '电强度(X 方向)', value: 0.1, unit: 'kV/mm', testMethod: 'IEC 60243-1'},
    ],
  },

  {
    id: '6',
    name: 'HP HR PA 12 GB',
    brand: 'HP',
    baseMaterial: '尼龙基材料',
    density: '1.30',
    color: '深灰色',
    features: '40% 玻璃微珠填充的热塑性材料，兼具优异的力学性能与高复用性，具有极高的刚度和尺寸稳定性，热变形表现出色',
    applications: '刚性要求极高的外壳、底座和工装夹具，长期负载零件',
    properties: [
      { label: '拉伸强度(X/Y/Z 方向)', value: '31/31/30', unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量(X/Y/Z 方向)', value: '2900/2900/3000', unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '热变形温度(0.45MPa, 66psi)(X/Y/Z 方向)', value: '170/170/172', unit: '°C', testMethod: 'ASTM D648' },
      { label: '热变形温度(1.82MPa, 66psi)(X/Y/Z 方向)', value: '113/113/118', unit: '°C', testMethod: 'ASTM D648' },
      { label: '屈服延伸率(X/Y/Z 方向)', value: '8/8/4', unit: '%', testMethod: 'ASTM D638' },
      { label: '断裂伸长率(X/Y/Z 方向)', value: '9/9/4', unit: '%', testMethod: 'ASTM D638' },
      { label: '冲击强度(X,Y,Z 方向)', value: 3, unit: 'kJ/m²', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '7',
    name: 'Precimid1172Pro',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '0.95',
    color: '白色',
    features: '表面光洁度高，细节展现优异，综合力学性能平衡，适合多种通用场景',
    applications: '手板模型验证，医疗辅具，电子外壳，教育与科研用途',
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
      { label: '抗热变形温度 0.45MPa', value: 168, unit: '°C', testMethod: 'ISO 75-1:2013' },
      { label: '抗热变形温度 1.8MPa', value: 90, unit: '°C', testMethod: 'ISO 75-1:2020' },
      { label: '拉伸强度', value: 41.7, unit: 'MPa', testMethod: 'ISO 527-1:2019' },
      { label: '拉伸模量', value: 2300, unit: 'MPa', testMethod: 'ISO 527-1:2019 & ISO 527-1:2012' },
      { label: '悬臂梁冲击测试 有凹口', value: 4.6, unit: 'kJ/m²', testMethod: 'ISO 180:2019' },
      { label: '悬臂梁冲击测试 无凹口', value: 19, unit: 'kJ/m²', testMethod: 'ISO 180:2019' },
    ],
  },

  {
    id: '9', 
    name: 'Precimid1172Pro（BLK）',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '0.95',
    color: '亮白/灰黑',
    features: '综合性能佳，颜色稳定，尺寸精确，高复用率',
    applications: '结构零件，功能外壳，复杂装配件，卡扣部件，文创，无人机',
    properties: [
      { label: '断裂延伸率', value: '8 - 17', unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 51, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 1280, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 180, unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.8MPa', value: 99, unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度', value: 46, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量', value: 1840, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '悬臂梁冲击测试 有凹口', value: 40, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 无凹口', value: 402, unit: 'J/m', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '10', 
    name: 'Precimid1180（BLK）',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '0.96',
    color: '本色白/本色黑',
    features: '抗冲击，高复用率，卓越韧性，耐热变形',
    applications: '热载荷环境，机械性好的部件，大面积黑色防划功能件',
    properties: [
      { label: '断裂延伸率', value: 45, unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 45, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 1200, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 193, unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.8MPa', value: 64, unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度', value: 47, unit: 'MPa', testMethod: 'ASTM D648' },
      { label: '拉伸模量', value: 1550, unit: 'MPa', testMethod: 'ASTM D648' },
      { label: '悬臂梁冲击测试 有凹口', value: 85, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 无凹口', value: '未发生破裂', unit: '', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '11', 
    name: 'Precimid1171Pro',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '0.95',
    color: '本色白',
    features: '生物相容性，美国药典USP CLASS VI标准，国标GB/T16886体外溶血测试，国标GB/T4806.7食品安全接触类材料和制品国家标准，尺寸精确，高强度，高复用率',
    applications: '复杂构件，食品容器，体外医疗用具',
    properties: [
      { label: '断裂延伸率', value: '8 - 15', unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 47, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 1700, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 167, unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.8MPa', value: 58, unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度', value: 46, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量', value: 1700, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '悬臂梁冲击测试 有凹口', value: 51, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 无凹口', value: 338, unit: 'J/m', testMethod: 'ASTM D256' },
    ],
  },

{
    id: '12', 
    name: 'Precimid1171 FR BLK',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '1.03',
    color: '灰黑色',
    features: '材料通过 UL94 V0@1.6MM测试，可用的阻燃材料的最佳表面光洁度和精度，更准确的尺寸',
    applications: '航空航天的内饰塑胶件，电线绝缘，油路管道接头，汽车发动机周边塑胶件',
    properties: [
      { label: '断裂延伸率', value: 10, unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 53, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 1462, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 188, unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.8MPa', value: 120, unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度', value: 38, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量', value: 2077, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '悬臂梁冲击测试 有凹口', value: 30, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 无凹口', value: 221, unit: 'J/m', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '13', 
    name: 'Precimid1171Pro AF40',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '1.36',
    color: '金属灰',
    features: '高强度，40%铝粉，金属色泽，耐磨，高复用率',
    applications: '需要金属质感的产品，热载荷环境，机械性好的部件',
    properties: [
      { label: '断裂延伸率', value: '1.5 - 3.5', unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 54, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 1994, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 167, unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.8MPa', value: 127, unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度', value: 32, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量', value: 1700, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '悬臂梁冲击测试 有凹口', value: 35, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 无凹口', value: 241, unit: 'J/m', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '14', 
    name: 'Precimid1171 GF30 FR BLK',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '1.25',
    color: '灰黑色',
    features: '30%玻璃，UL-94阻燃等级达到V-0 高刚度，高的抗拉强度耐热变形',
    applications: '尼龙基材料',
    properties: [
      { label: '断裂延伸率', value: 2.6, unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 63, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 2800, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 170, unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.8MPa', value: 133, unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度', value: 40, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量', value: 3500, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '悬臂梁冲击测试 有凹口', value: 18, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 无凹口', value: 82, unit: 'J/m', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '15', 
    name: 'Precimid1172Pro GF30（BLK）',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '1.17',
    color: '灰黄/灰黑',
    features: '高强度，30%玻璃，耐热变形，高复用率',
    applications: '高刚度要求，穿戴和耐磨环境，高温工况',
    properties: [
      { label: '断裂延伸率', value: '5 - 8', unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 71, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 2241, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 184, unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.8MPa', value: 126, unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度', value: 32, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量', value: 2398, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '悬臂梁冲击测试 有凹口', value: 29, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 无凹口', value: 264, unit: 'J/m', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '16', 
    name: 'Precimid1174Pro CF',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '1.09',
    color: '黑色',
    features: '极高的强度和硬度，耐磨耐热，含有碳纤维成分',
    applications: '无人机配件，耐热高压环境工况，汽车发动机组件',
    properties: [
      { label: '断裂延伸率-X/Y/Z', value: '8/9.5/1.7', unit: '%', testMethod: 'ASTM D638' },
      { label: '最大弯曲强度-X/Y/Z', value: '135/100/66', unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲弹性模量-X/Y/Z', value: '6000/4500/3000', unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 172, unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.72MPa', value: 172, unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度-X/Y/Z', value: '88/63/36', unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '杨氏弹性模量-X/Y/Z', value: '9000/6400/3500', unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '无缺口抗冲击-X/Y/Z', value: '35/35/25', unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '有缺口冲击-X/Y/Z', value: '6.3/6.8/3.5', unit: 'J/m', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '17', 
    name: 'Precimid1176Pro BLK',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: '0.95',
    color: '灰黑',
    features: '综合性能佳，颜色稳定，尺寸精确，高复用率',
    applications: '结构零件，功能外壳，复杂装配件，卡扣部件，文创类产品，无人机',
    properties: [
      { label: '断裂延伸率', value: 9.3, unit: '%', testMethod: 'ISO 527-1:2012' },
      { label: '弯曲强度', value: 67, unit: 'MPa', testMethod: 'ISO 178:2019' },
      { label: '弯曲模量', value: 1710, unit: 'MPa', testMethod: 'ISO 178:2019' },
      { label: '抗热变形温度 0.45MPa', value: 165, unit: '°C', testMethod: 'ISO 75-1:2013' },
      { label: '抗热变形温度 1.8MPa', value: 99, unit: '°C', testMethod: 'ISO 75-1:2020' },
      { label: '拉伸强度', value: 44.3, unit: 'MPa', testMethod: 'ISO 527-1:2019' },
      { label: '拉伸模量', value: 1800, unit: 'MPa', testMethod: 'ISO 527-1:2019 & ISO 527-1:2012' },
      { label: '悬臂梁冲击测试 有凹口', value: 4.2, unit: 'kJ/m²', testMethod: 'ISO 180:2019' },
      { label: '悬臂梁冲击测试 无凹口', value: 23, unit: 'kJ/m²', testMethod: 'ISO 180:2019' },
    ],
  },

  {
    id: '18', 
    name: 'PA6X BLK',
    brand: 'TPM3D(盈普)',
    baseMaterial: '尼龙基材料',
    density: 'N/A',
    color: '灰黑色',
    features: '耐热变形，良好综合力学性能',
    applications: '结构零件，叶轮/风扇，油路管道接头，汽车发动机',
    properties: [
      { label: '断裂延伸率', value: 17, unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 75, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 1500, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 190, unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.8MPa', value: 70, unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度', value: 51, unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '拉伸模量', value: 2000, unit: 'MPa', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 有凹口', value: 70, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 无凹口', value: 450, unit: 'J/m', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '19', 
    name: 'TPM3D PEEK IND',
    brand: 'TPM3D(盈普)',
    baseMaterial: '高性能工程塑料',
    density: '1.26',
    color: '棕色',
    features: '耐高温，高刚度，生物相容性，化学性能稳定',
    applications: '医疗，发动机，机械零件',
    properties: [
      { label: '断裂延伸率', value: 1.3, unit: '%', testMethod: 'ASTM D638' },
      { label: '弯曲强度', value: 80, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '弯曲模量', value: 3000, unit: 'MPa', testMethod: 'ASTM D790' },
      { label: '抗热变形温度 0.45MPa', value: 'N/A', unit: '°C', testMethod: 'ASTM D648' },
      { label: '抗热变形温度 1.8MPa', value: 'N/A', unit: '°C', testMethod: 'ASTM D648' },
      { label: '拉伸强度', value: 50, unit: 'MPa', testMethod: 'ISO 527' },
      { label: '拉伸模量', value: 'N/A', unit: 'MPa', testMethod: 'ASTM D638' },
      { label: '悬臂梁冲击测试 有凹口', value: 95, unit: 'J/m', testMethod: 'ASTM D256' },
      { label: '悬臂梁冲击测试 无凹口', value: 230, unit: 'J/m', testMethod: 'ASTM D256' },
    ],
  },

  {
    id: '20', 
    name: 'TPM3D PEKK IND',
    brand: 'TPM3D(盈普)',
    baseMaterial: '高性能工程塑料',
    density: 'N/A',
    color: '淡黄色',
    features: '耐高温，高刚度和阻燃性，生物相容性，化学性能稳定',
    applications: '医疗，发动机，机械零件',
    properties: [
      { label: '断裂伸长率', value: 2.3, unit: '%', testMethod: 'ISO 527' },
      { label: '拉伸强度', value: 81, unit: 'MPa', testMethod: 'ISO 527' },
      { label: '杨氏弹性模量', value: 4000, unit: 'MPa', testMethod: 'ISO 527' },
      { label: '最大弯曲强度', value: 160, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '弯曲弹性模量', value: 7200, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '单缺口抗冲击', value: 4.5, unit: 'kJ/m²', testMethod: 'ISO 180' },
      { label: '双缺口冲击', value: 3.969, unit: 'kJ/m²', testMethod: 'ISO 180' },
      { label: '热变形温度', value: '>200', unit: '°C', testMethod: 'N/A' },
    ],
  },

  {
    id: '21', 
    name: 'TPM3D PP Pro',
    brand: 'TPM3D(盈普)',
    baseMaterial: '高性能工程塑料',
    density: '0.8',
    color: '自然白',
    features: '综合性能良好，密度低重量轻，吸水率低，可二次塑性',
    applications: '医疗，汽车，消费电子，液体容器',
    properties: [
      { label: '断裂延伸率', value: 18, unit: '%', testMethod: 'ISO 527-1:2012' },
      { label: '弯曲强度', value: 30.2, unit: 'MPa', testMethod: 'ISO 178:2019' },
      { label: '弯曲模量', value: 1100, unit: 'MPa', testMethod: 'ISO 178:2019' },
      { label: '抗热变形温度 0.45MPa', value: 98, unit: '°C', testMethod: 'ISO 75-1:2013' },
      { label: '抗热变形温度 1.8MPa', value: 64, unit: '°C', testMethod: 'ISO 75-1:2020' },
      { label: '拉伸强度', value: 21.1, unit: 'MPa', testMethod: 'ISO 527-1:2019' },
      { label: '拉伸模量', value: 1180, unit: 'MPa', testMethod: 'ISO 527-1:2019 & ISO 527-1:2012' },
      { label: '悬臂梁冲击测试 有凹口', value: 4.5, unit: 'kJ/m²', testMethod: 'ISO 180:2019' },
      { label: '悬臂梁冲击测试 无凹口', value: 21, unit: 'kJ/m²', testMethod: 'ISO 180:2019' },
    ],
  },

  {
    id: '22', 
    name: 'TPM3D PPS IND',
    brand: 'TPM3D(盈普)',
    baseMaterial: '高性能工程塑料',
    density: 'N/A',
    color: '深黄色',
    features: '耐高温，阻燃，化学性能稳定，绝缘',
    applications: '电气行业，机械零件',
    properties: [
      { label: '断裂伸长率', value: 2.7, unit: '%', testMethod: 'ISO 527' },
      { label: '拉伸强度', value: 55, unit: 'MPa', testMethod: 'ISO 527' },
      { label: '杨氏弹性模量', value: 3900, unit: 'MPa', testMethod: 'ISO 527' },
      { label: '最大弯曲强度', value: 70, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '弯曲弹性模量', value: 3100, unit: 'MPa', testMethod: 'ISO 178' },
      { label: '单缺口抗冲击', value: 1.4, unit: 'kJ/m²', testMethod: 'ISO 180' },
      { label: '双缺口冲击', value: 1.688, unit: 'kJ/m²', testMethod: 'ISO 180' },
      { label: '热变形温度', value: '>200', unit: '°C', testMethod: 'N/A' },
    ],
  },

  {
    id: '23', 
    name: 'Precimid1130 90A',
    brand: 'TPM3D(盈普)',
    baseMaterial: '弹性体',
    density: 'N/A',
    color: 'N/A',
    features: '软性、弹性材料，抗冲击性、减震性能好，高复用率，耐热耐霉耐水',
    applications: '密封垫圈，汽车业减震零件和缓冲隔离，软性护具，表面延展性要求高的场景，运动鞋垫',
    properties: [
      { label: '邵A硬度-X/Z', value: '88 - 90', unit: 'A', testMethod: 'DIN ISO 7619-1' },
      { label: '拉伸强度-X/Z', value: '8/7', unit: 'MPa', testMethod: 'DIN53504,S2' },
      { label: '断裂伸长率-X/Z', value: '270/130', unit: '%', testMethod: 'DIN53504.S2' },
      { label: '拉伸模量-X/Z', value: '75', unit: 'MPa', testMethod: 'IS0527-2,1A' },
      { label: '弯曲模量-X/Z', value: '70', unit: 'MPa', testMethod: 'DIN EN ISO 178' },
      { label: '撕裂强度-X/Z', value: '26', unit: 'kN/m', testMethod: 'DINISO34-1,A' },
      { label: '撕裂强度-X/Z', value: '43/37', unit: 'kN/m', testMethod: 'DINISO34-1,B' },
      { label: '抗压缩性(23°C,72h)-X/Z', value: '24', unit: '%', testMethod: 'DIN ISO 815-1' },
      { label: '回弹性-X/Z', value: '63', unit: '%', testMethod: 'DIN 53512' },
      { label: '耐磨度(method A)-X/Z', value: '86/95', unit: 'mm³', testMethod: 'DINISO4649' },
      { label: '简支梁冲击强度(有缺口，23°C)-X/Z', value: '无断裂', unit: 'kJ/m²', testMethod: 'DIN EN ISO 179-1' },
      { label: '简支梁冲击强度(有缺口，-10°C)-X/Z', value: '60/58', unit: 'kJ/m²', testMethod: 'DIN EN ISO 179-1' },
      { label: '疲劳性能(Rossflex,100kcycles,23°C)-X/Z', value: '无割口增长 / 无', unit: '', testMethod: 'ASTM D1052' },
      { label: '疲劳性能(Rossflex,100kcycles,-10°C)-X/Z', value: '无割口增长 / 无', unit: '', testMethod: 'ASTM D1052' },
    ],
  },

  {
    id: '24', 
    name: 'PA 1100',
    brand: 'EOS',
    baseMaterial: '尼龙基材料',
    density: '1.03',
    color: '白色',
    features: '高延展性，高抗冲击性，易着色，色牢度高，生物基材料',
    applications: '抗冲击应用，在负载作用下不会碎裂，例如覆盖层或外壳，铰链、夹子或搭扣，消费品行业中的眼镜',
    properties: [
      { label: '拉伸强度(X,Y 方向)', value: 51, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '拉伸强度(Z 方向)', value: 50, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '拉伸模量(X,Y,Z 方向)', value: 1700, unit: 'MPa', testMethod: 'ISO 527-1/-2' },
      { label: '断裂应变(X,Y 方向)', value: 30, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '断裂应变(Z 方向)', value: 25, unit: '%', testMethod: 'ISO 527-1/-2' },
      { label: '夏比冲击强度(+23°C)(X,Y,Z 方向)', value: '无断裂', unit: '', testMethod: 'ISO 179/1eU' },
      { label: '夏比冲击强度(-30°C)(X 方向)', value: '无断裂', unit: '', testMethod: 'ISO 179/1eU' },
      { label: '夏比冲击强度(-30°C)(Z 方向)', value: '90', unit: 'kJ/m²', testMethod: 'ISO 179/1eU' },
      { label: '夏比冲击强度(-30°C,FORMIGA P 110 Velocis设备打印)(Z 方向)', value: '无断裂', unit: '', testMethod: 'ISO 179/1eU' },
      { label: '夏比冲击强度(-30°C,FORMIGA P 110 FDR设备打印)(Z 方向)', value: '无断裂', unit: '', testMethod: 'ISO 179/1eU' },
      { label: '夏比缺口冲击强度(+23°C)(X 方向)', value: 6.0, unit: 'kJ/m²', testMethod: 'ISO 179/1eA' },
      { label: '夏比缺口冲击强度(+23°C)(Y,Z 方向)', value: 5.5, unit: 'kJ/m²', testMethod: 'ISO 179/1eA' },
      { label: '邵氏D硬度', value: 75, unit: '', testMethod: 'ISO 7619-1' },
      { label: '熔化温度', value: 182, unit: '°C', testMethod: 'ISO 11357-1/-3' },
      { label: '负载 1.80 MPa时的挠度温度(X,Y 方向)', value: 46, unit: '°C', testMethod: 'ISO 75-1/-2' },
      { label: '负载 1.80 MPa时的挠度温度(Z 方向)', value: 47, unit: '°C', testMethod: 'ISO 75-1/-2' },
    ],
  },

  {
    id: '25', 
    name: 'PA 1101',
    brand: BRANDS.EOS,
    baseMaterial: MATERIAL_TYPES.NILONG,
    density: '1.03',
    color: '微白半透明色',
    features: '高抗冲击性，高断裂伸长率，生物基材料',
    applications: '抗冲击应用，在负载作用下不会碎裂，需要较高断裂伸长率的功能部件，如夹子或扣子，消费品行业中的眼镜',
    properties: [
      { label: '拉伸模量(X/Y/Z 方向)', value: 1650, unit: UNITS.MPA, testMethod: 'ISO 527-1/-2' },
      { label: '拉伸强度(X/Y/Z 方向)', value: '50/50/48', unit: UNITS.MPA, testMethod: 'ISO 527-1/-2' },
      { label: '断裂应变(X/Y/Z 方向)', value: '30/30/15', unit: UNITS.PERCENT, testMethod: 'ISO 527-1/-2' },
      { label: '断裂应变(Z 方向)(FORMIGA P 110 Velocis设备打印)', value: 22, unit: UNITS.PERCENT, testMethod: 'ISO 527-1/-2' },
      { label: '断裂应变(Z 方向)(P 770设备打印)', value: 12, unit: UNITS.PERCENT, testMethod: 'ISO 527-1/-2' },
      { label: '夏比冲击强度(+23°C)(X/Y/Z 方向)', value: '无断裂/无断裂/85', unit: UNITS.NONE, testMethod: 'ISO 179/1eU' },
      { label: '夏比冲击强度(+23°C)(Z 方向)(FORMIGA P 110 Velocis设备打印)', value: '无断裂', unit: UNITS.NONE, testMethod: 'ISO 179/1eU' },
      { label: '夏比冲击强度(-30°C)(X/Y 方向)', value: '无断裂', unit: UNITS.NONE, testMethod: 'ISO 179/1eU' },
      { label: '夏比冲击强度(-30°C)(Z 方向)(FORMIGA P 110 Velocis设备打印)', value: '无断裂', unit: UNITS.NONE, testMethod: 'ISO 179/1eU' },
      { label: '夏比缺口冲击强度(+23°C)(X/Y/Z 方向)', value: '6.9/7.3/5.5', unit: UNITS.KJ_M2, testMethod: 'ISO 179/1eA' },
      { label: '夏比缺口冲击强度(-30°C)(X/Y/Z 方向)', value: '6.3/5.8/5.1', unit: UNITS.KJ_M2, testMethod: 'ISO 179/1eA' },
      { label: '邵氏 D 硬度', value: 75, unit: UNITS.NONE, testMethod: 'ISO 7619-1' },
      { label: '熔化温度', value: 201, unit: UNITS.TEMP, testMethod: 'ISO 11357-1/-3' },
      { label: '负载 1.80MPa时的挠度温度(X/Y/Z 方向)', value: '46/46/47', unit: UNITS.TEMP, testMethod: 'ISO 75-1/-2' },
      { label: '0.45MPa时的挠度温度(X/Y/Z 方向)', value: '180/180/181', unit: UNITS.TEMP, testMethod: 'ISO 75-1/-2' },
      { label: '比较跟踪指数 CTI(X/Y/Z 方向)', value: '>=600', unit: UNITS.NONE, testMethod: 'IEC 60112' },
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
