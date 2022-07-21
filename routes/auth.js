const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Crear nuevo usuario
router.post('/new', [
        check('name','El nombres es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password es obligatorio').isLength(6),
        validarCampos
    ],crearUsuario);

// Login de usuario
router.post('/', [
        check('email','El email es obligatorio').isEmail(),
        check('password','El password es obligatorio').isLength(6),
        validarCampos
      ], loginUsuario);

// Para validar si el jwt que tiene la app de angular sigue siendo vigente
router.get('/renew',revalidarToken);


// exportación del router
module.exports = router;