<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/manage' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Teacher Account List</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- Content Area -->
        <div class="page_content">
            <div class="flex">
                <div class="input_box">
                    <el-input
                        v-model="searchParams.query"
                        placeholder="Search keyword"
                        class="input-with-select"
                    >
                        <template #append>
                            <el-button @click="filter"><el-icon><Search /></el-icon></el-button>
                        </template>
                    </el-input>
                </div>
                <!-- <el-button type="primary" style="margin-left: 1000px;" @click="addUserb">Create User</el-button> -->
            </div>

            <!-- Table -->
            <el-table class="table" :data="paginatedData" style="width: 100%">
                <el-table-column prop="teacher_id" label="Account ID" width="100" />
                <el-table-column prop="passwd" label="Password" width="100" />
                <el-table-column prop="teacher_name" label="Name" width="100" />
                <el-table-column prop="major_class" label="Managed Class" width="120" />
                <el-table-column prop="phone" label="Phone Number" />
                <!-- Operation column commented out -->
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

        <!-- Add User Dialog -->
        <el-dialog v-model="addUser.dialogadd" title="Create User">
            <el-form
                ref="addForm"
                :model="addUser"
                :rules="addrules"
            >
                <el-form-item label="Account ID" prop="teacher_id">
                    <el-input v-model="addUser.teacher_id" placeholder="Enter account ID" />
                </el-form-item>
                <el-form-item label="Password" prop="passwd">
                    <el-input v-model="addUser.passwd" placeholder="Enter password" />
                </el-form-item>
                <el-form-item label="Teacher Name" prop="teacher_name">
                    <el-input v-model="addUser.teacher_name" placeholder="Enter teacher name" />
                </el-form-item>
                <el-form-item label="Managed Class" prop="major_class">
                    <el-input v-model="addUser.major_class" placeholder="Enter class, e.g., SE2102" />
                </el-form-item>
                <el-form-item label="Phone Number" prop="phone">
                    <el-input v-model="addUser.phone" placeholder="Enter phone number" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex">
                    <el-button @click="addCancel">Cancel</el-button>
                    <el-button type="primary" @click="submitaddForm(addForm)">Confirm</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- Edit User Dialog -->
        <el-dialog v-model="editUser.dialogedit" title="Edit User Information">
            <el-form
                ref="editForm"
                :model="editUser"
                :rules="addrules"
            >
                <el-form-item label="Account ID" prop="teacher_id">
                    <el-input v-model="editUser.teacher_id" />
                </el-form-item>
                <el-form-item label="Password" prop="passwd">
                    <el-input v-model="editUser.passwd" />
                </el-form-item>
                <el-form-item label="Teacher Name" prop="teacher_name">
                    <el-input v-model="editUser.teacher_name" />
                </el-form-item>
                <el-form-item label="Managed Class" prop="major_class">
                    <el-input v-model="editUser.major_class" />
                </el-form-item>
                <el-form-item label="Phone Number" prop="phone">
                    <el-input v-model="editUser.phone" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="flex">
                    <el-button @click="editCancel">Cancel</el-button>
                    <el-button type="primary" @click="submiteditForm(editForm)">Confirm</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { toRefs,reactive,ref,onMounted,watch,computed } from 'vue'
