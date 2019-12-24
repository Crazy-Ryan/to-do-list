
var storage = window.localStorage;

var count = 0;
function onClickAdd(){
  console.log("clickAdd");
  count++;
  storage.setItem(count,"string");
  console.log(count);
}