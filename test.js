const http = require('http');
const fetch = require('node-fetch');
const test = require('ava');

function httpGet(url) {

  return new Promise((resolve, reject) => {

    http.get(url, (result) => {

      result.on('data', (buffer) => {

        resolve(buffer.toString('utf8'));
      });  
    }).on('error', (err) => {

      reject(err);
    });
  });
}

function httpPost(url, body) {

  return fetch(url, {

          method: 'post',
          body:    JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
      })

      .then(result => result.text());
}

test('home contains <form>', async t => {

  const page = await httpGet('http://localhost:3000/');

  t.regex(page, /<form/);
});

test('page contains name of the city', async t => {

  const page = await httpPost('http://localhost:3000/ville', { ville: 'paris' });

  t.regex(page, /paris/);
});

test('city with accentuated character', async t => {

  const page = await httpPost('http://localhost:3000/ville', { ville: 'nîmes' });

  t.regex(page, /nîmes/);
});