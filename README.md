# Monster Mouth Scanner

## Descripción
Aplicación interactiva con temática Halloween que utiliza la cámara para detectar la apertura de la boca. Al abrirla, se activa una “limpieza” con burbujas, animaciones y una barra de progreso.

Desarrollada con p5.js y ml5 (FaceMesh) y ejecutada como aplicación de escritorio mediante Electron.

---

## Tecnologías
- p5.js
- ml5.js (FaceMesh)
- JavaScript, HTML, CSS
- Electron

---

## Ejecución

1. Abrir una terminal
2. Ir a la carpeta del proyecto
3. Entrar en la carpeta electron:

cd electron

4. Instalar dependencias:

npm install

5. Ejecutar la aplicación:

npm start

---

## Estructura

/ (raíz)
├── index.html
├── sketch.js
├── style.css
├── spooky.mp3
├── image.jpg
├── Creepster-Regular.ttf
├── README.md
└── electron/
    ├── main.js
    ├── package.json

---

## Funcionamiento
- Se inicia la app y se solicita acceso a la cámara
- Se detecta la cara y la posición de la boca
- Al abrir la boca:
  - Se generan burbujas
  - Aparecen animaciones de limpieza
  - La barra de progreso aumenta
- Al llegar al 100% se muestra un mensaje de limpieza completada

---

## Recursos
- Fuente: Google Fonts (Rubik Wet Paint) - https://fonts.google.com/specimen/Rubik+Wet+Paint?query=halloween
- Sonido: efecto ambiente Halloween - https://pixabay.com/es/sound-effects/search/ghost/
- Librería FaceMesh (ml5.js)

---

## Autor
Juan Antonio Núñez