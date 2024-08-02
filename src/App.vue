<template>
  <div id="app">
    <h1>Car Plate Validator</h1>
    <PlateForm :fetchPlates="fetchPlates" />
    <PlateList :plates="plates" :fetchPlates="fetchPlates" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getPlates } from './services/plateService';
import PlateForm from './components/PlateForm.vue';
import PlateList from './components/PlateList.vue';
import type { Plate } from './types/plate';

export default defineComponent({
  components: {
    PlateForm,
    PlateList,
  },
  setup() {
    const plates = ref<Plate[]>([]);

    const fetchPlates = async () => {
      const { data, error } = await getPlates();
      if (error) {
        console.error(`Error fetching plates: ${error.message}`);
      } else {
        plates.value = data || [];
      }
    };

    onMounted(fetchPlates);

    return { plates, fetchPlates };
  },
});
</script>

<style>
@import './style.css';
</style>
