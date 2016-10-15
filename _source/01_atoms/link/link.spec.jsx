import React from 'react';
import { shallow } from 'enzyme';

import Link from './Link.jsx';

describe('<Link />', function() {

    let component;
        
    const getComponent = function(props = {}) {
        return <Link { ...props } />;
    };

    describe('when initialized without optional parameters', function() {

        beforeEach(function() {
            component = shallow(getComponent({}));
        });

        it('should have the correct class', function() {
            expect(component.find('a').hasClass('a-link')).toBe(true);
        });
    });

    describe('when initialized with optional parameters', function() {

        beforeEach(function() {
            component = shallow(getComponent({
                'className': 'banana',
                'text': 'Gscheider Text!',
                'icon': 'link'
            }));
        });

        it('should have the correct class', function() {
            expect(component.find('a').hasClass('a-link banana')).toBe(true);
        });

        it('should include an icon', function() {
            const iconProps = component.find('Icon').props();

            expect(iconProps).toEqual({
                'icon': 'link',
                'className': 'a-link__icon'
            });
        });

        it('should include the text', function() {
            expect(component.contains(
                'Gscheider Text!'
            )).toBe(true);
        });
    });
});