import { teacherListApi } from '@/util/request'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name:"Suser",
    setup(){
        const data=reactive({
            searchParams:{
                query:"",
                // pagenum:2,
                // pagesize:7,
            },
            addUser:{
                dialogadd:false,
                teacher_id:'',
                major_class:'',
                passwd:'',
                teacher_name:'',
                phone:'',
            },
            editUser:{
                dialogadd:false,
                teacher_id:'',
                major_class:'',
                passwd:'',
                teacher_name:'',
                phone:'',
            },
            UserList:[],
            filteredUserList:[],
            total:0,
            currentPage: 1, // 当前页
            pageSize: 11,
            addrules:{
                teacher_id:[
                    {required:true,message:"必填",trigger:"blur"},
                    
                ],
                
                passwd:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                teacher_name:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                major_class:[
                    {required:true,message:"必填",trigger:"blur"}
                ],
                phone:[
                    {required:true,}
                ], 
            },
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
                    (user.teacher_name && user.teacher_name.toLowerCase().includes(query)) ||
                    (user.teacher_id && user.teacher_id.toString().toLowerCase().includes(query)) ||
                    (user.major_class && user.major_class.toLowerCase().includes(query)) ||
                    (user.phone && user.phone.toString().toLowerCase().includes(query))||
                    (user.passwd && user.passwd.toString().toLowerCase().includes(query))
                    // 注意所有的字段现在都进行了存在性检查
                );
            });
            data.total = data.filteredUserList.length; // 更新总数据量
            data.currentPage = 1; // 搜索后重置到第一页
        }
        const searchList=()=>{//
            teacherListApi().then(res=>{
                data.UserList=res.data
                data.filteredUserList=data.UserList
            }).catch(error=>{
                ElMessage.error("服务器错误")
            })
        }
        //新建用户
        const addUserb=()=>{
            data.addUser.dialogadd=true

        }
        const submitaddForm=(form)=>{//更改
            // validate
            form.validate(res=>{
                if(!res){
                    ElMessage.warning("请填写必要信息")
                    return
                }
                // 表单通过请求接口
                const formData = new URLSearchParams();
                // formData.append('studentId', data.addUser.studentId);
                // formData.append('majorClass', data.addUser.majorClass);
                // formData.append('passWord', data.addUser.studentPwd);
                // formData.append('idCardNum', data.addUser.idCardNum);
                // formData.append('studentName', data.addUser.studentName);
                // formData.append('phone', data.addUser.phone);
                // formData.append('studentSex', data.addUser.studentSex);
                // formData.append('age', data.addUser.age);
                StudentAddApi(formData).then(res=>{
                    if(res.data){ 
                        // 隐藏弹窗
                        data.dialogFormVisible=false
                        // 清空form
                        addCancel
                        // 重新更新列表 
                        ElMessageBox.alert('新建成功...', '恭喜！')
                        searchList()
                    }
                }).catch(error=>{
                    ElMessage.error("新建用户失败")
                })
            })
        }
        const addCancel=()=>{//更改
            data.addUser={
                dialogadd:false,
                teacher_id:'',
                major_class:'',
                passwd:'',
                teacher_name:'',
                phone:'',
            }
        }
        const addForm=ref()
        
        //编辑用户
        const editRow=(row)=>{
            // const {student_id,major_class,student_pwd,age,student_name,phone_number,idcard_num,student_sex}=row//更改
            // data.editUser.dialogedit=true
            // data.editUser.studentId=student_id
            // data.editUser.age=age
            // data.editUser.idCardNum=idcard_num
            // data.editUser.majorClass=major_class
            // data.editUser.studentPwd=student_pwd
            // data.editUser.studentName=student_name
            // data.editUser.phone=phone_number
            // data.editUser.studentSex=student_sex
        }
        const editCancel=()=>{//更改
            data.editUser={
                dialogadd:false,
                teacher_id:'',
                major_class:'',
                passwd:'',
                teacher_name:'',
                phone:'',
            }
        }
        const submiteditForm=(form)=>{//更改
            // form.validate(res=>{
            //     if(!res){
            //         ElMessage.warning("请填写必要信息!")
            //         return
            //     }
            //     // 提交修改

            //     userChangeInfoApi(data.formData2).then(res=>{
            //         if(res.data){ 
            //             editCancel
            //             ElMessageBox.alert('修改成功...', '恭喜！')
            //             searchList()
            //         }
            //     }).catch(error=>{
            //         ElMessage.error("修改失败")
            //     })
            // })
        }
        const editForm=ref()

        
        // 删除数据
        const deleteRow=row=>{//更改
            console.log("删除的那条数据",row.teacher_id)
            const formData = new URLSearchParams();
            formData.append('id',row.teacher_id);
            StudentDeleteApi(formData).then(res=>{
                ElMessageBox.alert('删除成功', '恭喜！')
                searchList()
            }).catch(error=>{
                ElMessageBox.alert('删除失败...', '遗憾！')
            }) 
        }

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
            deleteRow,
            computed,
            paginatedData,
            handleCurrentChange,
            addUserb,
            submitaddForm,
            addForm,
            addCancel,
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