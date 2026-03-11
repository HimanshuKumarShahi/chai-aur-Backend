import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){

 return(

   <ProtectedRoute>

     <Products/>

   </ProtectedRoute>

 );

}

export default App;