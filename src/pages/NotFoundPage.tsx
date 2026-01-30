import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Ghost } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-foreground relative overflow-hidden">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Ghost className="h-12 w-12 text-muted-foreground" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          404 <span className="text-primary">Not Found</span>
        </h1>

        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          The page you are looking for does not exist. It might have been moved
          or deleted.
        </p>

        <div className="flex items-center gap-2">
          <Button asChild size="lg" className="gap-2 shadow-lg">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 text-xs text-muted-foreground">
        Error Code: 404_PAGE_NOT_FOUND
      </div>
    </div>
  );
}
