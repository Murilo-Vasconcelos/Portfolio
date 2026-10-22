import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Button from "@/components/Button";

describe("Button", () => {
  it("é um botão comum por padrão (não envia formulário sem querer)", () => {
    render(<Button>Salvar</Button>);
    const button = screen.getByRole("button", { name: "Salvar" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toBeEnabled();
  });

  it("fica bloqueado e troca o texto enquanto está pendente", () => {
    render(
      <Button pending pendingLabel="Salvando…">
        Salvar
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Salvando…" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
