import ProductDetail from "../../src/components/ProductDetail.tsx";
import {render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import {server} from "../mocks/server.ts";
import {delay, http, HttpResponse} from "msw";
import {afterAll, beforeAll, expect} from "vitest";
import {db} from "../mocks/db.ts";
import AllProviders from "../AllProviders.tsx";

describe('ProductDetail', () => {
    let productId: number;
    beforeAll(() => {
        const product = db.product.create();
        productId = product.id;
    });
    afterAll(() => {
        db.product.delete({where: {id: {equals: productId}}});
    });

    it('should render product details', async () => {
        const product = db.product.findFirst({where: {id: {equals: productId}}});
        render(<ProductDetail productId={productId}/>, {wrapper: AllProviders});

        expect(await screen.findByText(new RegExp(product!.name))).toBeInTheDocument();
        expect(await screen.findByText(new RegExp(product!.price.toString()))).toBeInTheDocument();
    });
    it('should render a message if the product is not found', async () => {
        server.use(http.get(`/products/${productId}`, () => HttpResponse.json(null)));

        render(<ProductDetail productId={productId}/>, {wrapper: AllProviders});
        const message = await screen.findByText(/not found/i);

        expect(message).toBeInTheDocument();
    })
    it('should render an error for invalid productId', async () => {
        render(<ProductDetail productId={0}/>, {wrapper: AllProviders});
        const message = await screen.findByText(/invalid/i);
        expect(message).toBeInTheDocument();
    });
    it('should render an error if data fetching fails', async () => {
        server.use(http.get(`/products/${productId}`, () => HttpResponse.error()));

        render(<ProductDetail productId={productId}/>, {wrapper: AllProviders});
        const errorMessage = await screen.findByText(/error/i);

        expect(errorMessage).toBeInTheDocument();
    });
    it('should render the indicator loading when fetching data', async () => {
        server.use(http.get(`/products/${productId}`, async () => {
            await delay();
            HttpResponse.json([]);
        }));

        render(<ProductDetail productId={productId}/>, {wrapper: AllProviders});
        const loadingMessage = await screen.findByText(/loading/i);

        expect(loadingMessage).toBeInTheDocument();
    });
    it('should remove loading indicator after data is fetched', async () => {
        render(<ProductDetail productId={productId}/>, {wrapper: AllProviders});

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    });
    it('should remove loading indicator if data fetching fails', async () => {
        server.use(http.get(`/products/${productId}`, () => HttpResponse.error()));

        render(<ProductDetail productId={productId}/>, {wrapper: AllProviders});

        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    });

});