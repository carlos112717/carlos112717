### Hi there 👋

<!--
**carlos112717/carlos112717** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...Actualmente me encuentro trabajando en el lo subi por temas de enlaces para la universidad 
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->

## 🍽️ Restaurante "Sabor de Casa"

Sitio web en la carpeta [`restaurante/`](restaurante/) hecho con HTML, CSS y JavaScript (sin dependencias):

- **Inicio** (`index.html`): portada y presentación del restaurante.
- **Menú** (`menu.html`): platos con foto, descripción y precio; filtro por categoría y buscador. Los platos se editan en `js/menu.js`.
- **Reservas** (`reservas.html`): formulario con validación, horarios disponibles según el día y el cupo, código de confirmación y lista de "Mis reservas" con opción de cancelar. El horario y la capacidad se configuran en `js/reservas.js`.

> Las reservas se guardan en el `localStorage` del navegador (no hay servidor), así que solo las ve quien las hizo en ese navegador.

Para verlo: abrir `restaurante/index.html` en el navegador.
