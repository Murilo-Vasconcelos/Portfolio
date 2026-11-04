import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import pt from "@/app/[lang]/dictionaries/pt.json";
import LoginForm from "@/components/dashboard/LoginForm";

// A Server Action vira um mock: o teste olha só o que o formulário mostra
const signIn = vi.fn();
vi.mock("@/actions/auth", () => ({
  signIn: (...args: unknown[]) => signIn(...args),
}));

const dict = pt.panel.login;

async function submit() {
  const user = userEvent.setup();
  render(<LoginForm lang="pt" dict={dict} />);
  await user.type(screen.getByLabelText(dict.email), "ana@exemplo.com");
  await user.type(screen.getByLabelText(dict.password), "senha");
  await user.click(screen.getByRole("button", { name: dict.submit }));
}

beforeEach(() => signIn.mockReset());

describe("LoginForm", () => {
  it("avisa de senha errada", async () => {
    signIn.mockResolvedValue({ status: "wrong" });
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(dict.wrong);
  });

  it("avisa quando o servidor barra por excesso de tentativas", async () => {
    signIn.mockResolvedValue({ status: "tooMany" });
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent(dict.tooMany);
    expect(signIn).toHaveBeenCalledWith(
      "pt",
      { status: "idle" },
      expect.any(FormData),
    );
  });
});
