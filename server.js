const http = require("http");
const yargs = require("yargs");
const url = require("url");
const fs = require("fs");
const Jimp = require("jimp");

const key = 123;
const argv = yargs
  .command(
    "llave",
    "Verificador para inciar el servidor",
    {
      key: {
        describe: "Llave",
        demand: true,
        alias: "k",
      },
    },
    (args) => {
      args.key == key
        ? http
            .createServer((req, res) => {

              if (req.url == "/") {
                res.writeHead(200, { "Content-Type": "text/html" });
                fs.readFile("index.html", "utf8", (err, html) => {
                  res.end(html);
                });
              }

              if (req.url == "/style") {
                res.writeHead(200, { "Content-Type": "text/css" });
                fs.readFile("./assets/css/style.css", "utf8", (err, css) => {
                  res.end(css);
                });
              }

              if (req.url.startsWith('/imagen')) {
                const params = url.parse(req.url, true).query
                const urlImg = params.urlImg;
                Jimp.read(urlImg, (err, imagen) => {
                  imagen
                    .resize(350, Jimp.AUTO)
                    .quality(60)
                    .greyscale()
                    .writeAsync("newImg.jpg")
                    .then(() => {
                      fs.readFile("newImg.jpg", (err, Imagen) => {
                        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                        res.end(Imagen)
                      });
                    });
                });
              }
            })
            .listen(8080, () => console.log("Escuchando en 8080"))
        : console.log("Llave incorrecta");
    }
  )
  .help().argv;

/*
if(req.url.includes('/imagen')){
            const params = url.parse(req.url, true).query;
            const img = params.img;

            Jimp.read(`${img}`,(err, image) =>{
                image
                    .grayscale()
                    .quality(60)
                    .resize(350, Jimp.AUTO)
                    .writeAsync('newImg.jpg')
                    .then(() =>{
                        fs.readFile('newImg.jpg', (err, imagen) => {
                            res.writeHead(200, { 'Content-Type': 'image/jpeg'});
                            res.end(imagen);
                        });
                    })
*/
