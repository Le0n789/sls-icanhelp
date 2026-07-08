import { BrowserRouter, Routes, Route } from 'react-router';
import { Home } from './pages/Home';
import { CostCalculator } from './components/CostCalculator';
import { PlaceholderTool } from './components/PlaceholderTool';

export default function App() {
  return (
    <BrowserRouter basename="/sls-icanhelp">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cost-calculator" element={<CostCalculator />} />
        <Route path="/material-details" element={<PlaceholderTool title="打印材料明细" />} />
        <Route path="/material-comparison" element={<PlaceholderTool title="打印材料对比" />} />
        <Route path="/defect-cases" element={<PlaceholderTool title="零件缺陷案例" />} />
        <Route path="/post-processing-cases" element={<PlaceholderTool title="零件后处理案例" />} />
        <Route path="/print-cases" element={<PlaceholderTool title="各材料打印零件案例" />} />
      </Routes>
    </BrowserRouter>
  );
}