import React, { PropTypes, Component } from 'react';

import Bookmark from '../bookmark/Bookmark.jsx';
import Icon from '../../01_atoms/icon/Icon.jsx';

/**
 * React component
 * A wrapper for all categories
 * @class 02_molecules/category/Category
 * 
 * @requires 02_molecules/bookmark/Bookmark
 *
 * @prop {string} name Name of the category
 */
export default class Category extends Component {
    render() {
        const PROPS = this.props;

        return (
            <section className="m-category">
                <Icon className="m-category__icon a-icon--dark" icon="reduce" />
                <h1 className="m-category__name">{ PROPS.name }</h1>
                <Icon className="m-category__icon a-icon--dark" icon="edit" />
                <Icon className="m-category__icon a-icon--dark" icon="delete" />
                <Icon className="m-category__icon a-icon--dark" icon="drag" />
                <ul className="m-category__bookmarks">
                    <Bookmark title="Bookmark 1" url="https://booky.io" />
                    <Bookmark title="Bookmark 2" url="https://booky.io" />
                    <Bookmark title="Bookmark 3" url="https://booky.io" />
                </ul>
            </section>
        );
    }
}

Category.propTypes = {
    'name': PropTypes.string.isRequired
};
