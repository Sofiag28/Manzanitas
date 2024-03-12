const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const session= require('express-session');
const path=require('path');
const { emitWarning } = require('process');
const app = express()
// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(session({
  //Cadenas para crear sesiones para cada uno de los usuarios

  secret: 'hola', //guardar las cookies de la sesión, única
  resave:false, //indica si la sesión debera volver a pedir las cookies
  saveUninitialized:false //Sirve para saber si hay alguna sesiónn vacía
  //El false sirve para que no guarde cada sesión
}))
app.use(express.static(path.join(__dirname)))

//Creacion de la conexion
const db = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sofi_bbdd',
    timezone: '-05:00'
  };
//Crear usuarios
app.post('/crear', async (req,res)=>{
    const conect=await mysql.createConnection(db)
    const { Nombre, Tipo, Documento, Contraseña, id_M1} = req.body; 
    try{
  //Verificador de usuario
      const [indicador]=await conect.execute('SELECT * FROM usuarios WHERE Documento=? AND Tipo=? AND Contraseña=?',[Documento,Tipo, Contraseña])
    
      if(indicador.length>0){
      res.status(409).send(`
      <script>
      window.onload = function(){
      alert("Este usuario ya existe");
      window.location.href = '/inicio.html';
      }
    </script>
      `)
    }
    else{
    await conect.execute('INSERT INTO usuarios (Nombre, Tipo,Documento, Contraseña, id_M1) VALUES (?,?,?,?,?)',
    [Nombre, Tipo,Documento,Contraseña, id_M1])
    res.status(201).send(`
    <script>
      window.onload = function(){
        alert("Datos Guardados :D");
        window.location.href = '/inicio.html';
      }
    </script>
    `)}
    await conect.end()
    }
    catch(error){
        console.error('Error en el servidor:', error);
        res.status(500).send(`
        <script>
          window.onload = function(){
            alert("Error En El Envío... :c");
            window.location.href = '/Ingreso.html';
          }
        </script>
        `)
    }

})
//Ruta para manejar Login
app.post('/iniciar', async(req,res)=>{
    const conect=await mysql.createConnection(db)
    const {Documento,Tipo,Contraseña}= req.body
  try{
    //Verifique las credenciales
    const [indicador]=await conect.execute('SELECT * FROM usuarios WHERE Documento=? AND Tipo=? AND Contraseña=?',[Documento,Tipo,Contraseña]);
    console.log(indicador);
    if(indicador.length>0){
      req.session.usuarios=indicador[0].Nombre
      req.session.Documento=Documento
      if (indicador[0].Rol=="Administrador"){
        res.sendFile(path.join(__dirname, 'Admin.html'))
      }
      else{
        const usuarios={Nombre:indicador[0].Nombre}
        console.log(usuarios)
        res.locals.usuarios=usuarios
      res.sendFile(path.join(__dirname,'usuario.html'))
      }
    }
    else{
      res.status(401).send(`
        <script>
        window.onload=function(){
          alert("Usuario No Encontrado :(, busquese una vida papi");
          window.location.href='inicio.html';
        }
          </script>
      `)
      await conect.end()
    }
  }
  
  catch(error){
    console.error("Error En El Servidor",error);
    res.status(500).send(`

    <script>
      window.onload = function(){
        alert("Error En El Servidor");
        window.location.href = '/inicio.html';
      }
    </script>
    `)
  }
})

//Ruta de inicio para el administrador
/*app.post('/obtener-Administrador',(req,res)=>{
  const administrador=req.session.Documento;
  if(administrador){
    res.json({Rol:Administrador});
  }
  else{
    res.status(401).send('Administrador no encontrado');
  }
})*/

