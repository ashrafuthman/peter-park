<template>
  <div v-if="plates?.length">
    <h2>Plates List</h2>
    <ul>
      <li v-for="plate in plates" :key="plate.id">
        <span v-if="!isEditing(plate.id)">{{ plate.plate }}</span>
        <input
          v-if="isEditing(plate.id)"
          v-model="editPlateValue"
          placeholder="Enter new plate"
          @keydown.enter="savePlate(plate.id)"
        />
        <button @click="editPlateMode(plate.id, plate.plate)">
          {{ isEditing(plate.id) ? 'Save' : 'Edit' }}
        </button>
        <button @click="handleDeletePlate(plate.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { deletePlate as deletePlateService, updatePlate, validatePlate } from '../services/plateService';
import type { Plate } from '../types/plate';

export default defineComponent({
  props: {
    plates: {
      type: Array as () => Plate[],
      required: true,
    },
    fetchPlates: {
      type: Function,
      required: false,
    },
  },
  setup(props) {
    const editPlateValue = ref('');
    const editingPlateId = ref<number | null>(null);
    const message = ref('');
    const isError = ref(false);

    const editPlateMode = async (id: number, plate: string) => {
      if (editingPlateId.value === id) {
        if (!validatePlate(editPlateValue.value)) {
          message.value = 'Plate format is invalid.';
          isError.value = true;
          return;
        }

        try {
          await updatePlate(id, editPlateValue.value);
          message.value = 'Plate updated successfully!';
          isError.value = false;
          props.fetchPlates?.();
        } catch (error) {
          message.value = `Error: ${(error as Error).message}`;
          isError.value = true;
        }

        editPlateValue.value = '';
        editingPlateId.value = null;
      } else {
        editingPlateId.value = id;
        editPlateValue.value = plate;
      }
    };

    const handleDeletePlate = async (id: number) => {
      try {
        await deletePlateService(id);
        message.value = 'Plate deleted successfully!';
        isError.value = false;
        props.fetchPlates?.();
      } catch (error) {
        message.value = `Error: ${(error as Error).message}`;
        isError.value = true;
      }
    };

    const savePlate = async (id: number) => {
      if (!validatePlate(editPlateValue.value)) {
        message.value = 'Plate format is invalid.';
        isError.value = true;
        return;
      }

      try {
        await updatePlate(id, editPlateValue.value);
        message.value = 'Plate updated successfully!';
        isError.value = false;
        props.fetchPlates?.();
        editPlateValue.value = '';
        editingPlateId.value = null;
      } catch (error) {
        message.value = `Error: ${(error as Error).message}`;
        isError.value = true;
      }
    };

    const isEditing = (id: number): boolean => {
      return editingPlateId.value === id;
    };

    return { editPlateValue, editPlateMode, handleDeletePlate, savePlate, isEditing, message, isError };
  },
});
</script>
