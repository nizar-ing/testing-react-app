import {describe, it} from "vitest";
import {db} from "./mocks/db.ts";
//import {faker} from "@faker-js/faker";

describe('group', () => {
    it('should', () => {
        //expect(1).toBeTruthy();
        /*const response = await fetch('/categories');
        const data = await response.json();
        console.log(data);
        expect(data).toHaveLength(3);*/

        /*console.log({
            name: faker.commerce.productName(),
            price: faker.commerce.price({min: 1, max: 100}),
        });*/

        const product = db.product.create({name: 'Apple'});
        console.log(db.product.delete({where: {name: {equals: product.name}}}));
    });
});