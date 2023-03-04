import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { GoVerified } from 'react-icons/go';
import Link from 'next/link';
import axios from 'axios';

import VideoCard from '../../components/VideoCard';
import NoResults from '../../components/NoResults';
import { IUser, Video } from '../../types';
import { BASE_URL } from '../../utils';

import useAuthStore from '../../store/authStore';
import { allUsersQuery } from '@/utils/queries';

const Search = ({ videos }: { videos: Video[] }) => {
    const [isAccounts, setIsAccounts] = useState(false);
    const router = useRouter()
    const { searchTerm }: any = router.query
    const { allUsers } = useAuthStore()

    const accounts = isAccounts ? 'border-b-2 border-black' : 'text-gray-400';
    const isVideos = !isAccounts ? 'border-b-2 border-black' : 'text-gray-400';

    const searchedAccounts = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className='w-full'>
        <div className='flex gap-10 mb-10 border-b-2 border-gray-200 md:fixed z-50 bg-white w-full'>
        <p onClick={() => setIsAccounts(true)} className={`text-xl  font-semibold cursor-pointer ${accounts} mt-2`}>
          Accounts
        </p>
        <p className={`text-xl font-semibold cursor-pointer ${isVideos} mt-2`} onClick={() => setIsAccounts(false)}>
          Videos
        </p>
        </div>
        {isAccounts ? (
            <div className='md:mt-16'>
                {searchedAccounts.length > 0 ? (
                    searchedAccounts.map((user: IUser, idx: number) => (
                    <Link href={`/profile/${user._id}`} key={idx}>
                        <div className=' flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200'>
                            <div>
                                <Image
                                src={user.image}
                                width={48}
                                height={48}
                                className="rounded-full cursor-pointer"
                                alt="profile"
                                />
                            </div>
                                <p className='flex cursor-pointer gap-1 items-center text-[18px] font-bold leading-6 text-primary'>
                                {user.userName}{' '}
                                <GoVerified color='red' />
                                </p>
                        </div>
                    </Link>
                    ))
                ): <NoResults text={`No Video Results Found for ${searchTerm}`} />}  
            </div>
        ): (
            <div className='md:mt-16 flex flex-wrap gap-6 md:justify-start'>
                {videos.length ? (
                    videos.map((video: Video, idx) => (
                        <VideoCard post={video} key={idx} />
                    ))
                ): <NoResults text={`No Video Results Found for ${searchTerm}`} />}    
            </div>
        )}
    </div>
  )
}

export const getServerSideProps = async ({
    params: { searchTerm }
}: {
    params: { searchTerm: string }
}) => {
    const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)

    return {
        props: { videos: res.data }
    }
}

export default Search