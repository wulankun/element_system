module.exports={
    chainWebpack:config=>{
        config.when(process.env.NODE_ENV==='production',config=>{
            config
            .entry('app')
            .clear()
            .add('./src/main.js')


            config.set('externals',{
                vue:'vue',
                'vue-router':'VueRouter',
                axios:'axios',
                lodash:'_',
                echarts:'NPprogress',
                'vue-quill-editor':'VueQuillEditor'
            }
                
            )
        })


    }
}