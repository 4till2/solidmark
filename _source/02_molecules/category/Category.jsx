import React from 'react';

import Bookmark from '../bookmark/Bookmark.jsx';
import './category.scss';

export default class Category extends React.Component {
    constructor() {
        super();
    }

    render() {
        const PROPS = this.props;

        return (
            <section className="m-category">
                <div className="m-category__icon a-icon a-icon--reduce"></div>
                <h1 className="m-category__name">{ PROPS.name }</h1>
                <div className="m-category__icon a-icon a-icon--move"></div>
                <div className="m-category__icon a-icon a-icon--edit"></div>
                <div className="m-category__icon a-icon a-icon--delete"></div>
                <ul className="m-category__bookmarks">
                    <Bookmark title="Bookmark title" />
                </ul>
            </section>
        );
    }
}