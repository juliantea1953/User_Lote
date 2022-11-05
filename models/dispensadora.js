const {model, Schema, ObjectId} = require('mongoose');
const dispensadorasSchema = new Schema({
    fecha:Date,
    serial:String,
    serialICS: String,
    nombre: String,
    cliente: {
        idInssa: ObjectId,
        nit: String,
        razonSocial: String,
        cuenta: {
            idcuentaDispensadora: ObjectId,
            operacion: {
                idOperacion: ObjectId,
                locacion: {
                    nombre: String,
                    piso: String
                }
            }
        }
    },
    caracteristicas: {
        marca: String,
        modelo: String,
        tipo: String
    },
    planograma: {
        selecciones: [{
            numero: Number,
            producto: {
                nombre: String,
                idproducto: ObjectId,
                costo: String,
                tipo: String
            },
            canMax: Number,
            canMin: Number,
            canActual: Number
        }]
    },
    perifericos: {
        billetero: {
            manufactura: String,
            serial: String,
            modelo: String,
            reciclador: {
                denominacion: Number,
                cantidad: Number
            }
        },
        monedero: {
            manufactura: String,
            serial: String,
            modelo: String,
            inventarioMonedas: {
                mon100: Number,
                mon1000: Number,
                mon200: Number,
                mon50: Number,
                mon500: Number
            }
        }
    },
    estado: Boolean,
    valorAcreditacion: Number   
},{collection:"dispensadoras_ics"})

module.exports = model('dispensadoras_ics', dispensadorasSchema);