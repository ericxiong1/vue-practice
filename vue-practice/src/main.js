import Vue from 'vue'
import App from './App.vue'
import {
  applyPolyfills,
  defineCustomElements,
} from '@aws-amplify/ui-components/loader';

import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'

Amplify.configure(awsExports)

applyPolyfills().then(() => {
  defineCustomElements(window);
});

Vue.config.ignoredElements = [/amplify-\w*/];

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
