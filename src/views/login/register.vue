<template>
  <div class="common-layout">
    <el-container class="form-container">
      <el-main class="form-main">
        <div class="registration-module">
          <el-header class="form-header">register page</el-header>
          <el-radio-group v-model="accountType" class="account-type-selector">
            <el-radio-button label="student">student</el-radio-button>
            <el-radio-button label="doctor">doctor</el-radio-button>
          </el-radio-group>
          <div v-if="accountType === 'student'" class="form-content">
            <el-form ref="addform1" :model="Student" :rules="addrules1">
              <!-- 学生表单字段 -->
              <el-form-item label="id" prop="studentId" >
                <el-input v-model="Student.studentId"  placeholder="start with 'S-'"></el-input>
              </el-form-item>
              <el-form-item label="password" prop="studentPwd">
                <el-input v-model="Student.studentPwd"></el-input>
              </el-form-item>
              <el-form-item label="Name" prop="studentName">
                <el-input v-model="Student.studentName"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="studentSex">
                    <el-radio-group v-model="Student.studentSex">
                        <el-radio label="male" />
                        <el-radio label="female" />
                    </el-radio-group>
                </el-form-item>
              <el-form-item label="age" prop="age">
                <el-input v-model="Student.age"></el-input>
              </el-form-item>
              <el-form-item label="major class" prop="majorClass">
                <el-input v-model="Student.majorClass" placeholder="e.g. data science 61"></el-input>
              </el-form-item>
              <el-form-item label="phone" prop="phone">
                <el-input v-model="Student.phone" ></el-input>
              </el-form-item>
              <el-form-item label="id number" prop="idCardNum">
                <el-input v-model="Student.idCardNum"></el-input>
              </el-form-item>
            </el-form>
            <div class="flex">
                   <el-button type="primary" @click="submitaddFormS(addform1)" >确定</el-button>
               </div>
          </div>

          

          <div v-if="accountType === 'doctor'"  class="form-content">
            <el-form ref="addform2"  :model="Doctor" :rules="addrules3" >
              <el-form-item label="id" prob="doctor_id"  >
                <el-input v-model="Doctor.doctor_id" placeholder="start with'D-'"></el-input>
              </el-form-item>
              <el-form-item label="password" prop="doctor_pwd">
                <el-input v-model="Doctor.doctor_pwd"></el-input>
              </el-form-item>
              <el-form-item label="name" prop="doctor_name">
                <el-input v-model="Doctor.doctor_name"></el-input>
              </el-form-item>
              <el-form-item label="gender" prop="doctor_sex">
                    <el-radio-group v-model="Doctor.doctor_sex">
                        <el-radio label="male" />
                        <el-radio label="female" />
                    </el-radio-group>
                </el-form-item>
              <el-form-item label="age" prop="age">
                <el-input v-model="Doctor.age"></el-input>
              </el-form-item>
              <el-form-item label="department" prop="department">
                <el-input v-model="Doctor.department"></el-input>
              </el-form-item>
              <el-form-item label="title" prop="title">
                <el-input v-model="Doctor.title"></el-input>
              </el-form-item>
              <el-form-item label="head id" prop="head_of_department">
                <el-input v-model="Doctor.head_of_department"></el-input>
              </el-form-item>
              <el-form-item label="phone" prop="phone_number">
                <el-input v-model="Doctor.phone_number"></el-input>
              </el-form-item>
            </el-form>
            <div class="flex">
                   <el-button type="primary" @click="submitaddFormD(addform2)" >confirm</el-button>
               </div>
          </div>

        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { reactive,toRefs,computed,ref } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {StudentAddApi,addDocApi} from '@/util/request'
