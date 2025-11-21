'use client';
import React, { useEffect, useState } from "react";
import { getPosts } from "@/lib/actions";
import { Post } from "@/lib/supabase-types";


const BlogListPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await getPosts();
                setPosts(result.data ?? []);
                if (result.error) {
                    // Optionally, you can set an error state here if you want to display it
                    console.error(result.error);
                }
                // Handle error as needed
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (posts.length === 0) {
        return <div>No blog posts found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-gray-100">Blog Posts</h1>
            <div className="grid gap-6">
            {posts.map((post) => (
                <div
                key={post.id}
                className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow-sm border border-gray-100 dark:border-gray-800"
                >
                <h2 className="text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-400">{post.title}</h2>
                <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{post.published_at}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{post.tags}</p>
                <a
                    href={`/blog/${post.id}`}
                    className="inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                    Read more &rarr;
                </a>
                </div>
            ))}
            </div>
        </div>
    );
};

export default BlogListPage;