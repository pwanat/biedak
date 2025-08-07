// import { UserButton } from '@clerk/clerk-react'
import { Header } from './header'
import { Search } from '../search'
import { ThemeSwitch } from '../theme-switch'
import { UserButton } from '@clerk/tanstack-react-start'

const TopBar = () => {
  return (
    <Header fixed>
      <Search />
      <div className='ml-auto flex items-center space-x-4'>
        <ThemeSwitch />
        <UserButton />
        {/* <ProfileDropdown /> use this some day in place of clerks <UserButton />*/}
      </div>
    </Header>
  )
}

export default TopBar
