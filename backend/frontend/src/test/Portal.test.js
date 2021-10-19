import React from "react";
import Portal from "../components/pages/Portal";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { render, screen } from "@testing-library/react";

// Snapshot test: Portal component
test("Portal component renders correctly", () => {
  const mockState = {
    isLoggedIn: true
  };

  const tree = renderer
    .create(
      <BrowserRouter>
        <Portal isLoggedIn={mockState.isLoggedIn} />
      </BrowserRouter>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

// Unit test: Correct message is displayed to user when page is loaded
test("Correct message is displayed to user.", () => {
  const mockState = {
    isLoggedIn: true
  };
  
  render(
    <BrowserRouter>
      <Portal isLoggedIn={mockState.isLoggedIn} />
    </BrowserRouter>
  );

  const divElement = screen.getByTestId("credentials-loading");
  expect(divElement).toHaveTextContent("Credentials loading...");
});
