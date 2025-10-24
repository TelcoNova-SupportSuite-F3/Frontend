import { NextResponse } from 'next/server';
import { getOrdersData } from '@/hooks/useOrdersData';

export async function GET() {
  try {
    const { orders, summary, error, isAuthenticated } = await getOrdersData();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    if (error) {
      return NextResponse.json(
        { error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orders,
      summary,
    });
  } catch (error) {
    console.error('Error en API route /api/orders:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
