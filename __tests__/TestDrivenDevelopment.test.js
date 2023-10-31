const TestDrivenDevelopment = require('../src/TestDrivenDevelopment');

describe('Test-Driven Development tests suite', () => {
    test('should contain three phases in right order', () => {
        const designTechnique = new TestDrivenDevelopment();

        expect(designTechnique.phases()).toEqual(["RED", "GREEN", "REFACTOR"]);
    });
});