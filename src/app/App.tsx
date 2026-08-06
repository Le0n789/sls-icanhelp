import { BrowserRouter, Routes, Route } from 'react-router';
import { Home } from './pages/Home';
import { CostCalculator } from './components/CostCalculator';
import { MaterialDetails } from './components/MaterialDetails';
import { DefectCases } from './components/DefectCases';
import { PlaceholderTool } from './components/PlaceholderTool';
import { PostProcessingCases } from './components/PostProcessingCases';
import { PostProcessingDefectCases } from './components/PostProcessingDefectCases';

export default function App() {
  return (
    <BrowserRouter basename="/sls-icanhelp">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cost-calculator" element={<CostCalculator />} />
        <Route path="/material-details" element={<MaterialDetails />} />
        <Route path="/post-processing-defect-cases" element={<PostProcessingDefectCases />} />
        <Route path="/defect-cases" element={<DefectCases />} />
        <Route path="/post-processing-cases" element={<PostProcessingCases />} />
        <Route path="/print-cases" element={<PlaceholderTool title="各材料打印零件案例" />} />
      </Routes>
    </BrowserRouter>
  );
}
