const http = require('http');

const server = http.createServer((req, res)=>{
  const data = {
    "id": 1,
    "name": "tony"
  }

  
  const jsonData = JSON.stringify(data);

  res.writeHead(200, {
    'Content-type': 'application/json; charset=utf-8'
  });

  res.write(jsonData);
  res.end();

});

server.listen(3000, ()=>{
  console.log('🚀服务已启动');
});