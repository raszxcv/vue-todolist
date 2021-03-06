import Vue from 'vue'
import AV from 'leancloud-storage'
import AVKey from './cloudKey'

AV.init({
  appId: AVKey.APP_ID,
  appKey: AVKey.APP_KEY
});
var app = new Vue({
  el: '#app',
  components:{
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
      isLoginColor:false,
      isSignColor:true,
      currentUser:null,

  },
  created: function(){
    this.currentUser = this.getCurrentUser();
    this.fetchTodos();
  },
  methods:{
    saveTodo:function(){
      let dataString = JSON.stringify(this.items)     
      let AVTodos = AV.Object.extend('AllTodos');
      let avTodos = new AVTodos();
      
      let acl =new AV.ACL();
      acl.setReadAccess(AV.User.current(),true);
      acl.setWriteAccess(AV.User.current(),true);
      avTodos.set('content',dataString);
      avTodos.setACL(acl);

      
      avTodos.save().then((todo)=>{
        this.items.id=todo.id;
        // console.log("保存成功");
      },function(error){
        console.error("保存失败");
      });      
    },
    updateTodos:function(){
      let dataString = JSON.stringify(this.items);
      let avTodos=AV.Object.createWithoutData('AllTodos',this.items.id);
      avTodos.set('content',dataString);
      // avTodos.save().then(()=>{
      //   console.log('更新成功')
      // })
    },
    saveOrUpdateTodos:function(){
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
      this.saveOrUpdateTodos();
    },
    toggleisfinish:function(item){
      item.isfinish=!item.isfinish;
      this.saveOrUpdateTodos();
    },
    isfinish:function(item){
      item.isfinish=!item.isfinish;
      this.saveOrUpdateTodos();
    },
    isdelete:function(index){
      let Id = this.items.id;
      let vm=this;
      let items=[];
      vm.items.map(function(val){
        if(val===vm.items[index]){
          return
        }
        items.push(val)
      })
      vm.items=items;
      vm.items.id=Id;
      this.saveOrUpdateTodos();
    },
    changBtn:function(type){
      [this.isSignColor,this.isLoginColor]=[false,false]
      if(type==="signup"){
        this.actionType='signUp';
        this.isSignColor=true;
      }
      if(type==="login"){
        this.actionType='login';
        this.isLoginColor=true;
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
          alert("用户名已被注册")
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
