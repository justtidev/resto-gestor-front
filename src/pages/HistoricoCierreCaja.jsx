import React, { useState, useEffect, useMemo, useCallback } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel, // Necesario para paginación
} from '@tanstack/react-table';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  History, Trash2, SortAsc, SortDesc, Filter, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Calendar, Search
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AsideBar from '../components/AsideBar';


export default function HistoricoCierreCaja() {
  const [cierres, setCierres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para la paginación y filtros
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Índice de página actual (0-based)
    pageSize: 10, // Cantidad de elementos por página
  });
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

const timeZone = 'America/Argentina/Buenos_Aires';
  // Función para obtener los cierres de caja
  const fetchCierres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.pageIndex + 1, // El backend espera 1-based index
        pageSize: pagination.pageSize,
        sortBy: sorting.length > 0 ? sorting[0].id : 'fecha_cierre',
        sortOrder: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
      };
      if (startDate) params.startDate = format(startDate, 'yyyy-MM-dd');
      if (endDate) params.endDate = format(endDate, 'yyyy-MM-dd');

      const response = await axios.get('/cierre-caja/historico', { params });
      setCierres(response.data.data);
      console.log("cierre", response.data.data)
      // TanStack Table necesita la información de paginación para sus controles internos
      // No la estamos pasando directamente a la tabla, la estamos manejando manualmente
      // Si la tabla no tiene `manualPagination`, estos valores no son estrictamente necesarios para `useReactTable`
      // pero sí para tus controles de paginación personalizados.
    } catch (err) {
      console.error("Error al obtener histórico de cierres:", err);
      setError("No se pudo cargar el historial de cierres.");
      setCierres([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, startDate, endDate]);

  useEffect(() => {
    fetchCierres();
    
  }, [fetchCierres]);

  // Función para eliminar un cierre de caja
  const handleDeleteCierre = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cierre de caja? Esta acción es irreversible.')) {
      try {
        await axios.delete(`/cierre-caja/${id}`);
        toast.success("✅ Cierre de caja eliminado con éxito.");
        fetchCierres(); // Refrescar la lista
      } catch (err) {
        console.error("Error al eliminar cierre de caja:", err);
        toast.error("❌ Error al eliminar el cierre de caja.");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'fecha_cierre',
        header: 'Fecha de Cierre',
cell: (info) => {
  const date = new Date(info.getValue());

  return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
},
     enableSorting: true,
      },
       
      {
        accessorKey: 'total_ventas',
        header: 'Total Ventas',
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
        enableSorting: true,
      },
      {
        accessorKey: 'total_efectivo',
        header: 'Efectivo',
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
        enableSorting: true,
      },
      {
        accessorKey: 'total_credito',
        header: 'Crédito',
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
        enableSorting: true,
      },
      {
        accessorKey: 'total_debito',
        header: 'Débito',
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
        enableSorting: true,
      },
      {
        accessorKey: 'total_mercadoPago',
        header: 'Mercado Pago',
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
        enableSorting: true,
      },
   {
  accessorFn: row => row.usuario?.nombre || 'N/A',
  id: 'usuario', // se requiere un ID si usás accessorFn
  header: 'Usuario',
  cell: info => info.getValue(),
  enableSorting: false, // TanStack no puede ordenar automáticamente funciones
},

      {
        id: 'acciones',
        header: 'Acciones',
        cell: (info) => (
          <button
            onClick={() => handleDeleteCierre(info.row.original.id)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
            title="Eliminar Cierre"
          >
            <Trash2 size={18} />
          </button>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: cierres,
    columns,
    state: {
      globalFilter,
      sorting,
      // Si la paginación es manual desde el backend, se debe configurar aquí:
      // pagination: pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Para paginación manual (si el backend maneja todo)
    // manualPagination: true,
    // pageCount: totalPages, // Esto vendría del backend
  });

  return (
    
    <div className="flex min-h-screen bg-[#FFFDF7] text-[#212121] font-sans">
      <AsideBar />
      <div className="flex-1 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-[#263238] mb-6 flex items-center gap-3">
        <History size={28} className="text-[#F4C430]" /> Historial de Cierres de Caja
      </h2>

      {/* Controles de filtro y búsqueda */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg border border-gray-200">
          <Calendar size={20} className="text-gray-600" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd/MM/yyyy"
            locale={es}
            placeholderText="Fecha inicio"
            className="bg-transparent outline-none cursor-pointer w-full"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg border border-gray-200">
          <Calendar size={20} className="text-gray-600" />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="dd/MM/yyyy"
            locale={es}
            placeholderText="Fecha fin"
            className="bg-transparent outline-none cursor-pointer w-full"
          />
        </div>
        <div className="relative flex-1 w-full sm:max-w-md">
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar en la tabla..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4C430]"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4C430] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      )}
      {error && <p className="text-red-500 text-center py-10">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                        ) : (
                          <Filter size={16} className="opacity-30" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (

                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ) ) }
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-500 text-lg">
                    No hay cierres de caja en el historial para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Controles de paginación */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span>Elementos por página:</span>
          <select
            value={pagination.pageSize}
            onChange={e => {
              setPagination(prev => ({ ...prev, pageSize: Number(e.target.value) }));
            }}
            className="p-2 border rounded-md"
          >
            {[10, 25, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: 0 }))}
            disabled={pagination.pageIndex === 0}
            className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
            disabled={pagination.pageIndex === 0}
            className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-2">
            Página {pagination.pageIndex + 1} de {table.getPageCount() || 1}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            disabled={pagination.pageIndex >= table.getPageCount() - 1} // table.getPageCount() viene de TanStack Table
            className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: table.getPageCount() - 1 }))}
            disabled={pagination.pageIndex >= table.getPageCount() - 1}
            className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}