const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, ()=>{
  console.log('🚀server is running');
});

app.get('/', (req, res)=>{
  res.send('hello')
})

const data = [
  {
    id: 1,
    title: 'my',
    author: 'tony'
  },
  {
    id: 2,
    title: 'you',
    author: 'tom'
  }
];

app.get('/posts', (req, res)=>{
  res.send(data);
});

app.get('/posts/:postId', (req, res)=>{
  // 获取params
  const {postId} = req.params;

  // 筛选数据
  const posts = data.filter(item=> item.id == postId);

  res.send(posts[0]);
});

app.post('/posts', (req, res)=>{
  const {content} = req.body;

  res.status(201);

  console.log(req.headers['my-name']);

  // 响应设置头部数据
  res.set('title', 'the first day');

  res.send({
    message: `成功创建了内容${content}`
  })
});