const express = require('express');
const app = express();
const port = 3000;

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