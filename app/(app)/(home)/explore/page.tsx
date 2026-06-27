import { redirect } from 'next/navigation'

const Page = () => {
  redirect('/explore/all')
  return <div className="bg-blue-200 w-full "></div>
}
export default Page
