import React from 'react'
import PostCard from './PostCard'
import { iphoneModels } from '../data/iphoneModels'

type GridProps = {
  wishlistItemIds: string[]
  onToggleWishlist: (itemId: string) => void
}

const Grid = ({ wishlistItemIds, onToggleWishlist }: GridProps) => {
  return (
    <div className="grid w-full grid-cols-6 gap-4">
      {iphoneModels.map((phone) => (
        <PostCard
          key={phone.id}
          model={phone.model}
          storageOptions={phone.storageOptions}
          condition={phone.condition}
          price={phone.price}
          ctaLabel={phone.ctaLabel}
          isWishlisted={wishlistItemIds.includes(phone.id)}
          onToggleWishlist={() => onToggleWishlist(phone.id)}
        />
      ))}
    </div>
  )
}

export default Grid
