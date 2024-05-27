import { Button, Label, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoDocumentAttach } from "react-icons/io5";
import DashSidebar from "../components/DashSidebar";
export default function PostPage() {
    const { post_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?postId=${post_id}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                if (res.ok) {
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(false);
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [post_id]);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        );
    return (
        <div className=" flex flex-col md:flex-row">
            <div className="min-h-screen">
                <DashSidebar />
            </div>

            <main className="p-3 flex flex-col  max-w-4xl mx-auto min-h-screen">
                <div className="flex items-center flex-col">
                    <h1 className="text-3xl font-semibold mb-4">
                        Прохождение реабилитации с{" "}
                        {new Date(post.startDate).toLocaleDateString()} по{" "}
                        {new Date(post.endDate).toLocaleDateString()}
                    </h1>
                    <h2 className="text-xl font-semibold mb-2">
                        Место прохождения: {post.place}
                    </h2>
                    <h3 className="text-lg font-semibold mb-2">
                        Главный врач: {post.author.fullname}{" "}
                        {post.author.surname}
                    </h3>
                </div>
                <div>
                    {post.procedures.map((procedure, index) => (
                        <div
                            key={index}
                            className="mb-6 p-4 border rounded-lg shadow-sm"
                        >
                            <Label className="text-sm text-gray-500">
                                Вид процедуры:
                            </Label>
                            <h4 className="inline text-lg font-semibold mx-2">
                                {procedure.category}
                            </h4>
                            <hr className="my-3" />
                            <Label className="block text-sm text-gray-500 mb-1">
                                Отметки:
                            </Label>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: procedure.content,
                                }}
                            />
                            <hr className="my-3" />
                            <Label className="block text-sm text-gray-500 mb-1">
                                Рекомендации:
                            </Label>

                            <h4 className="text-base">{procedure.title}</h4>

                            {procedure.image && (
                                <>
                                    <hr className="my-3" />
                                    <Label className="text-sm text-gray-500 mr-3">
                                        Вложение:
                                    </Label>
                                    <Button
                                        className="inline"
                                        color="gray"
                                        size="xs"
                                        onClick={() => {
                                            const link =
                                                document.createElement("a");
                                            link.href = procedure.image;
                                            link.target = "_blank";
                                            link.rel = "noopener noreferrer";
                                            link.download = true;
                                            link.click();
                                        }}
                                    >
                                        <IoDocumentAttach className="mr-2 h-4 w-4" />
                                        Открыть файл
                                    </Button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
