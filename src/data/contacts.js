// dummy contacts. We'll simulate pagination by slicing.
const contacts = [];
for (let i = 1; i <= 100; i++) {
  contacts.push({
    id: String(i),
    name: `Contact ${i}`,
    phone: `+91 90000${String(1000 + i).slice(-4)}`,
  });
}
export default contacts;
