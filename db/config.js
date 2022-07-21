const mongoose = require('mongoose');

const dbConnection = async() => {
  try{

    await mongoose.connect( process.env.BD_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,    
    });

    console.log('DB online');

  }catch(err){
    console.log(err);
    throw new Error('Error inicializando DB');
  }

}

module.exports = {
  dbConnection
}