# Nodepop

Documentación  - Verónica Cordobés

Instrucciones:

- Carga de anuncios y usuario: 
El fichero ./lib/install_db.js borra las tablas guardadas anteriormente y carga las del archivo anuncios.js y un usuario de prueba. Para ejecutarlo:
$node install_db.js

- Arrancar la aplicación: 
$nodemon

- Registrar usuarios nuevos, más cómodamente con Postman:
POST : http://localhost:3000/api/v1/usuarios/register

body : x-www.form-urlencoded
nombre : <nombre>
email : <email>
clave : <clave>

La clave se guarda en un hash por seguridad. Se devuelve un token que caduca en 2 días.
Hay un índice por email para que las búsquedas sean rápidas. 

- Autenticar un usuario:
POST : http://localhost:3000/api/v1/usuarios/authenticate

body : x-www.form-urlencoded
email : <email>
clave : <clave>

Se realiza de nuevo hash a la clave de autenticación y se compara si es el mismo hash que el guardado durante el registro

- Guardar token:
PUT : http://localhost:3000/api/v1/usuarios/pushtoken

body : x-www.form-urlencoded
plataforma : [‘ios’, android’]
token: <token>
usuario : <email>

Como puede haber tokens de usuarios y de no usuarios, no se utiliza filtro para guardarlos sólo si están registrados como usuarios.

- Listar anuncios:
GET : http://localhost:3000/api/v1/anuncios?token=<token>

Admite los siguientes filtros:
nombre: admite las primeras letras del nombre y es no case sensitive
venta: true | false
precio: rangos 10-50, 10-, -50, 50
tag
start
limit
sort
includeTotal: true | false añade una fila con el total de anuncios listados

Además debe incluir un token.

- Listar tags:
GET : http://localhost:3000/api/v1/anuncios/tags

- Visualización de imágenes:
http://localhost:3000/images/anuncios/iphone.png
http://localhost:3000/images/anuncios/bicicleta.png

- Internacionalización de mensajes de error:
Se utiliza el módulo i18n-2 para traducir los mensajes de error al idioma de petición. Se acepta el parámetro en la query de la url : 
http://localhost:3000/api/v1/usuarios/register?lang=es

- Cluster:
Para mejorar el aprovechamiento de recursos se incluye cluster.

- Validación código:
Con JSCS y el fichero .jscsrc y con JSHint y el fichero .jshintrc
