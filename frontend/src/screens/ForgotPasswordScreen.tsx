import { useState } from "react";
import { Mail, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onBack: () => void;
}

export const ForgotPasswordScreen = ({ onBack }: Props) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-foreground -ml-1.5 self-start"
      >
        <ChevronLeft className="w-5 h-5" />
        Назад
      </button>

      <header className="text-center mt-6">
        <h1 className="text-2xl font-bold tracking-tight">Сброс пароля</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Укажите email — мы отправим инструкцию
        </p>
      </header>

      {sent ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center shadow-soft">
            <Check className="w-8 h-8 text-success-foreground" strokeWidth={3} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Письмо отправлено на <span className="font-semibold text-foreground">{email}</span>
          </p>
          <Button onClick={onBack} className="mt-8 h-12 w-full rounded-xl shadow-button">
            Вернуться ко входу
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-3 mt-8"
        >
          <label className="relative block">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border border-transparent focus:border-primary focus:bg-background outline-none text-sm"
            />
          </label>
          <Button type="submit" className="h-12 mt-3 rounded-xl text-base font-semibold shadow-button">
            Отправить
          </Button>
        </form>
      )}
    </div>
  );
};
