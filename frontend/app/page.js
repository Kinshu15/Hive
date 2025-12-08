
import LoginPage from "./auth/login/page";
import SignupPage from "./auth/signup/page";
export default function Home() {
  console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
  return (
    <div >
      <SignupPage></SignupPage>
    </div>
  );
}
