import { createApp } from 'vue';

const Counter = {
  data() {
    return {
      counter: 0
    }
  }
}

createApp(Counter).mount('#counter')
