<template>
  <div id="room" ref="room">
    <div class="room-main">
      <div class="room-nav">
        <div class="room-nav-logo">
          <img src="/img/logo.jpeg" style="height: 100%" />
        </div>
        <div class="room-nav-search">
          <span
            style="
              width: 100%;
              margin-top: 5px;
              color: #0e70b6;
              font-size: 18px;
              font-weight: 600;
            "
          >
            计算机网络安全与管理课程设计——BY YJQ & XLZ
          </span>
        </div>
        <div>
          <a-button
            style="
              margin-top: 5px;
              background-color: #0e70b6;
              color: white;
              margin-left: 120px;
            "
            shape="round"
            @click="exit"
            >退出系统</a-button
          >
        </div>
      </div>

      <div class="room-content">
        <div class="room-left">
          <a-menu
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            theme="dark"
            :inline-collapsed="collapsed"
            class="room-left-nav"
          >
            <div
              style="
                width: 100%;
                font-size: 25px;
                margin-top: 16px;
                margin-left: 60px;
                margin-bottom: 20px;
                color: white;
              "
            >
              <i
                class="fa fa-id-card"
                aria-hidden="true"
                style="margin-right: 10px"
              ></i
              >我的好友
            </div>
            <div style="border-bottom: 1px solid #cccccc"></div>
            <div style="display: flex; flex-direction: row; margin-left: 20px">
              <div>
                <a-avatar
                  :src="currentUser.avatar"
                  :size="60"
                  @click="setAvatar"
                  style="margin-top: 20px"
                />
              </div>
              <div>
                <a-card
                  style="
                    width: 100%;
                    background-color: #001529;
                    border-width: 0 0 0 0;
                  "
                >
                  <p style="color: #ffffff">
                    <font size="5">{{ u_name }} </font>
                    <font size="5" color="green">(我 )</font>
                  </p>
                </a-card>
              </div>
            </div>

            <div
              v-for="friend in friendList"
              key="friend.f_id"
              style="display: flex; flex-direction: row; margin-left: 20px"
              @click="chatWithFriend(friend)"
            >
              <div>
                <a-avatar
                  :src="friend.f_avatar"
                  :size="60"
                  style="margin-top: 20px"
                />
              </div>
              <div>
                <a-card
                  style="
                    width: 100%;
                    background-color: #001529;
                    border-width: 0 0 0 0;
                  "
                >
                  <p style="color: #ffffff">
                    <font size="5">{{ friend.f_name }}</font>
                  </p>
                </a-card>
              </div>
            </div>
          </a-menu>
        </div>

        <div v-if="chatVisible" class="room-right">
          <div class="room-right-nav">
            <div class="my-font">{{ chatFriend.f_name }}</div>
          </div>
          <div class="room-message-content">
            <div class="leave_entry"></div>
          </div>
          <div class="room-send-message">
            <div class="message-choice">
              <i
                class="fa fa-picture-o fa-2x"
                aria-hidden="true"
                style="margin-left: 6px; margin-top: 3px"
                @click="sendImage"
              ></i>
            </div>
            <textarea
              v-model="message"
              class="room-message-input"
              style="resize: none"
            />

            <a-button
              @click="sendMessage"
              style="
                width: 10%;
                margin-right: 1%;
                background-color: #0e70b6;
                color: white;
                margin-top: 50px;
              "
              >发送<i
                class="fa fa-paper-plane"
                style="margin-left: 5px"
                aria-hidden="true"
              ></i
            ></a-button>
          </div>
        </div>
        <div v-else class="room-right">
          <div style="display: flex; flex-direction: row; margin: auto">
            <img
              src="/img/logo.jpeg"
              alt=""
              style="width: 300px; margin-top: "
            />
            <div style="font-size: 30px; margin-top: 20%; margin-left: 20px">
              点击好友头像开始聊天
            </div>
          </div>
        </div>
      </div>

      <!--底部导航栏-->
      <div class="room-bottom deep-blue-back">
        <div style="margin-top: 10px; color: white">
          易俊泉&nbsp;徐礼祯&nbsp;软件92&nbsp;
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="avatar_visible"
      title="设置头像"
      @ok="execUpload"
      centered="true"
      width="400px"
    >
      <a-upload
        list-type="picture-card"
        :show-upload-list="false"
        :before-upload="() => false"
        @change="handleChange"
        class="upload-avatar"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :style="{
            'max-height': '200px',
            'max-width': '200px',
          }"
        />
        <div v-else>
          <plus-outlined />
          <div class="ant-upload-text">选择头像</div>
        </div>
      </a-upload>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { get, post, tip, del, removeLocalToken } from "@/common";
