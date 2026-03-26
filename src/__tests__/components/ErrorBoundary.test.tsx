import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Component that throws an error
function ThrowError() {
  throw new Error("Test error");
}

describe("ErrorBoundary", () => {
  it("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should render error UI when child component throws", () => {
    // Suppress console.error for this test
    const consoleSpy = console.error;
    console.error = () => {};

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText(/We encountered an unexpected error/),
    ).toBeInTheDocument();

    console.error = consoleSpy;
  });

  it("should have a button to return home", () => {
    const consoleSpy = console.error;
    console.error = () => {};

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("button", { name: /Go to Home/i }),
    ).toBeInTheDocument();

    console.error = consoleSpy;
  });
});
