var obj = { title: "anbu" };
for (let i = 0; i < 10; i++) {
    const template = {
        prefix: `prefix-${i}`,
        body: [JSON.stringify({ title: "body" })],
        description: `Some description: ${i}`,
    };
    obj = Object.assign({}, template);
}
console.log(obj);
//# sourceMappingURL=test.js.map