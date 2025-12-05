<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>病历列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 内容区域 -->
    <div class="page_content">
      <div class="flex">
        <div class="input_box">
          <el-input
            v-model="searchParams.query"
            placeholder="搜索关键字（支持学生ID、医生ID、描述等）"
            class="input-with-select"
          >
            <template #append>
              <el-button @click="filter">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        class="table"
        :data="paginatedData"
        height="600"
        style="width: 100%"
        empty-text="暂无病历数据"
      >
        <el-table-column prop="student_id" label="学生ID" width="120" />
        <el-table-column prop="doctor_id" label="医生ID" width="120" />
        <el-table-column prop="diagnostic_num" label="咨询次数" width="120" />
        <el-table-column prop="case_id" label="病历ID" width="120" />
        <el-table-column prop="diagnostic_date" label="日期" width="120" />
        <el-table-column prop="diagnostic_time" label="时间" width="120" />
        <el-table-column prop="case_description" label="表现状况" min-width="200" />
        <el-table-column prop="diagnostic_des" label="病状" min-width="200" />
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { toRefs,reactive,ref,onMounted,watch,computed } from 'vue'
import{ useStore }from "vuex"
import { getcaseApi,writeCaseApi } from '@/util/request'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name:"caseD",
    setup(){
        const data=reactive({
            searchParams:{
                query:"",
                // pagenum:2,
                // pagesize:7,
            },
            editUser:{
                dialogadd:false,
                case_description:'',
                diagnostic_des:'',
                student_id:''
            },
            UserList:[],
            filteredUserList:[],
            total:0,
            currentPage: 1, // 当前页
            pageSize: 8,
            
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
                    (user.doctor_id && user.doctor_id.toString().toLowerCase().includes(query)) || // 添加逗号
                    (user.diagnostic_num && user.diagnostic_num.toString().toLowerCase().includes(query))||
                    (user.case_id && user.case_id.toString().toLowerCase().includes(query))||
                    (user.diagnostic_time && user.diagnostic_time.toString().toLowerCase().includes(query))||
                    (user.diagnostic_date && user.diagnostic_date.toString().toLowerCase().includes(query))||
                    (user.case_description && user.case_description.toString().toLowerCase().includes(query))||
                    (user.diagnostic_des && user.diagnostic_des.toString().toLowerCase().includes(query))
                    // 注意所有的字段现在都进行了存在性检查
                );
            });
            data.total = data.filteredUserList.length; // 更新总数据量
            data.currentPage = 1; // 搜索后重置到第一页
        }
        const searchList=()=>{//
            const formData=new URLSearchParams()
            // // const data1 = useStore.userInfo.loginData.id
            // const data1 = JSON.parse(localStorage.getItem("loginData"));
            // formData.append('doctorId',data1.id)
            getcaseApi().then(res=>{
                data.total=res.totalNum
                data.UserList=res.data
                data.filteredUserList=data.UserList
            }).catch(error=>{
                ElMessage.error("服务器错误")
            })
        }
        
        //编辑用户
        const editRow=(row)=>{
            const {case_description,diagnostic_des,student_id}=row//更改
            data.editUser.student_id=student_id
            data.editUser.dialogedit=true
            data.editUser.case_description=case_description
            data.editUser.diagnostic_des=diagnostic_des
        }
        const editCancel=()=>{//更改
            data.editUser={
                dialogadd:false,
                case_description:'',
                diagnostic_des:'',
                doctor_id:''
            }
        }
        const submiteditForm=(form)=>{//更改
            form.validate(res=>{
                if(!res){
                    ElMessage.warning("请填写必要信息!")
                    return
                }
                // 提交修改
                const formData=new URLSearchParams()

                formData.append('studentId',data.editUser.student_id)
                formData.append('description',data.editUser.case_description)
                formData.append('diagnosticMessage',data.editUser.diagnostic_des)
                writeCaseApi(formData).then(res=>{
                    
                        
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
            console.log("删除的那条数据",row.doctor_id)
            const formData = new URLSearchParams();
            formData.append('id',row.doctor_id);
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