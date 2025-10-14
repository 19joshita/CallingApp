import AsyncStorage from '@react-native-async-storage/async-storage';
export const save = async (k, v) => {
  try {
    await AsyncStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    console.warn(e);
  }
};
export const load = async k => {
  try {
    const s = await AsyncStorage.getItem(k);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    console.warn(e);
    return null;
  }
};
