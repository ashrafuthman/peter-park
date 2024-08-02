import { supabase } from '../supabaseClient';

export const validatePlate = (plate: string): boolean => {
  const plateRegex = /^[A-Z]{1,3}-[A-Z]{1,2}-\d{1,4}$/;
  return plateRegex.test(plate);
};

export const addPlate = async (plate: string) => {
  if (!validatePlate(plate)) {
    throw new Error('Plate format is invalid.');
  }
  const { data, error } = await supabase
    .from('plates')
    .insert([{ plate }]);

  return { data, error };
};

export const getPlates = async () => {
  const { data, error } = await supabase
    .from('plates')
    .select('*');

  return { data, error };
};

export const deletePlate = async (id: number) => {
  const { data, error } = await supabase
    .from('plates')
    .delete()
    .eq('id', id);

  return { data, error };
};

export const updatePlate = async (id: number, plate: string) => {
  const { data, error } = await supabase
    .from('plates')
    .update({ plate })
    .eq('id', id);

  return { data, error };
};
