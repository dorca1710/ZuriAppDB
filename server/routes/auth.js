const express = require('express')
const router = express.Router()
const authControllers = require('../../controllers/authController')
const authMiddleware = require('../../middleware/auth')


router.post('/api/zuriapp1/registro', authControllers.register)

router.post('/registerReemplazo', authControllers.registerReemplazo)

router.post('api/zuriapp1/Login', authControllers.login)

router.post('/logout', authControllers.logout)

router.post('/refresh', authControllers.refresh)

router.get('/reemplazos', authControllers.mostrarReemplazos)

router.get('/user', authMiddleware, authControllers.user)

router.delete('/eliminarReemplazo/:id', authControllers.eliminarReemplazo)

router.post('/api/zuriapp1/recuperarc', authControllers.recoverPassword);

module.exports = router