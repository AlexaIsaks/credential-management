import React from "react";
import Registration from "../components/pages/Registration";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";

//Snapshot test: Registration
test("Registration component renders correctly", () => {
  const tree = renderer
    .create(
      <BrowserRouter>
        <Registration />
      </BrowserRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
