'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


import Loader from "@components/Loader";
import Profile from "@components/Profile";

const ProfilePage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingFailed, setLoadingFailed] = useState(false);

    const maxRetries = 3;
    let retryCount = 0;

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setLoadingFailed(false);
            const response = await fetch(`/api/users/${session?.user.id}/posts`);
            const data = await response.json();

            setPosts(data);
            setLoading(false);

        } catch (error) {
            console.log(error)

            if (retryCount < maxRetries) {
                setTimeout(() => {
                    retryCount++;
                    console.log(`retry profile posts: ${retryCount}`);
                    fetchPosts();
                }, 4000);
            } else {
                setLoading(false);
                setLoadingFailed(true);
                console.log('Profile loading failed');
            }
        }
    };

    useEffect(() => {
        if (session?.user.id) fetchPosts();
    }, []);



    const handleEdit = (post) => {
        router.push(`/update-prompt/${post._id}`)
    }


    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?")

        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: "DELETE",
                });

                const filteredPosts = posts.filter((item) => item._id !== post._id);

                setPosts(filteredPosts);

            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
            {loading && <Loader />}
            
            {!loading && loadingFailed &&
                <div className="text-2xl text-[red] mt-6 flex flex-col items-center">
                    Loading Failed. Try Again!
                    <div
                        onClick={fetchPosts}
                        className="mt-4 text-[#0071e2] text-center font-medium text-lg py-2 px-12 border border-[#0071e2] rounded-md cursor-pointer select-none"
                    >
                        Reload
                    </div>
                </div>
            }


            {!loading && !loadingFailed &&
                <Profile
                    name="My"
                    desc="Welcome to your personalized profile page"
                    data={posts}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            }
        </>
    )
}

export default ProfilePage