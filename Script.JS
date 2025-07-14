let data = [];
let aprobadas = [];

function cargarDatos() {
  fetch("data.json")
    .then(response => response.json())
    .then(json => {
      data = json;
      renderMalla();
    });
}

function cambiarEstado(nombre) {
  const ramo = data.find(r => r.nombre === nombre);
  if (ramo.estado === "pendiente") ramo.estado = "aprobado";
  else if (ramo.estado === "aprobado") ramo.estado = "pendiente";
  renderMalla();
}

function renderMalla() {
  const malla = document.getElementById("malla");
  malla.innerHTML = "";

  const semestres = [...new Set(data.map(r => r.semestre))].sort((a, b) => a - b);

  semestres.forEach(sem => {
    const container = document.createElement("div");
    container.className = "semestre";
    container.innerHTML = `<h3>Semestre ${sem}</h3>`;

    const ramos = data.filter(r => r.semestre === sem);
    ramos.forEach(ramo => {
      const requisitosOK = ramo.prerrequisitos.every(pr => data.find(r => r.nombre === pr && r.estado === "aprobado"));
      const estado = ramo.estado === "aprobado" ? "aprobado" : requisitosOK ? "disponible" : "pendiente";

      const div = document.createElement("div");
      div.className = `ramo ${estado}`;
      div.innerHTML = `
        <strong>${ramo.nombre}</strong><br>
        <em>Prerrequisitos: ${ramo.prerrequisitos.join(", ") || "Ninguno"}</em><br>
        <button onclick="cambiarEstado('${ramo.nombre}')">
          ${estado === "aprobado" ? "Marcar como pendiente" : "Marcar como aprobado"}
        </button>
      `;
      container.appendChild(div);
    });

    malla.appendChild(container);
  });
}

cargarDatos();
