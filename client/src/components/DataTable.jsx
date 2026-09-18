import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Download, Search, ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({ columns, data, exportFileName = 'data_export' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle Sorting using callback var
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort Data
  const filteredAndSortedData = useMemo(() => {
    let processData = [...data];

    // Global Search
    if (searchTerm) {
      processData = processData.filter((row) => {
        return Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Sort
    if (sortConfig.key) {
      processData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processData;
  }, [data, searchTerm, sortConfig]);

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAndSortedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${exportFileName}.xlsx`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-100">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cc3b38] focus:bg-white focus:ring-2 focus:ring-[#cc3b38]/10 transition-all"
          />
        </div>
        <button
          onClick={exportToExcel}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Download size={15} />
          Export to Excel
        </button>
      </div>

      {/* Table Wrapper for horizontal scroll */}
      <div className="overflow-x-auto touch-scroll-x flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-200/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-gray-100/70 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && (
                      <span className="flex flex-col opacity-60">
                        <ChevronUp size={11} className={sortConfig.key === col.key && sortConfig.direction === 'asc' ? 'text-[#cc3b38] opacity-100' : ''} />
                        <ChevronDown size={11} className="-mt-1" stroke={sortConfig.key === col.key && sortConfig.direction === 'desc' ? 'var(--color-primary)' : 'currentColor'} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50/60 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">📂</span>
                    <p className="font-semibold text-gray-700">No records found</p>
                    <p className="text-xs text-gray-400">Add a new record or adjust your search term.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
