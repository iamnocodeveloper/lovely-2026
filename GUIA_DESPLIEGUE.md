# 🚀 Guía de Despliegue - siaprendi.com/lovely/

## ✅ Configuración Actualizada

Tu aplicación ahora está configurada para desplegarse en: `https://siaprendi.com/lovely/`

## 📦 Archivos Listos para Subir

Todo está en la carpeta `dist/`:
```
dist/
├── .htaccess          ← Configuración para SPA routing
├── check.html         ← Herramienta de diagnóstico
├── index.html         ← Tu aplicación
└── assets/
    ├── index-Bh1i69Wo.js   ← JavaScript
    └── index-Ct-D1q5S.css  ← Estilos
```

## 🎯 Pasos para Subir a cPanel

### 1. Accede a cPanel
- Ve a tu panel de control de hosting
- Abre "Administrador de Archivos" (File Manager)

### 2. Navega a la carpeta correcta
- Ve a `public_html/lovely/`
- **Si la carpeta `lovely` no existe, créala**

### 3. Limpia archivos antiguos
- **IMPORTANTE:** Elimina TODOS los archivos antiguos en `public_html/lovely/`
- Esto evita conflictos con versiones anteriores

### 4. Sube los archivos nuevos
- Haz clic en "Upload" (Subir)
- Selecciona TODOS los archivos de tu carpeta local:
  `c:\Users\joeld\OneDrive\Escritorio\salon colombia\lovely\dist\`
  
  Específicamente:
  - ✅ `index.html`
  - ✅ `.htaccess`
  - ✅ `check.html`
  - ✅ La carpeta completa `assets/` con sus archivos

### 5. Verifica la estructura
Tu carpeta `public_html/lovely/` debe verse así:

```
public_html/lovely/
├── index.html
├── .htaccess
├── check.html
└── assets/
    ├── index-Bh1i69Wo.js
    └── index-Ct-D1q5S.css
```

**NO debe ser:**
```
❌ public_html/lovely/dist/index.html  (INCORRECTO)
```

## ✅ Verificación

### Paso 1: Verifica que los archivos existan
Visita: `https://siaprendi.com/lovely/check.html`

- Haz clic en cada enlace
- Si ves código JavaScript/CSS → ✅ ¡Perfecto!
- Si ves 404 → ❌ Los archivos no están en el lugar correcto

### Paso 2: Prueba tu aplicación
Visita: `https://siaprendi.com/lovely/`

- Deberías ver tu aplicación funcionando
- No debería haber errores 404 en la consola
- La pantalla NO debe estar en blanco

## 🔧 Solución de Problemas

### Problema: Sigo viendo pantalla en blanco
**Solución:**
1. Presiona F12 para abrir la consola del navegador
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Comparte una captura de pantalla de los errores

### Problema: Error 404 en los assets
**Solución:**
1. Verifica que la carpeta `assets` esté dentro de `public_html/lovely/`
2. Verifica que los archivos JS y CSS estén dentro de `assets/`
3. Revisa los permisos de archivos (644 para archivos, 755 para carpetas)

### Problema: La página carga pero está en blanco sin errores
**Solución:**
1. Verifica que las variables de entorno estén configuradas
2. Revisa si hay errores de JavaScript en la consola
3. Verifica la configuración de Supabase

## 📝 Notas Importantes

- ✅ Los archivos ahora usan rutas `/lovely/assets/...`
- ✅ El `.htaccess` está configurado para el subdirectorio
- ✅ Todo está listo para subir directamente

## 🆘 ¿Necesitas Ayuda?

Si después de subir los archivos sigues teniendo problemas:

1. Toma una captura de pantalla de:
   - La consola del navegador (F12 → Console)
   - El administrador de archivos de cPanel mostrando `public_html/lovely/`

2. Visita `https://siaprendi.com/lovely/check.html` y comparte qué ves

¡Estoy aquí para ayudarte! 🚀
