import {render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import {afterAll, beforeAll, expect} from "vitest";
import {server} from "../mocks/server.ts";
import {http, HttpResponse, delay} from "msw";
import {db} from "../mocks/db.ts";
import AllProviders from "../AllProviders.tsx";


describe('Component: ProductList', () => {
    const productIds: number[] = [];

    beforeAll(() => {
        [1, 2, 3].forEach(() => {
            const prod = db.product.create();
            productIds.push(prod.id);
        });
    });
    afterAll(() => {
        db.product.deleteMany({where: {id: {in: productIds}}});
    });

    const renderProductList = () => {
        // const client = new QueryClient({
        //     defaultOptions: {
        //         queries: {
        //             retry: false
        //         }
        //     }
        // });
        // render(
        //     <QueryClientProvider client={client}>
        //         <ProductList/>
        //     </QueryClientProvider>
        // );
        render(<ProductList />, {wrapper: AllProviders});
        return {
            getItems: () => screen.findAllByRole('listitem'),
            /*getMessage: () => screen.findByText(/no product/i),
            getErrorMessage: () => screen.findByText(/error/i),
            getLoadingText: () => screen.findByText(/loading/i)*/
            getMessage: (text: string) => screen.findByText(new RegExp(text, "i"))
        }
    }
    it('should render the list of products', async () => {
        const {getItems} = renderProductList();

        const items = await getItems();
        expect(items.length).toBeGreaterThan(0);
    });
    it('should render no product available if no product is found', async () => {
        server.use(http.get('/products', () => HttpResponse.json([])));

        const {getMessage} = renderProductList();
        const message = await getMessage("no product");

        expect(message).toBeInTheDocument();
    });
    it('should render an error message when there is an error', async () => {
        server.use(http.get('/products', () => HttpResponse.error()));

        const {getMessage} = renderProductList();
        const errorMessage = await getMessage("error");

        expect(errorMessage).toBeInTheDocument();
    });
    it('should render a loader indicator when fetching data', async () => {
        server.use(http.get('/products', async () => {
            await delay();
            return HttpResponse.json([]);
        }));

        const {getMessage} = renderProductList();
        const loadingMessage = await getMessage("loading");
        expect(loadingMessage).toBeInTheDocument();
    });
    it('should remove loading indicator after data is fetched', async () => {
        renderProductList();
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    });
    it('should remove loading indicator if data fetching fails', async () => {
        server.use(http.get('/products', async () => HttpResponse.error()));
        renderProductList();
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    });
})