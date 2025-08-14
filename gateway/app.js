const app=require("express")();
const proxy=require("express-http-proxy");

app.use('/user',proxy('http://localhost:3001'));
app.use('/captain',proxy('http://localhost:3002'));
app.use('/rides',proxy('http://localhost:3003'));

app.listen(3000,()=>console.log("Gateway listening on port http://localhost:3000"));