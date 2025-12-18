import React from "react"
import { Protect, useUser, useClerk } from "@clerk/clerk-react"
import { NavLink } from "react-router-dom"
import { Eraser, Hash, House, Image, Scissors, SquarePen, Users, LogOut } from "lucide-react"

interface SidebarProps {
  sidebar: boolean
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

interface NavItem {
  to: string
  label: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const navItems: NavItem[] = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/community", label: "Community", Icon: Users },
]


const Sidebar: React.FC<SidebarProps> = ({ sidebar, setSidebar }) => {
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  if (!user) return null 

  return (
    <>
      {sidebar && (
        <div
          onClick={() => setSidebar(false)}
          className="sm:hidden fixed inset-0 bg-black/50 z-[60] top-14"/>
      )}

      <div
        className={`w-60 bg-white border-r border-gray-200 flex flex-col items-center 
        sm:relative max-sm:fixed top-14 bottom-0 left-0 z-[70]  pt-20 sm:pt-6
        ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"} 
        transition-all duration-300 ease-in-out`} >

        <div className="mt-0 mb-7 w-full overflow-y-auto flex-grow">
          <img src={user.imageUrl} alt="user avatar" className="w-14 rounded-full mx-auto" />
          <h1 className="mt-1 text-center font-medium">{user.fullName}</h1>

          <div className="px-6 mt-5 text-sm text-gray-600 font-medium flex flex-col gap-2">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/ai"}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded transition 
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                } >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
          <div onClick={() => openUserProfile()} className="flex gap-2 items-center cursor-pointer">
           <img src={user.imageUrl} className="w-8 rounded-full" alt="" />
            <div>
              <h1 className="text-sm font-medium">{user.fullName}</h1>
              <p className="text-xs text-gray-500">
                <Protect plan="premium" fallback="free">
                  Premium
                </Protect>{" "}
                Plan
              </p>
            </div>
          </div>
          <LogOut
            onClick={() => signOut()}
            className="w-5 text-gray-400 hover:text-gray-700 transition cursor-pointer" />
        </div>
      </div>
    </>
  )
}

export default Sidebar
