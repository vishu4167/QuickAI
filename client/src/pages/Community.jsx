import { useAuth, useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Sidebar from '../components/Sidebar'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = ({ sidebar, setSidebar }) => {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const { getToken } = useAuth()

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const imageLiketoogle = async (id) => {
    setCreations(prev =>
    prev.map(c => {
     if (c.id === id) {
      const alreadyLiked = c.likes.includes(user.id)
        return {
            ...c,
            likes: alreadyLiked
              ? c.likes.filter(uid => uid !== user.id)
              : [...c.likes, user.id]
          }
        }
        return c
      })
    )

    try {
      const { data } = await axios.post(
        '/api/user/toggle-like-creations',
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )
      if (!data.success) {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) fetchCreations()
  }, [user])

  return (
    

      <div className="flex-1 flex flex-col gap-4">
      <h2 className="text-xl font-semibold p-6">Creations</h2>
      <div className="w-full overflow-y-auto flex-1 p-6">
          {loading ? (
            <p className="text-center mt-10">Loading...</p>
          ) : creations.length === 0 ? (
            <p className="text-center mt-10">No creations yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {creations.map((creation, index) => (
               <div key={index} className="relative w-full">
                <img src={creation.content} alt="" className="w-full h-auto object-cover rounded-lg" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white rounded-b-lg">
                    <p className="text-sm">{creation.prompt}</p>
                    <div className="flex gap-1 items-center mt-1">
                      <p>{creation.likes.length}</p>
                      <Heart
                        onClick={() => imageLiketoogle(creation.id)}
                        className={`w-5 h-5 hover:scale-110 cursor-pointer ${
                          creation.likes.includes(user.id)
                            ? 'fill-red-500 text-red-600'
                            : 'text-white'
                        }`}
                      />
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    
  )
}

export default Community
