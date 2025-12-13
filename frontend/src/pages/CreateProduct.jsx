    import React from 'react'
    import { useState } from 'react'
    import api from '../services/api.js'

    const CreateStock = () => {

        const [name, setname] = useState('');
        const [price, setprice] = useState('');
        const handleSubmit = (e) => {
            e.preventDefault();

            const CreateStock = async () =>{
                try{
                    const response = await api.post('/stocks', { name, price });
                    console.log(response.data);
                }
                catch(err){
                    console.error(err);
                }
            } 
            CreateStock();
        }
    return (
        <div>
            <form>
                    <label>
                        Enter the Item Name:
                    </label>
                    <input type= "text" value={name} onChange={(e) => setname(e.target.value)}/>
                    <br/>
                    <br/>
                    <label>
                        Enter the amount:
                    </label>
                    <input type='number' value={price} onChange={(e) => setprice(e.target.value)} />
                    <br/>
                    <br/>
                    <button onClick={handleSubmit}> $Submit$ </button>
            </form>
        </div>
    )
    }

    export default CreateStock