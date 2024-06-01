import { Label, Sidebar } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { HiDocumentText } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

export default function DashInfoPatient() {
    const location = useLocation();
    const userData = useMemo(
        () => location.state?.userData || {},
        [location.state]
    );
    const [, setFormData] = useState({});

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/dashPostsPatient", { state: { userData } });
    };
    useEffect(() => {
        if (userData) {
            setFormData({
                surname: userData.surname,
                fullname: userData.fullname,
                patronymic: userData.patronymic,
                gender: userData.gender,
                dateOfBirth: userData.dateOfBirth,
                polis: userData.polis,
                disabilityGroup: userData.disabilityGroup,
            });
        }
    }, [userData]);

    const birthDate = new Date(userData.dateOfBirth);
    const currentDate = new Date();
    // Рассчитываем разницу между текущей датой и датой рождения в миллисекундах
    const differenceMs = currentDate - birthDate;
    // Переводим миллисекунды в годы
    const age = Math.floor(differenceMs / (1000 * 60 * 60 * 24 * 365));

    // Форматируем дату рождения
    const day = birthDate.getDate().toString().padStart(2, "0");
    const month = (birthDate.getMonth() + 1).toString().padStart(2, "0"); // Добавляем ведущий ноль для месяца
    const year = birthDate.getFullYear();
    const formattedBirthDate = `${day}.${month}.${year}`;
    const getAgeSuffix = (age) => {
        const lastDigit = age % 10;
        const lastTwoDigits = age % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return "лет";
        }
        switch (lastDigit) {
            case 1:
                return "год";
            case 2:
            case 3:
            case 4:
                return "года";
            default:
                return "лет";
        }
    };

    const ageWithSuffix = `${age} ${getAgeSuffix(age)}`;
    return (
        <Sidebar className="w-full md:w-64">
            <Sidebar.Items className="flex flex-col my-7 ms-6 ">
                <h2 className="text-center text-xl font-semibold ">
                    Информация о пациенте
                </h2>
                <Sidebar.ItemGroup className="flex   gap-1">
                    <Label className="text-base">Фамилия:</Label>
                    {userData.surname}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup className="flex gap-1">
                    <Label className="text-base">Имя:</Label>
                    {userData.fullname}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup className="flex gap-1">
                    <Label className="text-base">Отчество:</Label>
                    {userData.patronymic}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup className="flex gap-1">
                    <Label className="text-base">Пол:</Label>
                    {userData.gender}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup className="flex  gap-1">
                    <Label className="text-base">Дата рождения:</Label>
                    {formattedBirthDate}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup className="flex gap-1">
                    <Label className="text-base">Возраст:</Label>
                    {ageWithSuffix}
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup className="flex gap-1">
                    <Label className="text-base">Группа инвалидности:</Label>
                    {userData.disabilityGroup}
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup className="flex flex-col w-full gap-1">
                    <Sidebar.Item
                        icon={HiDocumentText}
                        as="div"
                        onClick={handleNavigate}
                        className="cursor-pointer"
                    >
                        Записи пациента
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
