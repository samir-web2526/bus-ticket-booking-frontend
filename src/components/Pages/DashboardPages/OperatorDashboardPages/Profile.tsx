import { getProfile } from '@/src/services/dashboard-services/profile';
import React from 'react'

export default async function Profile() {
   const user = await getProfile();
    console.log(user);
    return (
      <div>Profile: {user.data?.name}</div>
    )
}
