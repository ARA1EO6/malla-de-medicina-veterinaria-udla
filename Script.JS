let data = [];

function cargarDatos() {
  fetch("data.json")
    .then(response => response.json())
    .then(json => {
      data = json;
      renderMalla();
    })
    .catch(error => {
      console.error("Error cargando data.json:", error);
    });
}

function cambiarEstado(nombre) {
  const ramo = data.find(r => r.nombre === nombre);
  if (!ramo) return;
  ramo.estado = ramo.estado === "aprobado" ? "pendiente" : "aprobado";
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
      // Manejo seguro de prerrequisitos
      const prerrequisitos = ramo.prerrequisitos || [];
      const requisitosOK = prerrequisitos.every(pr =>
        data.find(r => r.nombre === pr && r.estado === "aprobado")
      );
      let estado;
      if (ramo.estado === "aprobado") estado = "aprobado";
      else if (requisitosOK) estado = "disponible";
      else estado = "pendiente";

      const div = document.createElement("div");
      div.className = `ramo ${estado}`;
      div.innerHTML = `
        <strong>${ramo.nombre}</strong><br>
        <em>Prerrequisitos: ${prerrequisitos.join(", ") || "Ninguno"}</em><br>
      `;
      const btn = document.createElement("button");
      btn.textContent = estado === "aprobado" ? "Marcar como pendiente" : "Marcar como aprobado";
      btn.onclick = () => cambiarEstado(ramo.nombre);
      div.appendChild(btn);

      container.appendChild(div);
    });

    malla.appendChild(container);
  });
}

// Ejecutar al cargar la página
cargarDatos();
