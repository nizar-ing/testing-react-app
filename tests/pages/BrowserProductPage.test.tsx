import {render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage.tsx";
import {Theme} from "@radix-ui/themes";
import {afterAll, beforeAll, expect} from "vitest";
import {userEvent} from "@testing-library/user-event";
import {db, getProductsByCategory} from "../mocks/db.ts";
import {Category, Product} from "../../src/entities.ts";
import {CartProvider} from "../../src/providers/CartProvider.tsx";
import {simulateDelay, simulateErrorResponse} from "../utils.ts";

describe('BrowserProductPage', () => {
    const categories: Category[] = [];
    const products: Product[] = [];

    beforeAll(() => {
        [1, 2].forEach(() => {
            const category = db.category.create();
            categories.push(category);
            [1, 2].forEach(() => {
                products.push(db.product.create({categoryId: category.id}));
            })
        });
    });
    afterAll(() => {
        const categoriesIds: number[] = categories.map((category) => category.id);
        const productsIds: number[] = products.map((product) => product.id);
        db.category.deleteMany({where: {id: {in: categoriesIds}}});
        db.product.deleteMany({where: {id: {in: productsIds}}});
    });

    it('should show a loading skeleton when fetching categories ', () => {
        // server.use(http.get('/categories', async () => {
        //     await delay();
        //     HttpResponse.json([]);
        // }));
        simulateDelay('/categories');

        const {getResourcesSkeleton} = renderBrowserProducts();

        expect(getResourcesSkeleton(/categories/i)).toBeInTheDocument();
    });
    it('should hide the loading skeleton after categories are fetched ', async () => {
        const {getResourcesSkeleton} = renderBrowserProducts();

        await waitForElementToBeRemoved(() => getResourcesSkeleton(/categories/i));
    });
    it('should show a loading skeleton when fetching products ', () => {
        // server.use(http.get('/products', async () => {
        //     await delay();
        //     HttpResponse.json([]);
        // }));
        simulateDelay('/products');

        const {getResourcesSkeleton} = renderBrowserProducts();

        expect(getResourcesSkeleton((/products/i))).toBeInTheDocument();
    });
    it('should hide the loading skeleton after products are fetched ', async () => {
        const {getResourcesSkeleton} = renderBrowserProducts();

        await waitForElementToBeRemoved(() => getResourcesSkeleton(/products/i));
    });
    it('should not render an error if categories cannot be fetched', async () => {
        simulateErrorResponse('/categories');

        const {getResourcesSkeleton} = renderBrowserProducts();
        await waitForElementToBeRemoved(() => getResourcesSkeleton(/categories/i));

        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        expect(screen.queryByRole('combobox', {name: /category/i})).not.toBeInTheDocument();
    });
    it('should render an error if products cannot be fetched', async () => {
        simulateErrorResponse('/products');

        renderBrowserProducts();
        const textError = await screen.findByText(/error/i);

        expect(textError).toBeInTheDocument();
    });
    it('should render categories with the right data options', async () => {
        renderBrowserProducts();

        const combobox = await screen.findByRole('combobox');
        expect(combobox).toBeInTheDocument();

        const user = userEvent.setup();
        await user.click(combobox);
        //const options = await screen.findAllByRole('option');

        //expect(options.length).toBeGreaterThan(0);

        expect(screen.getByRole('option', {name: /all/i})).toBeInTheDocument();
        categories.forEach((category) => {
            expect(screen.getByRole('option', {name: category.name})).toBeInTheDocument();
        })
    });
    it('should render products', async () => {
        const {getResourcesSkeleton} = renderBrowserProducts();

        await waitForElementToBeRemoved(() => getResourcesSkeleton(/products/i));

        products.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    });
    it('should filter products by category', async () => {
        const {selectCategory, expectProductsToBeInTheDocuments} = renderBrowserProducts();
        await selectCategory(categories[0].name);

        // Assert part
        const products = getProductsByCategory(categories[0].id);
        expectProductsToBeInTheDocuments(products);
    });
    it('should render all products if all category is selected', async () => {
        const {selectCategory, expectProductsToBeInTheDocuments} = renderBrowserProducts();
        await selectCategory("All");

        // Assert part
        const products = db.product.getAll();
        expectProductsToBeInTheDocuments(products);

        //renderBrowserProducts();

        // // Arrange part
        // const combobox = await screen.findByRole('combobox');
        // const user = userEvent.setup();
        // await user.click(combobox);
        //
        // // Act part
        // const option = screen.getByRole('option', {name: /all/i});
        // await user.click(option);
        //
        // // Assert part
        // const products = db.product.getAll();
        // const rows = screen.getAllByRole('row');
        // const rowsData = rows.slice(1); // we slice the header row "entête" from the expectation
        // expect(rowsData).toHaveLength(products.length);
        //
        // products.forEach((product) => {
        //     expect(screen.getByText(product.name)).toBeInTheDocument();
        // })
    });
})

const renderBrowserProducts = () => {
    render(
        <CartProvider>
            <Theme>
                <BrowseProducts/>
            </Theme>
        </CartProvider>
    );
    return {
        getResourcesSkeleton: (regExp: RegExp) => screen.queryByRole('progressbar', {name: new RegExp(regExp)}),
        selectCategory: async (regExp: string) => {
            // Arrange part
            const combobox = await screen.findByRole('combobox');
            const user = userEvent.setup();
            await user.click(combobox);

            // Act part
            const option = screen.getByRole('option', {name: new RegExp(regExp, 'i')});
            await user.click(option);
        },
        expectProductsToBeInTheDocuments: (products: Product[]) => {
            const rows = screen.getAllByRole('row');
            const rowsData = rows.slice(1); // we slice the header row "entête" from the expectation

            expect(rowsData).toHaveLength(products.length);
            products.forEach((product) => {
                expect(screen.getByText(product.name)).toBeInTheDocument();
            })
        }
    }
}
