import { signIn } from "next-auth/react";

const SocialLogin = () => {
  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signIn("google")}
        className="flex items-center justify-center gap-2 w-full p-2 border rounded hover:bg-gray-50"
      >
        {/* You can use an icon library like react-icons here */}
        <img src="/google-icon.svg" alt="G" className="w-5 h-5" />
        Sign in with Google
      </button>

      <button
        type="button"
        onClick={() => signIn("facebook")}
        className="flex items-center justify-center gap-2 w-full p-2 border rounded hover:bg-gray-50"
      >
        <img src="/facebook-icon.svg" alt="F" className="w-5 h-5" />
        Sign in with Facebook
      </button>
    </div>
  );
};

export default SocialLogin;
