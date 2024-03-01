const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 4000;

// middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.json()); 

const fermentacionRecords = [];

const form3 = {
    name: "fermentación",
    fields:[{
        field: "startDate",
        label: "Fecha Inicio",
        type: "date"
    },
    {
        field:"input",
        label:"Cantidad Entrada(kg)",
        type: "number"
    },
    {
        field:"endDate",
        label:"Cantidad salida(kg)",
        type: "number"
    }
]
};

//Endpoint para CRUD de registros de fermentacion
app.post('/fermentacion/:account', validateUserPermissions, validateFormData, createFermentacionRecord);
app.get('/fermentacion/:account', validateUserPermissions, getFermentacionRecords);
app.put('/fermentacion/:account:recordId', validateUserPermissions, validateFormData, updatefermentacionRecord);
app.delete('/fermentacion/:account/:recordId', validateUserPermissions, deleteFermentacionRecord);

//funcion para validar datos del formulario
function validateFormData(req ,res, next){
    const formData = req.body;

    //validar que las propiedades enviadas esten permitidas segun el formulario form3

    const allowedProperties = form3.fields.map(field => field.field);
    if(!validateProperties(formData,allowedProperties)){
        return res.status(400).json({error:'Datos de fermentacion no validos'});
    }
    
    //validar fechas y cantidades 
    const StartDate = formData.StartDate;
    const endDate = formData.endDate;
    const inputQuantity = formData.input;
    const outputQuantity = formData.output;
    
    if (!validateDateOrder(StartDate, endDate) || !validateQuantityOrder(inputQuantity, outputQuantity)) {
        return res.satatus(400).json({error: 'Fechas o cantidades no validas'});
    
    }
    return next();
}

// Funcion para crear registro de fermentacion
function createFermentacionRecord(req,res){
    const account = req.params.account;
    const userId = req.headers.authorization;
    const newReocrd = {...req.body, account, userId};

    fermentacionRecords.push(newReocrd);

    res.satatus(201).json({message: 'Registro de fermentacion creado conexito', newReocrd});
}

//Funcion para obtener registros de fermentacion 
function getFermentacionRecords(req,res){
    //devuelve un ojeto con dos propiedades: data y summary
    const data = fermentacionRecords;
    const summary = calculateSummary(fermentacionRecords);

    res.json({data,summary})
}

//Funcion para actualizar los registo de fermentacion
function updatefermentacionRecord(req,res){
    const recordId = req.params.recordId;
    const updatedData = req.body;

    const recordToUpdate = fermentacionRecords.find(record=> record.id === recordId);

    if(!recordToUpdate){
        return res.satatus(404).json({error: 'Registro de fermetacion no encotrado'});

        //validar que el ususario tenga permisos para actualizar este registro
        if(recordToUpdate.userId !== req.headers.authorization){
            return res.status(400).json({error:'No tienes permisos para actualizar este registro'});
        }
    }

    //Actualiza el resgistro con lo nuevos datos
    Object.assign(recordToUpdate,updatedData);

    res.json({message: 'Registro de fermentacion actualizado con exito', updatedData});
}

//funcion para eliminar resgistro de fermentacion
function deleteFermentacionRecord(req,res){
    const recordId = req.params.recordId;

    //Busaca el inidice del registro que se va a eliminar
    const recordIndex = fermentacionRecords.findIndex(record => record.id === recordId)

    if(recordIndex === -1){
        return res.status(400).json({error: 'Registro de fermentacion no encontrado'})
    }

    //validar que el usuario tenga permiso para eliminar este resgistro

    if(fermentacionRecords[recordIndex].userId !== req.headers.authorization){
        return res.status(403).json({error: 'No tienes permuiso para eliminar este registro'});
    }

    //eliminar el registro del array
    const deleteRecord = fermentacionRecords.splice(recordIndex, 1)[0];

    res.json({message: 'Registro de fermentacion eliminado con exito', deleteRecord})
}

//Funcion para calcular el resumen
function calculateSummary(records){
    const totalRecords = records.lenght;

    if(totalRecords===0){
        return{avg_days: 0, avg_weight_loos: 0};
    }
    const totalDays = record.reduce((acc , record)=>{
        const startDate = new Date(record.startDate);
        const endDate = new Date(record.endDate);
        const daysDifference = (endDate - startDate) / (1000 * 60 *60 * 24);
        return acc + daysDifference; 
    },0)
    
    const totalWeightLoss = records.reduce((acc, record)=>{
        const inputQuantity = record.input;
        const outputQuantity = record.output;
        const  weightLost = inputQuantity-outputQuantity;
        return acc + weightLost;
    },0)
    
    const avgDays = totalDays / totalRecords;
    const avgweightloos = totalWeightLoss /totalRecords;

    return{avg_days: avgDays, avg_weight_loos: avgweightloos };
}

//Funcion para validar propiedades 
function validatePorperties(object, allowedProperties){
    const objectProperties = Object.keys(object);
    return objectProperties.every(prop=>allowedProperties.includes(prop));
}

//funcion para validar orden de fechas
function validateDateOrder(startDateString,endDateString){
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    return startDate <= endDate;
}

//funcion para validar orden de cantidades 
function validateQuantityOrder(startQuantity,endQuantity){
    return startQuantity >= endQuantity;
}

app.listen(PORT, ()=>{
    console.log(`Servidor en ejecucion en http://localhost:${PORT}`);
});