import $ from "jquery";
/* import socket from "../common/utils/socket"; */
import {
  BellOutlined,
  UserOutlined,
  TeamOutlined,
  ToolOutlined,
  PlusOutlined,
  SoundTwoTone,
} from "@ant-design/icons-vue";
import { useRouter, useRoute } from "vue-router";
import moment from "moment";
const imageUrl = ref("");
const imageFile = ref(null);
const avatar_visible = ref(false);
const image_visible = ref(false);
const router = useRouter();

const setAvatar = () => {
  avatar_visible.value = true;
};

const sendImage = () => {
  console.log("我来了");
  image_visible.value = true;
};

//选择头像
const handleChange = (info) => {
  imageFile.value = info.file;
  if (imageFile.value.size / 1024 / 1024 > 1) {
    tip.error("图片大小大于1M，请重新上传");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    imageUrl.value = reader.result;
  });
  reader.readAsDataURL(info.file);
};
const execUpload = () => {
  if (!imageFile.value) {
    tip.error("请选择头像！");
    return;
  }
  const formData = new FormData();
  formData.append("file", imageFile.value);
  formData.append("prefix", "avatar");
  post("/upload", formData).then((res) => {
    const url = res.data;
    formData.append("url", url);
    post("room/avatar", formData).then((res) => {
      tip.success("头像设置成功！");
      avatar_visible.value = false;
      getCurrentUser();
    });
  });
};

const uploadSend = () => {
  if (!imageFile.value) {
    tip.error("请选择图片！");
    return;
  }
  const formData = new FormData();
  formData.append("file", imageFile.value);
  formData.append("prefix", "message");
  post("/upload", formData).then((res) => {
    const url = res.data;
    const data = JSON.stringify({
      sender_name: currentUser.value.name,
      time: moment().format("HH:mm:ss"),
      avatar: currentUser.value.avatar,
      content: url,
      type: "IMAGE",
    });
    imageUrl.value = "";
    image_visible.value = false;
    socket.emit("triger", data);
  });
};

const route = useRoute();
const u_name = route.query.usr;
const u_avatar = "";
const value = "";
const onlineUserCnt = ref("1");
const onlineUsers = ref([]);

const message = ref("");
const currentUser = ref({
  id: "",
  name: "",
  avatar: "",
});

