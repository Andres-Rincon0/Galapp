const express = require('express');
const bodyParser = require( 'body-parser' );
const app = express();
const PORT = 3000;

// Middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.json());

const harvestRecords = [];

const form1 = {
    name: "Cosecha",
    fields: [{
        field:"date",
        label:"date",
        type:"date"
    },
    {
      field: "Employee",
      label: "Empleado",
      type: "text"
    },
    {
        field: "quantity",
        label: "Cantidad (kg)",
        type: "number"
      }
]
};

//Enpoint para la creacion de registros de cosecha
app.post('/harvest/:account', (req,res)=>{
    const account = req.params.account;
    const userId = req.headers.authorization;
    const userData = getUserData(userId);

    if(!userData || !userData.accounts.includes(account)){
        return res.status(400).json({error: 'Acceso no permitod'});
    }

    const newHaverstRecord = req.body;

    //validacion de porpiedades
    if(!validatePorperties(newHaverstRecord,form1.fields.map(filed => filed.filed))){
        return res.status(400).json({error: 'Datos de cosecha no validos'});
    }

    harvestRecords.push({ ...newHarvestRecord, account, userId });
  res.status(201).json({ message: 'Registro de cosecha creado con éxito', newHarvestRecord });
});

// Función para obtener datos de usuario desde la base de datos

function getUserData(userId) {
    const usersData = {
      "123": {
        accounts: ["Café", "Cacao"]
      },
    };
  
    return usersData[userId];
  };

  // Función para validar propiedades
function validateProperties(object, allowedProperties) {
    const objectProperties = Object.keys(object);
    return objectProperties.every(prop => allowedProperties.includes(prop));
  }

  app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
  });