import React from 'react';
import { makePrivateRequest } from 'core/utils/request';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseForm from '../../BaseForm';
import './styles.scss';
import { useHistory } from 'react-router';

type FormState = {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

const Form = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormState>();
  const history = useHistory();

  const onSubmit = (data: FormState) => {
    makePrivateRequest({ url: '/products11', method: 'POST', data })
      .then(() => {
        toast.info('Produto cadastrado com sucesso!');
        history.push('/admin/products')
      }).catch(error => {
        toast.error(error.response.status + ' - Erro ao salvar produto ');
      });
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <BaseForm title="cadastrar produto" >
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
                    {...register('imageUrl', { required: "Campo obrigatório" })}
                    className="form-control input-base" 
                    placeholder="url da imagem" />
              { errors.imageUrl && (
                <div className="invalid-feedback d-block">
                  { errors.imageUrl.message }
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