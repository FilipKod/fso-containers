import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Todo from "./Todo";

describe("Todo Component", () => {
  test("renders", () => {
    const todo = {
            "_id": "6a15b4f8358de27f109df8a3",
            "text": "Write code",
            "done": true
          }
    
    render(<Todo todo={todo} />);
    expect(screen.getByText(todo.text)).toBeDefined()
  })
})