var obj = { title: "anbu" } as Object;

for (let i = 0; i < 10; i++) {
  const template = {
    prefix: `prefix-${i}`,
    body: [JSON.stringify({ title: "body" })],
    description: `Some description: ${i}`,
  };
  obj = { ...template };
}

console.log(obj);
