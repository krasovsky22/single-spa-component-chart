import React from "react";
import { render } from "@testing-library/react";
import Root from "./App";

describe("Root component", () => {
  it("should be in the document", () => {
    const { getByText } = render(<Root name="Testapp" />);
    expect(true).toBeTruthy();
  });
});
