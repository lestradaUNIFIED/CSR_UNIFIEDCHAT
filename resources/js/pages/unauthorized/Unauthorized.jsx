import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const nav = useNavigate();

  const goBack = () => {
    nav(-1);
  };

  return (
    <section>
      <h4>Unauthorized</h4>
      <p>You do not have access to this page.</p>
      <div>
        <Button variant="contained" onClick={goBack}>Go Back</Button>
      </div>
    </section>
  );
};


export default Unauthorized;