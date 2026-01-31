import { LoginForm } from '@/features/components';
import { LeftImage } from '@/assets/images';

export default function Login() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[40vh_1fr] lg:grid-rows-1 h-screen min-h-screen overflow-hidden">
      <div className="relative min-h-0 h-full">
        <img
          src={LeftImage}
          alt="Manage digital gifting with ease"
          className="h-full w-full object-cover object-[40%_20%]"
        />
      </div>

      <div className="flex min-h-0 items-center justify-center p-4 sm:p-6 lg:p-8 overflow-auto">
        <LoginForm />
      </div>
    </div>
  );
}
