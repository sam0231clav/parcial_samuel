const API = ''; // vacío porque ahora todo está en el mismo servidor


// ====================== LOGIN ======================
async function login() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + '/login', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password })
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem('loggedIn', 'true');
    window.location.href = 'menu.html';
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

async function registrar() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  const res = await fetch('/register', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password })
  });

  const data = await res.json();

  if (data.success) {
    alert("Usuario creado correctamente");
  } else {
    alert(data.message);
  }
}

// ====================== PROTECCIÓN ======================
function checkLogin() {
  if (!localStorage.getItem('loggedIn')) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('loggedIn');
  window.location.href = 'login.html';
}

// ====================== DEPARTAMENTOS Y CARGOS ======================
async function cargarDepartamentos() {
  const res = await fetch(API + '/departamentos');
  const data = await res.json();
  const select = document.getElementById('id_departamento');
  select.innerHTML = '<option value="">Selecciona Departamento</option>';
  data.forEach(d => {
    select.innerHTML += `<option value="${d.id}">${d.nombre}</option>`;
  });
}

async function cargarCargos() {
  const res = await fetch(API + '/cargos');
  const data = await res.json();
  const select = document.getElementById('id_cargo');
  select.innerHTML = '<option value="">Selecciona Cargo</option>';
  data.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
  });
}

// ====================== CRUD EMPLEADOS ======================
async function cargar() {
  const res = await fetch(API + '/empleados');
  const data = await res.json();
  const tbody = document.getElementById('bodyTabla');
  tbody.innerHTML = '';
  data.forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.nombre}</td>
        <td>${e.apellido}</td>
        <td>$${e.salario}</td>
        <td>${e.departamento}</td>
        <td>${e.cargo}</td>
        <td>
          <button onclick="editar(${e.id})"> Editar</button>
          <button onclick="eliminar(${e.id})"> Eliminar</button>
        </td>
      </tr>`;
  });
}

async function agregar() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const salario = document.getElementById('salario').value;
  const id_departamento = document.getElementById('id_departamento').value;
  const id_cargo = document.getElementById('id_cargo').value;

  if (!nombre || !apellido || !salario || !id_departamento || !id_cargo) {
    alert("Completa todos los campos");
    return;
  }

  await fetch(API + '/empleados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, apellido, salario, id_departamento, id_cargo })
  });

  alert("Empleado agregado correctamente");
  document.getElementById('nombre').value = '';
  document.getElementById('apellido').value = '';
  document.getElementById('salario').value = '';
}

async function editar(id) {
  const nombre = prompt("Nuevo nombre:");
  const apellido = prompt("Nuevo apellido:");
  const salario = prompt("Nuevo salario:");
  const id_departamento = prompt("Nuevo ID departamento (1-3):");
  const id_cargo = prompt("Nuevo ID cargo (1-3):");

  if (nombre && apellido && salario && id_departamento && id_cargo) {
    await fetch(API + `/empleados/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, salario, id_departamento, id_cargo })
    });
    cargar();
    alert("Empleado actualizado");
  }
}

async function eliminar(id) {
  if (confirm("¿Seguro que quieres eliminar este empleado?")) {
    await fetch(API + `/empleados/${id}`, { method: 'DELETE' });
    cargar();
  }
}