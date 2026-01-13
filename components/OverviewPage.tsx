import React from 'react';
import { 
  Briefcase, 
  Droplets, 
  Database, 
  GitBranch,
  MapPin,
  QrCode,
  Users,
  ClipboardCheck,
  Gauge,
  ListTodo,
  DollarSign,
  Radio,
  Antenna,
  MapPinned,
  Wrench,
  AlertTriangle,
  Settings,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ViewType } from '../types';

interface OverviewPageProps {
  onNavigate: (view: ViewType, siteId?: string) => void;
}

// Static data for ezwater table
const EZWATER_TABLE_DATA = [
  { area_name: "Đào Viết hải", amount_value: "4", area_id: "R.5921.1.1", total_payment: "30853" },
  { area_name: "Phạm Văn Hanh", amount_value: "11", area_id: "R.5921.1.101", total_payment: "85703" },
  { area_name: "Đào Thị Nhớn", amount_value: "11", area_id: "R.5921.1.103", total_payment: "85703" },
  { area_name: "Phạm Đức Chính", amount_value: "8", area_id: "R.5921.1.105", total_payment: "61706" },
  { area_name: "Đào Viết Ngọc Hiển", amount_value: "8", area_id: "R.5921.1.107", total_payment: "61706" },
  { area_name: "Vũ Đình Hân", amount_value: "29", area_id: "R.5921.1.109", total_payment: "270819" },
  { area_name: "Đào Viết Tuấn", amount_value: "126", area_id: "R.5921.1.11", total_payment: "1763671" },
  { area_name: "Vũ Thị Hận", amount_value: "7", area_id: "R.5921.1.111", total_payment: "53993" },
  { area_name: "Nguyễn Thị Nhỡ", amount_value: "1", area_id: "R.5921.1.113", total_payment: "7713" },
  { area_name: "Đặng Thị Mạch", amount_value: "0", area_id: "R.5921.1.115", total_payment: "0" },
  { area_name: "Nguyễn Thị Chút", amount_value: "1", area_id: "R.5921.1.117", total_payment: "7713" },
  { area_name: "Đào Viết Vát", amount_value: "25", area_id: "R.5921.1.119", total_payment: "222826" },
  { area_name: "Phạm Đức Phiệt", amount_value: "9", area_id: "R.5921.1.121", total_payment: "69420" },
  { area_name: "Bùi Minh Sơn", amount_value: "6", area_id: "R.5921.1.123", total_payment: "46280" },
  { area_name: "Bùi Minh Thọ", amount_value: "9", area_id: "R.5921.1.125", total_payment: "69420" },
];

// Static data for ezwork line graph
const EZWORK_GRAPH_DATA = [
  { date: "13/12/2025", total_events: 21458, total_img: 18070 },
  { date: "14/12/2025", total_events: 24960, total_img: 21237 },
  { date: "15/12/2025", total_events: 14054, total_img: 11835 },
  { date: "16/12/2025", total_events: 14281, total_img: 12178 },
  { date: "17/12/2025", total_events: 14045, total_img: 11725 },
  { date: "18/12/2025", total_events: 14195, total_img: 11904 },
  { date: "19/12/2025", total_events: 14048, total_img: 11849 },
  { date: "20/12/2025", total_events: 21206, total_img: 18085 },
  { date: "21/12/2025", total_events: 25007, total_img: 21168 },
  { date: "22/12/2025", total_events: 14013, total_img: 11739 },
  { date: "23/12/2025", total_events: 14207, total_img: 12002 },
  { date: "24/12/2025", total_events: 14013, total_img: 11827 },
  { date: "25/12/2025", total_events: 14282, total_img: 12140 },
  { date: "26/12/2025", total_events: 13905, total_img: 11757 },
  { date: "27/12/2025", total_events: 21283, total_img: 17841 },
  { date: "28/12/2025", total_events: 24959, total_img: 21299 },
  { date: "29/12/2025", total_events: 14142, total_img: 11973 },
  { date: "30/12/2025", total_events: 14143, total_img: 11859 },
  { date: "31/12/2025", total_events: 14294, total_img: 12088 },
  { date: "01/01/2026", total_events: 24827, total_img: 21111 },
  { date: "02/01/2026", total_events: 14316, total_img: 12118 },
  { date: "03/01/2026", total_events: 21154, total_img: 17965 },
  { date: "04/01/2026", total_events: 24947, total_img: 20887 },
  { date: "05/01/2026", total_events: 14280, total_img: 12117 },
  { date: "06/01/2026", total_events: 14482, total_img: 12253 },
  { date: "07/01/2026", total_events: 14001, total_img: 11893 },
  { date: "08/01/2026", total_events: 14248, total_img: 12047 },
  { date: "09/01/2026", total_events: 14274, total_img: 12134 },
  { date: "10/01/2026", total_events: 16983, total_img: 14415 },
  { date: "11/01/2026", total_events: 25123, total_img: 21103 },
  { date: "12/01/2026", total_events: 14136, total_img: 12020 },
];

