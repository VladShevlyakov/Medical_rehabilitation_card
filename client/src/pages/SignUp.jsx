import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
    return (
        <div className="min-h-screen mt-20 font-medium">
            <div className="flex flex-col p-3 max-w-3xl  mx-auto md:flex-row md:items-center gap-5">
                {/* левая часть */}
                <div className="flex-1">
                    <Link
                        to="/"
                        className="font-bold dark:text-white  text-4xl"
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
                    <form className="flex flex-col gap-4">
                        <div className="">
                            <Label value="Ваш логин" />
                            <TextInput
                                type="text"
                                placeholder="Логин"
                                id="username"
                            />
                        </div>
                        <div className="">
                            <Label value="Ваша почта" />
                            <TextInput
                                type="email"
                                placeholder="name@company.ru"
                                id="email"
                            />
                        </div>
                        <div className="">
                            <Label value="Ваш пароль" />
                            <TextInput
                                type="password"
                                placeholder="Пароль"
                                id="password"
                            />
                        </div>
                        <Button gradientDuoTone="purpleToPink" type="submit">
                            Зарегистрироваться
                        </Button>
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Есть аккаунт?</span>
                        <Link to="/sign-in" className="text-blue-500">
                            Вход
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
