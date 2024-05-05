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

export default function CreatePost() {
    const [file, setFile] = useState(null);
    const [fileUploadProgress, setFileUploadProgress] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const handleUploadFile = async () => {
        try {
            if (!file) {
                setFileUploadError("Пожалуйста, выберите файл");
                return;
            }
            setFileUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + "-" + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setFileUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setFileUploadError("Не удалось загрузить файл");
                    setFileUploadProgress(null);
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setFileUploadProgress(null);
                            setFileUploadError(null);
                            setFormData({ ...formData, image: downloadURL });
                        }
                    );
                }
            );
        } catch (error) {
            setFileUploadError("Не удалось загрузить файл");
            setFileUploadProgress(null);
            console.log(error);
        }
    };
    const [forms, setForms] = useState([{}]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const addForm = () => {
        setForms([...forms, {}]); // Добавляем новую форму в массив состояния
    };
    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Создание записи
            </h1>
            <form className="flex flex-col gap-4">
                {forms.map((form, index) => (
                    <div
                        className={`flex flex-col gap-4 ${
                            index > 0 ? "mt-8" : ""
                        }`}
                        key={index}
                    >
                        <Select className="rounded border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500">
                            <option value="uncategorized">
                                Выбор пройденных процедур
                            </option>
                            <option value="psychologist">Психотерапия</option>
                            <option value="physiotherapist">
                                Физиотерапия
                            </option>
                            <option value="massage">Массаж</option>
                            <option value="lfk">ЛФК</option>
                        </Select>
                        <ReactQuill
                            theme="snow"
                            required
                            placeholder="Отметки..."
                            className="h-72 mb-12"
                        />
                        <TextInput
                            type="text"
                            placeholder="Рекомендации"
                            required
                            id="recomm"
                            className="rounded border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        <div
                            className="flex gap-4 items-center justify-between border-4 border-teal-500
                        border-dotted p-3"
                        >
                            <FileInput
                                type="file"
                                accept="*"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <Button
                                type="button"
                                gradientDuoTone="purpleToBlue"
                                size="sm"
                                outline
                                onClick={handleUploadFile}
                                disabled={fileUploadProgress}
                            >
                                {fileUploadProgress ? (
                                    <div className="w-16 h-16">
                                        <CircularProgressbar
                                            value={fileUploadProgress}
                                            text={`${fileUploadProgress || 0}%`}
                                        />
                                    </div>
                                ) : (
                                    "Загрузить файл"
                                )}
                            </Button>
                        </div>
                        {fileUploadError && (
                            <Alert color="failure">{fileUploadError}</Alert>
                        )}
                        {index === forms.length - 1 && (
                            <div className="flex gap-4 flex-col sm:flex-row">
                                <div className="flex flex-col">
                                    <Label className="text-sm text-gray-600">
                                        Начальная дата
                                    </Label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
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
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        dateFormat="dd.MM.yyyy"
                                        locale={ru}
                                        className="rounded-lg bg-gray-50 border-gray-300 focus:ring focus:ring-blue-200 focus:border-blue-500 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <Button
                    onClick={addForm}
                    gradientDuoTone="purpleToBlue"
                    outline
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
            </form>
        </div>
    );
}
