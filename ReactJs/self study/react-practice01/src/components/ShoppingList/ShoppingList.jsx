import React from 'react'

function ShoppingList() {

    const products = [
        { title: 'Cabbage', isFruit: false, id: 1 },
        { title: 'Garlic', isFruit: false, id: 2 },
        { title: 'Apple', isFruit: true, id: 3 },
      ];

    const itemlist  = products.map((product) =>{
        return(
            <li 
                key={product.id}
                style={{
                    color: product.isFruit ? 'magenta' : 'darkgreen'
                  }}
            >
                {product.title}
            </li>
        )
    }) 
  return (
    <ul>
      {itemlist}
    </ul>
  )
}

export default ShoppingList
