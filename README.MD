破万卷服务器端api

注册机制：
URL：/action=signUpVerify
method：post
功能：发送请求是服务器向邮箱发送验证码
发送数据：email
URL：/action=signup
method：post
功能：接受客户端发送的email,passsword,varity,验证并写入数据库
接受：email,password.varity

登录：
URL：/action=login
method：post
功能：接受客户端的登录请求，成功后返回个人数据
接受数据：email，password
返回（例如）：{"data":{"nickname":""，"briefintroduction":""},"":{}}

获取信息：
URL：/action=user=information
method：post


/action=serach=:type