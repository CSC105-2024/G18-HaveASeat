import React from "react";
import { Link, useParams } from "react-router";
import { Badge } from "@/components/ui/badge.jsx";
import { cn } from "@/lib/utils.js";
import { buttonVariants } from "@/components/ui/button.jsx";
import { IconCarambolaFilled, IconSettings } from "@tabler/icons-react";

function Page() {
  const { id } = useParams();

  const store = {
    id: id,
    name: "Summy Bar",
    telephone: "+66123456789",
    address:
      "126 Pracha Uthit Rd., Bang Mot Subdistrict, Thung Khru District, Bangkok 10140",
    open_hours: {
      Sunday: "10:00 - 00:00",
      Monday: "10:00 - 00:00",
      Tuesday: "10:00 - 00:00",
      Wednesday: "10:00 - 00:00",
      Thursday: "10:00 - 00:00",
      Friday: "10:00 - 00:00",
      Saturday: "10:00 - 00:00",
    },
    created_at: new Date(),
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-row items-center gap-4 rounded-lg bg-gray-50 px-8 py-16 relative">
        <div className="space-y-2">
          <h1 className="ml-1 text-xl font-semibold">{store.name}</h1>
          <div className="flex flex-row flex-wrap gap-2 text-sm">
            <Badge variant="secondary">
              <span className="font-medium">Since</span>{" "}
              {store.created_at.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </Badge>
            {import.meta.env.DEV && (
              <Badge variant="secondary">
                <span className="font-medium">ID</span> {id}
              </Badge>
            )}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Link
            to={`/merchant/${id}/settings`}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "w-full flex items-center justify-center",
            )}
          >
            <IconSettings/>
            Settings
          </Link>
        </div>
      </section>
      <section className="flex flex-col gap-8 md:flex-row-reverse">
        <aside className="flex-3/12 space-y-4 py-4">
          <div className="">
            <div className="space-y-2">
              {/*TODO: Check user role*/}
              <Link
                to={`/merchant/${id}/reservation`}
                className={cn(buttonVariants(), "w-full")}
              >
                Make A Reservation
              </Link>
              {/*TODO: Check user role*/}
              <Link
                to={`/merchant/${id}/reservations`}
                className={cn(buttonVariants(), "w-full")}
              >
                Reservation Lists
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded bg-gray-50 px-3 py-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Phone Number</h3>
              <div className="text-sm">
                <Link to={`tel:${store.telephone}`}>{store.telephone}</Link>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Address</h3>
              <div className="text-sm">
                <Link
                  to={`https://www.google.com/maps?q=${encodeURIComponent(store.address)}`}
                >
                  {store.address}
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Open Hours</h3>
              <div className="flex flex-col gap-2 text-sm">
                {Object.entries(store.open_hours).map((day) => (
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="font-medium">{day[0]}</span>
                    <span>{day[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <div className="flex flex-9/12 flex-col gap-8 py-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa
              delectus eveniet, excepturi, ipsam iusto, laboriosam magni nihil
              pariatur perspiciatis porro quaerat quas qui quidem quod repellat
              rerum similique. Architecto, qui.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex flex-row items-center gap-2">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <span className="flex flex-row items-center gap-2 text-sm">
                  <IconCarambolaFilled className="size-4 text-yellow-300" />
                  4.3 (2902 Reviews)
                </span>
              </div>
              <div className="space-x-2">
                <span className="font-medium">Sort by:</span>
                <span className="text-sm">Latest First</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
