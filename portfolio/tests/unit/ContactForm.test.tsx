import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import pt from "@/app/[lang]/dictionaries/pt.json";
import ContactForm from "@/components/ContactForm";

// A Server Action vira um mock: o teste olha só o comportamento do formulário
const sendContactMessage = vi.fn();
vi.mock("@/actions/contact", () => ({
  sendContactMessage: (...args: unknown[]) => sendContactMessage(...args),
}));

const dict = pt.contact.form;

function setup() {
  const user = userEvent.setup();
  render(<ContactForm dict={dict} />);
  return {
    user,
    name: screen.getByLabelText(dict.name),
    email: screen.getByLabelText(dict.email),
    message: screen.getByLabelText(dict.message),
    submit: screen.getByRole("button", { name: dict.submit }),
  };
}

beforeEach(() => {
  sendContactMessage.mockReset();
});

describe("ContactForm", () => {
  it("mostra a mensagem de cada campo e não envia quando está vazio", async () => {
    const { user, name, submit } = setup();

    await user.click(submit);

    expect(screen.getByText(dict.errors.nameShort)).toBeInTheDocument();
    expect(screen.getByText(dict.errors.emailRequired)).toBeInTheDocument();
    expect(screen.getByText(dict.errors.messageShort)).toBeInTheDocument();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveFocus();
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it("avisa do e-mail inválido ao sair do campo", async () => {
    const { user, email } = setup();

    await user.type(email, "ana@exemplo");
    await user.tab();

    expect(screen.getByText(dict.errors.emailInvalid)).toBeInTheDocument();
    expect(email).toHaveAccessibleDescription(dict.errors.emailInvalid);
  });

  it("tira o erro assim que o campo fica certo", async () => {
    const { user, email } = setup();

    await user.type(email, "ana");
    await user.tab();
    expect(screen.getByText(dict.errors.emailInvalid)).toBeInTheDocument();

    await user.type(email, "@exemplo.com");
    expect(
      screen.queryByText(dict.errors.emailInvalid),
    ).not.toBeInTheDocument();
    expect(email).toHaveAttribute("aria-invalid", "false");
  });

  it("bloqueia o botão durante o envio e mostra o sucesso", async () => {
    let finish: (value: { status: "success" }) => void = () => {};
    sendContactMessage.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const { user, name, email, message, submit } = setup();

    await user.type(name, "Ana Souza");
    await user.type(email, "ana@exemplo.com");
    await user.type(message, "Quero conversar sobre uma vaga de estágio.");
    await user.click(submit);

    // Enquanto o servidor não responde: botão travado, com spinner e texto
    const sending = await screen.findByRole("button", { name: dict.sending });
    expect(sending).toBeDisabled();

    finish({ status: "success" });

    expect(await screen.findByRole("status")).toHaveTextContent(dict.success);
    expect(screen.getByRole("button", { name: dict.submit })).toBeEnabled();
    // Depois do sucesso o formulário volta a ficar vazio
    expect(name).toHaveValue("");
    expect(sendContactMessage).toHaveBeenCalledTimes(1);
  });

  it("mantém o texto e mostra o erro quando o envio falha", async () => {
    sendContactMessage.mockResolvedValue({ status: "error" });
    const { user, name, email, message, submit } = setup();

    await user.type(name, "Ana Souza");
    await user.type(email, "ana@exemplo.com");
    await user.type(message, "Quero conversar sobre uma vaga de estágio.");
    await user.click(submit);

    expect(await screen.findByRole("alert")).toHaveTextContent(dict.error);
    expect(message).toHaveValue("Quero conversar sobre uma vaga de estágio.");
  });

  it("mostra os erros que o servidor devolver", async () => {
    sendContactMessage.mockResolvedValue({
      status: "invalid",
      errors: { email: "emailInvalid" },
    });
    const { user, name, email, message, submit } = setup();

    await user.type(name, "Ana Souza");
    await user.type(email, "ana@exemplo.com");
    await user.type(message, "Quero conversar sobre uma vaga de estágio.");
    await user.click(submit);

    await waitFor(() =>
      expect(screen.getByText(dict.errors.emailInvalid)).toBeInTheDocument(),
    );
  });
});
