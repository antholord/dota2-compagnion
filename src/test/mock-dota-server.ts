const http = require("http");
const fs = require("fs");

const server = http.createServer(function(req: any, res : any) {
  const data: any[] = [];

  req.on("data", (chunk: any) => {
    data.push(chunk);
  });
  req.on("end", () => {
    console.log("got update");
    fs.writeFile("dotaOutput.json", JSON.stringify(JSON.parse(data as any)), (err) => {
      console.log(err);
    });
    // console.log(data);

    // overlay?.webContents.send("game-time", time);
  });
});
server.listen(4000);
// const req = http.request({
//   hostname: "localhost",
//   port: 4000,
//   path: "/",
//   method: "POST"
// }, (res) => {
//   console.log(res);
//   res.on("data", d => {
//     process.stdout.write(d);
//   });
// });
// req.on("error", error => {
//   console.error(error);
// });
// setTimeout(() => {

// });
