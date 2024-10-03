import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Label } from './ui/label'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex gap-3 items-center'>
            <Avatar>
                <AvatarImage src={comment?.author?.profilePic} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className='font-bold text-sm'>{comment?.author.username} <Label className="font-normal pl-1">{comment?.text}</Label></h1>
        </div>
    </div>
  )
}

export default Comment