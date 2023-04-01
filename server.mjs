const express = require('express');
const https = require('https');

const app = express();

app.get('/baiduIndexCount/:url', (req, res) => {
  const url = req.params.url;
  const apiUrl = `https://www.baidu.com/s?wd=site:${url}&oq=site:${url}`;

  https.get(apiUrl, (apiRes) => {
    let rawData = '';
    apiRes.on('data', (chunk) => { rawData += chunk; });
    apiRes.on('end', () => {
      try {
        const regex = /百度为您找到相关结果约([\d,]+)个/g;
        const matches = regex.exec(rawData);
        const count = parseInt(matches[1].replace(/,/g, '')); // 将逗号去掉，转成整数

        res.json({count});
      } catch (error) {
        res.status(500).json({message: '获取数据出错'});
      }
    });
  }).on('error', (error) => {
    res.status(500).json({message: error.message});
  });
});

app.listen(3000, () => {
  console.log('API服务器已启动');
});
