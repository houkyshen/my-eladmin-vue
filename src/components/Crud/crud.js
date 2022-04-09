import {initData} from "@/api/data";

export default {
    data() {
        return {
            loading: true,
            //表格数据
            tableData: [],
            page: {
                // 页码
                page: 1,
                // 每页数据条数
                size: 10,
                // 总数据条数
                total: 0
            },
            //请求的url，由混入组件提供
            url: '',
            //查询参数，由混入组件提供
            params: {}
        }
    },
    methods: {
        refresh() {
            if (!this.beforeInit()) {//这里调用的实际上是user组件或者role组件的beforeInit()方法
                return
            }
            this.loading = true
            // 请求数据
            let queryParams = {page: this.page.page - 1, size: this.page.size}
            initData(this.url, queryParams).then(data => {
                this.page.total = data.totalElements
                this.tableData = data.content
                this.loading = false
            }).catch(err => {
                this.loading = false
            })
        },
        beforeInit() {//由于混入时这个函数跟原组件的函数名相同，所以会被原组件的函数覆盖，所以这里写任何代码都无用，直接return就好
            console.log('看看是否调用了crud.berforeInit()')//这句话永远不会被打印，除非混入组件没有同名方法
            return false
        },
        // 预防删除当前页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
        dleChangePage() {
            if (this.tableData.length === 1 && this.page.page !== 1) {
                this.page.page -= 1
            }
        },
        // 每页条数改变
        sizeChangeHandler(size) {
            this.page.size = size
            this.page.page = 1
            this.refresh()
        },
        // 当前页改变
        pageChangeHandler(page) {
            this.page.page = page
            this.refresh()
        },
    }
}