//Ruta de inicio para el usuario
app.post('/obtener-usuario',(req,res)=>{
  const usuarios=req.session.usuarios;
  if(usuarios){
    res.json({Nombre:usuarios});
  }
  else{
    res.status(401).send('Usuario no encontrado');
  }
})
//Obtención de servicios 
app.post('/obtener-servicios-usuarios',async (req,res)=>{
  const usuarios=req.session.usuarios
  const Documento=req.session.Documento
  console.log(usuarios,Documento)
  
  try{
    const conect=await mysql.createConnection(db)
    const[serviciosData]=await conect.execute('SELECT servicios.Nombre FROM usuarios INNER JOIN manzanas ON usuarios.`id_M1` = manzanas.`id_M` INNER JOIN m_s ON manzanas.`id_M`= m_s.`id_M1` INNER JOIN servicios ON m_s.`id_S1`=servicios.`id_S` WHERE usuarios.Documento=?',[Documento]);
    console.log(serviciosData);
    res.json({servicios: serviciosData.map(row=>row.Nombre)})

    await conect.end()
  }    
  catch(error){
    console.error('Error en el servidor:', error);
    res.status(500).send('Error en el servidor');
  }
});

//GUARDAR SERVICIOS
app.post('/guardar-servicios-usuarios',async (req,res)=>{
  const usuarios=req.session.usuarios;
  const Documento=req.session.Documento;
  const {servicios,fechaHora}=req.body;
  try{
    const conect= await mysql.createConnection(db)
    const [IDS] = await conect.query('SELECT servicios.id_S from servicios where servicios.`Nombre`=?',[servicios]);
    const [IDU] =await conect.execute('SELECT usuarios.idusuarios FROM usuarios WHERE usuarios.`Documento`=?',[Documento]);
    console.log(IDU[0].idusuarios, IDU)
    await conect.query(' INSERT INTO solicitudes (Fecha, id1, CodigoS) VALUES (?,?,?)', [fechaHora, IDU[0].idusuarios,IDS[0].id_S]);
    res.status(200).send('servicios guardados con exito')
    await conect.end()
  }
  catch(error){
    console.error('Error En El Servidor:',error);
   res.status(500).send('Error En El Servidor.. :c');
}
})
//SELECCIONAR SERVICIOS GUARDADOS
app.post('/obtener-servicios-guardados', async(req, res)=>{
  const Documento=req.session.Documento
  console.log(Documento);
  try{
    const conect= await mysql.createConnection(db)
    const [IDU]=await conect.execute('SELECT `idusuarios` FROM usuarios WHERE usuarios.`Documento`=?',[Documento])
    const [serviciosGuardadosData]=await conect.query('SELECT solicitudes.Fecha, servicios.id_S, servicios.`Nombre` , usuarios.`Documento` FROM solicitudes INNER JOIN usuarios ON usuarios.idusuarios = solicitudes.id1 INNER JOIN manzanas on manzanas.id_M =usuarios.id_M1 INNER JOIN m_s on m_s.id_M1 = manzanas.id_M INNER JOIN servicios ON servicios.id_S = m_s.id_S1 WHERE usuarios.`Documento`=? AND servicios.id_S=solicitudes.`CodigoS`', [IDU[0].idusuarios.solicitudes.CodigoS.servicios]);
    const serviciosGuardadosFiltrados=serviciosGuardadosData.map(servicios => {
      
    });(servicios=>({
    Nombre: servicios.Nombre,
    Fecha: servicios.Fecha,
    id: servicios.id_S
  }));
    
    res.json({serviciosGuardadosData: serviciosGuardadosFiltrados})
    await conect.end()
  }    
  catch(error){
    console.error('Error en el servidor:', error);
    res.status(500).send('Error en el servidor');
  }
})

 //ELIMINAR SERVICIOS
 app.delete('/eliminar-servicios/:id_S',async(req,res)=>{
  const id_S=req.params.idusuarios
  console.log("se elimino todo con éxito");
  try{
    const conect=await mysql.createConnection(db)
    await conect.execute('DELETE FROM solicitudes WHERE `id_solicitudes`=?',[id_S])
    res.status(200).send("Ok")

    await conect.end()
    
  }
  catch{
    console.error('Error al eliminar el servicio', error);
    res.status(500).send('Error al eliminar el servicio');
  }

})

