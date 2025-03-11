const express = require("express");
const cors = require("cors");
const path = require("path");
const empresas = require("./empresas");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: "GET, POST",
  allowedHeaders: "Content-Type"
}));

// 📌 Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// 📌 Definir la ruta raíz para servir `index.html`
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



// 📌 Función para calcular los datos desde el EPC
function calcularDatos(epc) {
  if (!epc || epc.length !== 20) {
    return { error: "EPC inválido" };
  }

  try {
    const dorsalExt = parseInt(epc.substring(4, 8), 16) + (parseInt(epc.substring(16, 18), 16) * parseInt(epc.substring(4, 8), 16));
    const dorsal = parseInt(epc.substring(4, 8), 16);
    const carrera = parseInt(epc.substring(8, 16), 16);
    const empresaCodigo = parseInt(epc.substring(0, 4), 16);
    const empresaNombre = empresas[empresaCodigo] || "No encontrada";
    const empresa = `${empresaCodigo} - ${empresaNombre}`;

    return { epc, dorsalExt, dorsal, empresa, carrera };
  } catch (error) {
    return { error: error.message };
  }
}

// 📌 Ruta API para procesar el EPC
app.post("/calcular", (req, res) => {
  const { epc } = req.body;
  const resultado = calcularDatos(epc);
  res.json(resultado);
});

// 📌 Iniciar el servidor
const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
