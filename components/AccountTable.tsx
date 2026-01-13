import React, { useState } from 'react';
import { Search, Calendar, Edit, Trash2 } from 'lucide-react';
import { Account } from '../types';

interface AccountTableProps {
  data: Account[];
}

export const AccountTable: React.FC<AccountTableProps> = ({ data }) => {
  // State for filters (visual only for this demo)
  const [filters, setFilters] = useState({
    username: '',
    fullName: '',
    date: '',
    company: '',
    position: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-white bg-[#0ea5e9]">
            {/* Row 1: Column Headers */}
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold border-r border-blue-400 w-12 text-center">STT</th>
              <th scope="col" className="px-4 py-3 font-semibold border-r border-blue-400">Tài khoản</th>
              <th scope="col" className="px-4 py-3 font-semibold border-r border-blue-400">Họ và tên</th>
              <th scope="col" className="px-4 py-3 font-semibold border-r border-blue-400 text-center">Thời gian tạo</th>
              <th scope="col" className="px-4 py-3 font-semibold border-r border-blue-400">Công ty</th>
              <th scope="col" className="px-4 py-3 font-semibold border-r border-blue-400">Chức vụ</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center w-24">Quản lý</th>
            </tr>
            {/* Row 2: Filter Inputs */}
            <tr className="bg-white border-b border-gray-200">
              <td className="p-2 border-r border-gray-200 bg-gray-50"></td>
              
              <td className="p-2 border-r border-gray-200">
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-2 py-1 pr-8 text-xs focus:outline-none focus:border-blue-500"
                    onChange={(e) => handleFilterChange('username', e.target.value)}
                  />
                  <Search className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
              </td>
              
              <td className="p-2 border-r border-gray-200">
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-2 py-1 pr-8 text-xs focus:outline-none focus:border-blue-500"
                    onChange={(e) => handleFilterChange('fullName', e.target.value)}
                  />
                  <Search className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
              </td>

              <td className="p-2 border-r border-gray-200">
                 <div className="relative">
                  <input 
                    type="text" 
                    placeholder=""
                    className="w-full border border-gray-300 rounded px-2 py-1 pr-8 text-xs focus:outline-none focus:border-blue-500"
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  />
                  <Calendar className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
              </td>

              <td className="p-2 border-r border-gray-200">
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-2 py-1 pr-8 text-xs focus:outline-none focus:border-blue-500"
                    onChange={(e) => handleFilterChange('company', e.target.value)}
                  />
                  <Search className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
              </td>

              <td className="p-2 border-r border-gray-200">
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded px-2 py-1 pr-8 text-xs focus:outline-none focus:border-blue-500"
                    onChange={(e) => handleFilterChange('position', e.target.value)}
                  />
                  <Search className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
                </div>
              </td>

              <td className="p-2 bg-gray-50 text-center"></td>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center border-r border-gray-100">{index + 1}</td>
                <td className="px-4 py-3 border-r border-gray-100 font-medium text-gray-800">{item.username}</td>
                <td className="px-4 py-3 border-r border-gray-100">{item.fullName}</td>
                <td className="px-4 py-3 border-r border-gray-100 text-center text-gray-500">{item.createdAt}</td>
                <td className="px-4 py-3 border-r border-gray-100">{item.company}</td>
                <td className="px-4 py-3 border-r border-gray-100">{item.position}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button className="p-1 rounded hover:bg-blue-100 text-teal-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Empty rows filler if needed, but not required by prompt */}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};