import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  UserCircle2,
  LogOut,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AsideBar from '../components/AsideBar';

import { useLogout } from '../hooks/useLogout';

export default function CierreCaja() {
  const [comandas, setComandas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const { userId, userName } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = useLogout();

  const [modalArqueoAbierto, setModalArqueoAbierto] = useState(false);

  const [montosFisicos, setMontosFisicos] = useState({
    Efectivo: '',
    Crédito: '',
    Débito: '',
    MercadoPago: '',
  });

  const [cierreConfirmado, setCierreConfirmado] = useState(false);

  const obtenerComandasDelDia = async (fecha) => {
    const fechaFormateada = format(fecha, 'yyyy-MM-dd');
    try {
      const response = await axios.get(`/cierre-caja?fecha=${fechaFormateada}`);
      const pagadas = (response.data.data || []).filter(
        (comanda) => comanda.estado_Comanda === 'Liberada'
      );
      setComandas(pagadas);
    } catch (err) {
      console.error('Error al obtener comandas para el cierre de caja', err);
      toast.error('❌ Error al cargar los datos del cierre de caja.');
      setComandas([]);
    }
  };

  useEffect(() => {
    obtenerComandasDelDia(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'fecha_apertura',
        header: 'Fecha',
        cell: (info) =>
          format(new Date(info.getValue()), 'dd/MM/yyyy HH:mm', { locale: es }),
        enableSorting: true,
      },
      {
        accessorKey: 'Mesa.numero',
        header: 'Mesa',
        cell: (info) => `Mesa ${info.getValue()}`,
        enableSorting: true,
      },
      {
        accessorKey: 'Usuario.nombre',
        header: 'Atendido por',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'metodo_pago',
        header: 'Forma de Pago',
        cell: (info) => info.getValue() || 'N/A',
        enableSorting: true,
        filterFn: 'includesString',
      },
      {
        accessorKey: 'precio_total',
        header: 'Total',
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
        enableSorting: true,
      },
    ],
    []
  );

  const totalVentas = useMemo(() => {
    return comandas.reduce((sum, comanda) => sum + Number(comanda.precio_total), 0);
  }, [comandas]);

  const totalesPorPago = useMemo(() => {
    const totales = {};
    comandas.forEach((comanda) => {
      const forma = comanda.metodo_pago || 'Sin especificar';
      totales[forma] = (totales[forma] || 0) + Number(comanda.precio_total);
    });
    return totales;
  }, [comandas]);

  const table = useReactTable({
    data: comandas,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const realizarCierre = async () => {
    const fechaLocal = new Date();
    const diferencias = {};
    Object.entries(montosFisicos).forEach(([forma, valorIngresado]) => {
      const sistema = totalesPorPago[forma] || 0;
      const diferencia = Number(valorIngresado || 0) - sistema;
      diferencias[forma] = diferencia;
    });

    const cierreData = {
      fecha: fechaLocal,
      total_ventas: totalVentas,
      totales_por_pago: totalesPorPago,
      usuarioId: userId,
      montos_fisicos: montosFisicos,
      diferencias,
    };

    try {
      await axios.post('/cierre-caja', cierreData);
      toast.success('✅ Cierre de caja realizado con éxito.');
      setComandas([]);
      setMontosFisicos({ Efectivo: '', Crédito: '', Débito: '', MercadoPago: '' });
      setCierreConfirmado(true);
      setModalArqueoAbierto(false);
    } catch (err) {
      console.error('Error al realizar el cierre de caja', err, cierreData);
      toast.error('❌ No se pudo realizar el cierre de caja.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF7] text-[#212121] font-sans">
      <AsideBar />
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold p-4">Cierre de Caja</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl">
              <UserCircle2 size={20} />
              <p className="font-semibold text-[#263238] text-sm">{userName}</p>
            </div>

            <button
              className="flex items-center gap-2 text-black hover:bg-stone-500 hover:text-[#F4C430] transition px-4 py-2 rounded-xl text-sm"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label>Seleccionar Fecha:</label>
          <DatePicker
            selected={fechaSeleccionada}
            onChange={(date) => setFechaSeleccionada(date)}
            dateFormat="dd/MM/yyyy"
            locale={es}
            className="border p-1"
            maxDate={new Date()}
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Buscar:</label>
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar en la tabla..."
            className="border p-1 w-full"
          />
        </div>

        <div className="mb-4">
          <p className="font-bold">Total del día: ${totalVentas.toFixed(2)}</p>
        </div>

        {Object.entries(totalesPorPago).map(([forma, total]) => (
          <div key={forma} className="mb-2">
            {forma}: <strong>${total.toFixed(2)}</strong>
          </div>
        ))}

        {!cierreConfirmado && (
          <>
            <table className="w-full border mt-6">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border px-2 py-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border px-2 py-1">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col items-center max-w-md mx-auto gap-4 mt-4 w-full">
              <div className="flex w-full justify-center gap-4">
                <button
                  onClick={() => setModalArqueoAbierto(true)}
                  className="bg-accent hover:bg-yellow-700 text-white px-4 py-2 rounded-xl flex-1 text-center"
                >
                  Arqueo
                </button>

                <button
                  onClick={realizarCierre}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition flex-1 text-center"
                >
                  Confirmar Cierre de Caja
                </button>
                <button
                  onClick={() => navigate('/cierre/historico')}
                  className="bg-[#263238] text-white px-4 py-2 rounded-xl hover:bg-[rgba(38,50,56,0.8)] transition flex-1 text-center"
                >
                  Historial de Cierres
                </button>
              </div>
            </div>
          </>
        )}

        {cierreConfirmado && (
          <div className="text-green-800 font-bold text-xl mt-6">
            ✅ Caja cerrada correctamente.
          </div>
        )}

        {/* Modal de arqueo */}
        {modalArqueoAbierto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Arqueo de Caja</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Efectivo', 'Crédito', 'Débito', 'MercadoPago'].map((forma) => (
                  <div key={forma}>
                    <label className="block font-medium text-sm mb-1">{forma} físico:</label>
                    <input
                      type="number"
                      value={montosFisicos[forma]}
                      onChange={(e) =>
                        setMontosFisicos((prev) => ({ ...prev, [forma]: e.target.value }))
                      }
                      className="border p-2 w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setModalArqueoAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-[#263238] text-white px-4 py-2 rounded"
                  onClick={() => {
                    toast.success('Arqueo guardado localmente.');
                    setModalArqueoAbierto(false);
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

             
