// ===== Datos del menú =====
// Para agregar o modificar platos basta con editar este arreglo.
const PLATOS = [
    // Entradas
    { nombre: "Empanadas de carne", categoria: "entradas", precio: 12000,
      descripcion: "Tres empanadas crujientes rellenas de carne y papa, con ají casero.",
      imagen: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=70",
      etiquetas: ["Casero"] },
    { nombre: "Ceviche de camarón", categoria: "entradas", precio: 24000,
      descripcion: "Camarones marinados en limón, cebolla morada, cilantro y aguacate.",
      imagen: "https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&q=70",
      etiquetas: ["Picante"] },
    { nombre: "Patacones con hogao", categoria: "entradas", precio: 10000,
      descripcion: "Plátano verde frito servido con hogao tradicional.",
      imagen: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=70",
      etiquetas: ["Vegano"] },

    // Platos fuertes
    { nombre: "Bandeja paisa", categoria: "fuertes", precio: 38000,
      descripcion: "Frijoles, arroz, carne molida, chicharrón, chorizo, huevo, plátano y arepa.",
      imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=70",
      etiquetas: ["Especialidad"] },
    { nombre: "Salmón a la parrilla", categoria: "fuertes", precio: 46000,
      descripcion: "Filete de salmón con vegetales salteados y puré de papa criolla.",
      imagen: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=70",
      etiquetas: [] },
    { nombre: "Lomo al trapo", categoria: "fuertes", precio: 52000,
      descripcion: "Lomo de res cocido en sal y tela, con papas al romero y chimichurri.",
      imagen: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=70",
      etiquetas: ["Especialidad"] },
    { nombre: "Risotto de champiñones", categoria: "fuertes", precio: 34000,
      descripcion: "Arroz cremoso con mezcla de hongos, parmesano y aceite de trufa.",
      imagen: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=70",
      etiquetas: ["Vegetariano"] },
    { nombre: "Bowl de quinoa", categoria: "fuertes", precio: 29000,
      descripcion: "Quinoa, garbanzos asados, aguacate, vegetales frescos y aderezo de tahini.",
      imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=70",
      etiquetas: ["Vegano"] },

    // Postres
    { nombre: "Tres leches", categoria: "postres", precio: 14000,
      descripcion: "Bizcocho húmedo bañado en tres leches con merengue y canela.",
      imagen: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=70",
      etiquetas: ["Casero"] },
    { nombre: "Brownie con helado", categoria: "postres", precio: 15000,
      descripcion: "Brownie tibio de chocolate con helado de vainilla y salsa de frutos rojos.",
      imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=70",
      etiquetas: [] },

    // Bebidas
    { nombre: "Limonada de coco", categoria: "bebidas", precio: 9000,
      descripcion: "Limonada frappé con crema de coco.",
      imagen: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=70",
      etiquetas: ["Vegano"] },
    { nombre: "Jugo natural", categoria: "bebidas", precio: 7000,
      descripcion: "Mango, maracuyá, mora o lulo. En agua o en leche.",
      imagen: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=70",
      etiquetas: [] },
    { nombre: "Café de origen", categoria: "bebidas", precio: 6000,
      descripcion: "Café colombiano de especialidad, preparado en método filtrado.",
      imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=70",
      etiquetas: ["Vegano"] }
];

const CATEGORIAS = {
    todos: "Todos",
    entradas: "Entradas",
    fuertes: "Platos fuertes",
    postres: "Postres",
    bebidas: "Bebidas"
};

const formatoPrecio = new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
});

// ===== Renderizado =====
document.addEventListener("DOMContentLoaded", () => {
    const contFiltros = document.getElementById("filtros");
    const lista = document.getElementById("lista-platos");
    const buscador = document.getElementById("buscador");
    let categoriaActual = "todos";

    // Botones de categoría
    Object.entries(CATEGORIAS).forEach(([clave, texto]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "filtro" + (clave === categoriaActual ? " activo" : "");
        btn.textContent = texto;
        btn.dataset.categoria = clave;
        btn.addEventListener("click", () => {
            categoriaActual = clave;
            contFiltros.querySelectorAll(".filtro").forEach(b =>
                b.classList.toggle("activo", b === btn));
            pintar();
        });
        contFiltros.appendChild(btn);
    });

    buscador.addEventListener("input", pintar);

    function normalizar(texto) {
        return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    }

    function claseEtiqueta(et) {
        const e = normalizar(et);
        if (e === "vegano" || e === "vegetariano") return "etiqueta vegano";
        if (e === "picante") return "etiqueta picante";
        return "etiqueta";
    }

    function pintar() {
        const termino = normalizar(buscador.value.trim());
        const filtrados = PLATOS.filter(p =>
            (categoriaActual === "todos" || p.categoria === categoriaActual) &&
            (termino === "" ||
             normalizar(p.nombre).includes(termino) ||
             normalizar(p.descripcion).includes(termino))
        );

        lista.innerHTML = "";

        if (filtrados.length === 0) {
            lista.innerHTML = '<p class="sin-resultados">No encontramos platos con esa búsqueda.</p>';
            return;
        }

        filtrados.forEach(p => {
            const art = document.createElement("article");
            art.className = "plato";
            art.innerHTML = `
                <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'img-respaldo',textContent:'🍽️'}))">
                <div class="cuerpo">
                    <div class="fila">
                        <h3>${p.nombre}</h3>
                        <span class="precio">${formatoPrecio.format(p.precio)}</span>
                    </div>
                    <p>${p.descripcion}</p>
                    <div class="etiquetas">
                        <span class="etiqueta">${CATEGORIAS[p.categoria]}</span>
                        ${p.etiquetas.map(e => `<span class="${claseEtiqueta(e)}">${e}</span>`).join("")}
                    </div>
                </div>`;
            lista.appendChild(art);
        });
    }

    pintar();
});
