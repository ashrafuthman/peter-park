<template>
  <div>
    <h2>Add Car Plate</h2>
    <form @submit.prevent="submitPlate">
      <input v-model="newPlate" placeholder="Enter car plate" required />
      <button type="submit">Add Plate</button>
    </form>
    <p v-if="message" :class="{'error-message': isError}">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { addPlate } from '../services/plateService';

export default defineComponent({
  props: {
    fetchPlates: {
      type: Function,
      required: false,
    },
  },
  setup(props) {
    const newPlate = ref('');
    const message = ref('');
    const isError = ref(false);

    const submitPlate = async () => {
      try {
        message.value = '';
        isError.value = false;

        await addPlate(newPlate.value);
        
        message.value = 'Plate added successfully!';
        
        newPlate.value = ''; 
        props.fetchPlates?.();
      } catch (error) {
        message.value = `Error: ${(error as Error).message}`;
        isError.value = true;
      }
    };

    return { newPlate, submitPlate, message, isError };
  },
});
</script>
