import SearchInput from './SearchInput'
import Categories from './Categories'
import { HydrateClient } from '@/trpc/server'
import BreadCrumbList from '../BreadCrumbList'
import { Suspense } from 'react'
import CartButton from '../CartButton'
const SearchFilter = async () => {
  return (
    <HydrateClient>
      <Suspense fallback={SearchSkelaton()}>
        <div className="flex flex-col w-full sm:px-10 px-2 items-center py-5 gap-4 h-auto bg-white">
          <div className="flex flex-row w-full gap-3 ">
            <div className="flex-1 w-full">
              <SearchInput />
            </div>
            <CartButton />
          </div>
          <Categories />
          <div className="w-full bg-white flex">
            <BreadCrumbList />
          </div>
        </div>
      </Suspense>
    </HydrateClient>
  )
}

export default SearchFilter
const SearchSkelaton = () => {
  return <div className="flex flex-col w-full sm:px-10 px-2 items-center py-5 gap-4 h-auto "></div>
}
