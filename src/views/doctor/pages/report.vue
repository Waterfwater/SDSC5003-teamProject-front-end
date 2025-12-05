<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/manage' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Report List</el-breadcrumb-item> 
        </el-breadcrumb>

        <!-- Content Area -->
        <div class="page_content">
            <div class="flex">
                <div class="input_box">
                    <el-input
                        v-model="searchParams.query"
                        placeholder="Search Keywords"
                        class="input-with-select"
                    >
                        <template #append>
                            <el-button @click="filter"><el-icon><Search /></el-icon></el-button>
                        </template>
                    </el-input>
                </div>
            </div>

            <!-- Table -->
            <el-table class="table" :data="paginatedData" style="width: 100%">
                <el-table-column prop="doctor_id" label="Doctor ID" width="100" />
                <el-table-column prop="student_id" label="Student ID" width="100"/>
                <el-table-column prop="student_name" label="Student Name" width="100"/>
                <el-table-column prop="student_sex" label="Gender" width="100"/>
                <el-table-column prop="phone_number" label="Student Phone" width="100"/>
                <el-table-column prop="teacher_id" label="Teacher ID" width="100"/>
                <el-table-column prop="phone" label="Teacher Phone" width="100"/>
                <el-table-column prop="case_description" label="Diagnosis Description" width="100"/>
                <el-table-column prop="diagnose_Message" label="Suggestion" width="100"/>
                <el-table-column label="Actions">
                    <template #default="people">
                        <el-button type="primary" @click="editRow(people.row)">Edit</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- Pagination -->
            <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :total="total"
                :small="small"
                layout="total, prev, pager, next, jumper"
                @current-change="handleCurrentChange"
            />
        </div>

        <!-- Edit Dialog -->
        <el-dialog v-model="editUser.dialogedit" title="Edit Report Information">
           
           <el-form 
            ref="editForm"
            :model="editUser"
           >
               <el-form-item label="Report Information" prop="doctor_id">
                   <el-input v-model="editUser.diagnose_Message" />
               </el-form-item>
               
           </el-form>
           <template #footer>
               <div class="flex">
                   <el-button @click="editCancel">Cancel</el-button>
                   <el-button type="primary" @click="submiteditForm(editForm)" >Confirm</el-button>
               </div>
           </template>
        </el-dialog>
       
    </div>
</template>

<script>
import { toRefs,reactive,ref,onMounted,watch,computed } from 'vue'
import { studentRepApi,writeRepApi } from '@/util/request'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name:"Duser",
    setup(){
        const data=reactive({
            searchParams:{
                query:"",
                // pagenum:2,
                // pagesize:7,
            },
            editUser:{
                dialogadd:false,
                diagnose_Message:'',
                student_Id:'',
            },
            UserList:[],
            filteredUserList:[],
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
            return data.filteredUserList.slice(start, end);
        });

        const filter = () => {
            const query = data.searchParams.query.trim().toLowerCase();
            if (!query) {
                data.filteredUserList = data.UserList;
                data.total = data.filteredUserList.length; // 更新总数据量
                data.currentPage = 1; // 搜索后重置到第一页
                return;
            }
            data.filteredUserList = data.UserList.filter(user => {//更改
                
                return (
                    (user.student_id && user.student_id.toLowerCase().includes(query)) ||
                    (user.doctor_id && user.doctor_id.toString().toLowerCase().includes(query)) ||
                    (user.student_name && user.student_name.toLowerCase().includes(query)) ||
                    (user.phone_number && user.phone_number.toString().toLowerCase().includes(query))||
                    (user.student_sex && user.student_sex.toString().toLowerCase().includes(query))||
                    (user.teacher_id && user.teacher_id.toString().toLowerCase().includes(query))||
                    (user.phone && user.phone.toString().toLowerCase().includes(query))||
                    (user.case_description && user.case_description.toString().toLowerCase().includes(query))||
                    (user.diagnose_Message && user.diagnose_Message.toString().toLowerCase().includes(query))
                    // 注意所有的字段现在都进行了存在性检查
                );
            });
            data.total = data.filteredUserList.length; // 更新总数据量
            data.currentPage = 1; // 搜索后重置到第一页
        }
        const searchList=()=>{//
            const formData=new URLSearchParams()
            const data1 = JSON.parse(localStorage.getItem("loginData"));
            formData.append('doctor_id',data1.id)
            studentRepApi(formData).then(res=>{
                data.total=res.totalNum
                data.UserList=res.data
                data.filteredUserList=data.UserList
            }).catch(error=>{
                ElMessage.warning("暂无报告信息")
            })
        }
        
        
        //编辑用户
        const editRow=(row)=>{
            const {diagnose_Message,student_id}=row//更改
            data.editUser.student_Id=student_id
            data.editUser.diagnose_Message=diagnose_Message
            data.editUser.dialogedit=true
        }
        const editCancel=()=>{//更改
            data.editUser={
                dialogadd:false,
                diagnose_Message:'',
                student_Id:'',
            }
        }
        const submiteditForm=(form)=>{//更改
            form.validate(res=>{
                if(!res){
                    ElMessage.warning("请填写必要信息!")
                    return
                }
                const formData=new URLSearchParams()
                formData.append('diagnose_message',data.editUser.diagnose_Message)
                formData.append('studentId',data.editUser.student_Id)
                // 提交修改
                writeRepApi(formData).then(res=>{
                    
                        editCancel
                        ElMessageBox.alert('修改成功...', '恭喜！')
                        searchList()
                    
                }).catch(error=>{
                    ElMessage.error("修改失败")
                })
            })
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
            submiteditForm,
            editForm,
        }
    }
}
</script>
<style scoped>
.flex{
    margin-top: 16px;
}
.table{
    margin-top: 10px;
}
</style>