import { UserDetails } from "@/types/UserDetails"
import { ChefCatalog } from "@/components/chef-catalog"

interface FeaturedChefs {
  chefs: UserDetails[]
}

export function FeaturedChefs(props: FeaturedChefs) {
  const { chefs } = props

  return (
    <div className="bg-primary/20 py-10">
      <div className="container">
        <p className="font-header text-4xl font-bold">Featured Chefs</p>
        <div className="p-4">
          <ChefCatalog chefs={chefs} />
        </div>
      </div>
    </div>
  )
}
