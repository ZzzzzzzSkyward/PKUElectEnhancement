var isHidden=1;//此行可修改
var collegeName="某个学院"//此行可修改，初衷是删掉所以已经选掉的培养方案课程
var zz;

for(zz of document.getElementsByTagName('span')){

if(zz.innerText){

if(zz.innerText.match(/([0-9]{2,3}) \/ \1/)){

if(!isHidden){

zz.parentElement.parentElement.style.opacity='0.5'

}else{

zz.parentElement.parentElement.style.display='none';}

}else if(zz.innerText==collegeName){

if(!isHidden){

zz.parentElement.parentElement.style.opacity="0.5";

}else{

zz.parentElement.parentElement.style.display='none';


}}}}
