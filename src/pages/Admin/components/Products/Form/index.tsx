import React, { useEffect } from 'react';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseForm from '../../BaseForm';
import { useHistory, useParams } from 'react-router';
import './styles.scss';

type FormState = {
  name: string;
  price: string;
  description: string;
  imgUrl: string;
}

type paramsTypes = {
  productId: string;
}

const Form = () => {
  const history = useHistory();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormState>();
  const { productId } = useParams<paramsTypes>();
  const isEditing = productId !== 'create';
  const formTitle = isEditing ? 'Editar produto' : 'Cadastrar um produto';

  useEffect(() => {
    if(isEditing) {
      makeRequest({ url: `/products/${productId}` })
        .then(response => {
          setValue('name', response.data.name);
          setValue('price', response.data.price);
          setValue('description', response.data.description);
          setValue('imgUrl', response.data.imgUrl);
        })
    }
  }, [productId, isEditing, setValue])
  
  const onSubmit = (data: FormState) => {
    makePrivateRequest({ 
      url: isEditing ? `/products/${productId}` : '/products', 
      method: isEditing ? 'PUT' : 'POST', 
      data 
    })
    .then(() => {
      toast.success('Produto cadastrado com sucesso!');
      history.push('/admin/products')
    }).catch(error => {
      toast.error(error.response.status + ' - Erro ao salvar produto ');
    });
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <BaseForm title={formTitle} >
        <div className="row">
          <div className="col-6">
            <div className="margin-bottom-20">
              <input type="text" 
                    {...register('name', { 
                          required: "Campo obrigatório",
                          minLength: {
                            value: 5, 
                            message: 'O campo deve ter no mínimo 5 caracteres'
                          } 
                        }
                      )
                    }
                    className="form-control input-base" 
                    placeholder="Nome do produto" />
              { errors.name && (
                <div className="invalid-feedback d-block">
                  { errors.name.message }
                </div>
              )}
            </div>
            
            <div className="margin-bottom-20">
              <input type="number"
                    {...register('price', { required: "Campo obrigatório" })} 
                    className="form-control input-base" 
                    placeholder="Preço" />
              { errors.price && (
                <div className="invalid-feedback d-block">
                  { errors.price.message }
                </div>
              )}
            </div>

            <div className="margin-bottom-20">
              <input type="text" 
                    {...register('imgUrl', { required: "Campo obrigatório" })}
                    className="form-control input-base" 
                    placeholder="url da imagem" />
              { errors.imgUrl && (
                <div className="invalid-feedback d-block">
                  { errors.imgUrl.message }
                </div>
              )}
            </div>

          </div>
          <div className="col-6">
            <div>
              <textarea {...register('description', { required: 'Campo obrigatório' })} 
                        cols={30} 
                        rows={10} 
                        className="form-control input-base"
                        placeholder="Descrição" />
              { errors.description && (
                <div className="invalid-feedback d-block">
                  { errors.description.message }
                </div>
              )}
            </div>
          </div>
        </div>
      </BaseForm>
    </form>
  )
}

export default Form;