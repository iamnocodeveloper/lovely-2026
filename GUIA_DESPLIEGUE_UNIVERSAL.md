# 🚀 Guía de Despliegue Universal - Funciona en Cualquier Ruta

## ✨ Ventaja: Despliegue Flexible

Tu aplicación ahora usa **rutas relativas** (`./assets/...` en lugar de `/assets/...`).

**Esto significa que funcionará en CUALQUIER ubicación sin necesidad de reconstruir:**
- ✅ `siaprendi.com` (raíz)
- ✅ `siaprendi.com/lovely/` (subdirectorio)
- ✅ `siaprendi.com/app/` (otro subdirectorio)
- ✅ `app.siaprendi.com` (subdominio)
- ✅ Cualquier carpeta que elijas

## 📦 Archivos Listos para Subir

Todo está en la carpeta `dist/`:
```
dist/
├── .htaccess          ← SPA routing universal
├── check.html         ← Herramienta de verificación
├── index.html         ← Tu aplicación
└── assets/
    ├── index-Bh1i69Wo.js   ← JavaScript
    └── index-Ct-D1q5S.css  ← Estilos
```

## 🎯 Pasos para Subir a cPanel

### Opción A: Desplegar en la Raíz (siaprendi.com)

1. **Accede a cPanel** → Administrador de Archivos
2. **Ve a** `public_html/`
3. **Elimina archivos antiguos** (haz backup si es necesario)
4. **Sube TODOS los archivos** de `dist/`:
   - `index.html`
   - `.htaccess`
   - `check.html`
   - Carpeta `assets/` completa
5. **Visita** `https://siaprendi.com`

### Opción B: Desplegar en Subdirectorio (siaprendi.com/lovely/)

1. **Accede a cPanel** → Administrador de Archivos
2. **Ve a** `public_html/`
3. **Crea carpeta** `lovely` (si no existe)
4. **Entra a** `public_html/lovely/`
5. **Elimina archivos antiguos** en esa carpeta
6. **Sube TODOS los archivos** de `dist/`:
   - `index.html`
   - `.htaccess`
   - `check.html`
   - Carpeta `assets/` completa
7. **Visita** `https://siaprendi.com/lovely/`

### Opción C: Desplegar en Cualquier Otra Ubicación

Simplemente sube los archivos a la carpeta que quieras y funcionará automáticamente.

## ⚠️ Importante: Estructura Correcta

**✅ CORRECTO:**
```
public_html/[tu-carpeta]/
├── index.html
├── .htaccess
├── check.html
└── assets/
    ├── index-Bh1i69Wo.js
    └── index-Ct-D1q5S.css
```

**❌ INCORRECTO:**
```
public_html/[tu-carpeta]/dist/
├── index.html
└── assets/...
```

**Sube el CONTENIDO de `dist/`, NO la carpeta `dist/` completa.**

## ✅ Verificación

### Paso 1: Verifica los archivos
Visita: `https://siaprendi.com/[tu-carpeta]/check.html`

Ejemplos:
- Si subiste a raíz: `https://siaprendi.com/check.html`
- Si subiste a /lovely/: `https://siaprendi.com/lovely/check.html`

Haz clic en los enlaces:
- ✅ Si ves código JavaScript/CSS → ¡Archivos correctos!
- ❌ Si ves 404 → Los archivos no están bien ubicados

### Paso 2: Prueba tu aplicación
Visita la URL donde subiste los archivos:
- `https://siaprendi.com/` (si subiste a raíz)
- `https://siaprendi.com/lovely/` (si subiste a /lovely/)

## 🔧 Solución de Problemas

### Problema: Sigo viendo 404 en los assets

**Causa:** Los archivos no están en la ubicación correcta.

**Solución:**
1. Verifica en cPanel que la estructura sea correcta
2. Asegúrate de que la carpeta `assets` esté al mismo nivel que `index.html`
3. Verifica permisos: 755 para carpetas, 644 para archivos

### Problema: Pantalla en blanco sin errores 404

**Causa:** Problema con variables de entorno o JavaScript.

**Solución:**
1. Presiona F12 → Console
2. Busca errores en rojo
3. Verifica que las credenciales de Supabase estén configuradas

### Problema: Error "Failed to fetch" o CORS

**Causa:** Configuración de API o red.

**Solución:**
1. Verifica que las variables de entorno estén correctas
2. Revisa la configuración de Supabase
3. Verifica que el dominio esté permitido en Supabase

## 🎉 Ventajas de Esta Configuración

1. **Flexibilidad Total:** Sube a cualquier carpeta sin reconstruir
2. **Fácil Migración:** Mueve los archivos entre carpetas sin problemas
3. **Testing Simple:** Prueba en diferentes ubicaciones fácilmente
4. **Sin Configuración:** No necesitas cambiar nada en el código

## 📝 Resumen Rápido

```bash
# Ubicación de archivos locales
c:\Users\joeld\OneDrive\Escritorio\salon colombia\lovely\dist\

# Dónde subir en cPanel (elige UNA opción):
# Opción 1: Raíz
public_html/

# Opción 2: Subdirectorio
public_html/lovely/

# Opción 3: Cualquier otra carpeta
public_html/[nombre-que-quieras]/
```

## 🆘 ¿Necesitas Ayuda?

Si después de subir los archivos sigues teniendo problemas:

1. **Toma capturas de pantalla de:**
   - La consola del navegador (F12 → Console)
   - El administrador de archivos de cPanel mostrando la carpeta donde subiste

2. **Visita check.html** y comparte qué ves

3. **Comparte la URL exacta** donde subiste los archivos

¡Estoy aquí para ayudarte! 🚀
