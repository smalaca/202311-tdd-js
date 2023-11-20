
function generateCode(productName) {
  let x = Array(30).fill("X").join("");
  let code = productName.replaceAll(/[^\w\-\ ]/g, '').slice(0,15).replaceAll(' ', '-') + x;
  return code.slice(0, 30);

}

describe("Code", () => {
  it("Should generate empty", () => {
    const code = generateCode("")
    expect(code).toEqual("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  });
  it("Should generate with product name", () => {
    const code = generateCode("pietruszka")
    expect(code).toEqual("pietruszkaXXXXXXXXXXXXXXXXXXXX")
  });
  it("Should generate with long product name", () => {
    const code = generateCode("pietruszkajestfajnabardzo")
    expect(code).toEqual("pietruszkajestfXXXXXXXXXXXXXXX")
  });
  it("Should generate with long product name with spaces", () => {
    const code = generateCode("piet ruszka jest fajna bardzo")
    expect(code).toEqual("piet-ruszka-jesXXXXXXXXXXXXXXX")
  });
  it("Should generate with product name with special characters", () => {
    const code = generateCode("piet^*@ &$!^ruszka jest fajna bardz")
    expect(code).toEqual("piet-ruszka-jesXXXXXXXXXXXXXXX")
  });
})
