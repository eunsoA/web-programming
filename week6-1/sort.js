//배열을 선언함.
let arrayA = ['고구마', '감자','바나나'];
let arrayB = [{
    name:'고구마',
    price:1000
},{
    name:'감자',
    price:500
},{
    name:'바나나',
    price:400
}];

//기본 배열을 정렬하고 출력합니다.
arrayA.sort();
console.log('-문자열로 정렬');
console.log(arrayA);
console.log();
console.log('-문자열로 정렬(역순)');
console.log(arrayA.reverse());
console.log();

//객체 내부의 숫자로 정렬하고 출력합니다.
arrayB.sort((itemA, itemB)=>{
    return itemA.price - itemB.price;
});
console.log('-객체 내부의 숫자로 정렬');
console.log(arrayB);
console.log();

//객체 내부의 문자열로 정렬하고 출력합니다.
arrayB.sort((itemA, itemB)=>{
    if(itemA.name < itemB.name){
        return -1;
    } else if (itemA.name > itemB.name){
        return 1;
    } else {
        return 0;
    }
});
console.log('-객체 내부의 문자열로 정렬');
console.log(arrayB);
