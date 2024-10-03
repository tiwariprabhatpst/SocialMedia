import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const changeEvenetHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const signupHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/register/', input, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p>Signup to see Photos & videos from your friends</p>
                </div>
                <div>
                    <Label>Username</Label>
                    <Input type="text" name="username" value={input.username}
                        onChange={changeEvenetHandler} className="focus-visible:ring-transparent" />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input type="email" name="email" value={input.email} onChange={changeEvenetHandler} className="focus-visible:ring-transparent" />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input type="password" name="password" value={input.password} onChange={changeEvenetHandler} className="focus-visible:ring-transparent" />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please Wait
                        </Button>
                    ) : (<Button type='submit'>Signup</Button>)
                }
                <Label className="text-center" >Already have an accout? <Link to="/login" className='text-blue-600'>Login</Link></Label>
            </form>
        </div>
    )
}

export default Signup
