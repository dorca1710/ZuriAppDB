const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 8100; // Puerto de tu elección

app.use(bodyParser.json());

// Simulación de una base de datos
const users = [
  { email: 'usuario1@example.com', password: 'contrasena1' },
  // Agrega más usuarios según sea necesario
];

// Función para encontrar un usuario por correo electrónico
function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

// Función para generar un token aleatorio
function generateRandomToken() {
  return Math.random().toString(36).substr(2);
}

// Ruta para generar y enviar el token de recuperación
app.post('/api/zuriapp1/recuperarc', (req, res) => {
  const { email } = req.body;

  const user = findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
  }

  const token = generateRandomToken();

  // Simulación: Almacena el token en la base de datos del usuario
  user.recoveryToken = token;

  // Simulación: Envia el token por correo electrónico
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'decal1710@gmail.com', // Cambia esto al correo desde el que enviarás el token
      pass: '61095628dca', // Cambia esto a la contraseña del correo
    },
  });

  const mailOptions = {
    from: 'decal1710@gmail.com',
    to: email,
    subject: 'Recuperación de Contraseña',
    text: `Tu token de recuperación es: ${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      return res.status(500).json({ success: false, error: 'Error al enviar el correo' });
    }
    console.log('Correo enviado:', info.response);

    return res.status(200).json({ success: true, message: 'Token de recuperación enviado con éxito' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});