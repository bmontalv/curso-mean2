Lanzar siempre en segundo plano la DB MongoDB: 
	C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe

Para ejecutar consulta, crear nuevas entradas o editar la BD:
	C:\Program Files\MongoDB\Server\3.6\bin\mongo.exe

- ver las bases de datos: >show dbs
- acceder a DB: >use DB_name
- Crear un nuevo elemento bookmar: >db.bookmarks.save((id:1, title:"algo"))
- Ver los bookmarks creados: >db.bookmarks.find()

Llamadas al API:
Para obtener token de autenticación:
- Login usuario existente: POST http://localhost:3977/api/login con parametros de body: 
	email = prueba@admin.com
	password = prueba
	gethash = true
Esta petición devuelve un token que habrá que añadir en las headers del resto de peticiones como:
	Authorization = {token}
