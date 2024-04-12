import {render, screen} from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions.tsx";
import {expect} from "vitest";
import {userEvent} from "@testing-library/user-event";

describe('TermsAndConditions', () => {
    const renderComponent = () => {
        render(<TermsAndConditions />);
        return {
            heading: screen.getByRole('heading'),
            checkbox: screen.getByRole('checkbox'),
            button: screen.getByRole('button')
        }
    };

    it('should render with correct text and initial state', () => {
        const { heading, checkbox, button } = renderComponent();

        //expect(heading).toBeInTheDocument(); we don't longer need to use it since "getBy-------()" throw an error if dosen't exist
        expect(heading).toHaveTextContent("Terms & Conditions");
        //expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
        //expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
        //expect(button).toHaveTextContent(/submit/i); it's not valuable to add this assertion because the name of the button might changed in the future and we focus on the user interaction.
    });
    it('should enable the button when the checkbox is checked', async () => {
        const {checkbox, button} = renderComponent();

        const user = userEvent.setup();
        await user.click(checkbox);
        
        // Assert part
        expect(button).toBeEnabled();
    });

});