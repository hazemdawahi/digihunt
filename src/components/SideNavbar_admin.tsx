import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
  MdOutlineIntegrationInstructions,
  MdOutlineMoreHoriz,
  MdOutlineSettings,
  MdOutlineLogout,
  MdBusiness,
  MdQuiz,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaFilePdf, FaRegComments, FaRegFilePdf } from "react-icons/fa";
import { BiBriefcase, BiEditAlt, BiMessageSquareDots } from "react-icons/bi";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { profile } from "console";
import { Spacer } from "@nextui-org/react";
import { useRouter } from "next/router";

function SideNavbar_admin() {
  const router = useRouter();

  function companies() {
    router.push("/companies");
  }

  function users() {
    router.push("/users");
  }

  function quiznavigate() {
    router.push("/create_quizz");
  }
  
  async function handleSignout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      // Handle errors here
    }
  }

  const { data: session } = useSession(); // Retrieve the session data using useSession hook

  if (!session) {
    return null;
  }

  if (session.user.role !== "admin") {
    return null;
  }

  return (
    <div>
      <Disclosure as="nav">
        <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
          <GiHamburgerMenu className="block md:hidden h-6 w-6" aria-hidden="true" />
        </Disclosure.Button>
        <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
          <div className="fle flex-col justify-start item-center">
            <center>
              <img src="/assets/digi.png" alt="Logo" className="w-70 h-70 m-auto" />
            </center>
            <Spacer y={1} />
            <div className=" my-4 border-b border-gray-100 pb-4">
              <div onClick={users} className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <CgProfile className="text-2xl text-blue-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">Users</h3>
              </div>
              <div onClick={companies} className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdBusiness className="text-2xl text-blue-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">Companies</h3>
              </div>
              <div onClick={quiznavigate} className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdQuiz className="text-2xl text-blue-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">Quizzes</h3>
              </div>
            </div>
            <div onClick={handleSignout} className="my-4 cursor-pointer">
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineLogout className="text-2xl text-blue-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">Logout</h3>
              </div>
            </div>
          </div>
        </div>
        <Disclosure.Panel className="md:hidden">
          {/* Mobile view code can be inserted here, you can just copy the code from the previous disclosure */}
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
}

export default SideNavbar_admin;
