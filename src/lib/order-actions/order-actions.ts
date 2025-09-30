'use server';

import { type Order, delay } from './types';

// Base de datos simulada de órdenes
const ordersData: Order[] = [
  {
    id: '001',
    title: 'Instalación de fibra óptica',
    status: 'En curso',
    startDate: '2025-09-17 13:23',
    endDate: '',
  },
  {
    id: '002',
    title: 'Revisión de conexión ADSL',
    status: 'Finalizado',
    startDate: '2025-09-15 10:00',
    endDate: '2025-09-15 12:30',
  },
  {
    id: '003',
    title: 'Cambio de router',
    status: 'Pausado',
    startDate: '2025-09-16 09:00',
    endDate: '',
  },
  {
    id: '004',
    title: 'Configuración de red empresarial',
    status: 'Requerimiento adicional',
    startDate: '2025-09-18 14:00',
    endDate: '',
  },
];

// Server Action: Obtener todas las órdenes
export async function getOrders(): Promise<Order[]> {
  console.log('📋 Cargando órdenes desde servidor');
  await delay(400);
  return [...ordersData];
}

// Server Action: Obtener orden específica
export async function getOrder(id: string): Promise<Order | null> {
  console.log('📋 Cargando orden específica:', id);
  await delay(300);
  return ordersData.find((order) => order.id === id) || null;
}
