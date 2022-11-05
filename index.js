const mongoose = require ("mongoose");
mongoose.connect("mongodb://localhost:27017/inssa",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.catch(err => console.error(err))

mongoose.connection.once('open', _=>{
    console.log('Base de datos conectada');
})

mongoose.connection.on('error', err=>{
    console.log(err);
})


require('./user_data_ej/migraUsuariosVending.routes');