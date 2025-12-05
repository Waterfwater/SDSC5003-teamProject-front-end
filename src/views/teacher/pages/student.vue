<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>学生账号列表</el-breadcrumb-item> 
        </el-breadcrumb>
        <!-- 内容区域 -->
        <div class="page_content">
            <div class="flex">
                <div class="input_box">
                    <el-input
                        v-model="searchParams.query"
                        placeholder="搜索关键字"
                        class="input-with-select"
                        > 
                        <template #append>
                            <el-button @click="filter"><el-icon><Search /></el-icon></el-button>
                        </template>
                    </el-input>
                </div>
            </div>
            <!-- 表格 -->
            <!-- 
              el-table  的  data:要展示的数据数组
              el-table-column：列 prop每条数据的对应属性
                label：列标题
                scope.row:相当于一条数据
             -->
            <el-table class="table" :data="paginatedData" style="width: 100%">
                <el-table-column prop="student_id" label="id" width="100" />
                <el-table-column prop="student_pwd" label="password" width="100"/>
                <el-table-column prop="student_name" label="name" width="100"/>
                <el-table-column prop="student_sex" label="gender" width="100"/>
                <el-table-column prop="age" label="age" width="100"/>
                <el-table-column prop="major_class" label="major/class" width="100"/>
                <el-table-column prop="phone_number" label="phone " />
                <el-table-column prop="idcard_num" label="id number" />
                <el-table-column   label="report" > 
                    <template #default="people">
                        <el-button type="primary" @click="editRow(people.row)">view report</el-button>
                    </template>
                </el-table-column>
                <!-- mg_state 状态 -->
            </el-table>
            
                <!-- 分页 -->
                <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :total="total"
                :small="small"  
                layout="total, prev, pager, next, jumper"
                @current-change="handleCurrentChange"
                />
            
        </div>

        

        <!-- 报告弹窗 -->
        <el-dialog v-model="editUser.dialogedit" title="info about this student">
            <el-form ref="editForm" :model="editUser">
            <el-form-item label="name" prop="student_name">
                <el-input v-model="editUser.student_name" readonly />
            </el-form-item>
            <el-form-item label="phone"> 
                <el-input v-model="editUser.phone_number" readonly/>
            </el-form-item>
            <el-form-item label="condition description">
                <el-input v-model="editUser.case_description" readonly />
            </el-form-item>
            <el-form-item label="suggestion">
                <el-input v-model="editUser.diagnose_Message" readonly />
            </el-form-item>
            <el-form-item label="teacher's name">
                <el-input v-model="editUser.teacher_name" readonly />
            </el-form-item>
            <el-form-item label="teacher's phone">
                <el-input v-model="editUser.phone" readonly/>
            </el-form-item>
            
            </el-form>
           <template #footer>
               <div class="flex">
                   <el-button type="primary" @click="editCancel" >confirm</el-button>
               </div>
           </template>
        </el-dialog>
       
       
    </div>
</template>
<script>
import { toRefs,reactive,ref,onMounted,watch,computed,res } from 'vue'
import { studentListApi,studentRepApi,TstudentApi } from '@/util/request'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name:"studentT",
    setup(){
        const data=reactive({
            searchParams:{
                query:"",
                // pagenum:2,
                // pagesize:7,
            },
            editUser:{
                dialogedit:false,
                studentId:'',
                case_description:'',
                diagnose_Message:'',
                student_name:'',
                phone_number:'',
                teacher_name:'',
                phone:'',
            },
            StudentList:[],
            filteredStudentList:[],
            total:0,
            currentPage: 1, // 当前页
            pageSize: 11,
            
        })
        const handleCurrentChange = newVal => {
            data.currentPage = newVal;
        }

        // 分页器数据
        const paginatedData = computed(() => {
            const start = (data.currentPage - 1) * data.pageSize;
            const end = start + data.pageSize;
            return data.filteredStudentList.slice(start, end);
        });

        const filter = () => {
            const query = data.searchParams.query.trim().toLowerCase();
            if (!query) {
                data.filteredStudentList = data.StudentList;
                data.total = data.filteredStudentList.length; // 更新总数据量
                data.currentPage = 1; // 搜索后重置到第一页
                return;
            }
            data.filteredStudentList = data.StudentList.filter(student => {
                
                return (
                    (student.student_name && student.student_name.toLowerCase().includes(query)) ||
                    (student.student_id && student.student_id.toString().toLowerCase().includes(query)) ||
                    (student.major_class && student.major_class.toLowerCase().includes(query)) ||
                    (student.phone_number && student.phone_number.toString().toLowerCase().includes(query))||
                    (student.student_pwd && student.student_pwd.toString().toLowerCase().includes(query))||
                    (student.age && student.age.toString().toLowerCase().includes(query))||
                    (student.idcard_num && student.idcard_num.toString().toLowerCase().includes(query))||
                    (student.student_sex && student.student_sex.toString().toLowerCase().includes(query))
                    // 注意所有的字段现在都进行了存在性检查
                );
            });
            data.total = data.filteredStudentList.length; // 更新总数据量
            data.currentPage = 1; // 搜索后重置到第一页
        }
        const searchList=()=>{


            const formData=new URLSearchParams()
            const data1 = JSON.parse(localStorage.getItem("loginData"));

            formData.append('teacherId',data1.id)
            TstudentApi(formData).then(res=>{
                data.StudentList=res.data
                data.total=res.totalNum
                data.filteredStudentList=data.StudentList
            }).catch(error=>{
                ElMessage.error("服务器错误")
            })
        }
       
        
        //查看用户
        const editRow=(row)=>{
            const {student_id}=row
            data.editUser.studentId=student_id
            const formData=new URLSearchParams()
            formData.append('student_id',data.editUser.studentId)
            studentRepApi(formData).then(res=>{
                const data2=res.data[0]
                data.editUser.case_description=data2.case_description
                data.editUser.diagnose_Message=data2.diagnose_Message
                data.editUser.phone=data2.phone
                data.editUser.phone_number=data2.phone_number
                data.editUser.student_name=data2.student_name
                data.editUser.teacher_name=data2.teacher_name
                console.log(data.editUser)
                data.editUser.dialogedit=true
            }).catch(error=>{
                ElMessage.warning('该学生没有此信息')
            })
        }
        const editCancel=()=>{
            data.editUser={
                dialogedit:false,
                studentId:'',
                case_description:'',
                diagnose_Message:'',
                student_name:'',
                phone_number:'',
                teacher_name:'',
                phone:'',
            }
        }
        const editForm=ref()

        
        

        watch(paginatedData, (newData) => {
            // 当分页数据改变时，更新表格内容
            // 这里不需要处理任何逻辑，因为视图会自动与 paginatedData 保持同步
        });

        onMounted(() => {
            searchList(); // 组件挂载后立即执行 searchList
        });



        return{
            ... toRefs(data),
            watch,
            filter,
            searchList,
            editRow,
            computed,
            paginatedData,
            handleCurrentChange,
            editCancel,
            editForm,
        }
    }
}
</script>
<style scoped>
.data-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
.flex{
    margin-top: 16px;
}
.table{
    margin-top: 10px;
}
</style>