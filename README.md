# Frontend
Aplicación web moderna para la gestión y seguimiento de órdenes de trabajo. Interfaz intuitiva para técnicos y administradores que permite visualizar, actualizar estados, registrar evidencias y gestionar materiales en tiempo real.

# 🌐 TelcoNova SupportSuite - Frontend Web App

<div align="center">

![TelcoNova Logo](https://via.placeholder.com/200x80/0066CC/FFFFFF?text=TelcoNova)

**Sistema de Gestión de Soporte Técnico - Aplicación Web**
*Feature 3: Seguimiento de Órdenes en Proceso*

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/telconova/supportsuite)
[![Next.js](https://img.shields.io/badge/next.js-15.5.3-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/react-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Proprietario-red.svg)](LICENSE)

</div>

---

## 📋 Descripción General

**TelcoNova SupportSuite Frontend** es la aplicación web cliente del sistema de gestión de soporte técnico. Proporciona una interfaz moderna, responsive y accesible para que técnicos y administradores gestionen órdenes de trabajo, documenten evidencias y controlen materiales en tiempo real.

### 🎯 Características Principales

- **🔐 Login Seguro**: Autenticación JWT con validación de dominio @telconova.com
- **📱 Responsive**: Diseño adaptable para desktop, tablet y móvil
- **⚡ Performance**: Server-Side Rendering (SSR) y optimizaciones con Next.js 15
- **🎨 UI Moderna**: Componentes shadcn/ui con Tailwind CSS
- **♿ Accesible**: Cumple estándares WCAG 2.1 AA
- **🔄 Real-time**: Actualizaciones automáticas con Server Actions
- **📸 Upload de Archivos**: Integración con Cloudinary para evidencias

---

## 👥 Vistas por Rol

### 🔧 TÉCNICO
- Dashboard con órdenes asignadas personalmente
- Actualizar estado de órdenes (Iniciar, Pausar, Finalizar)
- Agregar comentarios y subir fotos
- Registrar materiales utilizados con búsqueda en tiempo real
- Ver historial de evidencias

### 👨‍💼 ADMINISTRADOR
- Dashboard con todas las órdenes del sistema
- Filtros avanzados por estado, técnico, fecha
- Vista detallada de cada orden
- Acceso completo a gestión de materiales

---

## 🚀 Guía de Inicio Rápido

### 📋 Prerrequisitos

- **Node.js 18.x** o superior
- **npm 9.x** o superior (o pnpm/yarn)
- **Backend API** corriendo (ver Backend README)

### ⬇️ Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/TelcoNova-SupportSuite-F3/my-nextjs-app
cd my-nextjs-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# 4. Ejecutar en desarrollo
npm run dev
```

### ✅ Verificación de Instalación

Una vez iniciado, verifica que esté funcionando:

```bash
# La aplicación debería estar disponible en:
# http://localhost:3000

# Verificar build de producción
npm run build
npm start
```

### 🌐 Acceder a la Aplicación

- **Desarrollo**: `http://localhost:3000`
- **Producción**: Configurado en Vercel/Railway según deployment
- **Login**: `/login`
- **Dashboard**: `/orders`
- **Detalle de Orden**: `/orders/[id]`

---

## 🛠️ Stack Tecnológico

### Core
- **Next.js 15.5.3** - Framework React con App Router
- **React 19** - Librería UI con Server Components
- **TypeScript 5** - Tipado estático
- **Turbopack** - Bundler ultra rápido

### Styling
- **Tailwind CSS 4.0** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI con Radix UI primitives
- **Lucide React** - Iconos SVG

### State & Data
- **Next.js Server Actions** - Mutaciones del servidor
- **Server Components** - Fetching de datos en servidor
- **React Hooks** - Estado local y efectos
- **Context API** - Estado global (Auth)

### Integrations
- **Cloudinary** - Almacenamiento de imágenes
- **Sonner** - Toast notifications
- **date-fns** - Manipulación de fechas

---

## 📁 Estructura del Proyecto

```
my-nextjs-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   ├── login/                # Página de login
│   │   ├── orders/               # Dashboard y detalle de órdenes
│   │   │   ├── page.tsx          # Lista de órdenes
│   │   │   └── [id]/             # Detalle de orden
│   │   ├── layout.tsx            # Layout raíz
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Estilos globales
│   │
│   ├── components/               # Componentes React
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── table.tsx
│   │   ├── LoginForm/            # Formulario de login
│   │   ├── OrderActionsSection/  # Acciones de orden
│   │   ├── MaterialsSection/     # Gestión de materiales
│   │   ├── EvidenceUpload/       # Subida de evidencias
│   │   ├── OrderComments/        # Comentarios de orden
│   │   ├── OrderTimeTracker/     # Seguimiento de tiempos
│   │   ├── OrderStatusChanger/   # Cambio de estado
│   │   └── MaterialSearchInput/  # Búsqueda de materiales
│   │
│   ├── services/                 # API Service Layer
│   │   ├── auth.service.ts       # Autenticación
│   │   ├── order.service.ts      # Órdenes
│   │   ├── materials.service.ts  # Materiales
│   │   ├── evidence.service.ts   # Evidencias
│   │   ├── http.service.ts       # Cliente HTTP base
│   │   └── Login.services.ts     # Login utilities
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useAddMaterial.ts     # Hook agregar material
│   │   ├── useEditMaterial.ts    # Hook editar material
│   │   ├── useDeleteMaterial.ts  # Hook eliminar material
│   │   ├── useSearchMaterials.ts # Hook búsqueda materiales
│   │   ├── useOrderDetail.ts     # Hook detalle orden
│   │   ├── useOrdersData.ts      # Hook lista órdenes
│   │   ├── useEvidenceUpload.ts  # Hook subir evidencia
│   │   └── useLoginLogic.ts      # Hook lógica login
│   │
│   ├── contexts/                 # React Context Providers
│   │   └── auth-context.tsx      # Contexto de autenticación
│   │
│   ├── lib/                      # Utilities & Helpers
│   │   ├── auth-server.ts        # Autenticación servidor
│   │   ├── config.ts             # Configuración API
│   │   ├── order-actions.ts      # Server Actions
│   │   ├── utils.ts              # Utilidades generales
│   │   └── order-actions/        # Actions modularizadas
│   │
│   ├── types/                    # TypeScript Types
│   │   └── orders.ts             # Tipos de órdenes
│   │
│   └── middleware.ts             # Next.js Middleware (Auth)
│
├── public/                       # Archivos estáticos
├── .env.local                    # Variables de entorno
├── next.config.ts                # Configuración Next.js
├── tailwind.config.ts            # Configuración Tailwind
├── tsconfig.json                 # Configuración TypeScript
└── package.json                  # Dependencias

```

---

## 📱 Guía de Uso

### 1. 🔐 Login

**Ruta**: `/login`

1. Ingresa tu email corporativo `@telconova.com`
2. Ingresa tu contraseña
3. Click en "Iniciar Sesión"
4. Serás redirigido al dashboard `/orders`

**Credenciales de Prueba**:
- **Técnico**: `juan.perez@telconova.com` / `password123`
- **Admin**: `admin@telconova.com` / `admin123`

### 2. 📋 Dashboard de Órdenes

**Ruta**: `/orders`

- **Técnicos**: Ven solo sus órdenes asignadas
- **Admins**: Ven todas las órdenes del sistema

**Filtros Disponibles**:
- Por estado (ASIGNADA, EN_PROCESO, PAUSADA, FINALIZADA)
- Por fecha de asignación
- Por prioridad (BAJA, MEDIA, ALTA, CRÍTICA)

**Acciones**:
- Click en una orden para ver detalles
- Ver indicador de órdenes vencidas (badge rojo)
- Ver tiempos de trabajo

### 3. 📄 Detalle de Orden

**Ruta**: `/orders/[id]`

**Información Visible**:
- Datos del cliente y ubicación
- Estado actual y prioridad
- Técnico asignado
- Fechas de asignación, inicio y fin
- Lista de materiales utilizados
- Historial de evidencias (comentarios y fotos)

**Acciones Disponibles**:

#### 🔄 Cambiar Estado
- **ASIGNADA → EN_PROCESO**: Iniciar trabajo
- **EN_PROCESO → PAUSADA**: Pausar trabajo temporalmente
- **PAUSADA → EN_PROCESO**: Reanudar trabajo
- **EN_PROCESO/PAUSADA → FINALIZADA**: Completar orden

#### ⏰ Seguimiento de Tiempos
- Fecha de inicio (automática al iniciar)
- Fecha de fin (automática al finalizar)
- Duración total calculada
- **Nota**: Las fechas son de solo lectura, gestionadas por el backend

#### 🔧 Gestión de Materiales
1. **Buscar Material**: Escribe al menos 3 caracteres
2. **Seleccionar**: Click en resultado de búsqueda
3. **Cantidad**: Ingresa cantidad deseada
4. **Agregar**: Click en "Agregar Material"

**Editar Material**:
1. Click en botón de editar (lápiz)
2. Ingresa nueva cantidad total deseada
3. Sistema calculará diferencia automáticamente
4. **Restricción**: Solo se puede aumentar cantidad, no disminuir

**Eliminar Material**:
1. Click en botón de eliminar (basura)
2. Confirmar acción

**Restricciones**:
- Solo disponible cuando orden está EN_PROCESO
- No se puede agregar/editar/eliminar en otros estados
- Se valida stock disponible antes de agregar

#### 📸 Evidencias

**Agregar Comentario**:
1. Escribir comentario (máx 500 caracteres)
2. Click en "Agregar Comentario"

**Subir Foto**:
1. Click en "Seleccionar Archivo" o arrastra imagen
2. Formatos permitidos: JPG, PNG (máx 10MB)
3. Vista previa antes de subir
4. Click en "Subir Evidencia"

---

## 🎨 Componentes UI

### Base Components (shadcn/ui)

```typescript
// Button
import { Button } from '@/components/ui/button';
<Button variant="default">Click me</Button>

// Card
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Input
import { Input } from '@/components/ui/input';
<Input type="text" placeholder="Enter text" />

// Dialog
import { Dialog, DialogContent } from '@/components/ui/dialog';
<Dialog open={isOpen}>
  <DialogContent>Content</DialogContent>
</Dialog>
```

### Custom Components

```typescript
// Material Search
import MaterialSearchInput from '@/components/MaterialSearchInput/MaterialSearchInput';
<MaterialSearchInput
  value={searchTerm}
  onValueChange={setSearchTerm}
  onMaterialSelect={handleSelect}
/>

// Evidence Upload
import EvidenceUpload from '@/components/EvidenceUpload/EvidenceUpload';
<EvidenceUpload orderId="123" />

// Order Status Changer
import OrderStatusChanger from '@/components/OrderStatusChanger/OrderStatusChanger';
<OrderStatusChanger
  order={orderData}
  currentUserEmail="user@telconova.com"
/>
```

### Agregar Nuevos Componentes

```bash
# Ver componentes disponibles
npx shadcn@latest add

# Agregar componente específico
npx shadcn@latest add badge
npx shadcn@latest add select
npx shadcn@latest add toast
```

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. Frontend envía POST a `/api/v1/auth/login`
3. Backend valida y devuelve JWT token
4. Token se guarda en cookie `auth-token` (httpOnly)
5. Middleware protege rutas `/orders/*`
6. Token se incluye en header `Authorization: Bearer <token>`

### Protección de Rutas

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  if (!token && request.nextUrl.pathname.startsWith('/orders')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

### Validación en Cliente

```typescript
// Verificar si usuario está autenticado
const { user, isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

---

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env.local`:

```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Auth
NEXT_PUBLIC_TOKEN_COOKIE_NAME=auth-token

# Cloudinary (para evidencias)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# App
NEXT_PUBLIC_APP_NAME=TelcoNova SupportSuite
NEXT_PUBLIC_APP_VERSION=1.0.0

# Environment
NODE_ENV=development
```

### Configuración Next.js

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    turbo: true,
  },
};
```

---

## 📝 Scripts Disponibles

```bash
# Desarrollo con Turbopack
npm run dev

# Build de producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint              # Verificar issues
npm run lint:check        # Verificar y fallar en warnings
npm run lint:fix          # Auto-fix issues

# Type checking
npm run type-check        # Verificar tipos TypeScript
```

---

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080/api/v1
    depends_on:
      - backend
    networks:
      - telconova-network

networks:
  telconova-network:
    external: true
```

### Comandos Docker

```bash
# Build imagen
docker build -t telconova-frontend:latest .

# Ejecutar contenedor
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api:8080 telconova-frontend:latest

# Con Docker Compose
docker-compose up -d
docker-compose logs -f frontend
```

---

## 🚀 Deployment en Vercel

### Deploy Automático

1. **Conectar Repositorio**:
   - Login en [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Importar repositorio Git

2. **Configurar Variables**:
   ```bash
   NEXT_PUBLIC_API_URL=https://api.telconova.com/api/v1
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=telconova-prod
   ```

3. **Deploy**:
   - Vercel detecta Next.js automáticamente
   - Deploy en cada push a `main`
   - Preview deployments en PRs

### Deploy Manual

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

---

## ⚡ Performance

### Optimizaciones Implementadas

- **Server Components**: Rendering en servidor para mejor performance
- **Image Optimization**: Next.js Image component con lazy loading
- **Code Splitting**: Chunks automáticos por ruta
- **Turbopack**: Bundler 700x más rápido que Webpack
- **Font Optimization**: Google Fonts con CSS inlining
- **Static Generation**: Páginas estáticas cuando es posible

### Métricas de Performance

```bash
# Lighthouse audit
npm run build
npm start
# Abrir DevTools > Lighthouse > Generate Report

# Análisis de bundle
npm run analyze
```

### Core Web Vitals

| Métrica | Target | Estado |
|---------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ |
| **FID** (First Input Delay) | < 100ms | ✅ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✅ |
| **FCP** (First Contentful Paint) | < 1.8s | ✅ |
| **TTFB** (Time to First Byte) | < 600ms | ✅ |

---

## 🚨 Solución de Problemas

### Problemas Comunes

#### 🔴 Error: "Network request failed"

**Síntomas**: Errores al hacer peticiones al backend
**Causa**: Backend no disponible o CORS mal configurado
**Solución**:
```bash
# Verificar que backend esté corriendo
curl http://localhost:8080/api/v1/actuator/health

# Verificar configuración CORS en backend
# Debe incluir: http://localhost:3000 y https://*.vercel.app
```

#### 🔴 Error: "Hydration failed"

**Síntomas**: Errores en consola sobre mismatch cliente/servidor
**Causa**: Contenido diferente entre SSR y cliente
**Solución**:
```typescript
// Usar useEffect para contenido solo cliente
'use client';
import { useEffect, useState } from 'react';

export default function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <div>Cliente only content</div>;
}
```

#### 🔴 Error: "Session expired" / 401

**Síntomas**: Redireccionamiento a login constantemente
**Causa**: Token JWT expirado
**Solución**:
```bash
# Hacer login nuevamente
# El token dura 24 horas

# Si persiste, verificar que cookie se esté guardando:
# DevTools > Application > Cookies > auth-token
```

#### 🔴 Error: "Image upload failed"

**Síntomas**: Error al subir evidencias
**Causas**:
- Archivo muy grande (>10MB)
- Formato no permitido (solo JPG, PNG)
- Configuración Cloudinary incorrecta

**Solución**:
```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
echo $NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

# Verificar tamaño del archivo
# Debe ser < 10MB
```

### Debugging

```typescript
// Activar logs detallados
// src/lib/http.service.ts
const DEBUG = true;

if (DEBUG) {
  console.log('Request:', { url, method, body });
  console.log('Response:', response);
}
```

### Logs de Desarrollo

```bash
# Ver logs en tiempo real
npm run dev

# Filtrar por tipo
npm run dev | grep "Error"
npm run dev | grep "Warning"

# Ver logs de servidor (Server Components)
# Se muestran en terminal, no en browser console
```

---

## 🧪 Testing (Futuro)

### Setup de Testing

```bash
# Instalar dependencias
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage
```

### Ejemplo de Test

```typescript
// __tests__/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '@/components/LoginForm/LoginForm';

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('shows error on invalid email', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/email inválido/i)).toBeInTheDocument();
  });
});
```

---

## 📞 Soporte y Contacto

### 🆘 Soporte Técnico

- **Email**: soporte@telconova.com
- **Teléfono**: +57 4 444-1234
- **Horarios**: Lunes a Viernes, 8:00 AM - 6:00 PM

### 👨‍💻 Equipo de Desarrollo

- **Email**: desarrollo@telconova.com
- **Slack**: #telconova-frontend
- **GitHub**: [Issues](https://github.com/telconova/supportsuite-frontend/issues)

### 📚 Recursos Adicionales

- **Documentación Next.js**: https://nextjs.org/docs
- **Documentación Tailwind**: https://tailwindcss.com/docs
- **Documentación shadcn/ui**: https://ui.shadcn.com
- **Wiki Técnica**: [Confluence](https://telconova.atlassian.net/wiki)

---

## 📜 Changelog

### v1.0.0 (2025-01-26)

#### ✨ Nuevas Funcionalidades
- 🔐 Sistema de login con autenticación JWT
- 📋 Dashboard de órdenes con filtros
- 📄 Vista detallada de órdenes
- 🔄 Cambio de estados de órdenes con validaciones
- ⏰ Seguimiento automático de tiempos de trabajo
- 🔧 Gestión completa de materiales (agregar, editar, eliminar)
- 🔍 Búsqueda de materiales en tiempo real con autocompletado
- 📸 Upload de evidencias (comentarios y fotos)
- 💬 Historial de comentarios
- 📱 Diseño responsive para móviles

#### 🎨 UI/UX
- Componentes shadcn/ui para interfaz consistente
- Tailwind CSS para styling moderno
- Toast notifications con Sonner
- Modales de confirmación para acciones críticas
- Loading states y skeleton loaders
- Estados vacíos informativos
- Tooltips y hints contextuales

#### 🔒 Seguridad
- Autenticación JWT con cookies httpOnly
- Middleware de Next.js para protección de rutas
- Validación de dominio @telconova.com
- CORS configurado para dominios permitidos
- Validación de tipos de archivo en cliente
- Sanitización de inputs

#### ⚡ Performance
- Server Components para reducir bundle de JavaScript
- Lazy loading de imágenes
- Code splitting automático
- Turbopack para builds rápidos
- Optimización de fuentes
- Cache de API calls con revalidación

---

## 📄 Licencia

Este software es propiedad de **TelcoNova Colombia SAS**. Todos los derechos reservados.

El uso de este software está restringido a empleados autorizados de TelcoNova Colombia y está sujeto a los términos del contrato de licencia corporativo.

---

<div align="center">

**🚀 ¡Gracias por usar TelcoNova SupportSuite! 🚀**

Si tienes preguntas o necesitas ayuda, no dudes en contactarnos.

</div>
