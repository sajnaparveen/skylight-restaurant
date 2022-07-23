import React from "react";
import { Navbar, NavbarBrand } from "reactstrap";
// import '../style/index.css'
// import '../style/index.css.map'
// import '../style/index.sass'

export default props => {
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand
          className="nav-brand"
          onClick={_ => {
            props.setPage(0);
          }}
        >
          RESTAURANTLY
        </NavbarBrand>
      </Navbar>
    </div>
  );
};
