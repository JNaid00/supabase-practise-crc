import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import Link from "next/link";
import NavBarEg from "../../components/NavBarEg";
const content = [
  {
    username: "Prospect",
    fullname: "Jesse",
    website: "https://spotlight.tailwindui.com/",
  },
];
const sortArray = [
  {
    title: "Username",
    type: "username",
    id: "1",
  },
  {
    title: "Full Name",
    type: "full_name",
    id: "2",
  },
  {
    title: "Age",
    type: "age",
    id: "3",
  },
];

const newProfile = [
  {
    title: "Username",
    type: "username",
    id: "username_newProfile",
  },
  {
    title: "Full Name",
    type: "full_name",
    id: "full_name_newProfile",
  },
  {
    title: "Age",
    type: "age",
    id: "age_newProfile",
  },
  {
    title: "Website",
    type: "website",
    id: "website_newProfile",
  },
];
export default function index() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [profiles, setProfiles] = useState([]);
  const [allStatus, setAllStatus] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [statusId, setStatusID] = useState("1");
  async function getData() {
    const { data, error } = await supabase.from("profiles").select();
  }
  useEffect(() => {
    getAllData();
  }, [session]);

  async function getAllData() {
    try {
      var { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, full_name, age, id`);

      if (error && status !== 406) {
        throw error;
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    }
    setProfiles(data);
  }

  async function sort(type) {
    console.log(type);

    try {
      let { data, error, status } = await supabase
        .from("profiles")
        .select()
        .order(type, { ascending: true });

      if (error && status !== 406) {
        throw error;
      }
      setProfiles(data);
      // console.log(data);
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
    }
  }

  useEffect(() => {
    getAllStatus();
  }, [session]);
  async function getAllStatus() {
    try {
      var { data, error, status } = await supabase
        .from("status")
        .select(
          `status_id, updated_at, status, profile_id, profiles (id, full_name, username)`
        );

      if (error && status !== 406) {
        throw error;
      }

      console.log(data);
      setAllStatus(data);
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    }
  }
  
  async function insertIntoTable() {
    
	allStatus.forEach(element => {
	if(element.profiles.id == user.id){
		setStatusID(element.status_id)
	}
  });
//   if (statusId === null){
// 	setStatusID("1")
//   }
setStatusID("1")
  console.log(parseInt(statusId), "Hello");
  console.log(newStatus);
    try {
      const updates = {
        status_id: parseInt(statusId),
		updated_at: new Date().toISOString(),
        status: newStatus,
        profile_id: user.id,
      };

      let { error } = await supabase.from("status").upsert(updates);
      if (error) throw error;
      
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    }

	getAllStatus();
  }
  return (
    <div className="container mx-auto">
      <NavBarEg />
      <div className="p-10 w-[90vw] mx-auto">
        <h1 className="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Profile Table
        </h1>

        <div
          className="inline-flex rounded-md shadow-sm items-center my-5"
          role="group"
        >
          {sortArray.map((item) => (
            <button
              key={item.id}
              onClick={() => sort(item.type)}
              type="button"
              className="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-l-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-6 bg-gray-100 dark:bg-gray-800"
                >
                  Username
                </th>
                <th scope="col" className="py-3 px-6">
                  Full Name
                </th>
                <th
                  scope="col"
                  className="py-3 px-6 bg-gray-100 dark:bg-gray-800"
                >
                  Age
                </th>
                <th scope="col" className="py-3 px-6 ">
                  Website
                </th>
              </tr>
            </thead>

            <tbody>
              {profiles.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap bg-gray-100 dark:text-white dark:bg-gray-800"
                  >
                    {item.username}
                  </th>
                  <td className="py-4 px-6">{item.full_name}</td>
                  <td className="py-4 px-6 bg-gray-100 dark:bg-gray-800">
                    {item.age}
                  </td>
                  <td className="py-4 px-6  font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    <Link href={item.website}>Link</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-10 w-[90vw]">
        <h1 className="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Status Table
        </h1>
        <form className="mb-5 mx-auto block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <div className="relative w-64 mb-5">
            <select
              value={newStatus}
              // defaultValue={"Enlisted"}
              onChange={(e) => {
                setNewStatus(e.target.value);
              }}
              id="status_input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Select">Select a status</option>
              <option value="Enlisted">Enlisted</option>
              <option value="Unlisted">Unlisted</option>
              <option value="Rebel">Rebel</option>
              <option value="Dead">Dead</option>
            </select>
          </div>
          <button
            onClick={insertIntoTable}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            type="button"
          >
            Submit
          </button>
        </form>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-6 bg-gray-100 dark:bg-gray-800"
                >
                  Username
                </th>
                <th scope="col" className="py-3 px-6">
                  Full Name
                </th>
                <th
                  scope="col"
                  className="py-3 px-6 bg-gray-100 dark:bg-gray-800"
                >
                  Status
                </th>
                <th scope="col" className="py-3 px-6 ">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {allStatus.map((item) => (
			
                <tr
                  key={item.status_id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap bg-gray-100 dark:text-white dark:bg-gray-800"
                  >
                    {item.profiles.username}
                  </th>
                  <td className="py-4 px-6">{item.profiles.full_name}</td>
                  <td className="py-4 px-6 bg-gray-100 dark:bg-gray-800">
                    {item.status}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {String(item.updated_at).substring(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
{
  /*
<form className="mb-5 mx-auto block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h1>Edit your status</h1>
		  <div className="relative w-64 mb-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              id="username"
              className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="username"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Username
            </label>
          </div>
		  <div className="relative w-64 mb-5">
            <input
              type="text"
              value={full_name}
              onChange={(e) => setfullname(e.target.value)}
              id="full_name"
              className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="full_name"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Full name
            </label>
          </div>
		  <div className="relative w-64 mb-5">
            <input
              type="text"
              value={age}
              onChange={(e) => setage(e.target.value)}
              id="age"
              className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="age"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Age
            </label>
          </div>
		  <div className="relative w-64 mb-5">
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              id="avatar"
              className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="avatar"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Avatar url
            </label>
          </div>
		  <div className="relative w-64 mb-5">
            <input
              type="text"
              value={website}
              onChange={(e) => setwebsite(e.target.value)}
              id="website"
              className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="website"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Wesbsite
            </label>
          </div>
          <button
            onClick={insertIntoTable}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            type="button"
          >
            Submit
          </button>
        </form>	
*/
}
