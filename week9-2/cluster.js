cluster.on('exit',(worker, code, signal)=>{
    console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
    console.log('code', code, 'signal',signal);
    cluster.fork();
});

cluster.on('exit',(worker,code, signal)=>{
    console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
    console.log('code',code,'signal',signal);
    cluster.fork();
});