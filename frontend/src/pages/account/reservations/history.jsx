import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Bookmark, ChevronRight } from "lucide-react";

function Page() {
  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold">My Reservation History</h1>
      <p className="mt-4 text-lg">You have made 2 reservations so far!</p>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-6 max-w-6xl w-full">
        {/* Card 1 */}
        <div className="bg-gray-100 p-4 rounded-xl shadow-md w-full max-w-sm">
          <img
            src="https://i.pinimg.com/736x/fc/84/ec/fc84ecf119dabf3cef590de566548469.jpg"
            alt="Bar"
            className="object-cover w-full h-48 rounded-lg"
          />
          <h2 className="text-xl mt-4">Bar Name</h2>
          <div className="text-gray-500 mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-sm">Date & Time: 18 July 2025 at 18:00</span>
              </div>
              <ChevronRight size={16} />
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span className="text-sm">Guests: 8</span>
            </div>
            <div className="flex items-center gap-2">
              <Bookmark size={16} />
              <span className="text-sm">Tables: 2 (A12, A13)</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-100 p-4 rounded-xl shadow-md w-full max-w-sm">
          <img
            src="https://i.pinimg.com/736x/fc/84/ec/fc84ecf119dabf3cef590de566548469.jpg"
            alt="Bar"
            className="object-cover w-full h-48 rounded-lg"
          />
          <h2 className="text-xl mt-4">Bar Name</h2>
          <div className="text-gray-500 mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-sm">Date & Time: 18 July 2025 at 18:00</span>
              </div>
              <ChevronRight size={16} />
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span className="text-sm">Guests: 8</span>
            </div>
            <div className="flex items-center gap-2">
              <Bookmark size={16} />
              <span className="text-sm">Tables: 2 (A12, A13)</span>
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full mt-8 text-white bg-black border border-black hover:bg-neutral-900 rounded-xl text-lg py-6">Close</Button>
    </div>
  );
}

export default Page;