// Format number with thousand separators
const formatNumber = (num: string | number): string => {
  return Number(num).toLocaleString('vi-VN');
};

// Simple Line Graph Component for ezwork
const LineGraph: React.FC<{ data: typeof EZWORK_GRAPH_DATA; accentColor: string }> = ({ data, accentColor }) => {
  const maxEvents = Math.max(...data.map(d => d.total_events));
  const maxImg = Math.max(...data.map(d => d.total_img));
  const maxValue = Math.max(maxEvents, maxImg);
  const height = 120;
  const width = 100; // percentage
  const padding = { top: 10, bottom: 20, left: 0, right: 0 };
  const graphHeight = height - padding.top - padding.bottom;
  
  const getY = (value: number) => {
    return padding.top + graphHeight - (value / maxValue) * graphHeight;
  };
  
  const pointSpacing = 100 / (data.length - 1);
  
  const eventsPath = data.map((d, i) => {
    const x = i * pointSpacing;
    const y = getY(d.total_events);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  const imgPath = data.map((d, i) => {
    const x = i * pointSpacing;
    const y = getY(d.total_img);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4 mb-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5" style={{ background: accentColor }}></div>
          <span className="text-slate-500">Sự kiện</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5" style={{ background: '#94a3b8' }}></div>
          <span className="text-slate-500">Hình ảnh</span>
        </div>
      </div>
      <svg 
        viewBox={`0 0 100 ${height}`} 
        className="w-full" 
        style={{ height: `${height}px` }}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1="0"
            y1={padding.top + graphHeight * (1 - ratio)}
            x2="100"
            y2={padding.top + graphHeight * (1 - ratio)}
            stroke="#e2e8f0"
            strokeWidth="0.3"
          />
        ))}
        
        {/* Events line */}
        <path
          d={eventsPath}
          fill="none"
          stroke={accentColor}
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Images line */}
        <path
          d={imgPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
        <span>13/12</span>
        <span>28/12</span>
        <span>12/01</span>
      </div>
    </div>
  );
};

