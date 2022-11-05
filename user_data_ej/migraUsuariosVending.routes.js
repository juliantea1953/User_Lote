const XLSX = require('xlsx');
const mongoose = require('mongoose')
const moment = require('moment-timezone');
const Usuario = require('../models/usuarioVENDING');
const Operacion = require('../models/operacionVENDING');
const Dispensadora = require('../models/dispensadora');


const tipocashless = [
    {id:"1",text:"BIOMETRÍA DACTILAR"},
    {id:"2",text:"CÓDIGO DE BARRAS"},
    {id:"3",text:"BIOMETRÍA FACIAL"},
    {id:"4",text:"CÉDULA DE CIUDADANÍA"}
  ];

//let mensajes = []
//let advertencias = {}
let dispensadoras = []


console.log(`:V >aita conectado con el archivo-->`, );
const main=()=>{    
    console.log('/OcO/ entra')
    let idOperacion = "635c14c90b0d6ac30146dc6d";
    const nombreArchivo = `Usuarios Inssa (2).xlsx`
   
            excelToJson(nombreArchivo).then(async data=>{
                let dataSave = await asignarGenero(data, idOperacion);
                console.log(`:V >HEMOS CUMPLIDO-->`, "hemos cumplido" );
            })
}

///////////7

const excelToJson = (nombreArchivo) =>{
    
    return new Promise((resolve,reject)=>{
        const excel = XLSX.readFile(`./uploads/${nombreArchivo}`);
        let hojas = excel.SheetNames;
        let datos = XLSX.utils.sheet_to_json(excel.Sheets[hojas[0]]);

        extension = (nombreArchivo.substring(nombreArchivo.lastIndexOf("."))).toLowerCase();

 

    if(extension != ".xlsx"){
        console.log('El formato del documento es inválido, escoja un formato .xlsx.');
        return false;
    }
    else{
       
       

        const eliminaCedulasDuplicadas = (arr) => {
            const personasMap = arr.map(persona => {
              return [persona.cedula, persona]
            });
          
            return [...new Map(personasMap).values()];
          }

          datos = eliminaCedulasDuplicadas(datos);

         ////////////////////////////////////////////////////////////////

         const busqueda = datos.reduce((acc, persona) => {
            acc[persona.idcod] = ++acc[persona.idcod] || 0;
            return acc;
          }, {});
          
          const duplicados = datos.filter( (persona) => {
              return busqueda[persona.idcod];
          });
          
          //console.log("Nombre: ", duplicados);

          



          
          
          

          //console.log(datos);

        let datosMapeados = datos.map(usu=>{
        let user = {

            nombre : usu.nombre!= undefined ? usu.nombre.toString().trim().toUpperCase():"DESCONOCIDO",
            cedula : usu.cedula.toString().trim().toUpperCase(),
            fecharegistro: new Date((usu.fecharegistro - (25569))*86400*1000),
            estadouser: usu.estadouser==1?true:false,
            departamento : usu.departamento!= undefined ? usu.departamento.toString().trim().toUpperCase():"DESCONOCIDO",
            centrocostos : usu.centrocostos!= undefined ? usu.centrocostos.toString().trim().toUpperCase():"DESCONOCIDO",                cargo : usu.cargo!= undefined ? usu.cargo.toString().trim().toUpperCase():"DESCONOCIDO",
            idcod : mapearCodigo(usu.tipo.toString().trim().toUpperCase(),usu.idcod.toString().trim().toUpperCase()),
            acumulable: usu.acumulable==1?"1":"0",
            tipo : usu.tipo.toString().trim().toUpperCase(),
            estadocodigo: usu.estadocodigo==1?true:false,
            saldo : usu.saldo.toString().trim().toUpperCase(),
            perfil : usu.perfil.toString().trim().toUpperCase(),
            genero : usu.genero.trim().toUpperCase()== "F"?"FEMENINO":"MASCULINO"
            }
            return user;
    })
        resolve(datosMapeados)
}
    })
} 

/////////


const updateUsuariosBiometria = async (dato, newData) => {
    let found = await Usuario.find({identificacion:dato.cedula});
    if(found.length == 0){
        console.log('<-_->:entra como nuevo usuario -->',found);
        let usuario = new Usuario({
            nombre:dato.nombre,
            identificacion: dato.cedula,
            fecharegistro:dato.fecharegistro,
            departamento: dato.departamento,
            centrocosto: dato.centrocostos,
            cargo: dato.cargo,
            estado: dato.estadouser,
            codigo: [{
                id_codigo: dato.idcod,
                tipoCashless: tipoIdentificacion(dato.tipo).text,
                idTipoCashless: tipoIdentificacion(dato.tipo).id,
                perfil: dato.perfil,
                saldo: dato.perfil,
                creditoAcum: dato.acumulable,
                estadocodigo: dato.estadocodigo,
                dispensadorasact: newData.dispensadorasact,
                idcliente:newData.idcliente,
                idCuenta:newData.idCuenta,
                idOperacion: newData.idOperacion,
                ultimaRecarga: moment(new Date()).tz("America/Bogota")._d
            }],
            genero:dato.genero
        })
        
        await usuario.save();
    }else{

        
        console.log(found);
      //console.log(found.identificacion);
      console.log("Va a actualizar");
        let doc = await Usuario. updateOne({identificacion:dato.cedula}, 
         
            {
               
            $set: {
                nombre: dato.nombre,
                codigo: {
                    id_codigo: dato.idcod,
                    tipoCashless: tipoIdentificacion(dato.tipo).text,
                    idTipoCashless: tipoIdentificacion(dato.tipo).id,
                    perfil: dato.perfil,
                    saldo: dato.saldo,
                    creditoAcum: dato.acumulable,
                    estadocodigo: dato.estadocodigo,
                    dispensadorasact: newData.dispensadorasact,
                    idcliente:newData.idcliente,
                    idCuenta:newData.idCuenta,
                    idOperacion: newData.idOperacion,
                    ultimaRecarga: moment(new Date()).tz("America/Bogota")._d
                    
                }
            }
            }, {
            returnOriginal: false
        })
    }
}

