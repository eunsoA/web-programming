let date = new Date();

switch (date.getMonth()+1){
    case 12:
    case 1:
    case 2:
        console.log("겨울입니다.");
        break;
    case 3:
    case 4:
    case 5:
        console.log("봄입니다.");
        break;
    case 6:
    case 7:
    case 8:
        console.log("여름입니다.");
        break;
    case 9:
    case 10:
    case 11:
        console.log("가을입니다.");
        break;
    default:
        console.log("대체 어떤 행성에 살고 계신가요?");
        break;
}