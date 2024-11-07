const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc,[k,v])=>{
            acc[k.trim()] = decodeURLComponent(v);
            return acc;
        }, {});

const session = {};

http.createServer(async (req,res) => {
    const cookie = parseCookies(req.headers.cookie);
    if(req.url.startsWith('\login')){
        const {query} = url.parse(req.url);
        const {name} = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes()+5);
        const uniqueInt = Date.now();
        session[uniqueInt] = {
            name,
            expires,
        };
        res.writeHead(302, {
            Location : '/',
            'set-cookie':`session=${uniqueInt}; Expires=${expires.toGMTString()};
            httpOnly; Path=/`,
        });
        res.end();
    }else if(){

    } else {
        
    }
})
    .listen(8085, ()=>{
        console.log('8085번 포트에서 서버 대기 중입니다!');
    });