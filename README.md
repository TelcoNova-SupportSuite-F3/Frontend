# TelcoNova Login App

Una aplicación de login moderna construida con Next.js, Tailwind CSS y shadcn/ui.

## Tecnologías Utilizadas

- **Next.js 15.5.3** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes UI modernos
- **Lucide React** - Iconos

## Desarrollo

Para ejecutar el proyecto en desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx          # Página principal
│   ├── layout.tsx        # Layout base
│   └── globals.css       # Estilos globales
├── components/
│   ├── login-form.tsx    # Componente de login
│   └── ui/               # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
└── lib/
    └── utils.ts          # Utilidades
```

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en producción
- `npm run lint` - Ejecuta el linter

## Componentes

El proyecto utiliza componentes de shadcn/ui para una interfaz consistente y accesible. Para agregar más componentes:

```bash
npx shadcn@latest add [component-name]
```
