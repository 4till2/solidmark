import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Bookmark from '../bookmark';
import Icon from '../../atoms/icon';

export default class Category extends Component {
  render() {
    const { name } = this.props;

    return (
      <section className="category">
        <header className="category__header">
          <Icon className="category__icon a-icon--dark" icon="reduce" title="Reduce category" />
          <h1 className="category__name">
            <span className="category__name-inner">{ name }</span>
          </h1>
          <Icon className="category__icon" icon="edit" />
          <Icon className="category__icon category__icon--edit-mode a-icon--dark" icon="edit" title="Edit category" />
          <Icon className="category__icon category__icon--edit-mode a-icon--dark" icon="delete" title="Delete category" />
          <Icon className="category__icon category__icon--edit-mode a-icon--dark category__icon--drag" icon="drag" title="Drag category" />
        </header>
        <ul className="category__bookmarks">
          <Bookmark name="Bookmark 1 veeeeeeery こんにちはお元気で loooooong tiiiitle !!!!!!" url="https://booky.io" />
          <Bookmark name="Bookmark مرحبا كيف حال 2" url="https://booky.io" />
          <Bookmark name="Bookmark Привет, как дела 3" url="https://booky.io" />
        </ul>
      </section>
    );
  }
}

Category.propTypes = {
  name: PropTypes.string.isRequired
};