// Table Component for ezwater
const DataTable: React.FC<{ data: typeof EZWATER_TABLE_DATA; accentColor: string }> = ({ data, accentColor }) => {
  return (
    <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
      <div className="max-h-[180px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-slate-50">
            <tr>
              <th className="text-left py-2 px-3 font-medium text-slate-600 border-b border-slate-200">Mã KV</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600 border-b border-slate-200">Tên khu vực</th>
              <th className="text-right py-2 px-3 font-medium text-slate-600 border-b border-slate-200">SL</th>
              <th className="text-right py-2 px-3 font-medium text-slate-600 border-b border-slate-200">Thanh toán (₫)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr 
                key={row.area_id} 
                className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
              >
                <td className="py-1.5 px-3 text-slate-500 font-mono text-[10px]">{row.area_id}</td>
                <td className="py-1.5 px-3 text-slate-700">{row.area_name}</td>
                <td className="py-1.5 px-3 text-right font-medium" style={{ color: accentColor }}>{row.amount_value}</td>
                <td className="py-1.5 px-3 text-right text-slate-600 font-mono">{formatNumber(row.total_payment)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Fixed data for each system
const SYSTEM_DATA = {
  ezwork: {
    id: 'ezwork',
    title: 'Quản lý trực ca',
    description: 'Quản lý khu vực, nhân viên và điểm kiểm tra',
    icon: Briefcase,
    accentColor: '#0284c7', // sky-600
    bgAccent: 'rgba(2, 132, 199, 0.08)',
    stats: [
      { label: 'Khu vực', value: '12', icon: MapPin },
      { label: 'Mã QR gán', value: '856', icon: QrCode },
      { label: 'Nhân viên', value: '45', icon: Users },
      { label: 'Điểm kiểm tra', value: '234', icon: ClipboardCheck },
    ]
  },
  ezwater: {
    id: 'ezwater',
    title: 'Quản lý chỉ số tiêu thụ',
    description: 'Theo dõi đồng hồ, công việc và doanh thu',
    icon: Droplets,
    accentColor: '#0ea5e9', // sky-500
    bgAccent: 'rgba(14, 165, 233, 0.08)',
    stats: [
      { label: 'Đồng hồ', value: '1,256', icon: Gauge },
      { label: 'Công việc', value: '89', icon: ListTodo },
      { label: 'Doanh thu', value: '2.5B', icon: DollarSign },
    ]
  },
  datasite: {
    id: 'datasite',
    title: 'Quản lý tài sản',
    description: 'Quản lý cosite, small cell và bảo dưỡng',
    icon: Database,
    accentColor: '#16a34a', // green-600
    bgAccent: 'rgba(22, 163, 74, 0.08)',
    stats: [
      { label: 'Cosite', value: '156', icon: Radio },
      { label: 'Small Cell', value: '89', icon: Antenna },
      { label: 'Trạm QR/Tọa độ', value: '234/312', icon: MapPinned },
      { label: 'Sửa chữa', value: '18', icon: Wrench },
      { label: 'Báo hỏng', value: '7', icon: AlertTriangle },
      { label: 'Bảo dưỡng', value: '23', icon: Settings },
    ]
  },
  mode4: {
    id: 'mode4',
    title: 'Quản lý luồng công việc',
    description: 'Quản lý khu vực, nhân viên và tiến độ công việc',
    icon: GitBranch,
    accentColor: '#7c3aed', // violet-600
    bgAccent: 'rgba(124, 58, 237, 0.08)',
    stats: [
      { label: 'Khu vực', value: '8', icon: Building2 },
      { label: 'Nhân viên', value: '67', icon: Users },
      { label: 'Tổng công việc', value: '456', icon: ListTodo },
      { label: 'Phải hoàn thành', value: '89', icon: CheckCircle2 },
    ]
  }
};

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const systems = Object.values(SYSTEM_DATA);

  const handleGoTo = (siteId: string) => {
    onNavigate('embedded', siteId);
  };

  return (
    <div 
      className="h-full overflow-y-auto"
      style={{ background: '#f8fafc' }}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <h1 
          className="text-2xl text-slate-800 mb-1"
          style={{ fontWeight: 600, letterSpacing: '-0.02em' }}
        >
          Tổng quan hệ thống
        </h1>
        <p className="text-slate-500 text-sm">
          Xem nhanh thông tin và truy cập các module quản lý
        </p>
      </div>

      {/* 2x2 Grid */}
      <div 
        className="px-8 pb-8 grid gap-6"
        style={{ 
          gridTemplateColumns: 'repeat(2, 1fr)'
        }}
      >
        {systems.map((system) => {
          const IconComponent = system.icon;
          
          return (
            <div
              key={system.id}
              className="bg-white rounded-lg transition-all duration-200 flex flex-col"
              style={{
                border: '0.5px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Card Header */}
              <div 
                className="px-6 py-5 flex items-center justify-between"
                style={{ 
                  borderBottom: '0.5px solid rgba(0, 0, 0, 0.06)',
                  background: system.bgAccent
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      background: system.accentColor,
                      boxShadow: `0 2px 8px ${system.accentColor}40`
                    }}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-base text-slate-800"
                      style={{ fontWeight: 600, letterSpacing: '-0.01em' }}
                    >
                      {system.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {system.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid - flex-1 to push footer to bottom */}
              <div className="p-6 flex-1">
                <div 
                  className="grid gap-4"
                  style={{ 
                    gridTemplateColumns: system.stats.length <= 3 
                      ? 'repeat(3, 1fr)' 
                      : system.stats.length <= 4 
                        ? 'repeat(4, 1fr)'
                        : 'repeat(3, 1fr)'
                  }}
                >
                  {system.stats.map((stat, idx) => {
                    const StatIcon = stat.icon;
                    return (
                      <div 
                        key={idx}
                        className="flex flex-col"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <StatIcon 
                            className="w-3.5 h-3.5" 
                            style={{ color: system.accentColor, opacity: 0.7 }}
                          />
                          <span className="text-xs text-slate-500 font-medium">
                            {stat.label}
                          </span>
                        </div>
                        <span 
                          className="text-xl text-slate-800"
                          style={{ 
                            fontWeight: 600,
                            fontVariantNumeric: 'tabular-nums',
                            letterSpacing: '-0.02em'
                          }}
                        >
                          {stat.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Line Graph for ezwork */}
                {system.id === 'ezwork' && (
                  <LineGraph data={EZWORK_GRAPH_DATA} accentColor={system.accentColor} />
                )}
                
                {/* Data Table for ezwater */}
                {system.id === 'ezwater' && (
                  <DataTable data={EZWATER_TABLE_DATA} accentColor={system.accentColor} />
                )}
              </div>

              {/* Card Footer - always at bottom */}
              <div 
                className="px-6 py-4 flex justify-end mt-auto"
                style={{ borderTop: '0.5px solid rgba(0, 0, 0, 0.06)' }}
              >
                <button
                  onClick={() => handleGoTo(system.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150"
                  style={{
                    color: system.accentColor,
                    background: system.bgAccent,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${system.accentColor}18`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = system.bgAccent;
                  }}
                >
                  <span>Đi tới</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
