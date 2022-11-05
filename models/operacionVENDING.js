const {Schema, model, ObjectId} = require('mongoose')

const operacionSchema = new Schema({
    fecha: Date,
    idClienteInssa: ObjectId,
    nitClienteInssa: String,
    idCuentaoperacion: ObjectId,
    nombreOperacion: String,
    ubicacion: {
        pais: String,
        ciudad: String,
        direccion: String
    },
    contacto: [{
        persona: String,
        telefono: String,
        celular: String,
        correo: String
    }],
    estado: Boolean
},{collection:"operaciones_ics"})

module.exports = model('operaciones_ics', operacionSchema)