import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

export default function Header() {
    const path = useLocation().pathname;
    return (
        <Navbar className="border-b-2">
            <Link
                to="/"
                className=" text-sm sm:text-xl font-semibold dark:text-white "
            >
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                    Медицинский
                </span>
                Блог
            </Link>
            <form>
                <TextInput
                    type="text"
                    placeholder="Поиск..."
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                />
            </form>
            <Button className="w-12 h-10 lg:hidden" color="gray" pill>
                <AiOutlineSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button
                    className="w-12 h-10 hidden sm:inline"
                    color="gray"
                    pill
                >
                    <FaMoon />
                </Button>
                <Link to="/sign-in">
                    <Button gradientDuoTone="purpleToBlue" outline>
                        Вход
                    </Button>
                </Link>
                <Navbar.Toggle />
            </div>

            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={"div"}>
                    <Link to="/">Главная страница</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={"div"}>
                    <Link to="/about">О нас</Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/projects"} as={"div"}>
                    <Link to="/projects">Проекты</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
