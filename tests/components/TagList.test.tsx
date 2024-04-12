import {describe, expect} from "vitest";
import TagList from "../../src/components/TagList.tsx";
import {render, screen} from "@testing-library/react";

describe(TagList, () => {

    it('should render an array of tags', async () => {
        render(<TagList />);
        /* await waitFor(() => {
             const listItems = screen.getAllByRole('listitem');
             expect(listItems.length).toBeGreaterThan(0);
         });*/
        // we can use another solution more elegant which is a combination between "waitFor" and "get-----" query.
        const listItems = await screen.findAllByRole('listitem');

        expect(listItems.length).toBeGreaterThan(0);
    });
})