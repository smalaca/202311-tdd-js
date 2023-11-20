class AddProductDto {
  amount;
  name;
  code;
  price;
  description;
  assortmentId;

  constructor({amount, name, code, price, description, assortmentId }) {
      this.amount = amount;
      this.name = name;
      this.code = code;
      this.price = price;
      this.description = description;
      this.assortmentId = assortmentId;
  }
}

module.exports = AddProductDto;