<template>

  <div class="common-layout">
     <el-container>
       <el-header class="common-header flex-float"> 
            <div class="flex">
                 <h1 class="title">Doctor Scheme</h1>
            </div>  
            <div class="pinfo">
              <el-dropdown>
                <el-button type="primary">
                  Logout <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="loginOut">Logout</el-dropdown-item>
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
                         <span>Inquiry Administration</span>
                     </template>
                      <el-menu-item-group>
                         <el-menu-item index="/appointD">Appointment List</el-menu-item> 
                     </el-menu-item-group>
                     <el-menu-item-group>
                         <el-menu-item index="/caseD">Medical Record List</el-menu-item> 
                     </el-menu-item-group>
                     <el-menu-item-group>
                         <el-menu-item index="/reportD">Report List</el-menu-item> 
                     </el-menu-item-group>
                 </el-sub-menu>
                 <el-sub-menu index="2">
                     <template #title>
                        <el-icon><Notebook /></el-icon>
                         <span>Working Arrangement Information</span>
                     </template>
                      <el-menu-item-group>
                         <el-menu-item index="/dutyD">Working Schedule Information</el-menu-item> 
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
 import { toRefs,reactive,ref,onMounted,watch,computed } from 'vue'
 import { useRouter } from 'vue-router'
 import { useStore } from "vuex" 
 export default {
     name:"doctor",
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
        background: rgb(102, 170, 99);
        height: 10%;
        display: flex; /* 使用 Flexbox 布局 */
        align-items: center; /* 垂直居中 */
        padding: 0 20px;
     } 
     .common-aside{
         background: rgb(102, 170, 99);
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