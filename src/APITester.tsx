import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRef, type SubmitEvent } from "react";

export function APITester() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const testEndpoint = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const endpoint = formData.get("endpoint") as string;
      const url = new URL(endpoint, location.href);
      const method = formData.get("method") as string;
      const res = await fetch(url, { method });

      const data = await res.json();
      responseInputRef.current!.value = JSON.stringify(data, null, 2);
    } catch (error) {
      responseInputRef.current!.value = String(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <form
        onSubmit={testEndpoint}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
      >
        <div className="flex gap-2 w-full sm:w-auto">
          <Label htmlFor="method" className="sr-only">
            Method
          </Label>
          <Select name="method" defaultValue="GET">
            <SelectTrigger className="w-[100px]" id="method">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Label htmlFor="endpoint" className="sr-only">
          Endpoint
        </Label>
        <Input
          id="endpoint"
          type="text"
          name="endpoint"
          defaultValue="/api/hello"
          placeholder="/api/hello"
          className="w-full sm:flex-1"
        />
        <Button type="submit" variant="secondary" className="w-full sm:w-auto">
          Send
        </Button>
      </form>
      <Label htmlFor="response" className="sr-only">
        Response
      </Label>
      <Textarea
        ref={responseInputRef}
        id="response"
        readOnly
        placeholder="Response..."
        className="min-h-[140px] font-mono resize-y w-full"
      />
    </div>
  );
}
