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
