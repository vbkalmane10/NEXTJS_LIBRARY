import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center h-screen">
       
        <Loader2 className="animate-spin" />
         <p className="ml-2">Loading...</p>
      
      </div>
    );
  }
  