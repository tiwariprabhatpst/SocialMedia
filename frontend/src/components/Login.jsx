import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice.js'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    const {user} = useSelector(store=>store.auth);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEvenetHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const signupHandler = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login/', input, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
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

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p>Login to see Photos & videos from your friends</p>
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
                    ) : (<Button type='submit'>Login</Button>)
                }
                <Label className="text-center" >Don't have an accout? <Link className='text-blue-600' to="/signup">Signup</Link></Label>
            </form>
        </div>
    )
}

export default Login
