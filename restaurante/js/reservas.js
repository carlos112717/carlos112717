// ===== Configuración del restaurante =====
const CONFIG = {
    diasCerrado: [1],                 // 0 = domingo, 1 = lunes...
    turnos: [                         // horas de inicio disponibles
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
    ],
    capacidadPorTurno: 20,            // máximo de comensales por franja horaria
    maxPersonas: 12,
    diasAnticipacion: 60
};

const CLAVE_STORAGE = "reservas-restaurante";

// ===== Almacenamiento (localStorage) =====
// Nota: sin servidor, las reservas se guardan solo en este navegador.
function leerReservas() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
    } catch {
        return [];
    }
}

function guardarReservas(reservas) {
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(reservas));
        return true;
    } catch {
        return false;
    }
}

// ===== Utilidades de fecha =====
function fechaISO(d) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${dia}`;
}

function parsearFecha(iso) {
    const [a, m, d] = iso.split("-").map(Number);
    return new Date(a, m - 1, d);
}

function formatearFecha(iso) {
    return parsearFecha(iso).toLocaleDateString("es-CO", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
}

function generarCodigo() {
    const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let codigo = "";
    for (let i = 0; i < 6; i++) codigo += letras[Math.floor(Math.random() * letras.length)];
    return codigo;
}

function personasEnTurno(fecha, hora, reservas) {
    return reservas
        .filter(r => r.fecha === fecha && r.hora === hora)
        .reduce((total, r) => total + r.personas, 0);
}

// ===== Página de reservas =====
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-reserva");
    const inputFecha = document.getElementById("fecha");
    const inputPersonas = document.getElementById("personas");
    const contHoras = document.getElementById("horas");
    const ayudaHoras = document.getElementById("ayuda-horas");
    const mensaje = document.getElementById("mensaje");
    const listaMias = document.getElementById("mis-reservas");
    let horaSeleccionada = null;

    // Límites del calendario
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + CONFIG.diasAnticipacion);
    inputFecha.min = fechaISO(hoy);
    inputFecha.max = fechaISO(limite);
    inputPersonas.max = CONFIG.maxPersonas;

    // ----- Franjas horarias -----
    function pintarHoras() {
        contHoras.innerHTML = "";
        horaSeleccionada = null;
        const fecha = inputFecha.value;

        if (!fecha) {
            ayudaHoras.textContent = "Selecciona primero una fecha.";
            return;
        }

        const dia = parsearFecha(fecha).getDay();
        if (CONFIG.diasCerrado.includes(dia)) {
            ayudaHoras.textContent = "Los lunes el restaurante permanece cerrado. Elige otro día.";
            return;
        }

        const reservas = leerReservas();
        const personas = Number(inputPersonas.value) || 1;
        const esHoy = fecha === fechaISO(new Date());
        const ahora = new Date();
        let disponibles = 0;

        CONFIG.turnos.forEach(hora => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "hora";
            btn.textContent = hora;

            const [h, m] = hora.split(":").map(Number);
            const yaPaso = esHoy && (h * 60 + m) <= (ahora.getHours() * 60 + ahora.getMinutes() + 30);
            const sinCupo = personasEnTurno(fecha, hora, reservas) + personas > CONFIG.capacidadPorTurno;

            if (yaPaso || sinCupo) {
                btn.disabled = true;
                btn.title = yaPaso ? "Horario no disponible" : "Sin cupo para ese número de personas";
            } else {
                disponibles++;
                btn.addEventListener("click", () => {
                    horaSeleccionada = hora;
                    contHoras.querySelectorAll(".hora").forEach(b =>
                        b.classList.toggle("seleccionada", b === btn));
                    limpiarError("hora");
                });
            }
            contHoras.appendChild(btn);
        });

        ayudaHoras.textContent = disponibles > 0
            ? "Almuerzo 12:00–15:00 · Cena 19:00–22:00"
            : "No quedan horarios disponibles para esta fecha.";
    }

    inputFecha.addEventListener("change", () => { limpiarError("fecha"); pintarHoras(); });
    inputPersonas.addEventListener("change", pintarHoras);

    // ----- Validación -----
    function mostrarError(campo, texto) {
        const cont = document.querySelector(`[data-campo="${campo}"]`);
        cont.classList.add("invalido");
        cont.querySelector(".error").textContent = texto;
    }

    function limpiarError(campo) {
        const cont = document.querySelector(`[data-campo="${campo}"]`);
        cont.classList.remove("invalido");
        cont.querySelector(".error").textContent = "";
    }

    function validar(datos) {
        let valido = true;
        ["nombre", "email", "telefono", "personas", "fecha", "hora"].forEach(limpiarError);

        if (datos.nombre.length < 3) {
            mostrarError("nombre", "Escribe tu nombre completo."); valido = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
            mostrarError("email", "Escribe un correo válido."); valido = false;
        }
        if (!/^[0-9+\s-]{7,15}$/.test(datos.telefono)) {
            mostrarError("telefono", "Escribe un teléfono válido (7 a 15 dígitos)."); valido = false;
        }
        if (!(datos.personas >= 1 && datos.personas <= CONFIG.maxPersonas)) {
            mostrarError("personas", `Entre 1 y ${CONFIG.maxPersonas} personas. Para grupos más grandes llámanos.`);
            valido = false;
        }
        if (!datos.fecha) {
            mostrarError("fecha", "Selecciona una fecha."); valido = false;
        } else if (datos.fecha < inputFecha.min || datos.fecha > inputFecha.max) {
            mostrarError("fecha", "La fecha está fuera del rango permitido."); valido = false;
        } else if (CONFIG.diasCerrado.includes(parsearFecha(datos.fecha).getDay())) {
            mostrarError("fecha", "Ese día estamos cerrados."); valido = false;
        }
        if (!datos.hora) {
            mostrarError("hora", "Selecciona un horario."); valido = false;
        }
        return valido;
    }

    function mostrarMensaje(texto, tipo) {
        mensaje.textContent = texto;
        mensaje.className = `mensaje visible ${tipo}`;
        mensaje.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // ----- Envío -----
    form.addEventListener("submit", e => {
        e.preventDefault();
        mensaje.className = "mensaje";

        const datos = {
            nombre: form.nombre.value.trim(),
            email: form.email.value.trim(),
            telefono: form.telefono.value.trim(),
            personas: Number(form.personas.value),
            fecha: form.fecha.value,
            hora: horaSeleccionada,
            ocasion: form.ocasion.value,
            comentarios: form.comentarios.value.trim()
        };

        if (!validar(datos)) {
            mostrarMensaje("Revisa los campos marcados en rojo.", "fallo");
            return;
        }

        const reservas = leerReservas();
        // Vuelve a comprobar el cupo por si cambió entre la selección y el envío
        if (personasEnTurno(datos.fecha, datos.hora, reservas) + datos.personas > CONFIG.capacidadPorTurno) {
            mostrarMensaje("Lo sentimos, ese horario se acaba de llenar. Elige otro.", "fallo");
            pintarHoras();
            return;
        }

        const reserva = { ...datos, codigo: generarCodigo(), creada: new Date().toISOString() };
        reservas.push(reserva);

        if (!guardarReservas(reservas)) {
            mostrarMensaje("No pudimos guardar la reserva en este navegador. Llámanos para reservar.", "fallo");
            return;
        }

        mostrarMensaje(
            `¡Listo, ${datos.nombre.split(" ")[0]}! Tu mesa para ${datos.personas} ` +
            `${datos.personas === 1 ? "persona" : "personas"} quedó reservada el ` +
            `${formatearFecha(datos.fecha)} a las ${datos.hora}. Código: ${reserva.codigo}`,
            "exito"
        );

        form.reset();
        pintarHoras();
        pintarMisReservas();
    });

    // ----- Mis reservas -----
    function pintarMisReservas() {
        const hoyISO = fechaISO(new Date());
        const proximas = leerReservas()
            .filter(r => r.fecha >= hoyISO)
            .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

        listaMias.innerHTML = "";

        if (proximas.length === 0) {
            listaMias.innerHTML = '<li class="ayuda">Aún no tienes reservas próximas.</li>';
            return;
        }

        proximas.forEach(r => {
            const li = document.createElement("li");
            li.className = "reserva-item";

            const detalle = document.createElement("div");
            detalle.className = "detalle";
            const titulo = document.createElement("strong");
            titulo.textContent = `${formatearFecha(r.fecha)} · ${r.hora}`;
            const sub = document.createElement("span");
            sub.textContent = `${r.nombre} · ${r.personas} ${r.personas === 1 ? "persona" : "personas"}`;
            const codigo = document.createElement("span");
            codigo.className = "codigo";
            codigo.textContent = `Código ${r.codigo}`;
            detalle.append(titulo, sub, codigo);

            const cancelar = document.createElement("button");
            cancelar.type = "button";
            cancelar.className = "boton boton-secundario boton-pequeno";
            cancelar.textContent = "Cancelar";
            cancelar.addEventListener("click", () => {
                if (!confirm(`¿Cancelar la reserva ${r.codigo}?`)) return;
                guardarReservas(leerReservas().filter(x => x.codigo !== r.codigo));
                pintarMisReservas();
                pintarHoras();
            });

            li.append(detalle, cancelar);
            listaMias.appendChild(li);
        });
    }

    pintarHoras();
    pintarMisReservas();
});
