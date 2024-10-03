
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { Label } from './ui/label'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        }
        else {
            setText("");
        }
    }

    const likeOrDislike = async () => {
        try {
            const action = liked ? 'dislike' : "like";
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedLike = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLike);
                setLiked(!liked);
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    }
                        : p
                )
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true });
            const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, {withCredentials:true});
            if(res.data.success){
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePic} alt="Post Image"></AvatarImage>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex gap-3 items-center'>
                    <h1>{post.author?.username}</h1>
                    {user?._id === post.author._id && (<Badge variant="secondary">Author</Badge>)}
                    </div>
                </div>
                <Dialog >
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {
                            user && user?._id !== post?.author._id &&
                        <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                        }
                        <Button variant="ghost" className="cursor-pointer w-fit ">Add to favorites</Button>
                        {
                            user && user?._id === post?.author._id &&
                            <Button variant="ghost" onClick={deletePostHandler} className="cursor-pointer w-fit ">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img className='rounded-sm my-2 w-full aspect-square object-cover' src={post.image} alt='Loading Image'></img>

            <div className='flex items-center justify-between my-2' >
                <div className='flex items-center gap-3'>
                    {
                        liked ? <FaHeart size={"24px"} onClick={() => likeOrDislike()} className='cursor-pointer text-red-600' />
                            :
                            <FaRegHeart size={"22px"} onClick={() => likeOrDislike()} className='cursor-pointer hover:text-gray-600'></FaRegHeart>
                    }
                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className='cursor-pointer hover:text-gray-600'></MessageCircle>
                    <Send className='cursor-pointer hover:text-gray-600'></Send>
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
            </div>
            <Label className="fond-medium block mb-2">{postLike} likes</Label>
            <p>
                <Label className="font-medium mr-2">{post.author.username}</Label>
                {post.caption}
            </p>
            {
                comment.length > 0 && (
                    <Label onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} className="text-sm cursor-pointer text-gray-400">View all {post.comments.length} comments</Label>
                )
            }
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='items-center flex justify-between'>
                <input type='text' placeholder='Add a comment' className='outline-none text-sm w-full' value={text} onChange={changeEventHandler}></input>
                {
                    text && <Label onClick={commentHandler} className="text-[#3BADF8]">Post</Label>
                }
            </div>
        </div>
    )
}

export default Post