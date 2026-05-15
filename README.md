# ISARACK Instaladores - PWA

App móvil para instaladores. Lee desde Supabase los pedidos asignados.

## Archivos
- `index.html` — la app completa
- `manifest.json` — config para que se instale como app
- `sw.js` — service worker (funcionamiento offline básico)
- `icon-192.png` y `icon-512.png` — iconos

## Códigos de instaladores (cámbialos si quieres)
| Nombre | Celular | Código |
|---|---|---|
| Brayan Alexis | 6123090644 | 1234 |
| Jonas Sañudo | 6563549469 | 5678 |
| Gilberto Rodriguez | 6642323708 | 2323 |
| Oscar Ochoa | 6642271617 | 2271 |
| Israel Mendez | 6646705293 | 7052 |
| Isaac Romero | 6644211088 | 2110 |
| Samuel A. Gomez | 6635223207 | 5232 |

## Deploy
1. Crear repo nuevo en GitHub: `isarack-instaladores`
2. Subir los 5 archivos
3. Conectar a Vercel
4. Listo en `isarack-instaladores.vercel.app`

## Cómo usan los instaladores
1. Abren `isarack-instaladores.vercel.app` en su celular
2. Entran con celular + código
3. El navegador les pregunta si quieren instalar la app
4. Tap "Instalar" → aparece icono naranja en su pantalla
5. Ya pueden abrir como app normal
