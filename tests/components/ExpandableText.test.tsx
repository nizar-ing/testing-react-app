import {render, screen} from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText.tsx";
import {userEvent} from "@testing-library/user-event";


describe('ExpandableText', () => {
    const limit = 255;
    const longText = 'a'.repeat(limit + 1);
    const truncatedText = longText.substring(0, limit) + "...";

    it('should render the full text than is less than 255 characters', () => {
        const text = "Short text";
        render(<ExpandableText text={text} />);
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('should render a truncate text if is longer than 255 characters', () => {

        render(<ExpandableText text={longText} />);

        expect(screen.getByText(truncatedText)).toBeInTheDocument();

        const button = screen.getByRole('button');
        //expect(button).toBeInTheDocument(); It's not necessary in this case because getByRole generate an error and we have another assertion below.
        expect(button).toHaveTextContent(/more/i);
    });
    it('should expand text when Show more button is clicked', async () => {
        render(<ExpandableText text={longText} />);
        const button = screen.getByRole('button');
        const user = userEvent.setup();

        await user.click(button);

        expect(screen.getByText(longText)).toBeInTheDocument();
        expect(button).toHaveTextContent(/less/i);
    });
    it('should collapse text when Show less button is clicked', async () => {
        /*render(<ExpandableText text={longText} />);
        const button = screen.getByRole('button');
        const user = userEvent.setup();
        await user.click(button);

        await user.click(button);

        expect(screen.getByText(truncatedText)).toBeInTheDocument();
        expect(button).toHaveTextContent(/more/i);*/

        /* We can make better just for readability but technically they are the same */

        render(<ExpandableText text={longText} />);
        const showMoreButton = screen.getByRole('button', {name: /more/i});
        const user = userEvent.setup();
        await user.click(showMoreButton);

        const showLessButton = screen.getByRole('button', {name: /less/i});
        await user.click(showLessButton);

        expect(screen.getByText(truncatedText)).toBeInTheDocument();
        expect(showMoreButton).toHaveTextContent(/more/i);

    });
});