import { Router } from 'express'
const router = Router();
import { connect } from '../database'
import { ObjectID } from 'mongodb'


router.get('/', async (req, res) => {
    const db = await connect();

    if (db === 1) {
        const respuesta = mensajeArray(1, "Hubo un error en la conexion a la base de datos", null)
        console.log(respuesta);
        res.json(respuesta);
    } else {
        try {
            const busqueda = await db.collection('regions').find({},
                { projection: { "provincias.nombre": 1,"provincias.codigo":1, _id: 1 } })
                .toArray().then(function (docs) {
                    if (docs.length == 0) {
                        const respuesta = mensajeArray(3, "Consulta relizada, no se ha encontrado documento", null)
                        console.log(respuesta);
                        res.json(respuesta);
                    } else {
                        const respuesta = mensajeArray(0, "Consulta relizada", docs)
                        console.log(respuesta);
                        res.json(respuesta);
                    }
                });

            //console.log(busqueda);
            //res.json(busqueda);

        } catch (error) {
            const respuesta = mensajeArray(2, "Hubo un error en la consulta", null);
            console.log(respuesta);
            res.json(respuesta);
        }

    }

});

router.get('/:cod_provincia', async (req, res) => {
    const { cod_provincia } = req.params;
    const db = await connect();
    if (db === 1) {
        const respuesta = mensaje(1, "Hubo un error en la conexion a la base de datos", null)
        console.log(respuesta);
        res.json(respuesta);
    } else {
        try {
            const busqueda = await db.collection('regions').findOne({ "provincias.codigo": cod_provincia }, {
                projection: { "provincias": { $elemMatch: { "codigo": cod_provincia }},"provincias.comunas":0 }
            }).then(function (doc) {
                if (!doc) {
                    const respuesta = mensaje(3, "Consulta relizada, no se ha encontrado documento", null)
                    console.log(respuesta);
                    res.json(respuesta);
                } else {
                    const respuesta = mensaje(0, "Consulta relizada", doc)
                    console.log(respuesta);
                    res.json(respuesta);
                }
            });
            console.log(busqueda);
        } catch (error) {
            const respuesta = mensaje(2, "Hubo un error en la consulta", null);
            console.log(respuesta);
            res.json(respuesta);
        }
    }
    db.close;
});


router.get('/:cod_provincia/comunas',async(req,res)=>{
    const {cod_provincia}=req.params;
    const db=await connect();
    if(db===1){
        const respuesta = mensajeArrayComunas(1, "Hubo un error al conectar la base de datos", null)
        console.log(respuesta);
        res.json(respuesta)
    }else{
        db.collection('regions').findOne({"provincias.codigo":cod_provincia},
         {projection: { "provincias": { $elemMatch: { "codigo": cod_provincia }},"provincias.comunas":1,_id:0}},function(err,doc){
            if(err){
                const respuesta = mensajeArrayTodasComunas(2, "Hubo un error en la consulta", null);
                console.log(respuesta);
                res.json(respuesta);
            }else{
                if(!doc){
                    const respuesta = mensajeArrayTodasComunas(3, "Consulta relizada, no se ha encontrado documento", null);
                    console.log(respuesta);
                    res.json(respuesta);
                }else{
                    console.log(doc);
                    const respuesta=mensajeComunas(0,"consulta realizada",doc)
                    res.json(respuesta);
                }
            }
        })
    }
})

router.get('/:cod_provincia/comunas/:cod_comuna',async(req,res)=>{
    const cod_provincia=req.params.cod_provincia;
    const cod_comuna=req.params.cod_comuna;
    const db=await connect();

    if(db===1){
        const respuesta = mensajeArrayComunas(1, "Hubo un error al conectar la base de datos", null)
        console.log(respuesta);
        res.json(respuesta)
    }else{
        db.collection('regions').findOne({"provincias.codigo":cod_provincia},
        {projection:{"provincias":{$elemMatch:{"codigo":cod_provincia}},"provincias.comunas":1,_id:0}},function(err,doc){
            if(err){
                const respuesta=mensajeArrayComunas(1,"consulta realizada",null,cod_comuna);
                console.log(doc);
                res.json(respuesta);
            }else{
                if(!doc){
                    const respuesta = mensajeArrayComunas(3, "Consulta relizada, no se ha encontrado documento", null);
                    console.log(respuesta);
                    res.json(respuesta);
                }else{
                    const respuesta=mensajeComuna("consulta realizada",doc,cod_comuna);
                    console.log(doc);
                    res.json(respuesta);
                }
            }         
        })
        
    }

})



function mensaje(cod, resp, info) {
    
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },
        provincia:{
            ...info.provincias[0]
        }
      

    }
    return estado;
}

function mensajeComuna(resp, info, cod_comuna) {

    const comuna = info.provincias.map(function (provincia) {
        const consulta = provincia.comunas.filter(
            comuna => comuna.codigo === cod_comuna
        )
        return consulta[0];
    });

    
    if(comuna[0]==null || comuna[0]==undefined){
        const estado = {
            estado: {
                codigo: 2,
                respuesta: "no se encontro la busqueda, verifique la comuna",
            },
            comuna: null
    
        }
        return estado;

    }else{
        const estado = {
            estado: {
                codigo: 0,
                respuesta: resp,
            },
            comuna: {
                ...comuna[0]
            }
    
        }
        return estado;
    }

}


function mensajeComunas(cod,res,info){
    const comunas=[];
    const comuna = info.provincias.map(function (provincia) {
        const consulta = provincia.comunas.map(function(comuna){
            comunas.push(comuna);
        });
    });

    const estado={
        estado:{
            codigo:cod,
            respuesta:res,

        },
        comunas
    }   
    return estado;
}

function mensajeArray(cod, resp, info) {
    const arrayDatos=[];
    for(let i=0;i<info.length;i++){
        for(let j=0;j<info[i].provincias.length;j++){
            arrayDatos.push(info[i].provincias[j]);
            console.log(arrayDatos);
        }
        
    }    
    const estado = {
        estado: {
            codigo: cod,
            respuesta: resp,
        },provincias:[
            ...arrayDatos
        ]
            
    }
    return estado;
}


export default router;