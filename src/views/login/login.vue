<template>
  <div class="common-layout">
    <el-container class="container">
      <el-header class="head">
        <div class="tit">
                <h1 class="title" style="font-size: 40px;">Psychological Counseling Appointment Platform</h1>
        </div> 
      </el-header>
      <el-main class="main">
        <div class="form_wrap">
          <h1 style="text-align: center;">Account Login</h1>
          <el-form
              ref="ruleFormRef"
              :model="loginData"
              label-width="100px"
              class="demo-dynamic"
          >
              <el-form-item 
                  label="User ID" 
                  prop="id"
                  :rules="[
                      {
                        required:true,
                        message:'Required',
                        trigger:'blur',
                      },
                  ]"
              >
                <el-input v-model="loginData.id"/>
              </el-form-item>
              <el-form-item 
                  label="Password" 
                  prop="password"
                  :rules="[
                      {
                        required:true,
                        message:'Required',
                        trigger:'blur',
                      },
                  ]"
              >
                <el-input
                  v-model="loginData.password" type="password"/>
              </el-form-item>
              <el-form-item>
                <el-button class="button" type="primary" plain @click="submitForm">Login</el-button>
                <el-button class="button" type="primary" plain @click="resetForm">Reset</el-button>
                
              </el-form-item>
              <el-form-item>
                No account? 
                <el-link @click="regForm">Click to Register <el-icon><User /></el-icon></el-link>
              </el-form-item>
            </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import { ref } from 'vue';
import { reactive,toRefs } from 'vue'
import{ useStore }from "vuex"
import  {useRouter} from "vue-router"
import {loginApi} from "@/util/request"
import { ElMessage } from 'element-plus';
export default {
    name:"login",
    setup(){
        const store =useStore()
        const router = useRouter()
        const count=store.state.number.count
        const ruleFormRef = ref(null);//创建引用
        const data=reactive({
          loginData:{
                id:"",
                password:""
            },
          loginFlag:{
                currentState:"",
                url:""
          },
          num:count, 
        })
        
        const submitForm = () => {
          // 验证表单
          ruleFormRef.value.validate((valid) => {
            if (valid) {
              const formData = new URLSearchParams();
              formData.append('id', data.loginData.id);
              formData.append('password', data.loginData.password);
              loginApi(formData).then(res => {
                if (res.currentState != "fail") {
                  store.commit('setUserInfo', data.loginData);
                  // localStorage.setItem("loginData", JSON.stringify(loginData))
                  // 跳转
                  router.push({
                    path: ("/" + res.url)
                  })
                  
                }
                else{
                  ElMessage.error('登录失败，账号或密码错误');
                }
              }).catch(error => {
                // 异常处理
                // ...省略的异常处理代码...
                ElMessage.error('登录失败，账号或密码错误');
              });
            } else {
              ElMessage.error('请填写必要信息');
              return false;
            }
          });
        }
        
        //重置方法
        const resetForm = () => {
          // 重置 loginData 对象
          data.loginData.id = "";
          data.loginData.password = "";
          
          // 如果存在表单引用，则调用其 reset 方法
          if (ruleFormRef.value) {
            ruleFormRef.value.resetFields();
          }
        };
        
        const regForm = () => {
          //跳转到注册页面
          router.push({
            path:("/register")
          })
        }
        return{
            ...toRefs(data),
            resetForm,
            submitForm,
            regForm,
            ruleFormRef,
        }
    }
}
</script>

<style  scoped>
    .common-layout{
      background-image: url('@/assets/login.png');
      background-size: cover;
      background-position: center;
    }
    .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    }
    .head{
      background:rgba(202, 242, 251, 0.534);
      height: 140px;
    }
    .tit{
      display: flex; /* 使用flex布局对齐图像和标题 */
      align-items: center; /* 垂直居中对齐 */
      justify-content: flex-start; /* 使内容靠左对齐 */
      margin-left: 5%;
    }
    .logo {
      width: 120px; /* 设置图片最大宽度是其原始宽度的50% */
      height: auto; /* 设置图片高度自动，以保持长宽比 */
    }
    .form_wrap{
        position: fixed;
        border-radius: 5px;
        background-color: rgba(202, 242, 251, 0.688);
        top:50%;
        left: 50%;
        transform: translate(60%, -50%);
        padding:10px 20px;
    }
</style>