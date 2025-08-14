const app=require('./app');
const http=require('http');

const server=http.createServer(app);

server.listen(3003,()=>{
  console.log("Ride listening on port 3003");
});