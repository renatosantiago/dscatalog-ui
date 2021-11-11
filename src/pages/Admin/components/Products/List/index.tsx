import React, { useCallback, useEffect, useState } from 'react';
import { ProductResponse } from 'core/types/Product';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import Pagination from 'core/components/Pagination';
import { toast } from 'react-toastify';


const List = () => {
  const [productResponse, setProductResponse] = useState<ProductResponse>();
  const [isLoading, setIsLoading] = useState(false); 
  const [activePage, setActivePage] = useState(0);
  const history = useHistory();

  const getProducts = useCallback(() => {
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
  },[activePage]);

  useEffect(() => {
    getProducts();
  },[getProducts])

  const handleCreate = () => {
    history.push('/admin/products/create');
  }

  const onRemove = (productId: number) => {
    makePrivateRequest({
      url: `/products/${productId}`,
      method : 'DELETE'
    }).then(() => {
      toast.success('Produto removido com sucesso!');
      getProducts();
    }).catch(error => {
      toast.error(error.response.status + ' - Erro ao remover produto');
    })
  }

  return (
    <div className="admin-products-list">
      <button className="btn btn-primary btn-large" onClick={handleCreate}>
        Adicionar
      </button>
      <div className="admin-list-container">
        {productResponse?.content.map(prod => (
          <Card product={prod} key={prod.id} onRemove={onRemove} />
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