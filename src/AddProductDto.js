class AddProductDto {
  amount;
  name;
  code;
  price;
  description;

  constructor({amount, name, code, price, description}) {
      this.amount = amount;
      this.name = name;
      this.code = code;
      this.price = price;
      this.description = description;
  }
}

module.exports = AddProductDto;