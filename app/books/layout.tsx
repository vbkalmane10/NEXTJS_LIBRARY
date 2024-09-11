import Header from "@/components/Header";
import NavBar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
export const experimental_ppr = true;
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full">
      <div className="w-full">
      
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
