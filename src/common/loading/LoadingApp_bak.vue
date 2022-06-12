<template>
  <transition name="bounce">
    <div
      v-if="loading.loading"
      style="
        z-index: 9000;
        position: fixed;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
      "
    >
      <div
        style="
          position: absolute;
          left: 0px;
          right: 0px;
          top: 0px;
          bottom: 0px;
          background-color: rgba(255, 255, 255, 0.7);
        "
      ></div>

      <div
        style="
          position: absolute;
          top: 0px;
          left: 0px;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #53a8ff;
        "
      >
        <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        <span v-if="loading.tip" style="margin-top: 10px">{{
          loading.tip
        }}</span>
      </div>
    </div>
  </transition>
</template>




<script>
import { loading } from "./index";
export default {
  setup(props) {
    return {
      loading,
    };
  },
};
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>