const fs = require("fs");

class Productos{
    namefile="src/db/products.txt"


    constructor(id, nombre,timestamp,descripcion,codigo,url,precio,stock){
        this.id=id;
        this.timestamp=timestamp;
        this.nombre = nombre;
        this.descripcion =descripcion;
        this.codigo =codigo;
        this.url = url;
        this.precio= precio;
        this.stock= stock;
    }

    async getById(id){
        try {
            let content = await fs.promises.readFile(this.namefile, "utf8");
            if (content != "") {
              const contentObj = JSON.parse(content);
              let obj = null;
              obj = contentObj.filter((o) => o.id == id);
              return obj;
            } else {
              return null;
            }
          } catch (error) {
            console.log(error);
          }
    }

    async getAll(limit = null) {
      try {
        let content = await fs.promises.readFile(this.namefile, "utf8");
        let contentObj = JSON.parse(content);
        if (limit) {
          contentObj = contentObj.slice(0, limit);
        }
        return contentObj;
      } catch (error) {
        console.log(error);
        throw new Error("Error al obtener todos los productos");
      }
    }

    async save(obj) {
      try {
        let content = await fs.promises.readFile(this.namefile, "utf8");
        console.log(  content != "")
        if ( content != "") {
          
          let contentObj = JSON.parse(content);
          let lastId = contentObj.at(-1).id;
          obj.id = parseInt(lastId) + 1;
          contentObj.push(obj);
          await fs.promises.writeFile(this.namefile, JSON.stringify(contentObj));
          return obj;
        } else {
          obj.id = 0;
          await fs.promises.appendFile(this.namefile, JSON.stringify([obj]));
          return obj;
        }
      } catch (error) {
        console.log(error);
        return null
      }
    }

    async deleteById(id) {
      try {
        if (isNaN(id)) {
          throw new Error('El id debe ser un número');
        }
        let content = await fs.promises.readFile(this.namefile, "utf8");
        if (content != "") {
          const contentObj = JSON.parse(content);
          let obj = null;
          obj = contentObj.filter((o) => o.id != id);
          if (obj.length === contentObj.length) {
            throw new Error(`No se encontró ningún objeto con el id ${id}`);
          }
          await fs.promises.writeFile(this.namefile, obj.length!=0?JSON.stringify(obj):"");
          return 1;
        }
      } catch (error) {
        console.log(`Error al borrar objeto con id ${id}: ${error}`);
        return null;
      }
    }

    async updateById(id, obj) {
      try {
        let content = await fs.promises.readFile(this.namefile, "utf8");
        if (content != "") {
          const contentObj = JSON.parse(content);
          const index = contentObj.findIndex((o) => o.id == id);
          if (index != -1) {
            const updatedObj = { ...contentObj[index], ...obj };
            updatedObj.id = contentObj[index].id;
            contentObj[index] = updatedObj;
            await fs.promises.writeFile(this.namefile, JSON.stringify(contentObj));
            return updatedObj;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    }

}

module.exports= Productos