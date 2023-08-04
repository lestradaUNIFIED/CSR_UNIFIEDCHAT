

function UpsButton({type,text,style}){
    return(
        <button type={type} className="ups-button" style={{width:style.width, marginTop:style.marginTop}}>{text}</button>
    )
}

export default UpsButton;