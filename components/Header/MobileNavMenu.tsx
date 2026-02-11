import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import LinkItem from "./LinkItem"
import { routes } from "./routes"

const MobileNavMenu=({isOpen,close}:{isOpen:boolean,close:()=>void})=>{
    return (
<Sheet open={isOpen} onOpenChange={(open)=>{(!open)?close():""}}>
  <SheetTrigger className="w-0 h-0"></SheetTrigger>
  <SheetContent side="right" className="bg-white">
    <SheetHeader>
      <SheetTitle>Menu </SheetTitle>
    </SheetHeader>
    <div className="flex flex-col gap-4 px-4">
  {routes.map((route) => (
            <LinkItem key={route.link} {...route} />
          ))}

          <button className="h-full px-6 flex items-center font-medium border-l border-r">
            Login
          </button>

          <button className="h-full px-6 flex items-center border shadow rounded">
            Start Free
          </button>
    </div>
  </SheetContent>
</Sheet>
    )

}
export default MobileNavMenu