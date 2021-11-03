import { makePrivateRequest } from 'core/utils/request';
import React, { useState } from 'react';
import BaseForm from '../../BaseForm';
import './styles.scss';

type FormState = {
  name: string;
  price: string;
  category: string;
  description: string;
}

type FormEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

const Form = () => {

  const [formData, setFormData] = useState<FormState>({
    name: '',
    price: '',
    category: '',
    description: ''
  });

  const handleOnChange = (event: FormEvent) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(data => ({ ...data, [name]: value }));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...formData,
      imgURL: 'https://images-americanas.b2w.io/produtos/3924785178/imagens/consoley-play-5/3924785178_1_xlarge.jpg',
      categories: [{ id: formData.category }]
    }

    makePrivateRequest({
      url: '/products',
      method: 'POST',
      data: payload
    });
  }

  return(
    <form onSubmit={handleSubmit}>
      <BaseForm title="cadastrar produto" >
        <div className="row">
          <div className="col-6">
            <input type="text" 
                  className="form-control mb-4 mt-5" 
                  placeholder="Nome do produto"
                  onChange={handleOnChange}
                  name="name"
                  value={formData.name} />

            <select className="form-control mb-4" 
                    onChange={handleOnChange} name="category" value={formData.category}>
              <option value="">-- selecione --</option>
              <option value="1">Livros</option>
              <option value="3">Computadores</option>
              <option value="2">Eletrônicos</option>
            </select>

            <input type="text" 
                  className="form-control" 
                  placeholder="Preço"
                  onChange={handleOnChange}
                  name="price"
                  value={formData.price} />
          </div>
          <div className="col-6">
            <textarea name="description" 
                      cols={30} 
                      rows={10} 
                      onChange={handleOnChange}
                      value={formData.description}
                      className="form-control mt-5" />
          </div>
        </div>
      </BaseForm>
    </form>
  )
}

export default Form;