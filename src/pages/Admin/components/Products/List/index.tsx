import React, { useEffect, useState } from 'react';
import { ProductResponse } from 'core/types/Product';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import { makeRequest } from 'core/utils/request';
import Pagination from 'core/components/Pagination';


const List = () => {
  const [productResponse, setProductResponse] = useState<ProductResponse>();
  const [isLoading, setIsLoading] = useState(false); 
  const [activePage, setActivePage] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const params = {
      page: activePage,
      linesPerPage: 4,
      direction: 'DESC',
      orderBy: 'id'
    }

    setIsLoading(true);
    makeRequest({ url: '/products', params })
      .then(response => setProductResponse(response.data))
      .finally(() => {
        setIsLoading(false);
      });
  },[activePage])

  const handleCreate = () => {
    history.push('/admin/products/create');
  }

  return (
    <div className="admin-products-list">
      <button className="btn btn-primary btn-large" onClick={handleCreate}>
        Adicionar
      </button>
      <div className="admin-list-container">
        {productResponse?.content.map(prod => (
          <Card product={prod} key={prod.id} />
        ))}
        {productResponse && (
        <Pagination 
            totalPages={productResponse.totalPages}
            activePage={activePage} 
            changePage={page => setActivePage(page)} />
        )}
      </div>
    </div>
  );
}

export default List;