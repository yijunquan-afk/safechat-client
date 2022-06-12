// 聊天室服务器
// 没错, 这竟然是用 js 写的

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./chatroom.db')
db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS t_user ( \
		id INT PRIMARY KEY, \
		name TEXT NOT NULL, \
		pwd TEXT NOT NULL \
		)");
});

const http = require('http')
var fs = require('fs')
const server_http = http.createServer() // 创建一个服务, 用于监听 http 请求
const server_websocket = http.createServer()//创建一个服务, 用于监听 websocket 请求
// 当前连接的总用户数量
let count = 0
// 当前在线的用户列表
var onlineUsers = new Set()
// 发送的消息来自自己
const MYSELF = true
// 发送的消息来自他人
const OTHERS = false
const TYPE_ENTER = 1
const TYPE_LEAVE = -1
const STATUS_SUCCESS = 200
const STATUS_FAILED = 500
// 监听一个事件
server_websocket.on('request', (req, res) => {
	fs.readFile(__dirname + '/index.html', function (err, data) {
		if (err) {
			res.writeHead(500)
			return res.end('Error loading index.html')
		}
		res.writeHead(200)
		res.end(data)
	})
})

server_websocket.listen(8000, () => {
	console.log('WebSocket 服务器启动成功')
})
// socket.emit:触发某个事件
// socket.on:注册某个事件,如果需要获取浏览器数据，需要监听一个事件，等待浏览器触发
var io = require('socket.io')(server_websocket) //创建socketio对象

io.on('connection', function (socket) {
	console.log('新连接')
	count++

	var userName = 'undefined'
	var userPwd = 'undefined'
	var socketid = 'undefined'

	// 有用户尝试登录
	socket.on('logintry', (data, callback) => {
		// 获取用户名与用户密码
		userName = data.userName
		userPwd = data.userPwd
		socketid = data.socketid
		// 查询数据库, 并将结果存放在 result 中
		var resp = { status: STATUS_SUCCESS, msg: '登录成功' }
		db.serialize(() => {
			db.get(
				"SELECT COUNT(*) AS count FROM t_user WHERE name = ? and pwd = ? ;",
				userName,
				userPwd,
				(err, row) => {
					// 所有登录逻辑必须在该回调中
					// 否则会异步执行
					if (row.count != 1) {
						resp.status = STATUS_FAILED
					}

					if (resp.status == STATUS_SUCCESS) {
						if (onlineUsers.has(userName)) {
							// 该用户已登录
							Log('用户' + userName + '尝试登录失败, 该用户已登录')
							resp.status = STATUS_FAILED
							resp.msg = '该用户已登录'
						} else {
							Log('用户' + userName + '登录成功')
							io.emit('entry', {
								type: TYPE_ENTER,
								msg: `${userName}进入了聊天室`,
								time: new Date().toLocaleTimeString()
							})
							onlineUsers.add(userName)
						}
					} else {
						Log('用户' + userName + '尝试登录失败, 帐号或密码错误')
						resp.status = STATUS_FAILED
						resp.msg = '帐号或密码错误'
					}
					callback(JSON.stringify(resp))
				}
			)
		});
	})

	//接收数据
	socket.on('testCall', function (obj) {
		// 发送数据
		console.log(obj.name);
	});

	// 监听退出连接事件
	socket.on('disconnect', () => {
		Log(`用户${userName}离开了聊天室`)
		// console.log("退出系统")
		onlineUsers.delete(userName)
		//广播
		io.emit('leave', {
			type: TYPE_LEAVE,
			msg: `${userName}离开了聊天室`,
			time: new Date().toLocaleTimeString()
		});
	})
	// 监听信息发送
	socket.on('triger_send', (obj) => {
		// 广播 触发 发送消息
		io.emit('send', {
			avatar: "https://note-image-1307786938.cos.ap-beijing.myqcloud.com/img/avatar20220509_81cfa5eb-fad0-4859-a3d5-81e268697664.jpeg",
			name: userName,
			content: obj.content,
			time: new Date().toLocaleTimeString(),
		});
	})

	// 获取用户信息
	socket.on('getCurrentUser_triger', () => {
		socket.emit('entry', {
			type: TYPE_ENTER,
			msg: `${userName}进入了聊天室`,
			time: new Date().toLocaleTimeString()
		});
		// 广播 触发 发送消息
		socket.emit('getCurrentUser', {
			name: userName,
			id: socketid
		});
	})
});

const Log = (msg) => {
	var time = new Date().toLocaleTimeString()
	console.log('[' + time + '] ' + msg)
}
