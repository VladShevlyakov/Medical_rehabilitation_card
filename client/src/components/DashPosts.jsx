import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    console.log(userPosts);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(
                    `/api/post/getposts?userId=${currentUser._id}`
                );
                const data = await res.json();
                console.log(data);
                if (res.ok) {
                    setUserPosts(data.posts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchPosts();
    }, [currentUser._id]);
    return (
        <div
            className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
		"
        >
            {userPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Дата создания</Table.HeadCell>
                            <Table.HeadCell>Вид реабилитации</Table.HeadCell>
                            <Table.HeadCell>Место прохождения</Table.HeadCell>
                            {currentUser.isDoctor && (
                                <>
                                    <Table.HeadCell>Удалить</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span>Изменить</span>
                                    </Table.HeadCell>
                                </>
                            )}
                        </Table.Head>
                        {userPosts.map((post) => (
                            <>
                                <Table.Body className="divide-y ">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>
                                            {new Date(
                                                post.updatedAt
                                            ).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell className="flex justify-center">
                                            <Link to={`/post/${post.slug}`}>
                                                {post.category}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>{post.place}</Table.Cell>
                                        {currentUser.isDoctor && (
                                            <>
                                                <Table.Cell>
                                                    <span
                                                        className="font-medium text-red-500 hover:underline
													cursor-pointer"
                                                    >
                                                        Удалить
                                                    </span>
                                                </Table.Cell>
                                                <Table.Cell className="">
                                                    <Link
                                                        className="text-teal-500 hover:underline"
                                                        to={`/post/${post._id}`}
                                                    >
                                                        <span>Изменить</span>
                                                    </Link>
                                                </Table.Cell>
                                            </>
                                        )}
                                    </Table.Row>
                                </Table.Body>
                            </>
                        ))}
                    </Table>
                </>
            ) : (
                <p>У вас нет записей</p>
            )}
        </div>
    );
}
