<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/manage' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Doctor Account List</el-breadcrumb-item>
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
                <el-button type="primary" style="margin-left: 1000px;" @click="addUserb">
                    Create User
                </el-button>
            </div>

            <!-- Table -->
            <el-table class="table" :data="paginatedData" style="width: 100%">
                <el-table-column prop="doctor_id" label="Account ID" width="100" />
                <el-table-column prop="doctor_pwd" label="Password" width="100"/>
                <el-table-column prop="doctor_name" label="Name" width="100"/>
                <el-table-column prop="age" label="Age" width="100"/>
                <el-table-column prop="doctor_sex" label="Gender" width="100"/>
                <el-table-column prop="department" label="Department" width="100"/>
                <el-table-column prop="title" label="Title" width="100"/>
                <el-table-column prop="head_of_department" label="Director ID" width="100"/>
                <el-table-column prop="phone_number" label="Phone Number" />

                <el-table-column label="Operation">
                    <template #default="people">
                        <el-button type="primary" @click="editRow(people.row)">Edit</el-button>
                        <el-button type="danger" @click="deleteRow(people.row)">Delete</el-button>
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

        <!-- Add User Dialog -->
        <el-dialog v-model="addUser.dialogadd" title="Create User">
            <el-form
                ref="addForm"
                :model="addUser"
                :rules="addrules"
            >
                <el-form-item label="Account ID" prop="doctor_id">
                    <el-input v-model="addUser.doctor_id" placeholder="Enter account ID, start with 'D-'" />
                </el-form-item>

                <el-form-item label="Password" prop="doctor_pwd">
                    <el-input v-model="addUser.doctor_pwd" placeholder="Enter password" />
                </el-form-item>

                <el-form-item label="Doctor Name" prop="doctor_name">
                    <el-input v-model="addUser.doctor_name" placeholder="Enter doctor name" />
                </el-form-item>

                <el-form-item label="Age" prop="doctor_name">
                    <el-input v-model="addUser.age" placeholder="Enter age" />
                </el-form-item>

                <el-form-item label="Gender" prop="doctor_sex">
                    <el-radio-group v-model="addUser.doctor_sex">
                        <el-radio label="Male" />
                        <el-radio label="Female" />
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="Department" prop="department">
                    <el-input v-model="addUser.department" placeholder="Enter department" />
                </el-form-item>

                <el-form-item label="Title" prop="doctor_name">
                    <el-input v-model="addUser.title" placeholder="Enter title" />
                </el-form-item>

                <el-form-item label="Phone Number" prop="phone_number">
                    <el-input v-model="addUser.phone_number" placeholder="Enter phone number" />
                </el-form-item>

                <el-form-item label="Director ID" prop="doctor_name">
                    <el-input v-model="addUser.head_of_department" placeholder="Enter director ID" />
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
                <el-form-item label="Account ID" prop="doctor_id">
                    <el-input v-model="editUser.doctor_id" placeholder="Start with 'D-'" />
                </el-form-item>

                <el-form-item label="Password" prop="doctor_pwd">
                    <el-input v-model="editUser.doctor_pwd" />
                </el-form-item>

                <el-form-item label="Doctor Name" prop="doctor_name">
                    <el-input v-model="editUser.doctor_name" />
                </el-form-item>

                <el-form-item label="Age" prop="age">
                    <el-input v-model="editUser.age"/>
                </el-form-item>

                <el-form-item label="Gender" prop="doctor_sex">
                    <el-radio-group v-model="editUser.doctor_sex">
                        <el-radio label="Male" />
                        <el-radio label="Female" />
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="Department" prop="department">
                    <el-input v-model="editUser.department" />
                </el-form-item>

                <el-form-item label="Title" prop="title">
                    <el-input v-model="editUser.title" />
                </el-form-item>

                <el-form-item label="Phone Number" prop="phone_number">
                    <el-input v-model="editUser.phone_number" />
                </el-form-item>

                <el-form-item label="Director ID" prop="head_of_department">
                    <el-input v-model="editUser.head_of_department" />
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
import { DocListApi,DoctorDeleteApi,addDocApi,UpDocApi } from '@/util/request'
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
            addUser:{
                dialogadd:false,
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
            editUser:{
                dialogadd:false,
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
            UserList:[],
            filteredUserList:[],
            total:0,
            currentPage: 1, // 当前页
            pageSize: 11,
            addrules:{
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
                    (user.doctor_name && user.doctor_name.toString().toLowerCase().includes(query)) ||
                    (user.doctor_id && user.doctor_id.toString().toLowerCase().includes(query)) ||
                    (user.department && user.department.toLowerCase().includes(query)) ||
                    (user.phone_number && user.phone_number.toString().toLowerCase().includes(query))||
                    (user.doctor_pwd && user.doctor_pwd.toString().toLowerCase().includes(query))||
                    (user.doctor_sex && user.doctor_sex.toString().toLowerCase().includes(query))||
                    (user.title && user.title.toString().toLowerCase().includes(query))||
                    (user.age && user.age.toString().toLowerCase().includes(query))||
                    (user.head_of_department && user.head_of_department.toString().toLowerCase().includes(query))
                    // 注意所有的字段现在都进行了存在性检查
                );
            });
            data.total = data.filteredUserList.length; // 更新总数据量
            data.currentPage = 1; // 搜索后重置到第一页
        }
        const searchList=()=>{//
            DocListApi().then(res=>{
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
        const submitaddForm=(form)=>{//
            // validate
            form.validate(res=>{
                if(!res){
                    ElMessage.warning("请填写必要信息")
                    return
                }
                // 表单通过请求接口
                const formData = new URLSearchParams();
                formData.append('id', data.addUser.doctor_id);
                formData.append('doctorName', data.addUser.doctor_name);
                formData.append('age', data.addUser.age);
                formData.append('department', data.addUser.department);
                formData.append('doctorSex', data.addUser.doctor_sex);
                formData.append('title', data.addUser.title);
                formData.append('phoneNumber', data.addUser.phone_number);
                formData.append('doctorPwd', data.addUser.doctor_pwd);
                formData.append('headofdepartment', data.addUser.head_of_department);
                addDocApi(formData).then(res=>{
                    
                        // 隐藏弹窗
                        data.dialogFormVisible=false
                        // 清空form
                        addCancel
                        // 重新更新列表 
                        ElMessageBox.alert('新建成功...', '恭喜！')
                        searchList()
                    
                }).catch(error=>{
                    ElMessage.error("新建用户失败")
                })
            })
        }
        const addCancel=()=>{//更改
            data.addUser={
                dialogadd:false,
                doctor_id:'',
                department:'',
                doctor_pwd:'',
                age:0,
                doctor_sex:'',
                doctor_name:'',
                title:'',
                head_of_department:'',
                phone_number:'',
            }
        }
        const addForm=ref()
        
        //编辑用户
        const editRow=(row)=>{
            const {doctor_id,department,doctor_name,doctor_pwd,age,doctor_sex,title,head_of_department,phone_number}=row//更改
            data.editUser.dialogedit=true
            data.editUser.doctor_id=doctor_id
            data.editUser.department=department
            data.editUser.age=age
            data.editUser.doctor_name=doctor_name
            data.editUser.doctor_pwd=doctor_pwd
            data.editUser.doctor_sex=doctor_sex
            data.editUser.title=title
            data.editUser.phone_number=phone_number
            data.editUser.head_of_department=head_of_department
        }
        const editCancel=()=>{//更改
            data.editUser={
                dialogadd:false,
                doctor_id:'',
                department:'',
                doctor_pwd:'',
                age:0,
                doctor_sex:'',
                doctor_name:'',
                title:'',
                head_of_department:'',
                phone_number:'',
            }
        }
        const submiteditForm=(form)=>{//更改
            form.validate(res=>{
                if(!res){
                    ElMessage.warning("请填写必要信息!")
                    return
                }
                // 提交修改
                const formData2=new URLSearchParams()
                formData2.append('doctorId',data.editUser.doctor_id)
                formData2.append('doctorName',data.editUser.doctor_name)
                formData2.append('age',data.editUser.age)
                formData2.append('department',data.editUser.department)
                formData2.append('doctorSex',data.editUser.doctor_sex)
                formData2.append('title',data.editUser.title)
                formData2.append('phoneNumber',data.editUser.phone_number)
                formData2.append('doctorPwd',data.editUser.doctor_pwd)
                UpDocApi(formData2).then(res=>{
                    
                        ElMessageBox.alert('修改成功...', '恭喜！')
                        editCancel
                        searchList()
                    
                }).catch(error=>{
                    ElMessage.error("修改失败")
                })
            })
        }
        const editForm=ref()

        
        // 删除数据
        const deleteRow=row=>{//更改
            const formData = new URLSearchParams();
            formData.append('id',row.doctor_id);
            DoctorDeleteApi(formData).then(res=>{
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