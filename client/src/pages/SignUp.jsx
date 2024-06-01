import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formatPolis = (value) => {
        // Удаляем все символы, кроме цифр
        const cleaned = value.replace(/\D+/g, "");
        // Разбиваем строку на части по 4 символа
        const match = cleaned.match(/.{1,4}/g);
        // Объединяем части с пробелами
        return match ? match.join(" ") : "";
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        let formattedValue = value;

        if (id === "polis") {
            formattedValue = formatPolis(value);
        }

        setFormData({ ...formData, [id]: formattedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.polis || !formData.email || !formData.password) {
            return setErrorMessage("Пожалуйста, заполните все поля");
        }
        // Удаляем пробелы из Полиса перед отправкой на сервер
        const formDataNew = {
            ...formData,
            polis: formData.polis.replace(/\s+/g, ""),
        };
        try {
            setLoading(true);
            setErrorMessage(null);

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formDataNew),
            });
            const data = await res.json();
            if (data.success === false) {
                return setErrorMessage(data.message);
            }
            setLoading(false);
            if (res.ok) {
                navigate("/sign-in");
            }
        } catch (error) {
            setErrorMessage(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-20 font-medium ">
            <div className="flex flex-col p-3 max-w-3xl  mx-auto md:flex-row gap-5">
                {/* левая часть */}
                <div className="flex-1 mt-4">
                    <Link
                        to="/"
                        className=" font-bold dark:text-white  text-4xl"
                    >
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            ЭМКР
                        </span>
                    </Link>
                    <p className="text-sm mt-5">
                        Это демо-приложение. Вы можете зарегистрироваться с
                        помощью номера Полиса ОМС и пароля или через google.
                        <br /> В будущем планируется сделать регистрацию через
                        госуслуги.
                    </p>
                </div>
                {/* правая часть */}
                <div className="flex-1">
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <Label value="Ваш полис" />
                            <TextInput
                                type="text"
                                placeholder="1234 1234 1234 1234"
                                id="polis"
                                value={formData.polis || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value="Ваша почта" />
                            <TextInput
                                type="email"
                                placeholder="name@company.ru"
                                id="email"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value="Ваш пароль" />
                            <TextInput
                                type="password"
                                placeholder="Пароль"
                                id="password"
                                onChange={handleChange}
                            />
                        </div>
                        <Button
                            gradientDuoTone="purpleToPink"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="pl-3">Загрузка...</span>
                                </>
                            ) : (
                                "Зарегистрироваться"
                            )}
                        </Button>
                        <OAuth />
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Есть аккаунт?</span>
                        <Link to="/sign-in" className="text-blue-500">
                            Вход
                        </Link>
                    </div>
                    {errorMessage && (
                        <Alert className="mt-5" color="failure">
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
