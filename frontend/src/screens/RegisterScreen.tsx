import { useState } from "react";
import { Mail, Lock, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onRegister: (payload: { name: string; email: string; password: string }) => void | Promise<void>;
  onBack: () => void;
}

export const RegisterScreen = ({ onRegister, onBack }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    if (submitting) return;
    setSubmitting(true);
    try {
      await onRegister({ name, email, password });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-foreground -ml-1.5 self-start"
      >
        <ChevronLeft className="w-5 h-5" />
        Назад
      </button>

      <header className="text-center mt-4">
        <h1 className="text-2xl font-bold tracking-tight">Регистрация</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Создайте аккаунт, чтобы начать бронировать места
        </p>
      </header>

      <form onSubmit={submit} className="flex flex-col gap-3 mt-8">
        <Field icon={<User className="w-4 h-4" />} placeholder="Имя" value={name} onChange={setName} />
        <Field icon={<Mail className="w-4 h-4" />} placeholder="example@mail.com" type="email" value={email} onChange={setEmail} />
        <Field icon={<Lock className="w-4 h-4" />} placeholder="Пароль" type="password" value={password} onChange={setPassword} />
        <Field icon={<Lock className="w-4 h-4" />} placeholder="Повторите пароль" type="password" value={confirm} onChange={setConfirm} />

        {confirm && confirm !== password && (
          <p className="text-xs text-destructive">Пароли не совпадают</p>
        )}

        <Button type="submit" disabled={submitting} className="h-12 mt-3 rounded-xl text-base font-semibold shadow-button">
          Создать аккаунт
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <button onClick={onBack} className="text-primary font-semibold hover:underline">
          Войти
        </button>
      </p>
    </div>
  );
};

const Field = ({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) => (
  <label className="relative block">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
    <input
      type={type}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border border-transparent focus:border-primary focus:bg-background outline-none text-sm transition-colors"
    />
  </label>
);
