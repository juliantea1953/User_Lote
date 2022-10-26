const xlsx = require("xlsx");
const mon = require("mongoose");


const ExJson = ()=>{
    const excel = xlsx.readFile("Usuarios Inssa (2).xlsx");
    let hojas = excel.SheetNames;
    let datos = xlsx.utils.sheet_to_json(excel.Sheets[hojas[0]]);
    let datosMapeados = datos.map(usu=>{


        const mapearCodigo = (tipo, codigo) => {
            if(tipo == "4"){
                return codigo.padStart(10,"0");
            }
            return codigo;
        }


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

    console.log(datosMapeados);
    

    
        

};
ExJson();



