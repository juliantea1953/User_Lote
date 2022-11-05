const {model, Schema, ObjectId} = require('mongoose');
const usuariosSchema = new Schema({
    nombre: String,
    identificacion: String,
    departamento: String,
    centrocosto: String,
    cargo: String,
    estado: Boolean,
    codigo: [{
        id_codigo: String,
        tipoCashless: String,
        idTipoCashless: String,
        perfil: Number,
        saldo: Number,
        estadocodigo: Boolean,
        creditoAcum: String,
        dispensadorasact: [ObjectId],
        idcliente: ObjectId,
        idCuenta: ObjectId,
        idOperacion: ObjectId,
        ultimaRecarga: Date,
        _id:0
    }],
    fecharegistro: Date,
    genero:String
},{collection:"usuarios_ics"})

module.exports = model('usuariosVending', usuariosSchema);