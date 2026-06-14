# Atlas Canarias — Maqueta web

Rediseño sobrio (azul / blanco) de la web de Atlas Canarias. Proyecto estático,
sin dependencias ni build: solo HTML, CSS y JavaScript.

## Estructura

```
atlas-canarias/
├── index.html            ← Inicio
├── nosotros.html         ← Nosotros
├── aire-comprimido.html  ← Soluciones de aire comprimido
├── manipulacion.html     ← Carretillas / manipulación de carga
├── vacio-gases.html      ← Vacío y generación de gases
├── contacto.html         ← Contacto (con formulario de demo)
├── css/
│   └── styles.css        ← TODOS los estilos (paleta editable arriba del todo)
├── js/
│   └── main.js           ← Menú, animaciones y formulario
└── assets/               ← (para tus imágenes/logo propios)
```

## Cómo verlo en localhost (VS Code)

1. Abre la carpeta `atlas-canarias` en VS Code.
2. Instala la extensión **Live Server** (de Ritwick Dey).
3. Clic derecho sobre `index.html` → **Open with Live Server**.
4. Se abre en `http://127.0.0.1:5500` y se recarga solo al guardar.

(Alternativa rápida sin extensión: doble clic en `index.html` y se abre en el navegador.)

## Editar lo importante

- **Colores y tipografías:** todo está en el bloque `:root` al principio de
  `css/styles.css`. Cambia ahí los azules y se actualiza toda la web.
- **Logo:** ahora se usa el logo real alojado en la web de Atlas. Si tienes el
  archivo en mejor calidad, mételo en `assets/` y cambia el `src` del logo en la
  cabecera de cada página (busca `logo-pill`) y en el pie (`f-logo`).
- **Imágenes:** las fotos se cargan desde la web actual de Atlas. Para que la
  maqueta funcione 100% sin internet, descárgalas a `assets/` y cambia los `src`.
- **Formulario:** es una demo (no envía datos). Para activarlo de verdad, conecta
  el `<form>` de `contacto.html` a un servicio como Formspree o a vuestro CRM.

## Notas

- Responsive (móvil incluido), accesible (foco de teclado, `prefers-reduced-motion`).
- Textos y datos basados en el contenido real de atlascanarias.es.
```
