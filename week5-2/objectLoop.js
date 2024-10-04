let object = {
    name:'바나나',
    price : 1200
};

for (let key in object){
    console.log(`${key}: ${object[key]}`);
}