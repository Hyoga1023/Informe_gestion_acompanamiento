// Tus datos del JSON
const ejecutivos = [
  { "nombre": "Alex Marcial Bandera Nova", "correo": "alex.bandera@proteccion.com.co" },
  { "nombre": "Nancy Florez", "correo": "nancy.florez@proteccion.com.co" },
  { "nombre": "Carol Andrea lasso Cardona", "correo": "carol.lasso@proteccion.com.co" },
  { "nombre": "Sindy Johanna Cardona Barrientos", "correo": "sindy.barrientos@proteccion.com.co" },
  { "nombre": "Geraldin Mora Diaz", "correo": "geraldin.mora@proteccion.com.co" },
  { "nombre": "Sonia Gonzalez", "correo": "sonia.gonzalez@proteccion.com.co" },
  { "nombre": "Yordy Camilo Peñuela", "correo": "yordy.penuela@proteccion.com.co" },
  { "nombre": "Arianne Marcela Reyes Suarez", "correo": "arianne.reyess@proteccion.com.co" },
  { "nombre": "Romulo Alfredo Sandoval Hernandez", "correo": "romulo.sandoval@proteccion.com.co" },
  { "nombre": "Julian David Ruiz Corrales", "correo": "julian.ruiz@proteccion.com.co" },
  { "nombre": "Magda Johana Rueda Ariza", "correo": "magda.rueda@proteccion.com.co" },
  { "nombre": "Paola Andrea Cruz Franco", "correo": "paola.cruz@proteccion.com.co" },
  { "nombre": "Yina Saray Bedoya Saavedra", "correo": "yina.bedoyas@proteccion.com.co" }
];

const selectNombre = document.getElementById('nombreEjecutivo');
const inputEmail = document.getElementById('emailEjecutivo');

// 1. Llenamos el Select con los nombres
ejecutivos.forEach((ejecutivo, index) => {
    const option = document.createElement('option');
    option.value = index; // Usamos el índice para encontrarlo fácil después
    option.textContent = ejecutivo.nombre;
    selectNombre.appendChild(option);
});

// 2. Evento para cambiar el correo automáticamente
selectNombre.addEventListener('change', (e) => {
    const seleccionado = e.target.value;
    
    if (seleccionado !== "") {
        // Buscamos el correo basado en el índice seleccionado
        inputEmail.value = ejecutivos[seleccionado].correo;
    } else {
        inputEmail.value = "";
    }
});