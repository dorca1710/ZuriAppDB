export default {
    mounted() {
    let timeout;

    const startTimer = () => {
        // Limpia el temporizador existente, si hay alguno
        if (timeout) {
        clearTimeout(timeout);
        }

        // Inicia un nuevo temporizador
        timeout = setTimeout(() => {
          // Cierra la sesión después de 3 minutos de inactividad
        this.cerrarSesion();
        }, 3 * 60 * 1000); // 3 minutos en milisegundos
    };

    const cerrarSesion = () => {
    
        localStorage.removeItem('token'); 
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = '/api/zuriapp1/Login';
    };

      // Escucha los eventos de actividad del usuario
    window.addEventListener('mousemove', startTimer);
    window.addEventListener('keydown', startTimer);
    },
};