import React from 'react'
import EditiProfile from './EditiProfile'
import { useSelector } from 'react-redux'

const Profile = () => {
  const user=useSelector((store)=>store.user)
  return (
    user &&(
    <div>
      <EditiProfile user={user}/>
    </div>
    )
  )
}

export default Profile