// 获取当前用户信息
const getCurrentUser = () => {
  get("/user/login/getUserInfo")
    .then((res) => {
      currentUser.value.id = res.data.u_id;
      currentUser.value.name = res.data.u_name;
      currentUser.value.avatar = res.data.u_avatar;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
getCurrentUser();

const exit = () => {
  del("/room/exit").then((res) => {
    tip.success("您已成功退出系统，请重新登录！");
    removeLocalToken();
    socket.disconnect();
    router.push({ path: "/login" });
  });
};

// websocket 连接
var socket = io.connect(
  "http://127.0.0.1:8888",
  { query: "u_name=" + u_name },
  { transports: ["websocket"] }
);

const friendList = ref([]);
const getFriendList = () => {
  get("/friend/get").then((res) => {
    friendList.value = res.data;
    console.log(friendList.value);
  });
};
getFriendList();

const chatVisible = ref(false);
const chatFriend = ref();

const chatWithFriend = (friend) => {
  chatVisible.value = true;
  chatFriend.value = friend;
  console.log(chatFriend.value);
  const data = JSON.stringify({
    sender_name: currentUser.value.name,
    receiver_name: chatFriend.value.f_name,
    time: moment().format("HH:mm:ss"),
    avatar: currentUser.value.avatar,
    content: "建立会话",
    type: "MASTER",
  });
  console.log(data);
  socket.emit("send_triger", data);
};

// 发送消息
const sendMessage = () => {
  const data = JSON.stringify({
    sender_name: currentUser.value.name,
    receiver_name: chatFriend.value.f_name,
    time: moment().format("HH:mm:ss"),
    avatar: currentUser.value.avatar,
    content: message.value,
    type: "SESSION",
  });
  const message_detail = {
    content: message.value,
    avatar: currentUser.value.avatar,
  };

  socket.emit("send_triger", data);

  var message_1 = `<div class="my-message">
                        <div class="content-message">${message_detail.content}</div>
                        <div class="bubble"></div>
                       <img src="${message_detail.avatar}" class="content-avatar" />
                      </div>`;

  $(".room-message-content").append(message_1);
  $(".room-message-content").children(":last")[0].scrollIntoView();
  message.value = "";
};

const receiveMessage = (receive) => {
  const data = JSON.stringify({
    sender_name: receive.sender_name,
    receiver_name: receive.receiver_name,
    time: receive.time,
    avatar: receive.avatar,
    content: receive.content,
    sign: receive.sign,
    type: receive.type,
  });
  console.log(data);
  socket.emit("receive_triger", data);
};

// 钩子函数
// 知道他能使以下函数起作用就行
onMounted(() => {
  // 发送消息
  socket.on("send", (receive) => {
    console.log(receive);
    receiveMessage(receive);
  });
  socket.on("receive", (data) => {
    if(data.type!="MASTER"){
          var message_1 = `<div class="others-message">
                        <div>
                         <img src="${data.avatar}" class="content-avatar" />

                        </div>
                        <div class="bubble"></div>
                         <div class="content-name">${data.sender_name}</div>
                        <div class="content-message">${data.content}</div>
                      </div>`;

    $(".room-message-content").append(message_1);
    $(".room-message-content").children(":last")[0].scrollIntoView();
    }
  });

  // 进入聊天室
  socket.on("entry", (data) => {
    var message = `<div class="entry">${data.sender_name}${data.content}</div>`;
    console.log(data);
    // 添加记录
    $(".leave_entry").append(message);
  });

  // 退出聊天室
  socket.on("leave", (data) => {
    var message = `<div class="leave">${data.sender_name}${data.content}</div>`;
    // 添加记录
    $(".leave_entry").append(message);
  });
});
</script>

<style>
/* 主页面样式 */
#room {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;

  min-width: 900px;
  min-height: 500px;

  display: flex;
  flex-direction: column;
  overflow: auto;
}

.room-main {
  width: 100%;
  flex: auto;
  /*本元素做为flex容器中的元素，以自动扩展占位*/

  display: flex;
  flex-direction: column;
}

.room-nav {
  position: relative;
  width: 100%;
  height: 70px;
  width: 100%;
  display: flex;
  flex-direction: row;
  /*主轴为水平方向*/
  align-items: center;
  box-shadow: 0 2px 0 #e7e2dc;
  margin-top: 0%;
}

.room-content {
  background-color: #e7e5e3;
  display: flex;
  width: 100%;
  flex: auto;
  flex-direction: row;
  padding: 30px 40px 20px 40px;
}
.room-left {
  display: flex;
  flex-direction: row;
  width: 20%;
  background-color: #363f48;
}

.room-left-nav {
  width: 100%;
  /* background-color: #2a333a; */
  background-color: #363f48;
}
.room-right {
  flex: 7;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
}
.room-bottom {
  height: 50px;
  width: 100%;
  background-color: #0e70b6;
}
.room-nav-logo {
  height: 65px;
  width: 10%;
  margin-top: 4px;
  margin-left: 10px;
}

.room-nav-search {
  width: 45%;
  margin-left: 30%;
}
.room-nav-menu {
  position: absolute;
  right: 0;
  width: 15%;
}

.room-nav-user-name {
  height: 20px;
  margin-top: 11px;
  margin-left: 10%;
}
.room-user-avatar {
  vertical-align: middle;
  margin-top: 5px;
  width: 60px;
  height: 60px;
}
.room-bottom-inform {
  font-size: 12px;
  align-content: center;
  margin-top: 5px;
  color: white;
}
.room-avatar {
  height: 50%;
}
.room-right-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.room-message-content {
  flex: 7;
  position: relative;
  overflow-x: hidden;
  border-bottom: 1px solid #ccc;
  padding-top: 10px;
}
/* 隐藏滚动条 */
.room-message-content::-webkit-scrollbar {
  display: none;
}
.my-message {
  float: right;
  position: relative;
  width: 100%;
  display: flex;
  height: 25%;
  margin-top: 20px;
}
.others-message {
  float: left;
  width: 100%;
  position: relative;
  display: flex;
  height: 25%;
  margin-top: 20px;
}
.my-message .content-message {
  position: absolute;
  right: 70px;

  background-color: #0e70b6;
  padding: 3px 3px 4px 6px;
  color: white;
  margin-top: 10px;
  border-radius: 2%;
  text-align: center;
  min-width: 120px;
  max-width: 400px;
  min-height: 35px;
  max-height: 400px;
  font-size: 17px;
}
.content-message .img {
  width: 100px;
}
.my-message .content-avatar {
  float: left;
  position: absolute;
  right: 10px;

  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.my-message .bubble {
  position: absolute;
  right: 58px;
  width: 10px;
  height: 10px;
  border-width: 6px;
  border-style: solid;
  border-color: white white white #0e70b6;
  margin-top: 12px;
}
.others-message .content-message {
  position: absolute;
  left: 70px;
  top: 12px;
  background-color: #e6e6e6;
  padding: 3px 3px 4px 6px;
  color: black;
  margin-top: 10px;
  border-radius: 2%;
  text-align: center;
  min-width: 120px;
  max-width: 400px;
  min-height: 35px;
  max-height: 400px;
  font-size: 17px;
}
.others-message .content-avatar {
  float: left;
  position: absolute;
  left: 10px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
.others-message .content-name {
  position: absolute;
  left: 70px;
  color: #4c5257;
  font-size: 15px;
}
.others-message .bubble {
  top: 15px;
  position: absolute;
  left: 58px;
  width: 10px;
  height: 10px;
  border-width: 6px;
  border-style: solid;
  border-color: white #e6e6e6 white white;
  margin-top: 12px;
}
.room-send-message {
  flex: 3;
}

.room-message-input {
  border: white solid 1px;
  height: 60%;
  width: 88%;
  outline: none;
  margin-left: 1%;
}

.my-font {
  font-size: 19px;
  font-weight: 600;
}
.leave {
  color: rgb(215, 137, 137);
}
.entry {
  color: rgba(16, 211, 16, 0.927);
}
.message-choice {
  height: 30%;
  display: flex;
  margin-left: 1%;
}
.my-message .message-image {
  position: absolute;
  right: 70px;
  padding: 3px 3px 4px 6px;
  color: white;
  margin-top: 10px;
  border-radius: 2%;
  text-align: center;
  /* min-width: 120px;
  max-width:8%; */
  min-height: 35px;
  max-height: 100%;
}
.others-message .message-image {
  position: absolute;
  top: 10px;
  left: 66px;
  padding: 3px 3px 4px 6px;
  color: white;
  margin-top: 10px;
  border-radius: 2%;
  text-align: center;
  /* min-width: 120px;
  max-width:8%; */
  min-height: 35px;
  max-height: 100%;
}
</style>
