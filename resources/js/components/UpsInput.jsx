function UpsInput({placeholder, type, name}){
    return(
        <div className="ups_input_wrapper mt-1" style={{width:'300px'}}>
              <input id={name} name={name} className="ups-input" type={type} placeholder={placeholder} required /> 
        </div>
    )
}

export default UpsInput;