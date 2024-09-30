<template>
  <Page>
    <ActionBar title="Sign Up" />
    <StackLayout>
      <TextField v-model="email" hint="Email" keyboardType="email" />
      <TextField v-model="password" hint="Password" secure="true" />
      <TextField v-model="fam_name" hint="Family Name" />
      <TextField v-model="giv_name" hint="Given Name" />
      <TextField v-model="sex" hint="Sex" />
      <TextField v-model="num_perso" hint="Number of Persons" keyboardType="number" />
      <TextField v-model="num_days" hint="Number of Days" keyboardType="number" />
      <TextField v-model="hotel_type" hint="Hotel Type" />
      <TextField v-model="room_type" hint="Room Type" />
      <Button text="Sign Up" @tap="register" :isEnabled="!loading" />
      <Label v-if="error" :text="error" class="error" />
      <ActivityIndicator v-if="loading" />
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios/dist/axios";

export default {
  data() {
    return {
      email: '',
      password: '',
      fam_name: '',
      giv_name: '',
      sex: '',
      num_perso: '',
      num_days: '',
      hotel_type: '',
      room_type: '',
      error: null,
      loading: false,
    };
  },
  methods: {
    async register() {
      this.error = null;
      this.loading = true;
      console.log('Sign Up button clicked');

      try {
        const response = await axios.post('http://10.0.2.2:3000/register', {
          email: this.email,
          password: this.password,
          fam_name: this.fam_name,
          giv_name: this.giv_name,
          sex: this.sex,
          num_perso: this.num_perso,
          num_days: this.num_days,
          hotel_type: this.hotel_type,
          room_type: this.room_type,
        });

        if (response.status === 201) {
          console.log('User registered successfully:', response.data);
          this.$navigateBack(); // Navigate back to the login page
        } else {
          console.log('Registration response:', response);
          this.error = 'Error registering user';
        }
      } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error);
        this.error = 'Error registering user';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
