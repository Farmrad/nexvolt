const DB = {

get(key){
return JSON.parse(localStorage.getItem(key)) || [];
},

set(key,value){
localStorage.setItem(key, JSON.stringify(value));
},

push(key,item){
let data = this.get(key);
data.push(item);
this.set(key,data);
return item;
},

delete(key,index){
let data = this.get(key);
data.splice(index,1);
this.set(key,data);
}

};
