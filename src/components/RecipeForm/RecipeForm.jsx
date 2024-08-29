import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as recipeService from '/src/services/recipeService'; 


const RecipeForm = (props) => {

    const { recipeId } = useParams()

    const [formData, setFormData] = useState({
        name: '',
        preptime: '',
        cooktime: '',
        ingredients: [{ name: '', measurement: '' }],
        instructions: [{ description: '' }],
        isPublic: true,
        imageUrl: '',
    })


    // use destructuring to extract properties from target
    
    const handleChange = (evt) => {
      const { name, value, type, checked } = evt.target;

      // if the input is a checkbox, then whatever the value in checked is will be stored
      // else, applies to other inputs 
      setFormData({...formData, [name]: type === 'checkbox' ? checked : value});
  };
  
    
    const handleIngredientChange = (ingredientIdx, evt) => {
      // creates a new array 
       const newIngredient = formData.ingredients.map((ingredient, idx) => {
        // if this is the ingredient being changed, then update it
        if (ingredientIdx === idx) {
          return { ...ingredient, [evt.target.name]: evt.target.value };
        }
        // otherwise, keep it as is
        return ingredient;
       })
       setFormData({ ...formData, ingredients: newIngredient });
    }

    // adds new blank forms 
    const handleAddIngredient = () => {
        setFormData({...formData, ingredients: [...formData.ingredients, { name: '', measurement: '' }]});
    };
    
    // 
    const handleRemoveIngredient = (idx) => {
        setFormData({...formData,ingredients: formData.ingredients.filter((_, sidx) => idx !== sidx)});
    };
    
  
    const handleInstructionChange = (instructionIdx, evt) => {
        const newInstruction = formData.instructions.map((instruction, idx) => {
            if (instructionIdx === idx){
              return {...instruction, [evt.target.name]: evt.target.value };
            } 
            return instruction;
        })

        setFormData({ ...formData, instructions: newInstruction });
    }


    const handleAddInstruction = () => {
        setFormData({...formData, instructions: [...formData.instructions, { description: '' }]});
    };
    
    const handleRemoveInstruction = (idx) => {
        setFormData({...formData, instructions: formData.instructions.filter((_, sidx) => idx !== sidx)});
    };
    

    const handleFileChange = (evt) => {
      const file = evt.target.files[0]; 
      setFormData({ ...formData, imageFile: file }); 
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();

        // const data = new FormData()
        // data.append('name', formData.name);
        // data.append('preptime', formData.preptime);
        // data.append('cooktime', formData.cooktime);
        // data.append('ingredients', JSON.stringify(formData.ingredients));
        // data.append('instructions', JSON.stringify(formData.instructions));
        // data.append('isPublic', formData.isPublic);
        
        // if(formData.imageFile){
        //   data.append('imageUrl', formData.imageFile);
        // }
      
        
        // console.log('img', data.get('imageUrl'));


        if (recipeId) {
            props.handleUpdateRecipe(recipeId, formData)
        } else {
            props.handleAddRecipe(formData)
        }
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            const recipeData = await recipeService.show(recipeId);
            setFormData(recipeData);
        }
        if(recipeId) fetchRecipe();
    }, [recipeId])



  return (
    <div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <p>{ recipeId ? 'Edit Recipe' : 'Add Recipe' }</p>

        <label htmlFor="name">Recipe Name:</label>
        <input 
        type="text" 
        name="name"
        id="name"
        value={formData.name}
        onChange={handleChange}
        required
        />

        <label htmlFor="preptime">Preptime:</label>
        <input
        type="text" 
        name="preptime"
        id="preptime"
        value={formData.preptime}
        onChange={handleChange}
        required
        />

        <label htmlFor="cooktime">Cooktime:</label>
        <input
        type="text" 
        name="cooktime"
        id="cooktime"
        value={formData.cooktime}
        onChange={handleChange}
        required
        />

        <label htmlFor="ingredients">Ingredients:</label>
        {formData.ingredients.map((ingredient, idx) => (
          <div key={idx}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={ingredient.name}
              onChange={evt => handleIngredientChange(idx, evt)}
              required
            />
            <label>Measurement:</label>
            <input
              type="text"
              name="measurement"
              value={ingredient.measurement}
              onChange={evt => handleIngredientChange(idx, evt)}
              required
            />

            <button type="button" onClick={() => handleRemoveIngredient(idx)}>Remove</button>
          </div>
        ))}
        <button type="button"  onClick={handleAddIngredient}>Add Ingredient</button>

        <label htmlFor="instructions">Instructions</label>
        {formData.instructions.map((instruction, idx) => (
            <div key={idx}>
            <textarea
              cols="40"
              rows="1"
              name="description"
              value={instruction.description}
              onChange={evt => handleInstructionChange(idx, evt)}
              required
            />
            <button type="button"  onClick={() => handleRemoveInstruction(idx)}>Remove</button>
            </div>
        ))}
        <button type="button" onClick={handleAddInstruction}>Add Step</button>
        
        <label htmlFor="imageUrl">Upload Image: </label>
        <input 
          type="text" 
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />

        <label htmlFor="isPublic">Share with Community?</label>
        <input
           type="checkbox"
           name="isPublic"
           checked={formData.isPublic}
           onChange={handleChange}
        />
    
        <button type="submit">SUBMIT</button>
        
        </form>
    </div>
  )
}

export default RecipeForm
