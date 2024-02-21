'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

import Form from '@components/Form';


const UpdatePrompt = ({ params }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const promptId = params.id;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    });



    useEffect(() => {
        const getPromptDetails = async () => {
            try {
                if (!promptId) {
                    throw new Error("Missing PromptId!");
                }

                const response = await fetch(`/api/prompt/${promptId}`);
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
    }, [])


    const editPrompt = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

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