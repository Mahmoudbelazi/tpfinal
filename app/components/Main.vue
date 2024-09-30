<template>
  <Page>
    <ActionBar title="Home" />
    <StackLayout>
      <Button text="Reservation" @tap="goToReservationList" />
      <Button text="Utilisateur" @tap="goToUserPage" />
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios/dist/axios";
import ReservationList from './Reservationlist.vue';
import User from './User.vue';

export default {
  methods: {
    goToReservationList() {
      this.$navigateTo(ReservationList);
    },
    goToUserPage() {
      this.$navigateTo(User);
    }
  }
};
</script>

<style scoped>
Button {
  margin: 10;
  font-size: 18;
}
</style>
