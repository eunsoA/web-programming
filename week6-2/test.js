function print(dan) {
    return new Promise((resolve) => {
        setTimeout(() => {
            for (let i = 1; i <= 9; i++) {
                console.log(`${dan} x ${i} = ${dan * i}`);
            }
            resolve();
        }, 1000);
    });
}

print(2) // 2단 출력
    .then(() => {
        return print(3); // 3단 출력
    })
    .then(() => {
        console.log("2단과 3단 출력이 끝났습니다.");
        return print(5); // 5단 출력
    })
    .then(() => {
        console.log("모든 출력이 완료되었습니다.");
    })
    .catch((error) => {
        console.error("에러 발생:", error);
    });