import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";

export default function FooterCom() {
    return (
        <Footer
            container
            className="border border-t-4 bg-gradient-to-r from-bg-foot-start to-bg-foot-end"
        >
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5 ">
                        <Link
                            to="/"
                            className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white   "
                        >
                            <span className="mr-2 px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                                ЭМКР
                            </span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="Сервисы" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Реабилитации
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Проект" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="/about"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    О сервисе
                                </Footer.Link>
                                <Footer.Link
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Мои предложения в карту
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Полезно" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="/dashboard?tab=profile"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Личный кабинет
                                </Footer.Link>
                                <Footer.Link
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Условия использования
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full flex justify-center ">
                    <Footer.Copyright
                        href="#"
                        by="ЭМКР"
                        year={new Date().getFullYear()}
                    />
                </div>
            </div>
        </Footer>
    );
}
