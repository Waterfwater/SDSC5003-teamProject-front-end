<template>


  <div class="common-layout">
     <el-container>
       <el-header class="common-header flex-float"> 
            <div class="flex">
                 <h1 class="title">backend management</h1>
            </div>  
            <div class="pinfo">
              <el-dropdown>
                <el-button type="primary">
                  logout<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="loginOut">logOut</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
       </el-header>
       <el-container>
         <el-aside class="common-aside" width="200px">
             <el-menu
                 background-color="none"
                 text-color="#fff"
                 :router="true"
             >
                 <el-sub-menu index="1">
                     <template #title> 
                         <el-icon><Avatar /></el-icon>
                         <span>user management</span>
                     </template>
                      <el-menu-item-group>
                         <el-menu-item index="/Studentuser">Student id list</el-menu-item> 
                     </el-menu-item-group>
                     <el-menu-item-group>
                         <el-menu-item index="/Teacheruser">Teacher id list</el-menu-item> 
                     </el-menu-item-group>
                     <el-menu-item-group>
                         <el-menu-item index="/Doctoruser">doctor id list</el-menu-item> 
                     </el-menu-item-group>
                 </el-sub-menu>
                 <el-sub-menu index="2">
                     <template #title>
                        <el-icon><Notebook /></el-icon>
                         <span>appointment management</span>
                     </template>
                      <el-menu-item-group>
                         <el-menu-item index="/appoint">appointment information management</el-menu-item> 
                         <el-menu-item index="/caseM">medical record list</el-menu-item> 
                     </el-menu-item-group>
                 </el-sub-menu>
                
             </el-menu>
         </el-aside>
         <el-main>
             
         <!-- router-view -->
         <router-view></router-view>
         </el-main>
       </el-container>
     </el-container>
   </div>
   
 </template>
 <script>
 import { useRouter } from 'vue-router'
 import { useStore } from "vuex" 
 export default {
     name:"manage",
     setup() {
         const store = useStore()
         const router = useRouter()
         const loginOut=()=>{
          localStorage.removeItem("loginData");
          store.commit('setUserInfo', {});
          router.push({
                path:"/"
          })
         }
        const pinfoTo=()=>{
          router.push({
            path:"/"
          })
        }
        return{
          loginOut
        }
     }
 }
 </script> 
 <style scoped>
     .el-container{
         height: 100vh;
         overflow: hidden;
     }
     .common-header{
        background: rgb(69, 75, 84); 
        height: 10%;
        display: flex; /* 使用 Flexbox 布局 */
        align-items: center; /* 垂直居中 */
        padding: 0 20px;
     } 
     .common-aside{
         background: rgb(69, 75, 84);
     }
     .logo{
         width: 80px;
     }
     .title{
         color: #fff;
     }
     .el-main{
         background: #efefef;
     }
     .flex {
          flex: 1; /* 推动其他元素到边缘 */
      }
     .pinfo{
       margin-right:100px;
     }
 </style>