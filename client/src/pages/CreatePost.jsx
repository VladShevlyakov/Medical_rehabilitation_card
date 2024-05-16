import {
    Alert,
    Button,
    FileInput,
    Label,
    Select,
    TextInput,
} from "flowbite-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreatePost() {
    const { currentUser } = useSelector((state) => state.user);
    const [formDataList, setFormDataList] = useState([
        { startDate: null, endDate: null },
    ]);
    const [fileUploadProgress, setFileUploadProgress] = useState(
        Array(formDataList.length).fill(null)
    );
    const [fileUploadError, setFileUploadError] = useState(
        Array(formDataList.length).fill(null)
    );
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();

    const handleUploadFile = async (index) => {
        try {
            const file = formDataList[index].file; // Получаем файл для текущей формы
            if (!file) {
                setFileUploadError((prevErrors) => {
                    const updatedErrors = [...prevErrors];
                    updatedErrors[index] = "Пожалуйста, выберите файл";
                    return updatedErrors;
                });
                return;
            }
            setFileUploadError((prevErrors) => {
                const updatedErrors = [...prevErrors];
                updatedErrors[index] = null;
                return updatedErrors;
            });

            const storage = getStorage(app);
            const fileName = new Date().getTime() + "-" + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setFileUploadProgress((prevProgressList) => {
                        const updatedProgress = [...prevProgressList];
                        updatedProgress[index] = progress.toFixed(0);
                        return updatedProgress;
                    });
                },
                () => {
                    setFileUploadError((prevErrors) => {
                        const updatedErrors = [...prevErrors];
                        updatedErrors[index] = "Не удалось загрузить файл";
                        return updatedErrors;
                    });
                    setFileUploadProgress((prevProgressList) => {
                        const updatedProgress = [...prevProgressList];
                        updatedProgress[index] = null;
                        return updatedProgress;
                    });
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setFileUploadProgress((prevProgressList) => {
                                const updatedProgress = [...prevProgressList];
                                updatedProgress[index] = null;
                                return updatedProgress;
                            });
                            setFileUploadError((prevErrors) => {
                                const updatedErrors = [...prevErrors];
                                updatedErrors[index] = null;
                                return updatedErrors;
                            });
                            setFormDataList((prevFormDataList) => {
                                const updatedList = [...prevFormDataList];
                                updatedList[index].image = downloadURL;
                                return updatedList;
                            });
                        }
                    );
                }
            );
        } catch (error) {
            setFileUploadError((prevErrors) => {
                const updatedErrors = [...prevErrors];
                updatedErrors[index] = "Не удалось загрузить файл";
                return updatedErrors;
            });
            setFileUploadProgress((prevProgressList) => {
                const updatedProgress = [...prevProgressList];
                updatedProgress[index] = null;
                return updatedProgress;
            });
            console.log(error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataListWithPlace = formDataList.map((formData) => ({
                ...formData,
                place: currentUser.place,
            }));
            // Отправка данных из всех форм
            const res = await fetch("/api/post/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataListWithPlace),
            });
            const data = await res.json();

            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            if (res.ok) {
                setPublishError(null);
                navigate("/post");
            }
        } catch (error) {
            setPublishError("Что-то пошло не так");
        }
    };

    const addProcedureForm = () => {
        setFormDataList((prevFormDataList) => [
            ...prevFormDataList,
            { startDate: null, endDate: null },
        ]);
        setFileUploadProgress((prevProgressList) => [
            ...prevProgressList,
            null,
        ]);
        setFileUploadError((prevErrors) => [...prevErrors, null]);
    };

    const handleStartDateChange = (date, index) => {
        setFormDataList((prevFormDataList) => {
            const updatedList = [...prevFormDataList];
            updatedList[index].startDate = date;
            return updatedList;
        });
    };

    const handleEndDateChange = (date, index) => {
        setFormDataList((prevFormDataList) => {
            const updatedList = [...prevFormDataList];
            updatedList[index].endDate = date;
            return updatedList;
        });
    };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Создание записи
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                {formDataList.map((formData, index) => (
                    <div
                        key={index}
                        className={`flex flex-col gap-4 ${
                            index > 0 ? "mt-8" : ""
                        }`}
                    >
                        <Select
                            onChange={(e) =>
                                setFormDataList((prevFormDataList) => {
                                    const updatedList = [...prevFormDataList];
                                    updatedList[index].category =
                                        e.target.value;
                                    return updatedList;
                                })
                            }
                        >
                            <option value="">Выбор пройденных процедур</option>
                            <option value="Психотерапия">Психотерапия</option>
                            <option value="Физиотерапия">Физиотерапия</option>
                            <option value="Массаж">Массаж</option>
                            <option value="ЛФК">ЛФК</option>
                        </Select>
                        <ReactQuill
                            theme="snow"
                            required
                            id={`content-${index}`}
                            placeholder="Отметки..."
                            className="h-72 mb-12"
                            onChange={(value) =>
                                setFormDataList((prevFormDataList) => {
                                    const updatedList = [...prevFormDataList];
                                    updatedList[index].content = value;
                                    return updatedList;
                                })
                            }
                        />
                        <TextInput
                            type="text"
                            placeholder="Рекомендации"
                            required
                            id={`title-${index}`}
                            onChange={(e) =>
                                setFormDataList((prevFormDataList) => {
                                    const updatedList = [...prevFormDataList];
                                    updatedList[index].title = e.target.value;
                                    return updatedList;
                                })
                            }
                        />

                        <div
                            className="flex gap-4 items-center justify-between border-4 border-teal-500
                        border-dotted p-3"
                        >
                            <FileInput
                                type="file"
                                accept="*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setFormDataList((prevFormDataList) => {
                                        const updated = [...prevFormDataList];
                                        updated[index].file = file; // Сохраняем файл в состояние формы
                                        return updated;
                                    });
                                }}
                            />
                            <Button
                                type="button"
                                gradientDuoTone="purpleToBlue"
                                size="sm"
                                outline
                                onClick={() => handleUploadFile(index)} // Передаем индекс формы
                                disabled={fileUploadProgress[index]}
                            >
                                {fileUploadProgress[index] ? (
                                    <div className="w-16 h-16">
                                        <CircularProgressbar
                                            value={fileUploadProgress[index]}
                                            text={`${
                                                fileUploadProgress[index] || 0
                                            }%`}
                                        />
                                    </div>
                                ) : (
                                    "Загрузить файл"
                                )}
                            </Button>
                        </div>
                        {fileUploadError[index] && (
                            <Alert color="failure">
                                {fileUploadError[index]}
                            </Alert>
                        )}
                        {index === formDataList.length - 1 && (
                            <>
                                <div className="flex gap-4 flex-col sm:flex-row">
                                    <div className="flex flex-col">
                                        <Label className="text-sm text-gray-600">
                                            Начальная дата
                                        </Label>
                                        <DatePicker
                                            selected={formData.startDate}
                                            onChange={(date) =>
                                                handleStartDateChange(
                                                    date,
                                                    index
                                                )
                                            }
                                            selectsStart
                                            startDate={formData.startDate}
                                            endDate={formData.endDate}
                                            dateFormat="dd.MM.yyyy"
                                            locale={ru}
                                            className="rounded-lg bg-gray-50 border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label className="text-sm text-gray-600">
                                            Конечная дата
                                        </Label>
                                        <DatePicker
                                            selected={formData.endDate}
                                            onChange={(date) =>
                                                handleEndDateChange(date, index)
                                            }
                                            selectsEnd
                                            startDate={formData.startDate}
                                            endDate={formData.endDate}
                                            minDate={formData.startDate}
                                            dateFormat="dd.MM.yyyy"
                                            locale={ru}
                                            className="rounded-lg bg-gray-50 border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                <Button
                    gradientDuoTone="purpleToBlue"
                    outline
                    onClick={addProcedureForm}
                >
                    Добавить процедуру
                </Button>
                <Button
                    type="submit"
                    gradientDuoTone="purpleToPink"
                    className="my-4"
                >
                    Сохранить
                </Button>
                {publishError && (
                    <Alert className="mt-5" color="failure">
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    );
}
