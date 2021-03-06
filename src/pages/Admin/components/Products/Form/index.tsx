import React, { useEffect, useState } from 'react';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import Select from 'react-select';
import BaseForm from '../../BaseForm';
import { useHistory, useParams } from 'react-router';
import { Category } from 'core/types/Product';
import './styles.scss';
import ImageUpload from '../ImageUpload';

export type FormState = {
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
  const [uploadedImgUrl, setUploadedImgUrl] = useState('');
  const [productImgUrl, setProductImgUrl] = useState('');
  const isEditing = productId !== 'create';
  const formTitle = isEditing ? 'Editar produto' : 'Cadastrar um produto';

  useEffect(() => {
    if(isEditing) {
      makeRequest({ url: `/products/${productId}` })
        .then(response => {
          setValue('name', response.data.name);
          setValue('price', response.data.price);
          setValue('description', response.data.description);
          setValue('categories', response.data.categories);
          setProductImgUrl(response.data.imgUrl);
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
    const payload = {
      ...data,
      imgUrl: uploadedImgUrl || productImgUrl
    }
    makePrivateRequest({ 
      url: isEditing ? `/products/${productId}` : '/products', 
      method: isEditing ? 'PUT' : 'POST', 
      data: payload 
    })
    .then(() => {
      toast.success('Produto cadastrado com sucesso!');
      history.push('/admin/products')
    }).catch(error => {
      toast.error(error.response.status + ' - Erro ao salvar produto ');
    });
  }

  const onUploadSuccess = (imgUrl: string) => {
    setUploadedImgUrl(imgUrl);
  }


  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <BaseForm title={formTitle} >
        <div className="row">
          <div className="col-6">
            <div className="margin-bottom-20">

              {/* NAME */}
              <input type="text" 
                    {...register('name', { 
                          required: "Campo obrigat??rio",
                          minLength: {
                            value: 5, 
                            message: 'O campo deve ter no m??nimo 5 caracteres'
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

            {/* CATEGORY */}
            <div className="margin-bottom-20">
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
                  Campo obrigat??rio
                </div>
              )}
            </div>
            
            {/* PRICE */}
            <div className="margin-bottom-20">
            <input type="number"
                    {...register('price', { required: "Campo obrigat??rio" })} 
                    className="form-control input-base" 
                    placeholder="Pre??o"
                    />
              { errors.price && (
                <div className="invalid-feedback d-block">
                  { errors.price.message }
                </div>
              )}
            </div>
            
            {/* URL IMAGE */}
            <div className="margin-bottom-20">
              <ImageUpload 
                onUploadSuccess={onUploadSuccess}
                productImgUrl={productImgUrl}
              />
            </div>
          </div>
          
          {/* DESCRIPITION */}
          <div className="col-6">
            <div>
              <textarea {...register('description', { required: 'Campo obrigat??rio' })} 
                        cols={30} 
                        rows={10} 
                        className="form-control input-base"
                        placeholder="Descri????o" />
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