import Vue from 'nativescript-vue'

import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Main from './components/Main'




new Vue({
  render: (h) => h('frame', [h(Login)]),
}).$start()
