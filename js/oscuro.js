const botonModo = document.getElementById("modo-btn");
const cuerpo = document.body;

const modoGuardado = localStorage.getItem("modo");

if (modoGuardado === "oscuro") {
    cuerpo.classList.add("oscuro");
    botonModo.textContent = "Desactivar modo oscuro";
}

botonModo.addEventListener("click", () => {
    cuerpo.classList.toggle("oscuro");

    if (cuerpo.classList.contains("oscuro")) {
        botonModo.textContent = "Desactivar modo oscuro";
        localStorage.setItem("modo", "oscuro");
    } else {
        botonModo.textContent = "Activar modo oscuro";
        localStorage.setItem("modo", "claro");
    }
})