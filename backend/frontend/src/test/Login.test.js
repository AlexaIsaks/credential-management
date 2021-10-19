import React from "react";
import Login from "../components/pages/Login";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";

// Snapshot test: Login component
test("Login component renders correctly", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