const mapearCodigo = (tipo, codigo) => {
    if(tipo == "4"){
        return codigo.padStart(10,"0");
    }
    return codigo;
}

const tipoIdentificacion = (exceltipo) => {
    let newTipo = tipocashless.find(tipo=>tipo.id == exceltipo);
    if(newTipo)return newTipo
    else{ throw new Error("No es un tipo de identificacion válido")}
}

const updateUsuarios = async (arrUsuarios) => {
    let contador = 0;
    for(us of arrUsuarios){
  
        contador += 1;
        if(contador == 3){
            console.log('<-_->:este -->', us);
        }
        console.log('<-_->:guardado -->',contador); 
    }
}

const mapearUsuarios = async (arr, idOperacion) => {
    let usuarios = []
    dispensadoras = await Dispensadora.find({"cliente.cuenta.operacion.idOperacion":new mongoose.Types.ObjectId(idOperacion)},'_id serial');
    console.log('<-_->:dispensadoras -->',dispensadoras);
    const dataOper = await Operacion.findById(idOperacion,'idClienteInssa idCuentaoperacion');
    console.log('<-_->:dataOper -->',dataOper);
    console.log('<-_->:dataOper.idCuentaoperacion -->',dataOper.idCuentaoperacion);
    newData = {
        idcliente: dataOper.idClienteInssa,
        idCuenta:dataOper.idCuentaoperacion,
        idOperacion:idOperacion
    }
    for(dato of arr){
        let id = getIdDispensadora(dato.usarendispensadora)
        let usuario = new Usuario({
            nombre:dato.nombre,
            identificacion: dato.cedula,
            fecharegistro:dato.fecharegistro,
            departamento: dato.departamento,
            centrocosto: dato.centrocostos,
            cargo: dato.cargo,
            estado: dato.estadouser,
            genero: dato.genero,
            codigo: [{
                id_codigo: dato.idcod,
                tipoCashless: tipoIdentificacion(dato.tipo).text,
                idTipoCashless: tipoIdentificacion(dato.tipo).id,
                perfil: dato.perfil,
                saldo: dato.perfil,
                creditoAcum: dato.acumulable,
                estadocodigo: dato.estadocodigo,
                dispensadorasact: dispActivas(dato.estadohuellamaquina)?[id]:[],
                idcliente:newData.idcliente,
                idCuenta:newData.idCuenta,
                idOperacion: newData.idOperacion,
                ultimaRecarga: moment(new Date()).tz("America/Bogota")._d
            }]
        })
        
        buscarUsuario = usuarios.find(us=>us.identificacion==dato.cedula);
        
        if(!buscarUsuario){
            usuarios.push(usuario);
            
            
        }else{
            let arrCodigos = buscarUsuario.codigo.find(cod=>cod.id_codigo==dato.idcod);
            console.log("aaaa");
            
            if(!arrCodigos){
                
                
                
                buscarUsuario.codigo.push({
                    id_codigo: dato.idcod,
                    tipoCashless: tipoIdentificacion(dato.tipo).text,
                    idTipoCashless: tipoIdentificacion(dato.tipo).id,
                    perfil: dato.perfil,
                    saldo: dato.perfil,
                    creditoAcum: dato.acumulable,
                    estadocodigo: dato.estadocodigo,
                    dispensadorasact: dispActivas(dato.estadohuellamaquina)?[id]:[],
                    idcliente:newData.idcliente,
                    idCuenta:newData.idCuenta,
                    idOperacion: newData.idOperacion,
                    ultimaRecarga: moment(new Date()).tz("America/Bogota")._d
                })
            }else{
                
                let arrDisp = arrCodigos.dispensadorasact.find(idABuscar=>{
                        return idABuscar==id
                    })
                if(!arrDisp && dispActivas(dato.estadohuellamaquina)){
                    arrCodigos.dispensadorasact.push(id)
                }

            }

        }
    }
    return usuarios
} 

const dispActivas = (estadohuella) => {
    if(estadohuella=="1" ){
        return true
    }
}

const getIdDispensadora = (serial) =>{
    let buscarDispensadora = dispensadoras.find(disp=>disp.serial==serial);
    if(buscarDispensadora){
        return buscarDispensadora._id
    }
}
const validarInsert = async (us) => {
    console.log('<-_->:us -->',us);
}


const asignarGenero = async (usuExcel, idOperacion) => {
    let usuarios = []
    const dispActivas = await Dispensadora.find({"cliente.cuenta.operacion.idOperacion":new mongoose.Types.ObjectId(idOperacion)},'_id');
    console.log(`:V >-->dispActivas`, dispActivas );    
    const dataOper = await Operacion.findById(new mongoose.Types.ObjectId(idOperacion),'idClienteInssa idCuentaoperacion');
        console.log('<-_->:dataOper -->',dataOper);
        console.log('<-_->:dataOper.idCuentaoperacion -->',dataOper.idCuentaoperacion);
        newData = {
            dispensadorasact: dispActivas.map(disp=> {
                    return disp._id
                }
            ),
            idcliente: dataOper.idClienteInssa,
            idCuenta:dataOper.idCuentaoperacion,
            idOperacion:idOperacion
        }
   
        let cont = 0;
        for (const i of usuExcel) {


        
            console.log('<-_->:ACTUALIZADO -->', "cc");
            await updateUsuariosBiometria(i,newData)
        }
        return usuExcel;
}

main();