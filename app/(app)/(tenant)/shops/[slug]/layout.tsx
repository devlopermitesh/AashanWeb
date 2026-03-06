export const revalidate = 60

const Layout = async ({ children }: LayoutProps<'/shops/[slug]'>) => {
  return <>{children}</>
}

export default Layout
