import { Button } from "@/components/ui/button";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


function Page(props) {
  return (
    <div className="space-x-4">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description 123</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <Button variant="destructive" className="w-full mt-4">Test</Button>
    </div>
  );
}

export default Page;