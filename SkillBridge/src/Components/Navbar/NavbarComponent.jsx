import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import { Link , useNavigate} from 'react-router-dom';
import {signOut, getAuth} from 'firebase/auth'

function NavbarComponent() {

  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInWorker")) || JSON.parse(localStorage.getItem("loggedInCustomer"))

  const handleLogin = ()=>{
    navigate("/login")
  }

  const handleLogout = async ()=>{
    const auth = getAuth();
    try{
      await signOut(auth);
      if(loggedInUser.role === "worker"){
        localStorage.removeItem("loggedInWorker");
      } else {
        localStorage.removeItem("loggedInCustomer");
      }
      
      navigate('/login')
      
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container >
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
             {loggedInUser? <Button  variant="light" onClick={handleLogout}>Log out</Button> : <Button variant="light" onClick={handleLogin}>Login / SignUp</Button> }
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;