export default {
  name:'register',
  setup() {
    const router = useRouter();
    const data=reactive({
      Student:{
                studentId:'',
                majorClass:'',
                studentPwd:'',
                idCardNum:'',
                studentName:'',
                age:0,
                phone:'',
                studentSex:'',
      },
      addrules1:{
                studentId:[
                    {required:true,message:"必填",trigger:"blur"},
                    { 
                      validator: (rule, value, callback) => {
                        if (!value.startsWith('S-')) {
                          callback(new Error('账号必须以"S-"开头'));
                        } else {
                          callback();
                        }
                      },
                      trigger: 'blur'
                    }
                ],
                studentPwd:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                studentName:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                majorClass:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                idCardNum:[
                    {required:false,}
                ], 
                phone:[
                    {required:false,}
                ], 
                studentSex:[
                    {required:false,}
                ], 
                age:[
                    {required:false,}
                ], 
            },
      Doctor:{
                doctor_id:'',
                department:'',
                doctor_pwd:'',
                age:0,
                doctor_sex:'',
                doctor_name:'',
                title:'',
                head_of_department:'',
                phone_number:'',
      },
      addrules3:{
                doctor_id:[
                    {required:true,message:"必填",trigger:"blur"},
                    { 
                      validator: (rule, value, callback) => {
                        if (!value.startsWith('D-')) {
                          callback(new Error('账号必须以"D-"开头'));
                        } else {
                          callback();
                        }
                      },
                      trigger: 'blur'
                    }
                ],
                doctor_pwd:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                doctor_name:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                department:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                age:[
                    {required:true,message:"必填",trigger:"blur"}
                ], 
                doctor_sex:[
                    {required:true,message:"必填",trigger:"blur"}
                ], 
                title:[
                    {required:true,message:"必填",trigger:"blur"}
                ], 
                phone_number:[
                    {required:true,message:"必填",trigger:"blur"}
                ], 
                head_of_department:[
                {required:true,message:"必填",trigger:"blur"}
                ]
            },
      accountType: 'student',
    })
    const addform1=ref();
    const addform2=ref();
    
    const submitaddFormD = (row) => {
      addform2.value.validate((valid) => {
        if(valid){
          const formData=new URLSearchParams()
          formData.append('id',data.Doctor.doctor_id)
          formData.append('doctorName',data.Doctor.doctor_name)
          formData.append('age',data.Doctor.age)
          formData.append('department',data.Doctor.department)
          formData.append('doctorSex',data.Doctor.doctor_sex)
          formData.append('title',data.Doctor.title)
          formData.append('phoneNumber',data.Doctor.phone_number)
          formData.append('doctorPwd',data.Doctor.doctor_pwd)
          formData.append('headofdepartment',data.Doctor.head_of_department)
          addDocApi(formData).then(res=>{
            ElMessageBox.alert("success！")
            router.push('/'); 

          }).catch(error=>{
            ElMessageBox.alert("服务器错误！")
          })
        }
        else{
          ElMessage.warning('请填写必要信息');
              return false;
        }

      })
      
      //添加注册成功提示
      // 注册成功后跳转到登录页面，确保该路由在router中配置
    }
    const submitaddFormS = (row) => {
      addform1.value.validate((valid) => {
        if(valid){
          const formData=new URLSearchParams()
          formData.append('studentId',data.Student.studentId)
          formData.append('studentName',data.Student.studentName)
          formData.append('age',data.Student.age)
          formData.append('majorClass',data.Student.majorClass)
          formData.append('studentSex',data.Student.studentSex)
          formData.append('idCardNum',data.Student.idCardNum)
          formData.append('phoneNumber',data.Student.phone)
          formData.append('studentPwd',data.Student.studentPwd)
          StudentAddApi(formData).then(res=>{
            ElMessageBox.alert("注册成功！")
            router.push('/'); 
          }).catch(err=>{
            ElMessageBox.alert("服务器错误！")
          })
        }
        else{
          ElMessage.warning('请填写必要信息');
              return false;
        }
          
      })
      // 注册成功后跳转到登录页面，确保该路由在router中配置
    }
    
    return {
      ...toRefs(data),
      addform1,
      addform2,
      submitaddFormD,
      submitaddFormS,
    }
  },
};
</script>

<style scoped>
/* 为了使模块居中，整体布局采用Flex */
.common-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

/* 注册模块容器样式调整 */
.form-container {
  width: 80%; /* 根据需要调整宽度 */
  max-width: 500px; /* 最大宽度500px */
  margin: auto;
}

/* 主要内容区域样式调整为居中以及背景色微透明 */
.form-main {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 标题样式 */
.form-header {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px; /* 可调整 */
}

/* 按钮组样式 */
.account-type-selector {
  margin-bottom: 20px; /* 可调整 */
}

/* 表单内容样式 */
.form-content {
  width: 100%;
}
</style>