const express = require("express");
const cors = require("cors");
const { version } = require("mongoose");

const app = express();
const port = 3900;

app.use(cors());
const conection = require("./database/conection");
conection();
const eventosRoutes = require("./routes/eventos.routes");
const participanteRoutes = require("./routes/participante.routes");
const equipoRoutes = require("./routes/equipo.routes");
const eventoCulturalRoutes = require("./routes/eventoCultural.routes");
const grupoMusicalRoutes = require("./routes/grupoMusical.routes");
const conciertoRoutes = require("./routes/concierto.routes");
const conferenciaRoutes = require("./routes/conferencia.routes");
const ponenteRoutes = require("./routes/ponente.routes");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/eventos", eventosRoutes);
app.use("/api/participantes", participanteRoutes);
app.use("/api/equipos", equipoRoutes);
app.use("/api/eventos-culturales", eventoCulturalRoutes);
app.use("/api/grupos-musicales", grupoMusicalRoutes);
app.use("/api/conciertos", conciertoRoutes);
app.use("/api/conferencias", conferenciaRoutes);
app.use("/api/ponentes", ponenteRoutes);
app.get("/", (req, res) => {
  return res.status(200).send(
    `
        <h1>Hola</h1>
    `
  );
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
