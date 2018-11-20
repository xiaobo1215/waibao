module.exports = {
  devServer:{
	  host:'localhost',
	  port:8080,
	  https:false,
	  open:true,
	  disableHostCheck:true,
	  proxy:{
		  "/api": {
				target: "http://live-smart.com.cn/",
				ws: true,
				changeOrigin: true,
				secure:false,
				pathRewrite:{
					'^/api':'/'
				}
		  }
	  }
  }
}
