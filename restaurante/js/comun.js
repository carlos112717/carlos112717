// Navegación móvil (botón hamburguesa) y año del pie de página
document.addEventListener("DOMContentLoaded", () => {
    const boton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (boton && nav) {
        boton.addEventListener("click", () => {
            const abierto = nav.classList.toggle("abierto");
            boton.setAttribute("aria-expanded", abierto);
        });
    }

    const anio = document.getElementById("anio");
    if (anio) anio.textContent = new Date().getFullYear();
});
