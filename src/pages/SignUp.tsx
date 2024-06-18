import  { useState } from "react";
import { FaLinkedinIn, FaRegEnvelope } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdContact } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { FaSchool } from "react-icons/fa";
import { MdEngineering } from "react-icons/md";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../configs/firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (password.length < 8) {
        toast.error("Password should be atleast 8 characters", {
          position: "bottom-center",
        });
        return;
      }
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Profile", user.uid), {
          email: email,
        });
      }
      console.log("User Created Successfully");
      toast.success("User Created Successfully !!", { position: "top-center" });
    } catch (error:any) {
      console.log(error.message);
      toast.error("User Already Registered", { position: "bottom-center" });
    }
  };

  return (
    <div className="col-span-7 flex min-h-screen flex-col items-center justify-center bg-gray-100 py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="flex w-2/3 max-w-4xl rounded-2xl bg-white shadow-2xl">
          <div className="w-full p-5">
            <div className="flex items-center gap-2">
              <img
                alt="logo"
                className=" aspect-square w-12 rounded-full p-1"
              />
              <div className="text-left text-xl font-bold">
                <span className="text-blue-500">Ask</span>
                <span className="text-black">Me</span>
              </div>
            </div>

            <div className="py-10" onSubmit={handleSubmit}>
              <h2 className="mb-2 text-3xl font-bold text-blue-500">
                Create your Account
              </h2>
              <form action="" onSubmit={handleSubmit}>
                <div className="mb-2 inline-block w-10 border-2 border-blue-500"></div>

                <div className="flex flex-col items-center">
                  <div className="mb-3 flex w-64 items-center rounded-xl bg-gray-100 p-2">
                    <FaRegEnvelope className="m-2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="flex-1 bg-gray-100 text-sm outline-none"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-3 flex w-64 items-center rounded-xl bg-gray-100 p-2">
                    <RiLockPasswordLine className="m-2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="flex-1 bg-gray-100 text-sm outline-none"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Link to="/sign-up">
                    <p
                      className="m-5 inline-block rounded-full border-2 border-solid border-blue-500 px-10 py-2 font-bold text-blue-500 hover:bg-white hover:text-blue-500"
                      onClick={handleSubmit}
                    >
                      Sign Up
                    </p>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
