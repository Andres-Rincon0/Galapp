# Descirpcion de la aplicacion

<p>Esta aplicacion Node.js proporcion servicios CRUD basicos para gestionar datos de diferentes entidades almacenados en archivo JSON. Cada entidad tiene su propia ruta y se pueden realizar operaciones de lectura, actualizacion y eliminacion de registros</p>

## requisitos previos
- Asegurate de tener Node.js v14 o superior

## Insatalacion
Instala las dependencias usando npm <br>
<strong>npm install</strong>

## Uso
<strong>Ejecutar la aplicaion</strong>
<br>
- Ejecutar comando cd src antes de ejecutar  el siguiente comando: 
- node index.js (se ejecuta en http://localhost:5000)
- node Servicio2.js ( se ejecutará en http://localhost:3000.)
- node Servicio3.js(se ejecutara en http://localhost:4000)

## Realizar solicitudes
Puedes realizar solicitudes HTTP utilizando POSTMAN o el comando 'curl' en la terminal <br><br>

Obtener todos los registros de una entidad
* curl http://localhost:5000/:entity
<br><br>

Obtener un registro especifico de una entidad
* curl http://localhost:5000/:entity/:id

<br><br>
Eliminar un registro de una  entidad
* curl -X DELETE http://localhost:5000/:entity/:id

# Data model
## User

representa  a un usuario del sistema, tiene los siguientes atributos

name (String): es el nombre de los ususarios.<br>
phone (String).<br>
email (String).<br>
accounts (Object):Las cuentas a las que está vinculado el usuario. Las claves de este objeto son IDs de cuentas y los valores son objetos con la siguiente estructura:<br>
nombre (String): Nombre de la cuenta.<br>
role (String): Rol de este usuario en esta cuenta.

## Account
Representan un espacio de almacenamiento donde se guardan todos los datos de un cliente. No es una base de datos independiente.
Un mismo cliente puede tener varias cuentas, con diferentes usuarios para cada una de ellas. Además, diferentes cuentas de un mismo cliente, pueden tener diferentes configuraciones y cultivos.
<br><br>

name (String): El nombre de la cuenta.<br>
roles (Objeto): Objeto que vincula la cuenta con sus formularios. También define qué permisos tienen los usuarios que pertenecen a este rol en cada formulario.<br>

name (String): Nombre del rol.<br>
permissions (Objeto): Objeto cuyas claves son IDs de formularios y sus valores son objetos que describen permisos CRUD:
- create (Boolean)
- read (booleano)
- update  (booleano)
- delete  (booleano)
<br><br>

## form
Describen la estructura de una tabla de base de datos o de un documento de una colección. Pueden estar vinculados a una o varias cuentas.
<br>
nombre (String): Nombre del formulario. Se supone que se mostrará a los usuarios en el frontend y en los mensajes de error.<br>
fields (Array): Array de objetos. Cada elemento tiene las siguientes propiedades:<br>
- field (String): Es el ID del campo. Es el equivalente al nombre de la columna de una tabla de base de datos.
- label (String): Nombre amigable para mostrar a los usuarios.
- type (String): Describe el tipo de variable para este campo.