//CERRAR SESION USUARIO
  app.post('cerrar-sesion',(req,res)=>{
    req.session.destroy((err)=>{
      if(err){
        console.error('Error al cerrar Sesión');
        res.status(500).send("Error al cerrar Sesión")
      }
      else{
        res.status(200).send("Sesión Cerrada")
      }
    })
  })

//PANEL DE ADMIN

//ACTUALIZAR

app.post('actualizar-manzanas${id_M}', async (req, res) => {
  const { Nombre, Direccion } = req.body;
  try {
    const conect = await mysql.createConnection(db);
    await conect.execute('INSERT INTO Manzanas (Nombre, Direccion) VALUES (?, ?)', [Nombre, Direccion]);
    res.status(200).send(`
    <script>
    alert("Manzana agregada exitosamente");
    window.location.href = 'Admin.html';
    </script>
    `);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send(`
    <script>
    alert("Error en el servidor");
    window.location.href = 'Admin.html';
    </script>
    `);
  }
});

app.post('actualizar-servicios${id_S}', async (req, res) => {
  const { Nombre, Tipo } = req.body;
  try {
    const conect = await mysql.createConnection(db);
    await conect.execute('INSERT INTO Servicios (Nombre, Tipo) VALUES (?, ?)', [Nombre, Tipo]);
    res.status(200).send(`
    <script>
    alert("Manzana agregada exitosamente");
    window.location.href = 'Admin.html';
    </script>
    `);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send(`
    <script>
    alert("Error en el servidor");
    window.location.href = 'Admin.html';
    </script>
    `);
  }
});

app.post('actualizar-usuarios/:idusuarios', async (req, res) => {
  const { idusuarios } = req.params;
  const { Nombre, Tipo, Contraseña, id_M1 } = req.body;
  try {
    const conect = await mysql.createConnection(db);
    await conect.execute('UPDATE usuarios SET Nombre = ?, Tipo = ?, Contraseña=?, id_M1=? WHERE idusuarios = ?', [Nombre, Tipo, Contraseña, id_M1, idusuarios]);
    res.status(200).send(`
    <script>
    alert("Usuario actualizado exitosamente");
    window.location.href = 'Admin.html';
    </script>
    `);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send(`
    <script>
    alert("Error en el servidor");
    window.location.href = 'Admin.html';
    </script>
    `);
  }
});

app.delete('eliminar-usuarios:idusuarios', async (req, res) => {
  const { id_M } = req.params;
  try {
    const conect = await mysql.createConnection(db);
    await conect.execute('DELETE FROM usuarios WHERE idusuarios = ?', [id_M]);
    res.status(200).send(`
    <script>
    alert("Usuario eliminado de manera exitosa");
    window.location.href = 'Admin.html';
    </script>
    `);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send(`
    <script>
    alert("Error en el servidor");
    window.location.href = 'Admin.html';
    </script>
    `);
  }
});

app.delete('eliminar-manzana:id_M', async (req, res) => {
  const { id_M } = req.params;
  try {
    const conect = await mysql.createConnection(db);
    await conect.execute('DELETE FROM Manzanas WHERE id_M = ?', [id_M]);
    res.status(200).send(`
    <script>
    alert("Manzana eliminada exitosamente");
    window.location.href = 'Admin.html';
    </script>
    `);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send(`
    <script>
    alert("Error en el servidor");
    window.location.href = 'Admin.html';
    </script>
    `);
  }
});

app.delete('eliminar-servicios:id_S', async (req, res) => {
  const { id_S } = req.params;
  try {
    const conect = await mysql.createConnection(db);
    await conect.execute('DELETE FROM Servicios WHERE id_S = ?', [id_S]);
    res.status(200).send(`
    <script>
    alert("Servicio eliminado exitosamente");
    window.location.href = 'Admin.html';
    </script>
    `);
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).send(`
    <script>
    alert("Error en el servidor");
    window.location.href = 'Admin.html';
    </script>
    `);
  }
});

  //Para la finalización de la conexión se hace en cada else