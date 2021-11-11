import React from 'react';
import ProductPrice from 'core/components/ProductPrice';
import { Product } from 'core/types/Product';
import './styles.scss';
import { Link } from 'react-router-dom';

type Props = {
  product: Product
}

const Card = ({ product }: Props ) => {
  return (
    <div className="card-base product-card-admin">
      <div className="row">
        <div className="col-2 text-center border-right py-1">
          <img src={product.imgUrl}
              alt={product.name}
              className="product-card-image-admin" />
        </div>
        <div className="col-7 py-1">
          <h6> {product.name} </h6>
          <ProductPrice price={product.price} />
          <div>
            {product.categories.map(category => (
              <span className="badge badge-pill badge-secondary mr-1" key={category.id}>
                {category.name}
              </span>
            ))}
          </div>
        </div>
        <div className="col-3 pt-3 pr-4">
          <Link
            to={`/admin/products/${product.id}`}
            type="button"
            className="btn btn-outline-secondary btn-block border-radius-10 mb-3">
              EDITAR
          </Link>

          <button
            type="button"
            className="btn btn-outline-danger btn-block border-radius-10 mb-3">
              EXCLUIR
          </button>

        </div>
      </div>
    </div>
  )
}

export default Card;