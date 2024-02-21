'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import Form from '@components/Form';


const UpdatePrompt = () => {
    const router = useRouter();
    const { data: session } = useSession();
    // Wrap useSearchParams in Suspense
    const searchParams = useSearchParams();

    // Handle the case when promptId is not present
    if (!searchParams.get('id')) {
        // Redirect to an error page or another appropriate page
        // router.push('/error');
        return (
            <div>
                <h1 className="head_text text-left">
                    <span className="blue_gradient">Error: Prompt ID not found</span>
                </h1>

                <p className="desc text-left max-w-md">
                    Please check the URL and try again.
                </p>
            </div>
        );
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    });



    useEffect(() => {
        const getPromptDetails = async () => {
            try {
                const promptId = searchParams.get('id');
                if (!promptId) {
                    throw new Error("Missing PromptId!");
                }

                const response = await fetch(`api/prompt/${promptId}`);
                if (!response.ok) {
                    throw new Error("Failed to fecth prompt details")
                }

                const data = await response.json();
                setPost({
                    prompt: data.prompt,
                    tag: data.tag,
                })

            } catch (error) {
                console.log(error)
            }

        }

        getPromptDetails();
    }, [searchParams])


    const editPrompt = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const promptId = searchParams.get('id');

        if (!promptId) return alert('Prompt ID not found');

        try {
            const response = await fetch(`/api/prompt/${promptId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    userId: session?.user.id,
                    prompt: post.prompt,
                    tag: post.tag,
                }),
            });

            if (response.ok) {
                router.back();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Form
                type="Edit"
                post={post}
                setPost={setPost}
                isSubmitting={isSubmitting}
                handleSubmit={editPrompt}
            />
        </Suspense>
    )
}

export default UpdatePrompt