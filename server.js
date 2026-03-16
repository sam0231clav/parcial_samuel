const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();

app.use(express.static('public'));  // Sirve los HTML automáticamente
// Redirigir raíz a login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});
app.use(cors());
app.use(express.json());

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario=$1 AND password=$2",
      [usuario, password]
    );
    res.json({ success: result.rows.length > 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DEPARTAMENTOS y CARGOS (para selects dinámicos)
app.get('/departamentos', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM departamentos");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/cargos', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cargos");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD EMPLEADOS (con JOIN para mostrar nombres)
app.get('/empleados', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.id, e.nombre, e.apellido, e.salario,
             d.nombre as departamento,
             c.nombre as cargo
      FROM empleados e
      LEFT JOIN departamentos d ON e.id_departamento = d.id
      LEFT JOIN cargos c ON e.id_cargo = c.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/empleados', async (req, res) => {
  try {
    const { nombre, apellido, salario, id_departamento, id_cargo } = req.body;
    await pool.query(
      "INSERT INTO empleados(nombre,apellido,salario,id_departamento,id_cargo) VALUES($1,$2,$3,$4,$5)",
      [nombre, apellido, salario, id_departamento, id_cargo]
    );
    res.json({ message: "Empleado agregado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/empleados/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, apellido, salario, id_departamento, id_cargo } = req.body;
    await pool.query(
      "UPDATE empleados SET nombre=$1, apellido=$2, salario=$3, id_departamento=$4, id_cargo=$5 WHERE id=$6",
      [nombre, apellido, salario, id_departamento, id_cargo, id]
    );
    res.json({ message: "Empleado actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/empleados/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM empleados WHERE id=$1", [id]);
    res.json({ message: "Empleado eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3000}`);
});