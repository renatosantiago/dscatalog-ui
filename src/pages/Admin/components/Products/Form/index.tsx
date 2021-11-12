import React, { useEffect, useState } from 'react';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import Select from 'react-select';
import BaseForm from '../../BaseForm';
import { useHistory, useParams } from 'react-router';
import { Category } from 'core/types/Product';
import './styles.scss';

type FormState = {
  name: string;
  price: string;
  description: string;
  imgUrl: string;
  categories: Category[];
}

type paramsTypes = {
  productId: string;
}

const Form = () => {
  const history = useHistory();
  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<FormState>();
  const { productId } = useParams<paramsTypes>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
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
          setValue('categories', response.data.categories);
        })
    }
  }, [productId, isEditing, setValue]);

  useEffect(() => {
    setIsLoadingCategories(true);
    makeRequest({ url: '/categories' })
      .then(response => setCategories(response.data.content))
      .finally(() => setIsLoadingCategories(false))
  }, []);
  
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
              {/* <Controller
                options={categories}
                getOptionLabel={(option: Category) => option.name}
                getOptionValue={(option: Category) => String(option.id)}
                placeholder="Categoria"
                classNamePrefix="categories-select"
                isMulti /> */}
              <Controller
                name="categories"
                control={control}
                rules={{required: true}}
                render={({ field }) => <Select 
                  {...field} 
                  options={categories}
                  getOptionLabel={(option: Category) => option.name}
                  getOptionValue={(option: Category) => String(option.id)}
                  placeholder="Categoria" 
                  classNamePrefix="categories-select"
                  isLoading={isLoadingCategories}
                  isMulti
                />}
              />
              { errors.categories && (
                <div className="invalid-feedback d-block">
                  Campo obrigatório
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