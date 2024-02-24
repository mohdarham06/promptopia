'use client'

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Loader from "@components/Loader";
import Profile from "@components/Profile";


const UserProfiles = ({ params }) => {
    const searchParams = useSearchParams();
    const userName = searchParams.get("name");

    const [userPosts, setUserPosts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingFailed, setLoadingFailed] = useState(false);

    const maxRetries = 3;
    let retryCount = 0;

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setLoadingFailed(false);
            const response = await fetch(`/api/users/${params?.id}/posts`);
            const data = await response.json();

            setUserPosts(data);
            setLoading(false);

        } catch (error) {
            console.log(error)

            if (retryCount < maxRetries) {
                setTimeout(() => {
                    retryCount++;
                    console.log(`retry user profile posts: ${retryCount}`);
                    fetchPosts();
                }, 4000);
            } else {
                setLoading(false);
                setLoadingFailed(true);
                console.log('User Profile loading failed');
            }
        }
    };

    useEffect(() => {
        if (params?.id) fetchPosts();
    }, [params.id]);



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
                    name={userName}
                    desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
                    data={userPosts}
                />
            }
        </>
    )
}

export default UserProfiles