import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import DashInfoPatient from "./DashInfoPatient";

export default function DashPostsPatient() {
    const location = useLocation();
    const userData = location.state?.userData || {};
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(
                    `/api/post/getposts?userId=${userData._id}`
                );
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchPosts();
    }, [userData._id]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(
                `/api/post/getposts?userId=${userData._id}&startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(
                `/api/post/deletepost/${postIdToDelete}/${userData._id}`,
                {
                    method: "DELETE",
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== postIdToDelete)
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <div className=" flex flex-col md:flex-row">
            <div className="min-h-screen">
                <DashInfoPatient />
            </div>
            <div
                className="table-auto  md:mx-auto p-3  
		"
            >
                {userPosts.length > 0 ? (
                    <>
                        <Table hoverable className="shadow-md">
                            <Table.Head>
                                <Table.HeadCell>
                                    Даты прохождения
                                </Table.HeadCell>
                                <Table.HeadCell>Главный Врач</Table.HeadCell>
                                <Table.HeadCell>
                                    Место прохождения
                                </Table.HeadCell>
                                {currentUser.isDoctor && (
                                    <>
                                        <Table.HeadCell>Удалить</Table.HeadCell>
                                    </>
                                )}
                            </Table.Head>
                            <Table.Body className="divide-y ">
                                {userPosts.map((post) => (
                                    <Table.Row
                                        key={post._id}
                                        onClick={() =>
                                            navigate(`/post/${post._id}`)
                                        }
                                        className="cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <Table.Cell>
                                            {new Date(
                                                post.startDate
                                            ).toLocaleDateString()}
                                            {" - "}
                                            {new Date(
                                                post.endDate
                                            ).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell className="flex justify-center">
                                            {post.author.surname}{" "}
                                            {post.author.fullname}
                                        </Table.Cell>
                                        <Table.Cell>{post.place}</Table.Cell>

                                        {currentUser.isDoctor && (
                                            <>
                                                <Table.Cell>
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowModal(true);
                                                            setPostIdToDelete(
                                                                post._id
                                                            );
                                                        }}
                                                        className="font-medium text-red-500 hover:underline
													cursor-pointer"
                                                    >
                                                        Удалить
                                                    </span>
                                                </Table.Cell>
                                            </>
                                        )}
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        {showMore && (
                            <button
                                onClick={handleShowMore}
                                className="w-full text-teal-500 self-center text-sm py-7"
                            >
                                Показать больше
                            </button>
                        )}
                    </>
                ) : (
                    <p> Записей пока что нет</p>
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
                                Вы уверены, что хотите удалить данную запись?
                            </h3>
                            <div className="flex justify-center gap-10">
                                <Button
                                    color="failure"
                                    onClick={handleDeletePost}
                                >
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
        </div>
    );
}
