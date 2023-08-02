import { TailSpin } from "react-loader-spinner";

const LoaderSmall = (props) => {
  const check = props.loading == null ? false : props.loading;
  const textStatus = props.textStatus == null? "Loading" : props.textStatus;  
  return (
    check && (
      <div style={{ display: props.loading === true ? "block" : "none" }}>
       <span> {textStatus}  </span>
        <span >
          <TailSpin
            height="50"
            width="50"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </span>
      </div>
    )
  );
};

export default LoaderSmall;
