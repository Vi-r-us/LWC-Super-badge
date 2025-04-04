import { createElement } from 'lwc';
import MultiSlider from 'c/multiSlider';

describe('c-multi-slider', () => {
    afterEach(() => {
        // Reset the DOM after each test
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the multi-slider with default title', () => {
        // Arrange
        const element = createElement('c-multi-slider', {
            is: MultiSlider
        });

        // Act
        document.body.appendChild(element);

        // Assert
        const rangeLabel = element.shadowRoot.querySelector('label span');
        expect(rangeLabel.textContent).toContain('Total Range'); // Default title is "Total"
    });

    it('renders the multi-slider with a custom title', () => {
        // Arrange
        const element = createElement('c-multi-slider', {
            is: MultiSlider
        });

        // Act
        element.title = 'Price';
        document.body.appendChild(element);

        // Assert
        const rangeLabel = element.shadowRoot.querySelector('label span');
        expect(rangeLabel.textContent).toContain('Price Range'); // Custom title is "Price"
    });

    it('updates the range when start and end values are set', () => {
        // Arrange
        const element = createElement('c-multi-slider', {
            is: MultiSlider
        });

        // Act
        element.start = 10;
        element.end = 50;
        document.body.appendChild(element);

        // Assert
        const rangeLabel = element.shadowRoot.querySelector('label span');
        expect(rangeLabel.textContent).toContain('Total Range 40'); // 50 - 10 = 40
        const sliderValue = element.shadowRoot.querySelector('.slds-slider__value');
        expect(sliderValue.textContent).toBe('10 - 50');
    });

    it('dispatches a change event when the range is updated', () => {
        // Arrange
        const element = createElement('c-multi-slider', {
            is: MultiSlider
        });
        document.body.appendChild(element);

        // Mock the event listener
        const changeHandler = jest.fn();
        element.addEventListener('change', changeHandler);

        // Act
        element.start = 20;
        element.end = 60;

        // Simulate a change in the range
        const slider = element.shadowRoot.querySelector('.slider');
        slider.dispatchEvent(new Event('mouseup'));

        // Assert
        expect(changeHandler).toHaveBeenCalled();
        expect(changeHandler.mock.calls[0][0].detail).toEqual({
            start: 20,
            end: 60,
            range: 40 // 60 - 20 = 40
        });
    });

    it('handles mouse down and updates the active thumb color', () => {
        // Arrange
        const element = createElement('c-multi-slider', {
            is: MultiSlider
        });
        document.body.appendChild(element);

        const startThumb = element.shadowRoot.querySelector('.thumb.start');

        // Act
        startThumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        // Assert
        expect(startThumb.style.getPropertyValue('--thumb-active-color')).toBe('#bb202d'); // Active color
    });

    it('handles mouse up and resets the active thumb color', () => {
        // Arrange
        const element = createElement('c-multi-slider', {
            is: MultiSlider
        });
        document.body.appendChild(element);

        const startThumb = element.shadowRoot.querySelector('.thumb.start');

        // Simulate mouse down
        startThumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        // Act
        const slider = element.shadowRoot.querySelector('.slider');
        slider.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        // Assert
        expect(startThumb.style.getPropertyValue('--thumb-active-color')).toBe('#1b5297'); // Inactive color
    });

    it('updates the range bar when thumbs are moved', () => {
        // Arrange
        const element = createElement('c-multi-slider', {
            is: MultiSlider
        });
        document.body.appendChild(element);
    
        const startThumb = element.shadowRoot.querySelector('.thumb.start');
        const endThumb = element.shadowRoot.querySelector('.thumb.end');
        const rangeElement = element.shadowRoot.querySelector('.range');
    
        // Act
        // Simulate moving the start thumb
        startThumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 50 }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    
        // Simulate moving the end thumb
        endThumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 150 }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    
        // Assert
        expect(rangeElement.style.getPropertyValue('--range-left-position')).toBe('50px');
        expect(rangeElement.style.getPropertyValue('--range-width')).toBe('100px'); // 150 - 50 = 100
    });
});