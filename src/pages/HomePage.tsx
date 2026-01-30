import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APITester } from "@/APITester";
import logo from "@/logo.svg";
import reactLogo from "@/react.svg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function HomePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="container mx-auto p-8 text-center relative z-10 flex flex-col items-center">
      <div className="absolute top-4 right-4 flex gap-4 items-center">
        <span className="text-sm font-medium">
          Hello, {user?.displayName || user?.email}
        </span>
        <Button variant="destructive" onClick={signOut}>
          Logout
        </Button>
      </div>

      <div className="flex justify-center items-center gap-8 mb-8 mt-12">
        <img
          src={logo}
          alt="Bun Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-[spin_20s_linear_infinite]"
        />
      </div>
      <Card className="max-w-xl w-full">
        <CardHeader className="gap-4">
          <CardTitle className="text-3xl font-bold">
            Bun + React + Auth
          </CardTitle>
          <CardDescription>You are securely logged in.</CardDescription>
        </CardHeader>
        <CardContent>
          <APITester />
        </CardContent>
      </Card>
    </div>
  );
}
