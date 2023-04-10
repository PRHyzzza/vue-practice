import { ref } from "vue";

export default (length: number) => {
 const result = ref('')
 const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
 for (let i = 0; i < length; i++) {
  result.value += characters.charAt(Math.floor(Math.random() * characters.length));
 }
 return { result }
}
