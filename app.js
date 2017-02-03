import bar from './bar'
import Vue from 'vue'
import Storg from './storage'
import AV from 'leancloud-storage'

var APP_ID = 'oCA8kXF4wyGSxCIkHUcCxfxK-gzGzoHsz';
var APP_KEY = 'WTiO7VlWckiteR2gOCI3r4JU';
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});






var app = new Vue({
  el: '#app',
  components:{
    Storg
  },
  data: {
    msg: ' todo list!',
    loginName:AV.User.current()?AV.User.current().attributes.username:'',
      newItem:"",
      items:[], 
      actionType:'signUp',
      formDate:{
        username:'',
        password:'',
      },
      currentUser:null,

  },
  created: function(){
    this.currentUser = this.getCurrentUser();
    this.fetchTodos();

    

  },
  // watch:{
  //   items:{
  //     handler:function(val){
  //       Storg.save('todos-vuejs',val);

  //     },
  //     deep:true
  //   },
  //   newItem:{
  //   	handler:function(val){
  //   		Storg.save("todo-input",val)
  //   	}
  //   }
  // },
  methods:{
    saveTodo:function(){
      let dataString = JSON.stringify(this.items)     
      var AVTodos = AV.Object.extend('AllTodos');
      var avTodos = new AVTodos();
      
      let acl =new AV.ACL();
      acl.setReadAccess(AV.User.current(),true);
      acl.setWriteAccess(AV.User.current(),true);
      avTodos.set('content',dataString);
      avTodos.setACL(acl);

      
      avTodos.save().then((todo)=>{
        this.items.id=todo.id;
        console.log("保存成功");
      },function(error){
        console.error("保存失败");
      });      
    },
    updateTodos:function(){
      let dataString = JSON.stringify(this.items);
      let avTodos=AV.Object.createWithoutData('AllTodos',this.items.id);
      avTodos.set('content',dataString);
      avTodos.save().then(()=>{
        console.log('更新成功')
      })
    },
    saveOrUpdateTodos:function(){
      console.log(this.items.id)
      if(this.items.id){
        this.updateTodos();
      }else{
        this.saveTodo();
      }
    },
    fetchTodos:function(){
      if(this.currentUser){
       var query = new AV.Query('AllTodos');
       query.find()
         .then((todos)=> {
          let avAllTodos = todos[0];
          let id = avAllTodos.id;
          this.items = JSON.parse(avAllTodos.attributes.content);
          this.items.id=id;
          console.log(this.items.id)         
         }, function(error){
           console.error(error) 
         })
      }
    },
    addList:function(){ 
    let times=new Date();
    let timess=times.getFullYear()+"年"+ (times.getMonth()+1)+"月"+times.getDate()+"日";
      this.items.push({
        listcnt:this.newItem,
        isfinish:false, 
        time:timess,
      })
      this.newItem='';
      console.log(this.items.id)
      this.saveOrUpdateTodos();
    },
    toggleisfinish:function(item){
      console.log(item)
      item.isfinish=!item.isfinish;
      this.saveOrUpdateTodos();
    },
    isfinish:function(item){
      console.log(item)
      item.isfinish=!item.isfinish;
      this.saveOrUpdateTodos();
    },
    isdelete:function(index){
      let vm=this;
      let items=[];
      vm.items.map(function(val){
        if(val===vm.items[index]){
          return
        }
        items.push(val)
      })
      vm.items=items;
      this.saveOrUpdateTodos();
    },
    changBtn:function(type){
      if(type==="signup"){
        this.actionType='signUp';
      }
      if(type==="login"){
        this.actionType='login';
      }      
    },
    signUp:function(){
      let user = new AV.User();

      user.setUsername(this.formDate.username);

      user.setPassword(this.formDate.password);

      user.signUp().then((loginedUser) =>{
            // this.currentUser = this.getCurrentUser();
      alert('注册成功!');
        }, (error) => {
          alert("注册失败")
      });
    },
    login:function(){
        AV.User.logIn(this.formDate.username, this.formDate.password).then((loginedUser) => {
          this.currentUser = this.getCurrentUser();  
          this.fetchTodos();
          window.location.reload();                 
        }, function (error) {
          alert("登录失败")
        });
    },
    getCurrentUser:function(){
      let current = AV.User.current();
      if(current){
        let {id, createdAt, attributes: {username}} = AV.User.current();
        return {id,username,createdAt}
      }else{
        return null
        }
    },
    logOut:function(){
      AV.User.logOut();
      this.currentUser = null;
      window.location.reload();
    }   
  }
})                                                               
