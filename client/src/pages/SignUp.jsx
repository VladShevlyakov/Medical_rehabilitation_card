import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMessage("Пожалуйста, заполните все поля");
        }
        try {
            setLoading(true);
            setErrorMessage(null);

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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
            <div className="flex flex-col p-3 max-w-3xl  mx-auto md:flex-row md:items-center gap-5">
                {/* левая часть */}
                <div className="flex-1 mt-2">
                    <Link
                        to="/"
                        className=" font-bold dark:text-white  text-4xl"
                    >
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            ЭМКР
                        </span>
                    </Link>
                    <p className="text-sm mt-5">
                        Это демо-приложение. Вы можете войти с помощью номера
                        снилса и пароля или через госуслуги.
                    </p>
                </div>
                {/* правая часть */}
                <div className="flex-1">
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="">
                            <Label value="Ваш логин" />
                            <TextInput
                                type="text"
                                placeholder="Логин"
                                id="username"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <Label value="Ваша почта" />
                            <TextInput
                                type="email"
                                placeholder="name@company.ru"
                                id="email"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
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
