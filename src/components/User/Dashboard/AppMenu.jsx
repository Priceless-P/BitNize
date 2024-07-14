import React from 'react';
import { Menu } from 'primereact/menu';

export const AppMenu = ({ items }) => {
  return (
    <div className="layout-menu">
      <Menu model={items} />
    </div>
  );
};
