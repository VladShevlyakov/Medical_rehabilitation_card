import {
    Alert,
    Button,
    Label,
    Modal,
    TextInput,
    Radio,
    Select,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import ru from "date-fns/locale/ru";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] =
        useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const filePickerRef = useRef();
    const [setAddress] = useState("");

    const dispatch = useDispatch();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };
    useEffect(() => {
        setDateOfBirth(currentUser.dateOfBirth || null);
        if (imageFile) {
            uploadImage();
        }
    }, [currentUser, imageFile]);

    const uploadImage = async () => {
        //     service firebase.storage {
        //     match /b/{bucket}/o {
        //         match /{allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 2 * 1024 * 1024 &&
        //         request.resource.contentType.matches('image/.*')
        //         }
        //     }
        // }
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                setImageFileUploadProgress(progress.toFixed(0));
            },
            () => {
                setImageFileUploadError(
                    "Не удалось загрузить изображение(размер файла должен быть меньше 2 МБ)"
                );
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profileImg: downloadURL });
                    setImageFileUploading(false);
                });
            }
        );
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "dateOfBirth") {
            handleDateChange(new Date(value));
        } else if (id === "registAddress") {
            setAddress(value);
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [id]: value,
            }));
        }
    };

    const handleChangeAddress = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            registAddress: value,
        }));
    };

    const handleDateChange = (date) => {
        setDateOfBirth(date);
        setFormData((prevFormData) => ({
            ...prevFormData,
            dateOfBirth: date,
        }));
        localStorage.setItem("dateOfBirth", JSON.stringify(date));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (
            Object.keys(formData).length === 0 &&
            dateOfBirth !== null &&
            formData.dateOfBirth !== null &&
            formData.dateOfBirth !== dateOfBirth
        ) {
            setUpdateUserError("Изменения не внесены");
            return;
        }

        if (imageFileUploading) {
            setUpdateUserError("Пожалуйста, дождитесь загрузки изображения");
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, dateOfBirth }),
            });
            const data = await res.json();

            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("Профиль успешно обновлен");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };
    //Удаление профиля
    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    //Выйти из профиля
    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Профиль</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                <div
                    className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                    onClick={() => filePickerRef.current.click()}
                >
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${
                                        imageFileUploadProgress / 100
                                    })`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profileImg}
                        alt="user"
                        className={`rounded-full w-full h-full object-cover border-4 border-[lightgray] 
                        ${
                            imageFileUploadProgress &&
                            imageFileUploadProgress < 100 &&
                            "opacity-60"
                        }`}
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color="failure">{imageFileUploadError}</Alert>
                )}
                <TextInput
                    type="text"
                    id="surname"
                    placeholder="Фамилия"
                    defaultValue={currentUser.surname}
                    disabled={currentUser.surname ? true : false}
                    onChange={handleChange}
                />
                <TextInput
                    type="text"
                    id="fullname"
                    placeholder="Имя"
                    defaultValue={currentUser.fullname}
                    disabled={currentUser.fullname ? true : false}
                    onChange={handleChange}
                />
                <TextInput
                    type="text"
                    id="patronymic"
                    placeholder="Отчество"
                    defaultValue={currentUser.patronymic}
                    disabled={currentUser.patronymic ? true : false}
                    onChange={handleChange}
                />
                <div className="flex gap-3 items-center">
                    <Label className="text-sm text-gray-600">Пол:</Label>
                    {currentUser.gender !== "Мужской" &&
                    currentUser.gender !== "Женский" ? (
                        <>
                            <div className="flex items-center gap-1">
                                <Radio
                                    id="gender"
                                    name="gender"
                                    value="Мужской"
                                    onChange={handleChange}
                                />
                                <Label>Мужской</Label>
                            </div>
                            <div className="flex items-center gap-1">
                                <Radio
                                    id="gender"
                                    name="gender"
                                    value="Женский"
                                    onChange={handleChange}
                                />
                                <Label>Женский</Label>
                            </div>
                        </>
                    ) : (
                        <div className="text-sm text-gray-600">
                            {`${currentUser.gender}`}
                        </div>
                    )}
                </div>
                <div className="flex flex-col ">
                    <Label className="text-sm text-gray-600">
                        Дата Рождения
                    </Label>
                    <DatePicker
                        id="dateOfBirth"
                        selected={dateOfBirth}
                        disabled={currentUser.dateOfBirth ? true : false}
                        onChange={handleDateChange}
                        dateFormat="dd.MM.yyyy"
                        locale={ru}
                        className="disabled:cursor-not-allowed disabled:opacity-50 rounded-lg bg-gray-50 border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    />
                </div>
                {!currentUser.isDoctor && (
                    <div>
                        <Label className="text-sm text-gray-600">
                            Группа инвалидности:
                        </Label>
                        <Select
                            id="disabilityGroup"
                            value={
                                formData.disabilityGroup ||
                                currentUser.disabilityGroup
                            }
                            onChange={handleChange}
                            disabled={
                                currentUser.disabilityGroup ? true : false
                            }
                        >
                            <option value="">
                                Выберите группу инвалидности
                            </option>
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="Ребенок-инвалид">
                                Ребенок-инвалид
                            </option>
                        </Select>
                    </div>
                )}
                <div>
                    <Label className="text-sm text-gray-600">Полис ОМС</Label>
                    <TextInput
                        type="number"
                        id="snils"
                        placeholder="Полис ОМС"
                        defaultValue={currentUser.snils}
                        disabled={currentUser.snils ? true : false}
                        onChange={handleChange}
                    />
                </div>
                {!currentUser.isDoctor && (
                    <div>
                        <Label className="text-sm text-gray-600">
                            Адрес регистрации
                        </Label>
                        <AddressSuggestions
                            className="bg-gray-50"
                            id="registAddress"
                            token="c991cde6f33cd14199b9a8feb3ce230471c47a7f"
                            value={currentUser.registAddress}
                            onChange={handleChangeAddress}
                            inputProps={{
                                disabled: !!currentUser.registAddress,
                                placeholder: "Введите адрес",
                                className:
                                    "block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg",
                            }}
                        />
                    </div>
                )}
                {currentUser.isDoctor && (
                    <div>
                        <Label className="text-sm text-gray-600">
                            Место работы
                        </Label>
                        <TextInput
                            type="text"
                            id="place"
                            placeholder="Санаторий №10"
                            disabled={currentUser.place ? true : false}
                            defaultValue={currentUser.place}
                            onChange={handleChange}
                        />
                    </div>
                )}
                <TextInput
                    type="email"
                    id="email"
                    placeholder="Почта"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="Пароль"
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                    outline
                    disabled={loading || imageFileUploading}
                >
                    {loading ? "Загрузка..." : "Изменить"}
                </Button>
                {currentUser.isDoctor && (
                    <Link to={"/create-post"}>
                        <Button
                            type="button"
                            gradientDuoTone="purpleToPink"
                            className="w-full"
                        >
                            Создать запись
                        </Button>
                    </Link>
                )}
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span
                    onClick={() => setShowModal(true)}
                    className="cursor-pointer"
                >
                    Удалить аккаунт
                </span>
                <span onClick={handleSignout} className="cursor-pointer">
                    Выйти
                </span>
            </div>
            {updateUserSuccess && (
                <Alert color="success" className="mt-5">
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color="failure" className="mt-5">
                    {updateUserError}
                </Alert>
            )}
            {error && (
                <Alert color="failure" className="mt-5">
                    {error}
                </Alert>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size="md"
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle
                            className="h-14 w-14 text-gray-400 
                        dark:text-gray-200 mb-4 mx-auto"
                        />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Вы уверены, что хотите удалить аккаунт?
                        </h3>
                        <div className="flex justify-center gap-10">
                            <Button color="failure" onClick={handleDeleteUser}>
                                Да, хочу
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setShowModal(false)}
                            >
                                Нет
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
