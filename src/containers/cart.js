const fs = require("fs");

class Carrito{
    namefile="src/db/cart.txt"

    constructor(id,timestamp,productos){
        this.id=id;
        this.timestamp=timestamp;
        this.productos = productos;
    }

    async getById(id){
        try {
            let content = await fs.promises.readFile(this.namefile, "utf8");
            if (content != "") {
              const contentObj = JSON.parse(content);
              let obj = null;
              obj = contentObj.filter((o) => o.id == id);
              return obj[0];
            } else {
              return null;
            }
          } catch (error) {
            console.log(error);
          }
    }

    async getAll(){
      try {
        let content = await fs.promises.readFile(this.namefile, "utf8");
        if (content != "") {
          let contentObj = JSON.parse(content);
          return contentObj;
        } else {
          return [];
        }
      } catch (error) {
        console.log(error);
      }
    }

    async save(obj) {
      console.log("hgsakjdlhjasklhdj")
      try {
        let content = await fs.promises.readFile(this.namefile, "utf8");
        console.log(  content != "")
        if ( content != "") {
          
          let contentObj = JSON.parse(content);
          let lastId = contentObj.at(-1).id;
          obj.id = lastId + 1;
          contentObj.push(obj);
          await fs.promises.writeFile(this.namefile, JSON.stringify(contentObj));
          return obj;
        } else {
          console.log("hola")
          obj.id = 0;
          await fs.promises.appendFile(this.namefile, JSON.stringify([obj]));
          return obj;
        }
      } catch (error) {
        console.log(error);
        return null
      }
    }

    async saveProduct(id,obj) {
        try {
          let content = await fs.promises.readFile(this.namefile, "utf8");
          console.log(  content != "")
          if ( content != "") {
            let contentObj = JSON.parse(content);
            let objt = null;
            objt = contentObj.filter((o) => o.id != id);
            
            await this.deleteById(id)
            objt.push(obj)
            await fs.promises.writeFile(this.namefile, JSON.stringify(objt));
            return objt;
          } else {
            
            return null;
          }
        } catch (error) {
          console.log(error);
          return null
        }
      }

    async deleteById(id) {
      try {
        let content = await fs.promises.readFile(this.namefile, "utf8");
        if (content != "") {
          const contentObj = JSON.parse(content);
          let obj = null;
          obj = contentObj.filter((o) => o.id != id);
          await fs.promises.writeFile(this.namefile, obj.length!=0?JSON.stringify(obj):"");
          return 1
        }
      } catch (error) {
        console.log(error);
        return null
      }
    }

    async deleteProductsById(id,idproduct) {
      try {
          let content = await fs.promises.readFile(this.namefile, "utf8");
          let contentObj = content!==""?JSON.parse(content):[]
      
          let obj = null;
          obj = contentObj.filter((o) => o.id == id);
          let product = obj[0].productos.filter((o) => o.id != idproduct);
          console.log(product)

          obj[0].productos = product

          
         await fs.promises.writeFile(this.namefile, JSON.stringify(contentObj));
          return 1;

      } catch (error) {
        console.log(error);
        return null
      }
      
    }

}

module.exports= Carrito