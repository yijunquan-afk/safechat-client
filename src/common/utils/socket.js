import io from 'socket.io-client'
import { getLocalToken } from '@/common'
// 链接 服务端
const socket = io('http://localhost:8888', {
    query: {},
    transports: ['websocket'],
})
export default socket
