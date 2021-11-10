import React from 'react';
import './styles.scss'

const Card = () => {
  return (
    <div className="card-base product-card-admin">
      <div className="row">
        <div className="col-2 text-center border-right py-1">
          <img src="https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/3-big.jpg" 
              alt=""
              className="product-card-image-admin" />
        </div>
        <div className="col-7 py-1">
          <h6>core i7</h6>
        </div>
        <div className="col-3 py-1">
          <h6>ações</h6>
        </div>
      </div>
    </div>
  )
}

export default Card;