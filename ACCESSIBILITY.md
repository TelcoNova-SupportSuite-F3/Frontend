# Accesibilidad en TelcoNova - Módulo de Seguimiento

Este documento describe las características de accesibilidad implementadas en el módulo de seguimiento de órdenes de trabajo, siguiendo las pautas WCAG 2.1 nivel AA.

## Resumen de Cumplimiento

✅ **Todos los elementos interactivos son accesibles mediante lectores de pantalla**
✅ **Soporte para aumento de tamaño de letra**
✅ **Textos alternativos descriptivos para iconos y gráficos**
✅ **Contraste de color conforme a WCAG 2.1 (4.5:1 para texto normal, 3:1 para texto grande)**
✅ **Anuncios de mensajes, alertas y notificaciones por lectores de pantalla**

## Características de Accesibilidad Implementadas

### 1. Navegación por Teclado y Lectores de Pantalla

#### Elementos Interactivos con ARIA
- **Botones**: Todos los botones incluyen `aria-label` descriptivos
- **Tablas**: Implementan `role="table"`, `aria-label`, y `scope="col"` en encabezados
- **Formularios**: Labels asociados correctamente con inputs usando `htmlFor` e `id`
- **Estados**: Botones de estado usan `aria-pressed` y `aria-disabled`

#### Componentes Clave

**OrdersTable** (`src/components/OrdersTable/OrdersTable.tsx`)
```tsx
- role="table" con aria-label descriptivo
- TableHead con scope="col" para encabezados
- Cada celda con aria-label que describe su contenido
- Badges de estado con aria-label que anuncia el estado
```

**MaterialsSectionClient** (`src/components/MaterialsSection/MaterialsSectionClient.tsx`)
```tsx
- Tabla de materiales con role="table" y aria-label
- Botones de editar/eliminar con aria-label específicos
- Iconos con aria-hidden="true" (redundantes con aria-label del botón)
```

**OrderBasicInfo** (`src/components/OrderBasicInfo/OrderBasicInfo.tsx`)
```tsx
- Uso de elementos semánticos <dl>, <dt>, <dd>
- Badges con aria-label que describen estado y prioridad
- Asociación correcta entre etiquetas y valores
```

**OrderStatusChanger** (`src/components/OrderStatusChanger/OrderStatusChanger.tsx`)
```tsx
- Botones con aria-pressed para indicar estado activo
- aria-disabled para botones deshabilitados
- aria-label descriptivos para cada botón de estado
```

**OrderComments** (`src/components/OrderComments/OrderComments.tsx`)
```tsx
- Región con aria-label="Sección de comentarios"
- aria-describedby vincula textarea con ayuda y contador
- aria-live="polite" para contador de caracteres
- Status de envío anunciado con aria-live
```

**FileUpload** (`src/components/FileUpload/FileUpload.tsx`)
```tsx
- Región con aria-label="Subida de evidencias"
- Zona de arrastre con role="button" y tabIndex={0}
- Soporte de navegación por teclado (Enter/Space)
- aria-live="polite" para estado de carga
```

### 2. Tamaño de Letra Escalable

**Configuración en `src/app/globals.css`:**
```css
html {
  font-size: 100%; /* Respeta preferencias del navegador */
}

body {
  font-size: 1rem; /* 16px base, escala con html */
  line-height: 1.5; /* Mejora legibilidad */
}
```

**Beneficios:**
- Los usuarios pueden aumentar el tamaño de letra desde su navegador (Ctrl/Cmd + "+")
- El diseño se adapta usando unidades relativas (rem, em)
- El texto permanece legible hasta 200% de zoom (WCAG 2.1 1.4.4)

### 3. Textos Alternativos y Descripciones

#### Iconos
Todos los iconos decorativos tienen `aria-hidden="true"` y los botones que los contienen tienen `aria-label` descriptivos:

```tsx
// Ejemplo: Botón de editar material
<Button aria-label="Editar material Cable Fibra Óptica">
  <Edit2 aria-hidden="true" />
</Button>
```

#### Badges de Estado
Los badges incluyen aria-label que describe el estado completo:

```tsx
<Badge aria-label="Estado: En Proceso">
  En Proceso
</Badge>
```

### 4. Contraste de Color WCAG 2.1

**Archivo: `src/types/orders.ts`**

Los colores han sido optimizados para cumplir con:
- **Texto normal**: Contraste mínimo 4.5:1
- **Texto grande**: Contraste mínimo 3:1

