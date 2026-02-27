import React from 'react'
import PostCard from './PostCard'
import { iphoneModels } from '../data/iphoneModels'

type GridProps = {
  wishlistItemIds: string[]
  onToggleWishlist: (itemId: string) => void
}

const Grid = ({ wishlistItemIds, onToggleWishlist }: GridProps) => {
  return (
    <div className="grid w-full gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 md:gap-4">
      {iphoneModels.map((phone) => (
        <PostCard
          key={phone.id}
          model={phone.model}
          storageOptions={phone.storageOptions}
          condition={phone.condition}
          price={phone.price}
          ctaLabel={phone.ctaLabel}
          image={phone.image}
          isWishlisted={wishlistItemIds.includes(phone.id)}
          onToggleWishlist={() => onToggleWishlist(phone.id)}
        />
      ))}
    </div>
  )
}

export default Grid
