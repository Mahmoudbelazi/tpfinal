<template>
  <Page>
    <ActionBar title="Users" />
    <StackLayout>
      <Button text="Go Back" @tap="goBack" />
      <ListView for="user in users" @itemTap="editUser" height="300">
        <v-template>
          <StackLayout orientation="horizontal">
            <Label v-if="!isEditing(user)" :text="user.giv_name" />
            <Label v-if="!isEditing(user)" :text="user.Email" />
            <Button v-if="!isEditing(user)" text="Modify" @tap="() => startEditing(user)" />
            <Button v-if="!isEditing(user)" text="Delete" @tap="() => deleteUser(user.id_v)" />

            <!-- Inline Edit Form -->
            <StackLayout v-if="isEditing(user)">
              <TextField v-model="editingUser.giv_name" hint="Name" />
              <TextField v-model="editingUser.Email" hint="Email" keyboardType="email" />
              <Button text="Save Changes" @tap="modifyUser(editingUser)" />
              <Button text="Cancel" @tap="cancelEditing" />
            </StackLayout>
          </StackLayout>
        </v-template>
      </ListView>
      <ActivityIndicator v-if="loading" />
      <Label v-if="error" :text="error" class="error" />
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios/dist/axios";
import Main from './Main.vue';
import * as applicationSettings from '@nativescript/core/application-settings';
import { navigateTo } from '@nativescript/core';

export default {
  data() {
    return {
      users: [],
      editingUser: null,
      loading: false,
      error: null,
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const token = applicationSettings.getString('token');
        const response = await axios.get('http://10.0.2.2:3000/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        this.error = 'Error fetching users';
      } finally {
        this.loading = false;
      }
    },
    startEditing(user) {
      this.editingUser = { ...user };
    },
    async modifyUser(user) {
      if (!user.id_v) {
        console.error('User ID is missing');
        this.error = 'User ID is missing';
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const token = applicationSettings.getString('token');
        const response = await axios.put(`http://10.0.2.2:3000/user/${user.id_v}`, user, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const index = this.users.findIndex(u => u.id_v === user.id_v);
        if (index !== -1) {
          this.$set(this.users, index, response.data);
        }
        this.editingUser = null;
      } catch (error) {
        console.error('Error modifying user:', error);
        this.error = 'Error modifying user';
      } finally {
        this.loading = false;
      }
    },
    cancelEditing() {
      this.editingUser = null;
    },
    async deleteUser(id_v) {
      this.loading = true;
      this.error = null;
      try {
        const token = applicationSettings.getString('token');
        await axios.delete(`http://10.0.2.2:3000/user/${id_v}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.users = this.users.filter(u => u.id_v !== id_v);
      } catch (error) {
        console.error('Error deleting user:', error);
        this.error = 'Error deleting user';
      } finally {
        this.loading = false;
      }
    },
    editUser({ item }) {
      this.startEditing(item);
    },
    isEditing(user) {
      return this.editingUser && this.editingUser.id_v === user.id_v;
    },
    goBack() {
          this.$navigateTo(Main);
        }
      }
    };
</script>

<style scoped>
.error {
  color: red;
}
</style>
