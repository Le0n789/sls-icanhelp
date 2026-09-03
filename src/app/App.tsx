import { BrowserRouter, Routes, Route } from 'react-router';
import { Home } from './pages/Home';
import { CostCalculator } from './components/CostCalculator';
import { MaterialDetails } from './components/MaterialDetails';
import { DefectCases } from './components/DefectCases';
import { PlaceholderTool } from './components/PlaceholderTool';
import { PostProcessingCases } from './components/PostProcessingCases';
import { PostProcessingDefectCases } from './components/PostProcessingDefectCases';
import { DesignReference } from './components/DesignReference';

export default function App() {
  return (
    // basename 跟随 Vite 的 base 配置自动切换：当前为 /sls-icanhelp/，绑定自定义域名后构建时自动变为 /
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cost-calculator" element={<CostCalculator />} />
        <Route path="/material-details" element={<MaterialDetails />} />
        <Route path="/post-processing-defect-cases" element={<PostProcessingDefectCases />} />
        <Route path="/defect-cases" element={<DefectCases />} />
        <Route path="/post-processing-cases" element={<PostProcessingCases />} />
        <Route path="/print-cases" element={<DesignReference />} />
      </Routes>
    </BrowserRouter>
  );
}
