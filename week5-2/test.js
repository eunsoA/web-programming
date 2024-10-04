function DateCalculator(date){
    this.date = new Date(date);
}

DateCalculator.prototype.calculateDays = function () {
    let today = new Date();
    let timeDiff = today.getTime() - this.date.getTime();
    let dayDiff = Math.floor(timeDiff/(1000*60*60*24));
    return dayDiff;  
};

let dateCalc = new DateCalculator('2024-09-01');

console.log(`학기가 시작하고 나서 ${dateCalc.calculateDays()}일의 시간이 지났습니다.`);