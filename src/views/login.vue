<template>
  <div id="login">
    <div class="logo"><img src="/img/logo_white.png" style="width:60%;margin-left:30%;margin-top: -15%;" /></div>
    <div style="width: 50%">
      <div class="login-card">
        <div class="login-head">
          <h1 style="color: #0e70b6; font-weight: 500">登录</h1>
        </div>

        <div class="form-card">
          <div class="login-input">
            <a-input
              v-model:value="u_name"
              placeholder="用户名"
              allowClear="true"
              size="large"
            />
          </div>

          <div class="login-input">
            <a-input-password
              v-model:value="u_pwd"
              placeholder="密码"
              size="large"
              @pressEnter="login"
            />
          </div>

          <div class="login-submit">
            <a-button @click="login" size="large">登录</a-button>
          </div>
          <div>
            <a-button
              type="link"
              @click="() => router.push({ name: 'Register' })"
              >没有账号？点我注册一个</a-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { tip, get, post, setLocalToken, ddo } from "@/common";
import { useRouter } from "vue-router";
import { PASSWORD } from "@/common/utils";

const router = useRouter();
let u_name = ref("");
let u_pwd = ref("");

const login = () => {
  post("/user/login", {
    u_name: u_name.value,
    u_pwd: PASSWORD(u_pwd.value),
  })
    .then((res) => {
      tip.success(res.message);
      let token = res.data;
      setLocalToken(token);
      router.push({ name: "Room", query: { usr: u_name.value } });
    })
    .catch((err) => {
      tip.error("账号密码错误！");
    });
};

</script>

<style scoped>
#login {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  min-width: 900px;
  min-height: 500px;
  display: flex;
  flex-direction: row;
  overflow: auto;
  justify-content: center;
  background-size: cover;
  background: white;
  background: -webkit-linear-gradient(to left, #d7dae2, #cfddee);
  background: linear-gradient(to left, #d7dae2, #cfddee);
}

div.login-card {
  width: 400px;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

div.login-head {
  color: white;
  height: 15%;
  margin-top: 200px;
}

div.login-head h1 {
  font-family: SF-Pro;
  font-size: 36px;
  font-weight: 250;
  margin-bottom: 0;
}

div.login-head p {
  font-family: SF-Pro;
  font-size: 16px;
  font-weight: 200;
}

div.form-card {
  width: 100%;
  height: max-content;
  background-color: #ffffff;

  border: solid;
  border-width: 2px;
  border-color: #4b8bd5;
  border-radius: 20px;
  padding-top: 8%;
  padding-bottom: 3%;
}

div.login-input {
  margin-top: 10px;
  margin-bottom: 15px;
  margin-left: 15px;
  margin-right: 15px;
}

div.login-submit {
  margin-top: 15px;
}
div.logo {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
