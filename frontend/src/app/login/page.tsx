"use client";
import Head from "next/head";
import { signIn } from "next-auth/react";

const LoginPage: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Login Page</title>
      </Head>

      <div className="flex min-h-screen bg-mainContent items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h2 className="text-center text-4xl leading-9 font-extrabold text-white">Welcome to the DTI File Parser!</h2>
          <div className="mt-8 space-y-6">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: process.env.NEXT_PUBLIC_API_URL + "/welcome"})}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="mr-2 -ml-1 w-12 h-12"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>{" "}
              <span className="mt-2 ml-6 text-2xl"> Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
