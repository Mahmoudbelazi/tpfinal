<template>
  <Page>
    <ActionBar title="Login" />
    <StackLayout>
      <TextField v-model="email" hint="Email" keyboardType="email" />
      <TextField v-model="password" hint="Password" secure="true" />
      <Button text="Login" @tap="login" :isEnabled="!loading" />
      <Button text="Signup" @tap="onCreateAccount" />
      <Label v-if="error" text="Invalid credentials" class="error" />
      <ActivityIndicator v-if="loading" />
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios/dist/axios";
import Signup from './Signup.vue';
import Main from './Main.vue';
import * as applicationSettings from '@nativescript/core/application-settings';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
      loading: false,
    };
  },
  methods: {
    async login() {
      this.error = null;
      this.loading = true;
      console.log('Login button clicked');

      try {
        const response = await axios.post('http://10.0.2.2:3000/login', {
          email: this.email,
          password: this.password,
        });

        if (response.data.token) {
          console.log('Login successful:', response.data);
          applicationSettings.setString('token', response.data.token);
          this.$navigateTo(Main); //  Home page
        } else {
          console.log('Login response:', response);
          this.error = 'Invalid login credentials';
        }
      } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error);
        this.error = 'Invalid login credentials';
      } finally {
        this.loading = false;
      }
    },
    onCreateAccount() {
      this.$navigateTo(Signup);
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
