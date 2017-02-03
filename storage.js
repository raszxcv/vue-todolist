const STORAGE_KEY='todos-vuejs';
const STORAGE_KEY2="todo-input";
const STORAGE_KEY3="login";

export default{
	fetch:function(type,thiss){
		if(type==='todos-vuejs'){
			console.log(thiss)
			// thiss.currentUser = thiss.getCurrentUser();
			return JSON.parse(window.localStorage.getItem(STORAGE_KEY)||'[]')
		}
		if(type==="todo-input"){
			return JSON.parse(window.localStorage.getItem(STORAGE_KEY2)||'[]')
		}
		if(type==="login"){
			return JSON.parse(window.localStorage.getItem(STORAGE_KEY3)||null)
		}
		
	},
	save:function(type,items){
		if(type==='todos-vuejs'){
			return window.localStorage.setItem(STORAGE_KEY,JSON.stringify(items))
		}
		if(type==="todo-input"){
			return window.localStorage.setItem(STORAGE_KEY2,JSON.stringify(items))
		}
		if(type==="login"){
			return window.localStorage.setItem(STORAGE_KEY3,JSON.stringify(items))
		}
		
	},
	remove:function(){
		return window.localStorage.removeItem(STORAGE_KEY3)
	}
}