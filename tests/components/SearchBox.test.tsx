import {describe, expect, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox.tsx";
import {userEvent} from "@testing-library/user-event";

describe("SearchBox", () => {
    const renderSearchBox = () => {
        const onChange = vi.fn();
        render(<SearchBox onChange={onChange} />);
        
        return {
            input: screen.getByPlaceholderText(/search/i),
            user: userEvent.setup(),
            onChange
        }
    };
    it('should render an input field for searching', () => {
        const {input} = renderSearchBox();

        expect(input).toBeInTheDocument();
    });
    it('should call onChange callback when enter is pressed', async () => {
        const {input, user, onChange} = renderSearchBox();
        const searchTerm = "searchTerm";
        await user.type(input, `${searchTerm}{enter}`);

        expect(onChange).toHaveBeenCalledWith(searchTerm); // that means to have been called with searchTerm as an argument
    });
    it('should not call onChange if the input field is empty', async () => {
        const {input, user, onChange} = renderSearchBox();
        await user.type(input, "{enter}");

        expect(onChange).not.toHaveBeenCalled();
    });
})