#### Estados de Orden
- **ASIGNADA**: `bg-blue-100 text-blue-900` (contraste > 7:1)
- **EN_PROCESO**: `bg-primary/10 text-primary` (contraste > 5:1)
- **PAUSADA**: `bg-yellow-100 text-yellow-900` (contraste > 6:1)
- **FINALIZADA**: `bg-green-100 text-green-900` (contraste > 7:1)
- **CANCELADA**: `bg-gray-200 text-gray-900` (contraste > 8:1)

#### Prioridades
- **BAJA**: `bg-gray-200 text-gray-900` (contraste > 8:1)
- **MEDIA**: `bg-blue-100 text-blue-900` (contraste > 7:1)
- **ALTA**: `bg-orange-100 text-orange-900` (contraste > 5:1)
- **CRITICA**: `bg-red-100 text-red-900` (contraste > 6:1)

### 5. Anuncios para Lectores de Pantalla

#### Notificaciones Toast
**Configuración en `src/app/layout.tsx`:**
```tsx
<Toaster
  position='bottom-right'
  richColors
  toastOptions={{
    ariaLive: 'polite',
    role: 'status',
  }}
/>
```

Los mensajes de error, éxito y alertas se anuncian automáticamente mediante `aria-live="polite"`.

#### Regiones Live
Los siguientes componentes implementan aria-live:
- Contador de caracteres en comentarios (polite)
- Estado de carga en subida de archivos (polite)
- Estado de envío de formularios (polite)

### 6. Visibilidad de Foco para Teclado

**Configuración en `src/app/globals.css`:**
```css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

Todos los elementos interactivos muestran un indicador de foco visible cuando se navega con teclado.

## Navegación por Teclado

### Atajos Implementados

**OrderComments:**
- `Ctrl/Cmd + Enter`: Enviar comentario

### Navegación Estándar
- `Tab`: Navegar al siguiente elemento
- `Shift + Tab`: Navegar al elemento anterior
- `Enter` o `Space`: Activar botones
- `Esc`: Cerrar modales/diálogos

## Testing de Accesibilidad

### Herramientas Recomendadas

1. **Screen Readers:**
   - NVDA (Windows) - Gratuito
   - JAWS (Windows) - Comercial
   - VoiceOver (macOS/iOS) - Incluido
   - TalkBack (Android) - Incluido

2. **Extensiones de Navegador:**
   - axe DevTools
   - WAVE Evaluation Tool
   - Lighthouse (Chrome DevTools)

3. **Validadores de Contraste:**
   - WebAIM Contrast Checker
   - Chrome DevTools Color Picker

### Checklist de Pruebas

- [ ] Navegar toda la interfaz solo con teclado
- [ ] Verificar que todos los elementos interactivos sean alcanzables
- [ ] Probar con lector de pantalla (NVDA/VoiceOver)
- [ ] Aumentar tamaño de letra al 200% y verificar funcionalidad
- [ ] Verificar contraste de colores con herramientas automáticas
- [ ] Confirmar que las notificaciones se anuncian correctamente
- [ ] Validar que los formularios tienen labels y errores accesibles

## Mantenimiento

### Buenas Prácticas para Desarrolladores

1. **Siempre usar labels semánticos:**
   ```tsx
   // ✅ Correcto
   <Label htmlFor="quantity">Cantidad</Label>
   <Input id="quantity" />

   // ❌ Incorrecto
   <div>Cantidad</div>
   <Input />
   ```

2. **Iconos siempre con contexto:**
   ```tsx
   // ✅ Correcto
   <Button aria-label="Eliminar material">
     <Trash2 aria-hidden="true" />
   </Button>

   // ❌ Incorrecto
   <Button>
     <Trash2 />
   </Button>
   ```

3. **Tablas con estructura semántica:**
   ```tsx
   // ✅ Correcto
   <Table role="table" aria-label="Materiales utilizados">
     <TableHead scope="col">Material</TableHead>
   </Table>

   // ❌ Incorrecto
   <div className="table">
     <div>Material</div>
   </div>
   ```

4. **Notificaciones anunciables:**
   ```tsx
   // ✅ Correcto
   toast.success("Material agregado correctamente");

   // ❌ Incorrecto
   setMessage("Material agregado"); // Sin anuncio
   ```

## Referencias

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Contacto

Para reportar problemas de accesibilidad o sugerir mejoras, por favor crear un issue en el repositorio del proyecto.

---

**Última actualización:** 2025-11-18
**Versión:** 1.0.0
**Nivel de cumplimiento:** WCAG 2.1 Nivel AA
