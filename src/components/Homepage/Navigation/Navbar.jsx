import React from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const items = [
    {
      label: "Features",
    },
    {
      label: "External",
    },
    {
      label: "Links",
      items: [
        {
          label: "Home",
          command: () => {
            navigate("/");
          },
        },
        {
          label: "Another Page",
          command: () => {
            navigate("/another");
          },
        },
      ],
    },
  ];

  return (
    <div className="card navbar-container">
      <Menubar model={items} />
    </div>
  );
};

export default Navbar;


