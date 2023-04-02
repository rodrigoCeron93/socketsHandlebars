const express = require('express')

const Productos = require("./containers/products");

const {Server} = require('socket.io');
const handlebars = require("express-handlebars")
const producto = new Productos();

const app=  express()

const PORT=8080

const server= app.listen(8080,()=>{
    console.log(`servidor escuchando ${server.address().port}`)
})
server.on("error",error =>console.log(`error e el servidor ${error}`));

const socketServer = new Server(server)

app.get("/", async (req, res) => {

    const id = req.params.id;
    const limit = req.query.limit;
    try {
      if (!!id) {
        res.send(await producto.getById(id));
      } else {
   

    
        return res.render("home",{products:await producto.getAll(limit)})
  
        
        
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: -1, descripcion: "Error al obtener productos" });
    }
  
});

app.get("/realtimeproducts", async (req, res) => {
    return res.render("realtimeproducts")
  
});



socketServer.on('connection', (socket) => {
    console.log('Usuario conectado');
  
    // Manejar el evento de creación de un nuevo producto
    socket.on('new-product', async (product) => {
        console.log('Nuevo producto:', product);
        await producto.save(product)
        socket.emit('new-product-list', await producto.getAll());
      // Aquí irá el código para agregar el producto a la lista de productos y emitir un evento a todos los clientes
    });
  
    // Manejar el evento de eliminación de un producto
    socket.on('delete-product', (productId) => {
      console.log('Eliminar producto:', productId);
      // Aquí irá el código para eliminar el producto de la lista de productos y emitir un evento a todos los clientes
    });
  
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });

app.engine("hbs",handlebars.engine())
app.set("views",__dirname+"/views")
app.set("view engine","hbs")

app.use('/static',express.static(__dirname+'/public'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))



