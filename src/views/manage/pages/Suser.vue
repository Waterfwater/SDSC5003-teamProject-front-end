<template>
    <div>
        <!-- Breadcrumb -->
        <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/manage' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Student Account List</el-breadcrumb-item>
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
                <el-table-column prop="student_id" label="Account ID" width="100" />
                <el-table-column prop="student_pwd" label="Password" width="100"/>
                <el-table-column prop="student_name" label="Name" width="100"/>
                <el-table-column prop="student_sex" label="Gender" width="100"/>
                <el-table-column prop="age" label="Age" width="100"/>
                <el-table-column prop="major_class" label="Major Class" width="100"/>
                <el-table-column prop="phone_number" label="Phone Number" />
                <el-table-column prop="idcard_num" label="ID Card Number" />
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
                <el-form-item label="Account ID" prop="studentId">
                    <el-input v-model="addUser.studentId" placeholder="Start with 'S-'" />
                </el-form-item>

                <el-form-item label="Password" prop="studentPwd">
                    <el-input type="password" v-model="addUser.studentPwd" placeholder="Enter password" />
                </el-form-item>

                <el-form-item label="Student Name" prop="studentName">
                    <el-input v-model="addUser.studentName" placeholder="Enter student name" />
                </el-form-item>

                <el-form-item label="Major Class" prop="majorClass">
                    <el-input v-model="addUser.majorClass" placeholder="e.g., SE2102" />
                </el-form-item>

                <el-form-item label="Age" prop="age">
                    <el-input v-model="addUser.age" placeholder="Enter age" />
                </el-form-item>

                <el-form-item label="Gender" prop="studentSex">
                    <el-radio-group v-model="addUser.studentSex">
                        <el-radio label="Male" />
                        <el-radio label="Female" />
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="Phone Number" prop="phoneNumber">
                    <el-input v-model="addUser.phone" placeholder="Enter phone number" />
                </el-form-item>

                <el-form-item label="ID Card Number" prop="idCardNum">
                    <el-input v-model="addUser.idCardNum" placeholder="Enter ID card number" />
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
                <el-form-item label="Account ID" prop="studentId">
                    <el-input v-model="editUser.studentId" placeholder="Start with 'S-'" />
                </el-form-item>

                <el-form-item label="Password" prop="studentPwd">
                    <el-input v-model="editUser.studentPwd" />
                </el-form-item>

                <el-form-item label="Student Name" prop="studentName">
                    <el-input v-model="editUser.studentName" />
                </el-form-item>

                <el-form-item label="Major Class" prop="majorClass">
                    <el-input v-model="editUser.majorClass" />
                </el-form-item>

                <el-form-item label="Age" prop="age">
                    <el-input v-model="editUser.age" />
                </el-form-item>

                <el-form-item label="Gender" prop="studentSex">
                    <el-radio-group v-model="editUser.studentSex">
                        <el-radio label="Male" />
                        <el-radio label="Female" />
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="Phone Number" prop="phoneNumber">
                    <el-input v-model="editUser.phone" />
                </el-form-item>

                <el-form-item label="ID Card Number" prop="idCardNum">
                    <el-input v-model="editUser.idCardNum" />
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
import { studentListApi,StudentDeleteApi,StudentAddApi,UpStudentApi } from '@/util/request'
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
                studentId:'',
                majorClass:'',
                studentPwd:'',
                idCardNum:'',
                studentName:'',
                age:0,
                phone:'',
                studentSex:'',
            },
            editUser:{
                dialogedit:false,
                studentId:'',
                majorClass:'',
                studentPwd:'',
                idCardNum:'',
                studentName:'',
                age:0,
                phone:'',
                studentSex:'',
            },
            StudentList:[],
            filteredStudentList:[],
            total:0,
            currentPage: 1, // 当前页
            pageSize: 11,
            addrules:{
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
            studentListApi().then(res=>{
                data.StudentList=res.data
                data.total=res.totalNum
                data.filteredStudentList=data.StudentList
            }).catch(error=>{
                ElMessage.error("服务器错误")
            })
        }
        //新建用户
        const addUserb=()=>{
            data.addUser.dialogadd=true

        }
        const submitaddForm=(form)=>{
            // validate
            form.validate(res=>{
                if(!res){
                    ElMessage.warning("请填写必要信息")
                    return
                }
                // 表单通过请求接口
                const formData = new URLSearchParams();
                formData.append('studentId', data.addUser.studentId);
                formData.append('majorClass', data.addUser.majorClass);
                formData.append('studentPwd', data.addUser.studentPwd);
                formData.append('idCardNum', data.addUser.idCardNum);
                formData.append('studentName', data.addUser.studentName);
                formData.append('phoneNumber', data.addUser.phone);
                formData.append('studentSex', data.addUser.studentSex);
                formData.append('age', data.addUser.age);
                StudentAddApi(formData).then(res=>{
                    
                        // 隐藏弹窗
                        // 清空form
                        searchList()
                        addCancel
                        // 重新更新列表 
                        ElMessageBox.alert('新建成功', '恭喜！')
                    
                }).catch(error=>{
                    ElMessage.error("新建用户失败")
                })
            })
        }
        const addCancel=()=>{
            data.addUser={
                dialogadd:false,
                studentId:'',
                majorClass:'',
                studentPwd:'',
                idCardNum:'',
                studentName:'',
                age:0,
                phone:'',
                studentSex:'',
            }
        }
        const addForm=ref()
        
        //编辑用户
        const editRow=(row)=>{
            const {student_id,major_class,student_pwd,age,student_name,phone_number,idcard_num,student_sex}=row
            data.editUser.dialogedit=true
            data.editUser.studentId=student_id
            data.editUser.age=age
            data.editUser.idCardNum=idcard_num
            data.editUser.majorClass=major_class
            data.editUser.studentPwd=student_pwd
            data.editUser.studentName=student_name
            data.editUser.phone=phone_number
            data.editUser.studentSex=student_sex
        }
        const editCancel=()=>{
            data.editUser={
                dialogedit:false,
                studentId:'',
                majorClass:'',
                studentPwd:'',
                idCardNum:'',
                studentName:'',
                age:0,
                phone:'',
                studentSex:'',
            }
        }
        const submiteditForm=(form)=>{
            form.validate(res=>{
                if(!res){
                    ElMessage.warning("请填写必要信息!")
                    return
                }
                // 提交修改
                const formData2=new URLSearchParams()
                formData2.append('studentId',data.editUser.studentId)
                formData2.append('studentName',data.editUser.studentName)
                formData2.append('age',data.editUser.age)
                formData2.append('majorClass',data.editUser.majorClass)
                formData2.append('studentSex',data.editUser.studentSex)
                formData2.append('idCardNum',data.editUser.idCardNum)
                formData2.append('phoneNumber',data.editUser.phone)
                formData2.append('studentPwd',data.editUser.studentPwd)
                UpStudentApi(formData2).then(res=>{
                        ElMessageBox.alert('修改成功...', '恭喜！')
                        searchList()
                        editCancel
                    
                }).catch(error=>{
                    ElMessage.error("修改失败")
                })
            })
        }
        const editForm=ref()

        
        // 删除数据
        const deleteRow=row=>{
            console.log("删除的那条数据",row.student_id)
            const formData = new URLSearchParams();
            formData.append('id',row.student_id);
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