const { response }= require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req,res = response)=>{  
  const { email, name, password } = req.body;
  console.log( email, name, password );

  try{
    // verificar el email, que no exista en la DB
    const usuario = await Usuario.findOne({email:email})
    if(usuario){
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe con ese email'
      })
    }

    // crear usuario con el modelo
    const dbUser = new Usuario( req.body );
    console.log(dbUser);

    // encriptar la contraseña mediante Hash
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password,salt);

    // generar el JWT
    const token = await generarJWT( dbUser.id, name );

    // crear usuario de DB
    await dbUser.save();

    // generar respuesta exitosa
    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name,
      token
    });

  }catch(error){
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el admin.'
    })
  }  
}

const loginUsuario = async(req,res=response)=>{
  const { email, password } = req.body;  
  console.log( email, password );
  try{
    
    const dbUser = await Usuario.findOne({email:email});
    if(!dbUser){
      return res.status(400).json({
        ok: false,
        msg: 'El correo no existe'
      });
    }

    // confirmar si el password hace match
    // compara el password sin encriptar con el encriptado de la DB, internamente lo hashea para comparar
    const validPassword = bcrypt.compareSync( password, dbUser.password);
    if(!validPassword){
      return res.status(400).json({
        ok: false,
        msg: 'El password no es válido'
      });
    }

    // tenemos un usuario, su password y son válidos
    // generamos el jwt
    const token = await generarJWT( dbUser.id, dbUser.name );

    // respuesta del servicio - por defecto el status es 200
    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      token
    });

  }catch(error){
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el admin.'
    })
  }  
}

const revalidarToken = (req,res)=>{
  return res.json({
    ok:true,
    msg:'Renew'
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}