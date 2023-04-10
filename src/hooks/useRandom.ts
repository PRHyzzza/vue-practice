import { ref } from "vue";

export default (length: number) => {
 const result = ref('')
 const generateRandom = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result.value += characters.charAt(Math.floor(Math.random() * characters.length));
  }
 };
 generateRandom()
 return { result }
}
