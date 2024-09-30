<template>
  <Page>
    <ActionBar title="Reservations" />
    <StackLayout>
      <ListView for="reservation in reservations" @itemTap="editReservation" height="300">
        <v-template>
          <StackLayout orientation="horizontal">
            <Label :text="reservation.desc_res" />
            <Button text="Modify" @tap="() => startEditing(reservation)" />
            <Button text="Delete" @tap="() => deleteReservation(reservation.id_res)" />
          </StackLayout>
        </v-template>
      </ListView>
      <TextField v-model="newReservation.desc_res" hint="Description" />
      <TextField v-model="newReservation.desc_res" hint="Hotel ID" keyboardType="number" />
      <TextField v-model="newReservation.id_v" hint="Visitor ID" keyboardType="number" />
      <Button text="Add Reservation" @tap="addReservation" />
      <ActivityIndicator v-if="loading" />
      <Label v-if="error" :text="error" class="error" />

      <!-- Edit Reservation Form -->
      <StackLayout v-if="editingReservation">
        <TextField v-model="editingReservation.desc_res" hint="Description" />
        <TextField v-model="editingReservation.id_hotel" hint="Hotel ID" keyboardType="number" />
        <TextField v-model="editingReservation.id_visitor" hint="Visitor ID" keyboardType="number" />
        <Button text="Save Changes" @tap="modifyReservation(editingReservation)" />
        <Button text="Cancel" @tap="cancelEditing" />
      </StackLayout>

      <!-- Go Back Button -->
      <Button text="Go Back" @tap="goBack" />
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios/dist/axios";
import * as applicationSettings from '@nativescript/core/application-settings';
import Main from './Main.vue'; // Ensure Main component is imported

export default {
  data() {
    return {
      reservations: [],
      newReservation: {
        desc_res: '',
        id_hotel: '',
        id_visitor: ''
      },
      editingReservation: null,
      loading: false,
      error: null,
    };
  },
  created() {
    this.fetchReservations();
  },
  methods: {
    async fetchReservations() {
      this.loading = true;
      this.error = null;
      try {
        const token = applicationSettings.getString('token');
        const response = await axios.get('http://10.0.2.2:3000/reservations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.reservations = response.data;
      } catch (error) {
        console.error('Error fetching reservations:', error);
        this.error = 'Error fetching reservations';
      } finally {
        this.loading = false;
      }
    },
    async addReservation() {
      this.loading = true;
      this.error = null;
      try {
        const token = applicationSettings.getString('token');
        const response = await axios.post('http://10.0.2.2:3000/reservation', this.newReservation, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.reservations.push(response.data);
        this.newReservation = { desc_res: '', id_hotel: '', id_visitor: '' };
      } catch (error) {
        console.error('Error adding reservation:', error);
        this.error = 'Error adding reservation';
      } finally {
        this.loading = false;
      }
    },
    startEditing(reservation) {
      this.editingReservation = { ...reservation };
    },
    async modifyReservation(reservation) {
      this.loading = true;
      this.error = null;
      try {
        const token = applicationSettings.getString('token');
        const response = await axios.put('http://10.0.2.2:3000/reservation', reservation, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedReservation = response.data;
        const index = this.reservations.findIndex(r => r.id_res === updatedReservation.id_res);
        if (index !== -1) {
          this.$set(this.reservations, index, updatedReservation);
        }
        this.editingReservation = null;
      } catch (error) {
        console.error('Error modifying reservation:', error);
        this.error = 'Error modifying reservation';
      } finally {
        this.loading = false;
      }
    },
    cancelEditing() {
      this.editingReservation = null;
    },
    async deleteReservation(id_res) {
      this.loading = true;
      this.error = null;
      try {
        const token = applicationSettings.getString('token');
        await axios.delete(`http://10.0.2.2:3000/reservation/${id_res}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.reservations = this.reservations.filter(r => r.id_res !== id_res);
      } catch (error) {
        console.error('Error deleting reservation:', error);
        this.error = 'Error deleting reservation';
      } finally {
        this.loading = false;
      }
    },
    editReservation({ item }) {
      // Implement edit functionality here
      console.log('Edit reservation:', item);
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
