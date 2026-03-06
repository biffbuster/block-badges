"use client";

import { useLogin } from "@privy-io/react-auth";

export default function PrivyLoginButton() {
  const { login } = useLogin();

  return (
    <button
      onClick={login}
      className="btn-liquid px-6 py-2.5 text-sm font-bold rounded-full text-white"
    >
      Sign In
    </button>
  );
}
