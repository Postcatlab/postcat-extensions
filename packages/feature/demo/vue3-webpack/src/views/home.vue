<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="子应用 -- Vue@3.x" />
    <h3>API 列表</h3>
    <ul>
      <li v-for="item in apiList">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
  },
  setup() {
    const apiList = ref<any[]>(window.microApp?.getData()?.data || []);

    // 是否是微前端环境
    if (window.__MICRO_APP_ENVIRONMENT__) {
      // 向基座发送数据
      setTimeout(() => {
        apiList.value = window.microApp.getData().data || [];
        console.log("从基座获取的API列表", apiList.value);
      }, 500);
    }

    return {
      apiList,
    };
  },
});
</script>
